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
// this will cause problem related to order of routes you made (Search about it and understand)

router.put('/status', adminAuth, brandAuth, updateOrderStatus);

router.put('/cancel', adminAuth, brandAuth, customerAuth, deactivateOrder);

router.post('/checkout', customerAuth, checkoutOrder);


router.get('/history', customerAuth, getOrderHistory);
router.get('/:id', adminAuth, brandAuth, customerAuth, getOrderById);



module.exports = router;
