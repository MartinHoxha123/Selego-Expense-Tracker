// backend/models/Category.js - CORRECTED for ES Modules

import mongoose from 'mongoose'; // Changed from const mongoose = require('mongoose');

// Schema from the assessment: name: String, createdAt: Date
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', categorySchema);

// Changed from module.exports = Category;
export default Category;