import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true }, // main image (URL or path)
    brand: { type: String, required: true }, // e.g. Apple, Samsung
    rating: { type: Number, default: 0 },    // average rating
    numReviews: { type: Number, default: 0 } 
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
