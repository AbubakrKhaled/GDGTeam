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
const { customerAuth, adminAuth, brandAuth, authAny } = require('../middlewares/auth.js');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const brandController   = require('../controllers/brand');
const customerController = require('../controllers/customer');


router.get('/', authAny, getOrders);

router.put('/status', authAny, updateOrderStatus);

router.put('/cancel', authAny, deactivateOrder);

router.post('/checkout', customerAuth, checkoutOrder);


router.get('/history', customerAuth, getOrderHistory);
router.get('/:id', authAny, getOrderById);



module.exports = router;
