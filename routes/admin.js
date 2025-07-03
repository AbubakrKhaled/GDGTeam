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
} = require('../controllers/admin');

router.post('/login', adminLogin);

router
    .route('/')
    .get(getAllBrands);

router
    .route('/:id')
    .get(getBrandById)

    .put(brandApproval)

    .delete(deleteBrand);

module.exports = router;
