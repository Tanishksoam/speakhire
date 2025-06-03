import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import formRoutes from "./routes/form";
import userRoutes from "./routes/user";

dotenv.config();
const app = express();

// Configure CORS to allow all origins for testing
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint for App Engine
app.get("/", (req, res) => {
  res.status(200).send("SpeakHire server is up and running");
});

app.use("/api/forms", formRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB first
mongoose
  .connect(process.env.MONGO_URI!)
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
