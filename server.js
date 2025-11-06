// server.js
import path from "path";
import express from "express";
import dbconnect from "./config/db.js";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// ----------------------------------------------------------------------
// 🌟 CORS CONFIGURATION FIX 🌟
// Use a specific allowed origin list for production/deployment
const allowedOrigins = [
    // This must match your Vercel frontend URL
    process.env.FRONTEND_URL, 
    // Always allow local development
    'http://localhost:5173',
    'http://10.95.30.56:5173',
];

// Configure CORS Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or cURL)
        if (!origin) return callback(null, true); 
        
        // Allow if the origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log(`CORS Policy Blocked Origin: ${origin}`); 
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true, // IMPORTANT: Allows cookies (JWTs) to be sent across domains
}));
// ----------------------------------------------------------------------

// --- START: STATIC FOLDER SETUP (MOVED TO TOP) ---
const __dirname = path.resolve();
// This line allows the browser to request files like http://localhost:5000/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname,'/uploads')));
// --- END: STATIC FOLDER SETUP ---


app.use('/api/upload', uploadRoutes); // UPLOAD API (POST request)
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("ShopSphere Backend Running ✅");
});

app.use(notFound);
app.use(errorHandler);

dbconnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});