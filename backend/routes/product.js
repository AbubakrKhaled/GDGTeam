const express = require('express');
const router = express.Router();
const {
    brandLogin,

    createBrand,
    updateBrand,

    getAllProducts,
    getProductById,
    deleteProduct,
} = require('../controllers/brand.js');
const brandAuth = require('../middlewares/brandauth.js');