"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const form_1 = __importDefault(require("./routes/form"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configure CORS to allow all origins for testing
app.use((0, cors_1.default)({
    origin: "*", // Allow all origins for testing
    credentials: true,
}));
app.use(express_1.default.json());
// Health check endpoint for App Engine
app.get("/", (req, res) => {
    res.status(200).send("SpeakHire server is up and running");
});
app.use("/api/forms", form_1.default);
app.use("/api/users", user_1.default);
// Connect to MongoDB first
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    // Start the server after MongoDB connection is established
    const port = parseInt(process.env.PORT || "8080");
    // Listen on the port provided by App Engine
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});
