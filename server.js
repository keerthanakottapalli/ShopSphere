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

app.use(cors({
    origin: [
        'https://shop-sphere-ui.vercel.app',
        'http://localhost:5173',
        'http://10.95.30.56:5173'
    ],
    credentials: true, // This is crucial for RTK Query
    exposedHeaders: ['Authorization'] // Expose Authorization header if needed
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