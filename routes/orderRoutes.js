import express from "express";
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    getPayPalClientId
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



router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

// NOTE: The config route must come BEFORE the :id route
router.route('/config/paypal').get(protect, getPayPalClientId);

// PUT /api/orders/:id/deliver -> Mark as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// PUT /api/orders/:id/pay -> Mark as paid (Can be used by admin or payment webhook)
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;