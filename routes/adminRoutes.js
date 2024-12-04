const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');

const productDir = path.join(__dirname, '../public/img/product');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, productDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|web/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File upload chỉ chấp nhận hình ảnh!');
    },
});

router.get('/admin/login', adminController.showLogin);
router.post('/admin/login', adminController.login);
router.get('/admin/logout', adminController.logout);

router.get('/admin', adminController.showAdminPage);

router.get('/admin/register', (req, res) => {
    res.render('admin/register', { title: 'Đăng ký Admin', error: null });
});
router.post('/admin/register', adminController.register);

router.get('/admin/products/add', adminController.showAddProduct);
router.post('/admin/products/add', upload.single('image'), adminController.addProduct);

router.get('/admin/products', adminController.showProducts);
router.get('/admin/products/:id', adminController.viewProduct);
router.get('/admin/products/edit/:id', adminController.showEditProduct);
router.post('/admin/products/edit/:id', upload.single('image'), adminController.editProduct);
router.post('/admin/products/delete/:id', adminController.deleteProduct);

router.get('/admin/orders', adminController.showOrders);
router.get('/admin/orders/:id', adminController.viewOrderDetails);
router.post('/admin/orders/approve/:id', adminController.approveOrder);

router.get('/admin/users', adminController.showUsers);
router.get('/admin/users/add', adminController.showAdd);
router.post('/admin/users/add', adminController.add);
router.get('/admin/users/edit/:id', adminController.showEdit);
router.post('/admin/users/edit/:id', adminController.edit);
router.post('/admin/users/delete/:id', adminController.delete);
router.get('/users/details/:user_id', adminController.userDetails);

router.get('/admins', adminController.listAdmins);
router.get('/admin/contact', adminController.showContactManagement);

module.exports = router;