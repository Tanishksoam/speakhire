"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    formsCreated: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Form' }],
    accessMap: [
        {
            formId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Form' },
            allowedUsers: [
                {
                    email: { type: String, required: true },
                    token: { type: String, required: true },
                    used: { type: Boolean, default: false }
                }
            ]
        }
    ]
});
exports.default = mongoose_1.default.model('User', userSchema);
