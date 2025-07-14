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

router.get('/', getAllProducts);

//router.post('/create', brandAuth, createProduct);

//router.get('/update/:id', brandAuth, updateProduct);
router.get('/:id', getProductById);

//router.put('/:id/activate', brandAuth, activateProduct);
//router.put('/:id/deactivate', brandAuth, deactivateProduct);


module.exports = router;