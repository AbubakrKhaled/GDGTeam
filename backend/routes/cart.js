const express = require('express');
const router = express.Router();
const { getCartDetails } = require('../controllers/order.js');
const { 
    getWishlist,
    addToWishlist,
    deleteWishlistProduct

} = require('../controllers/cart.js')
const { customerAuth, adminAuth, brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');

router.get('/', customerAuth, getCartDetails);

router.get('/wishlist', customerAuth, getWishlist);
router.put('/wishlist/add/:id', customerAuth, addToWishlist);
router.put('/wishlist/delete/:id', customerAuth, deleteWishlistProduct)





module.exports = router;

