const express = require('express');
const router = express.Router();
const {
    brandLogin,

    createBrand,
    updateBrand,

    getAllProducts,
    getProductById,
    deleteProduct,
} = require('../controllers/brand');
const brandAuth = require('../middlewares/brandauth');

router.post('/login', brandLogin)

router.post('/signup', createBrand);

router.put('/:id/profile', brandAuth, updateBrand);

router.get('/customers', brandAuth, getAllProducts);
router.get('/customers/:id', brandAuth, getProductById);
router.delete('/customers/:id', brandAuth, deleteProduct);



module.exports = router;
