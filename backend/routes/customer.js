const express = require('express');
const router = express.Router();
const {
    customerLogin,
    customerSignup,
    updateCustomer,
    customerLogout,
    getCustomerProfile,
} = require('../controllers/customer.js')
const { customerAuth, adminAuth, brandAuth } = require('../middlewares/auth.js');
const {userLogin, userLogout} = require('../controllers/admin.js')

router.post('/login', customerLogin);
router.post('/logout', userLogout);

router.post('/signup', customerSignup);

//router.post('/logout', customerAuth, customerLogout);

router.put('/profile/update', customerAuth, updateCustomer);

router.get('/profile', customerAuth, getCustomerProfile);


module.exports = router;
