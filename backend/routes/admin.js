const express = require('express');
const router = express.Router();
const {
    adminLogin,

    getAllBrands,
    getBrandById,
    brandApproval,
    deleteBrand,

    getAllCustomers,
    getCustomerById,
    deleteCustomer,

    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/admin.js');
const { adminAuth } = require('../middlewares/auth.js');


router.post('/login', adminLogin);

router.get('/brands', adminAuth, getAllBrands);
router.get('/brands/:id', adminAuth, getBrandById);
router.put('/brands/:id/approve', adminAuth, brandApproval);
router.delete('/brands/:id', adminAuth, deleteBrand);

router.put('/brand/:id/activate', adminAuth, activate);
router.put('/brand/:id/deactivate', adminAuth, deactivate);

router.get('/customers', adminAuth, getAllCustomers);
router.get('/customers/:id', adminAuth, getCustomerById);
router.delete('/customers/:id', adminAuth, deleteCustomer);

router.get('/orders', adminAuth, getAllOrders);
router.get('/orders/:id', adminAuth, getOrderById);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);


module.exports = router;
