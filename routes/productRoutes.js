import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // 🔒 Import protect and admin

const router = express.Router();

// Route for submitting a review
router.route('/:id/reviews').post(protect, createProductReview);

router.get('/top', getTopProducts);

// Public read access. Admin protected write access.
router.route("/").get(getProducts).post(protect, admin, createProduct);

// Public read access. Admin protected update/delete access.
router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;