const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    activateProduct,
    deactivateProduct
} = require('../controllers/product.js');
const { brandAuth } = require('../middlewares/auth.js');

router.get('/', brandAuth, getAllProducts);

router.get('/create', brandAuth, createProduct);

router.get('/update/:id', brandAuth, updateProduct);
router.get('/:id', brandAuth, getProductById);

router.put('/:id/activate', brandAuth, activateProduct);
router.put('/:id/deactivate', brandAuth, deactivateProduct);


module.exports = router;