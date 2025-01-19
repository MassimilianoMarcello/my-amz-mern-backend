import express from 'express';

import productControllers from '../controllers/product.js';

const {
    getAllproducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getDiscountedProducts,
    getFeaturedProducts,
    getNewArrivals,
    getRecommendedProducts,
    getDailyDeals,
    
} = productControllers;

const router = express.Router();

// routes
// get all products and get product by ID
router.get('/products', getAllproducts);
router.get('/products/:id', getProduct);
// different type of get request
// featured products
router.get('/products/products/isfeatured', getFeaturedProducts);

// new arrivals
router.get('/products/this-products/new-arrivals', getNewArrivals);

// recommended products
router.get('/products/recommended', getRecommendedProducts);

// daily deals
router.get('/products/daily-deals', getDailyDeals);

// category
router.get('/products/category/:category', getProductsByCategory);


// discounted products
router.get('/products/products/discounted', getDiscountedProducts);

// create, update, delete products
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
