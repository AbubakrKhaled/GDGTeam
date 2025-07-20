const express = require('express');
const router = express.Router();
const {
    getOrderById,
    getOrders,
    updateOrderStatus,
    deactivateOrder,
    checkoutOrder,
    getOrderHistory

} = require('../controllers/order.js');
const { customerAuth, adminAuth, brandAuth } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const brandController   = require('../controllers/brand');
const customerController = require('../controllers/customer');


router.get('/', adminAuth, brandAuth, customerAuth, getOrders);
router.get('/:id', adminAuth, brandAuth, customerAuth, getOrderById);

router.put('/status', adminAuth, brandAuth, updateOrderStatus);
router.put('cancel', adminAuth, brandAuth, customerAuth, deactivateOrder);

router.post('/checkout', customerAuth, checkoutOrder);


router.get('/history', customerAuth, getOrderHistory);


module.exports = router;
