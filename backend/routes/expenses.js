// backend/routes/expenses.js
import express from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import { sendBudgetAlert } from '../services/emailService.js'; // 1. IMPORT EMAIL SERVICE

const router = express.Router();

// 2. GET /api/expenses/summary
router.get('/summary', async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            // Group expenses by categoryId and calculate the sum of amounts
            { $group: { _id: '$categoryId', totalSpent: { $sum: '$amount' } } },

            // Join with the Categories collection to get the category name
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryInfo' } },

            // Deconstruct the categoryInfo array (since it's a one-to-one join)
            { $unwind: '$categoryInfo' },

            // Reshape the output document
            { $project: { _id: 0, categoryId: '$_id', categoryName: '$categoryInfo.name', totalSpent: 1 } }
        ]);

        return res.status(200).json({ ok: true, data: summary });
    } catch (error) {
        console.error("Error fetching expense summary:", error);
        return res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});
// ----------------------------------------------------------------------

// GET /api/expenses - get all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({ ok: true, data: expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

// ----------------------------------------------------------------------
// 3. POST /api/expenses - CREATE EXPENSE AND CHECK BUDGET
// ----------------------------------------------------------------------
router.post('/', async (req, res) => {
    const { categoryId, amount, description } = req.body;
    const BUDGET_LIMIT = parseFloat(process.env.BUDGET_LIMIT); // Get limit from .env.example

    // Basic validation
    if (!categoryId || !amount || !description) {
        return res.status(400).json({ ok: false, error: 'Missing required fields: categoryId, amount, and description' });
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ ok: false, error: 'Amount must be a positive number' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ ok: false, error: 'Invalid category ID format' });
    }

    try {
        const newExpense = new Expense({ categoryId, amount, description });
        const savedExpense = await newExpense.save();

        await savedExpense.populate('categoryId', 'name');

        // --- Budget Check Logic ---
        if (!isNaN(BUDGET_LIMIT) && BUDGET_LIMIT > 0) {
            // 1. Calculate the new total spending
            const totalSpendingResult = await Expense.aggregate([
                { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
            ]);

            const totalSpent = totalSpendingResult.length > 0 ? totalSpendingResult[0].totalSpent : 0;

            // 2. Check if the limit is exceeded
            if (totalSpent > BUDGET_LIMIT) {
                // 3. Send the budget alert (non-blocking)
                console.log(`Budget exceeded! Total: $${totalSpent}, Limit: $${BUDGET_LIMIT}. Sending alert...`);
                // Note: We don't await this, so the API response isn't delayed by the email service
                sendBudgetAlert(totalSpent, BUDGET_LIMIT);
            } else {
                console.log(`Current spending: $${totalSpent}. Limit not yet exceeded.`);
            }
        }
        // --- End Budget Check Logic ---

        return res.status(201).json({ ok: true, data: savedExpense });
    } catch (error) {
        console.error("Error creating expense:", error);
        return res.status(500).json({ ok: false, error: 'Failed to create expense' });
    }
});
// ----------------------------------------------------------------------

// DELETE /api/expenses/:id - delete expense
router.delete('/:id', async (req, res) => {
    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ ok: false, error: 'Invalid expense ID format' });
    }

    try {
        const result = await Expense.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ ok: false, error: 'Expense not found' });
        }

        return res.status(200).json({ ok: true, data: { message: 'Expense deleted successfully' } });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ ok: false, error: 'Failed to delete expense' });
    }
});

export default router;