const express = require('express');
const router = express.Router();
const {
    brandLogin,
    createBrand,
    updateBrand,
    getBrandById
} = require('../controllers/brand.js');
const { brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');


router.post('/login', brandLogin)

router.post('/signup', createBrand);

router.put('/:id/update', brandAuth, updateBrand);
router.get('/:id/profile', brandAuth, getBrandById);

router.get('/products', brandAuth, productController.getAllProducts);
router.get('/products/create', brandAuth, productController.createProduct);
router.get('/products/update/:id', brandAuth, productController.updateProduct);
router.get('/products/:id', brandAuth, productController.getProductById);
router.put('/products/:id/activate', brandAuth, productController.activateProduct);
router.put('/products/:id/deactivate', brandAuth, productController.deactivateProduct);

module.exports = router;
