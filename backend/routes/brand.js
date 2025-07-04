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

router.post('/login', brandLogin)

router.post('/signup', createBrand);

router.put('/:id/profile', brandAuth, updateBrand);

router.get('/products', brandAuth, getAllProducts);
router.get('/products/:id', brandAuth, getProductById);
router.delete('/products/:id', brandAuth, deleteProduct);



module.exports = router;
