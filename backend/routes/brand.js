const express = require('express');
const router = express.Router();
const {
    brandLogin,

    createBrand,
    updateBrand,
    getBrandById
} = require('../controllers/brand.js');
const brandAuth = require('../middlewares/brandauth.js');

router.post('/login', brandLogin)

router.post('/signup', createBrand);

router.put('/:id/update', brandAuth, updateBrand);
router.get('/:id/profile', brandAuth, getBrandById);

module.exports = router;
