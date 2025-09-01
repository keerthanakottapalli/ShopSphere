import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// GET /api/products  -> all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Public (later → protect for admins)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, image, brand, rating, numReviews } = req.body;

  const product = new Product({
    name,
    description,
    price,
    stock,
    category,
    image,
    brand,
    rating,
    numReviews,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (later → protect for admins)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, image, brand } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.image = image || product.image;
    product.brand = brand || product.brand;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (later → protect for admins)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { createProduct, updateProduct, deleteProduct, getProducts, getProductById };
