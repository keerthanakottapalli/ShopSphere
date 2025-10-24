import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js"; // Needed to update product stock

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Requires JWT token)
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice, // Total price of all items (calculated on frontend)
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        const order = new Order({
            user: req.user._id, // Set from the 'protect' middleware
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // ⚠️ Future Improvement: Decrease product stock here 

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Only the owner or Admin can view)
const getOrderById = asyncHandler(async (req, res) => {
    // Populate user and orderItems (getting name from user, and product name from order items)
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Security check: Only allow the owner or an Admin to view the order
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error("Not authorized to view this order");
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // req.user._id is available from the 'protect' middleware
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});


// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // Populate user to show who placed the order
    const orders = await Order.find({}).populate('user', 'id name'); 
    res.json(orders);
});

// @desc    Update order to PAID (Admin only, or webhook)
// @route   PUT /api/orders/:id/pay
// @access  Private (Owner/Admin)
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // 🔑 Note: In a real app, the req.body would contain payment details 
        // from a service like Stripe/PayPal and you'd use that data here.
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: Date.now(),
            email_address: req.body.payer_email,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


// @desc    Update order to DELIVERED (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


export { 
    addOrderItems, 
    getOrderById, 
    getMyOrders, 
    getOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered 
};