import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { // Links the review to the user who wrote it
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true }, // main image (URL or path)
    brand: { type: String, required: true }, // e.g. Apple, Samsung
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },    // average rating
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

// ⚡️ Performance Improvement: Add Indexes
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ name: 'text', description: 'text' }); // For text search

const Product = mongoose.model("Product", productSchema);
export default Product;