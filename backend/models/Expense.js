// backend/models/Expense.js

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // This links it to the Category model
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01 // Ensures a positive amount
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;