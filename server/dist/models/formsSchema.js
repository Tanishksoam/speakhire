"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FormSchema = new mongoose_1.Schema({
    // userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    formFields: [
        {
            id: { type: String, required: true },
            type: { type: String, required: true },
            label: { type: String, required: true },
            required: { type: Boolean, default: false },
            options: [{ type: String }],
        },
    ],
    // formfields: [{ type: mongoose.Schema.Types.Mixed, required: true }],
    responses: [
        {
            email: { type: String, required: true },
            responses: { type: mongoose_1.Schema.Types.Mixed, required: true },
            submittedAt: { type: Date, default: Date.now },
        },
    ],
    accessToken: { type: String },
    recipients: [
        {
            email: { type: String },
            token: { type: String },
            used: { type: Boolean, default: false },
        },
    ],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    isTemplate: { type: Boolean, default: false },
    publishedUrl: { type: String, default: "" },
    // expiresAt: { type: Date },
    customStyles: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Form", FormSchema);
