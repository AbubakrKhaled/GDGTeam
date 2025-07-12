const express = require('express');
const router = express.Router();
const {
    adminLogin,

    getAllBrands,
    getBrandById,
    brandApproval,
    activateBrand,
    deactivateBrand,

    getAllCustomers,
    getCustomerById,
    activateCustomer,
    deactivateCustomer,

    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/admin.js');
const { adminAuth } = require('../middlewares/auth.js');


router.post('/login', adminLogin);

router.get('/brands', adminAuth, getAllBrands);
router.get('/brands/:id', adminAuth, getBrandById);
router.put('/brands/:id/approve', adminAuth, brandApproval);
router.put('/brand/:id/activate', adminAuth, activateBrand);
router.put('/brand/:id/deactivate', adminAuth, deactivateBrand);

router.get('/customers', adminAuth, getAllCustomers);
router.get('/customers/:id', adminAuth, getCustomerById);
router.delete('/customers/:id/activate', adminAuth, activateCustomer);
router.delete('/customers/:id/deactivate', adminAuth, deactivateCustomer);

router.get('/orders', adminAuth, getAllOrders);
router.get('/orders/:id', adminAuth, getOrderById);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);


module.exports = router;
