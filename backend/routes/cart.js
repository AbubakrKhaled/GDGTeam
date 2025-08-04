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
router.post('/wishlist/:id', customerAuth, addToWishlist);
router.delete('/wishlist/:id', customerAuth, deleteWishlistProduct);

router.put('/addToCartFromWishlist/:id', customerAuth, addToCartFromWishlist);
router.patch('/updateCartProductAmount/:id', customerAuth, updateCartProductAmount);
router.post('/:id', customerAuth, addToCart);
router.delete('/:id', customerAuth, deleteCartProduct);





module.exports = router;

