const express = require('express');
const router = express.Router();
const { getCartDetails } = require('../controllers/order.js');
const { 
    getCart,
    getWishlist,
    addToWishlist,
    deleteWishlistProduct,
    addToCartFromWishlist,
    addToCart,
    updateCartProductAmount,
    deleteCartProduct

} = require('../controllers/cart.js')
const { customerAuth, adminAuth, brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const orderController   = require('../controllers/order');
const brandController   = require('../controllers/brand');
const customerController = require('../controllers/customer');

router.get('/', customerAuth, getCart);

router.get('/wishlist', customerAuth, getWishlist);
router.put('/wishlist/add/:id', customerAuth, addToWishlist);
router.put('/wishlist/delete/:id', customerAuth, deleteWishlistProduct);

router.put('/addToCartFromWishlist', customerAuth, addToCartFromWishlist);
router.put('/addToCart', customerAuth, addToCart);
router.put('/updateCartProductAmount', customerAuth, updateCartProductAmount);
router.put('/deleteCartProduct', customerAuth, deleteCartProduct);





module.exports = router;

