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
    .get(getAllBrands)
    .get(getAllCustomers);

router
    .route('/:id')
    .get(getBrandById)
    .get(getCustomerById)

    .put(brandApproval)

    .delete(deleteBrand)
    .delete(deleteCustomer);

module.exports = router;
