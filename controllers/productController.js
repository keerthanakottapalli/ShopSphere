import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    // Find products where rating is greater than or equal to 4
    const products = await Product.find({ rating: { $gte: 4 } })
        .sort({ rating: -1 }) // Sort by rating descending
        .limit(3);           // Limit to 3 or 4 products

    res.json(products);
});

// @desc    Fetch all products with pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10; // ⚡️ Performance: Set items per page
  const page = Number(req.query.pageNumber) || 1; // Get current page from query string

  const keyword = req.query.keyword
    ? {
      // Use text index created in productModel.js
      $text: {
        $search: req.query.keyword,
      },
    }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize) // Limit results per page
    .skip(pageSize * (page - 1)); // Skip previously fetched results

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {

  const product = new Product({
    user: req.user._id,

    // REQUIRED FIELDS (using boilerplate values):
    name: 'Sample name',
    description: 'Sample description',
    price: 0,
    stock: 0, 
    category: 'Electronics',
    image: '/images/sample.jpg',
    brand: 'Generic Brand',

    // DEFAULT/OPTIONAL FIELDS:
    reviews: [],
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, image, brand } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Only update if value is provided in the request body
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product removed' })
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private (User must be logged in)
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 💡 Optional but recommended: Check if the user has purchased the product
  // This query checks if *any* order from this user contains the product ID
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    isDelivered: true, // Optional: only allow reviews after delivery
  });

  if (!hasPurchased) {
    res.status(403);
    throw new Error('You can only review products you have purchased and received.');
  }


  // 1. Check if the user has already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed by this user');
  }

  // 2. Create the new review object
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  // 3. Add the review to the product
  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // 4. Calculate the new average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

export { getTopProducts, createProduct, updateProduct, deleteProduct, getProducts, getProductById, createProductReview };