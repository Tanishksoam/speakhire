"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Create a new user
router.post('/create', async (req, res) => {
    try {
        const { email, name } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = await User_1.default.create({
            email,
            name,
            formsCreated: [],
            accessMap: []
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// User routes have been simplified - all recipient management is now handled in form routes
exports.default = router;
