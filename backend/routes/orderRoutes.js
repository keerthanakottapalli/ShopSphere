import express from "express";
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. User Routes
// GET /api/orders/myorders
router.route('/myorders').get(protect, getMyOrders);
// POST /api/orders (NOTE: This route must be before the admin GET /api/orders)
router.route('/').post(protect, addOrderItems);
// GET /api/orders/:id
router.route('/:id').get(protect, getOrderById);


// 2. Admin Routes
// GET /api/orders -> Get ALL orders
router.route('/').get(protect, admin, getOrders);
// PUT /api/orders/:id/deliver -> Mark as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// PUT /api/orders/:id/pay -> Mark as paid (Can be used by admin or payment webhook)
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;