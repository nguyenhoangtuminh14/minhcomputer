const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/register', indexController.showRegisterPage);
router.post('/register', indexController.register);

router.get('/login', indexController.showLoginPage);
router.post('/login', indexController.login);

router.get('/shop-grid', indexController.showShopGrid);
router.get('/product/:id', indexController.showProductDetail);
router.get('/cart', indexController.showCart);

router.post('/cart/add', indexController.addToCart);
router.post('/cart/update/:productId', indexController.updateCartQuantity);
router.post('/cart/remove/:id', indexController.removeFromCart);

router.get('/cart/checkout', indexController.showCheckout);
router.post('/cart/complete', indexController.completeCheckout);

router.get('/', indexController.showIndexPage);

router.get('/contact', (req, res) => {
    const user = req.session.user || null;
    res.render('partials/contact', { req: req, user: user });
});
router.post('/contact', indexController.contact);

module.exports = router;