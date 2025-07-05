const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    deleteProduct
} = require('../controllers/product.js');
const brandAuth = require('../middlewares/brandauth.js');

router.get('/', brandAuth, getAllProducts);

router.get('/create', brandAuth, createProduct);

router.get('/update/:id', brandAuth, updateProduct);
router.get('/:id', brandAuth, getProductById);
router.delete('/delete/:id', brandAuth, deleteProduct);

module.exports = router;