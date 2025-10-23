// backend/routes/categories.js
import express from 'express'; // Changed from const express = require('express');
import Category from '../models/Category.js'; // Changed from const Category = require('../models/Category');

const router = express.Router();

// GET /api/categories - get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        if (!categories || categories.length === 0) {
            return res.status(200).json({ ok: true, data: [] });
        }

        return res.status(200).json({ ok: true, data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ ok: false, error: 'Internal server error' });
    }
});

// POST /api/categories - create category
router.post('/', async (req, res) => {
    // Basic validation
    if (!req.body.name) {
        return res.status(400).json({ ok: false, error: 'Category name is required' });
    }

    try {
        const newCategory = new Category({ name: req.body.name });
        const savedCategory = await newCategory.save();

        return res.status(201).json({ ok: true, data: savedCategory });
    } catch (error) {
        // Check for duplicate name error (MongoDB error code 11000)
        if (error.code === 11000) {
            return res.status(409).json({ ok: false, error: 'Category already exists' });
        }
        console.error("Error creating category:", error);
        return res.status(500).json({ ok: false, error: 'Failed to create category' });
    }
});

export default router;