const db = require('../db'); 
const bcrypt = require('bcrypt'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const { formatCurrency } = require('./utils');
const nodemailer = require('nodemailer'); 
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

const adminController = {
    showAdminPage: (req, res) => {
        if (req.session.admin) {
            res.render('admin/admin', { 
                title: 'Admin', 
                message: 'Chào mừng đến với trang quản trị!', 
                adminEmail: req.session.admin.email,
                adminName: req.session.admin.name,
                adminCreatedAt: req.session.admin.createdAt,
                body: 'Nội dung của trang quản trị',
                layout: 'layouts/admin'
            });
        } else {
            res.redirect('/admin/login');
        }
    },

    showLogin: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin');
        } else {
            res.render('admin/login', { title: 'Đăng Nhập Admin', error: null });
        }
    },

    login: (req, res) => {
        const { email, password } = req.body;
    
        const query = 'SELECT * FROM admins WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.render('admin/login', { title: 'Đăng Nhập Admin', error: 'Có lỗi xảy ra.' });
            }
    
            if (results.length > 0) {
                const admin = results[0];
                bcrypt.compare(password, admin.password, (err, match) => {
                    if (err) {
                        console.error(err);
                        return res.render('admin/login', { title: 'Đăng Nhập Admin', error: 'Có lỗi xảy ra.' });
                    }
    
                    if (match) {
                        req.session.admin = { 
                            email: admin.email, 
                            name: admin.name,
                            createdAt: admin.created_at
                        }; 
                        res.redirect('/admin');
                    } else {
                        return res.render('admin/login', { title: 'Đăng Nhập Admin', error: 'Thông tin đăng nhập không chính xác.' });
                    }
                });
            } else {
                return res.render('admin/login', { title: 'Đăng Nhập Admin', error: 'Thông tin đăng nhập không chính xác.' });
            }
        });
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/admin');
            }
            res.redirect('/admin/login');
        });
    },

    register: (req, res) => {
        const { name, password, email, confirm_password } = req.body;
    
        if (password !== confirm_password) {
            return res.render('admin/register', { title: 'Đăng ký Admin', error: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
        }

        const checkUserQuery = 'SELECT * FROM admins WHERE email = ?';
        db.query(checkUserQuery, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.render('admin/register', { title: 'Đăng ký Admin', error: 'Có lỗi xảy ra khi kiểm tra tên đăng nhập.' });
            }
            if (results.length > 0) {
                return res.render('admin/register', { title: 'Đăng ký Admin', error: 'Email đã tồn tại. Vui lòng chọn email khác.' });
            }

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/register', { title: 'Đăng ký Admin', error: 'Có lỗi xảy ra khi mã hóa mật khẩu.' });
                }

                const insertUserQuery = 'INSERT INTO admins (name, password, email) VALUES (?, ?, ?)';
                db.query(insertUserQuery, [name, hash, email], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.render('admin/register', { title: 'Đăng ký Admin', error: 'Có lỗi xảy ra khi lưu tài khoản.' });
                    }
                    res.redirect('/admin/login');
                });
            });
        });
    },

    showAddProduct: (req, res) => {
        const query = 'SELECT * FROM product_catalog';
        db.query(query, (err, categories) => {
            if (err) {
                console.error(err);
                return res.render('admin/products/addProduct', { 
                    error: 'Có lỗi xảy ra khi lấy danh mục.', 
                    layout: 'admin/admin',
                    categories: [] 
                });
            }

            if (!req.session.admin) {
                return res.redirect('/admin/login');
            }

            res.render('admin/products/addProduct', { 
                categories: categories,
                adminEmail: req.session.admin.email,
                adminName: req.session.admin.name,
                adminCreatedAt: req.session.admin.createdAt,
                error: null,
                layout: 'admin/admin' 
            }); 
        });
    },
    addProduct: (req, res) => {
        const { name, description, price, category_id } = req.body;
        const image = req.file;
    
        if (!name || !description || !price || !category_id) {
            return res.render('admin/products/addProduct', {
                error: 'Vui lòng điền đầy đủ thông tin.',
                layout: 'admin/admin',
                categories: []
            });
        }
    
        const priceNumber = parseFloat(price);
    
        const productQuery = 'INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)';
        
        if (image) {
            const imageName = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}${path.extname(image.originalname)}`;
            const tempPath = image.path;
            const newPath = path.join(productDir, imageName);
    
            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/products/addProduct', {
                        error: 'Có lỗi xảy ra khi lưu hình ảnh.',
                        layout: 'admin/admin',
                        categories: []
                    });
                }
    
                db.query(productQuery, [name, description, priceNumber, category_id, imageName], (err) => {
                    if (err) {
                        console.error(err);
                        return res.render('admin/products/addProduct', {
                            error: 'Có lỗi xảy ra khi thêm sản phẩm.',
                            layout: 'admin/admin',
                            categories: []
                        });
                    }
    
                    res.redirect('/admin/products');
                });
            });
        } else {
            db.query(productQuery, [name, description, priceNumber, category_id, null], (err) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/products/addProduct', {
                        error: 'Có lỗi xảy ra khi thêm sản phẩm.',
                        layout: 'admin/admin',
                        categories: []
                    });
                }
    
                res.redirect('/admin/products');
            });
        }
    },
    
    showProducts: (req, res) => {
        const query = 'SELECT * FROM products';
        db.query(query, (err, products) => {
            if (err) {
                console.error(err);
                return res.render('admin/products/list_products', { 
                    error: 'Có lỗi xảy ra khi lấy sản phẩm.', 
                    products: [], 
                    categories: [] 
                });
            }
            
            const categoryQuery = 'SELECT * FROM product_catalog';
            db.query(categoryQuery, (err, categories) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/products/list_products', { 
                        error: 'Có lỗi xảy ra khi lấy danh mục.', 
                        products: [], 
                        categories: [] 
                    });
                }
                
                const formattedProducts = products.map(product => ({
                    ...product,
                    formattedPrice: formatCurrency(product.price)
                }));
    
                if (formattedProducts.length === 0) {
                    return res.render('admin/products/list_products', { 
                        error: 'Không có sản phẩm nào.', 
                        products: [], 
                        categories: categories,
                        layout: 'admin/admin' 
                    });
                }
    
                res.render('admin/products/list_products', { 
                    products: formattedProducts,
                    categories: categories,
                    layout: 'admin/admin' 
                });
            });
        });
    },
    
    viewProduct: (req, res) => {
        const productId = req.params.id;
        const query = 'SELECT * FROM products WHERE product_id = ?';
    
        db.query(query, [productId], (err, products) => {
            if (err) {
                console.error(err);
                return res.render('admin/products/view_product', { error: 'Có lỗi xảy ra khi lấy sản phẩm.', product: null });
            }
    
            if (products.length === 0) {
                return res.render('admin/products/view_product', { error: 'Sản phẩm không tồn tại.', product: null });
            }
    
            const product = {
                ...products[0],
                formattedPrice: formatCurrency(products[0].price)
            };
    
            res.render('admin/products/view_product', { 
                product: product,
                image: product.image
            });
        });
    },
    
    showEditProduct: (req, res) => {
        const productId = req.params.id;
        const queryProduct = 'SELECT * FROM products WHERE product_id = ?';
        const queryCategories = 'SELECT * FROM product_catalog';
    
        db.query(queryProduct, [productId], (err, product) => {
            if (err || product.length === 0) {
                console.error(err);
                return res.redirect('/admin/products');
            }
    
            db.query(queryCategories, (err, categories) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/products');
                }
    
                res.render('admin/products/edit_product', {
                    product: product[0],
                    categories: categories,
                    layout: 'admin/admin',
                    error: null
                });
            });
        });
    },
    editProduct: (req, res) => {
        const productId = req.params.id;
        const { name, description, price, category_id } = req.body;
        const images = req.files;
    
        if (!name || !description || !price || !category_id) {
            return res.render('admin/products/edit_product', {
                error: 'Vui lòng điền đầy đủ thông tin.',
                layout: 'admin/admin',
                product: { product_id: productId, name, description, price, category_id },
                categories: []
            });
        }
    
        const priceNumber = parseFloat(price);
        const productQuery = 'UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE product_id = ?';
    
        if (images && images.length > 0) {
            const imageName = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}${path.extname(images[0].originalname)}`;
            const tempPath = images[0].path;
            const newPath = path.join(productDir, imageName);
    
            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/products/edit_product', {
                        error: 'Có lỗi xảy ra khi lưu hình ảnh.',
                        layout: 'admin/admin',
                        product: { product_id: productId, name, description, price, category_id },
                        categories: []
                    });
                }
    
                db.query(productQuery + ', image = ? WHERE product_id = ?', [name, description, priceNumber, category_id, productId, imageName], (err) => {
                    if (err) {
                        console.error(err);
                        return res.render('admin/products/edit_Product', {
                            error: 'Có lỗi xảy ra khi cập nhật sản phẩm.',
                            layout: 'admin/admin',
                            product: { product_id: productId, name, description, price, category_id },
                            categories: []
                        });
                    }
    
                    res.redirect('/admin/products');
                });
            });
        } else {
            db.query(productQuery + ' WHERE product_id = ?', [name, description, priceNumber, category_id, productId], (err) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/products/edit_product', {
                        error: 'Có lỗi xảy ra khi cập nhật sản phẩm.',
                        layout: 'admin/admin',
                        product: { product_id: productId, name, description, price, category_id },
                        categories: []
                    });
                }
    
                res.redirect('/admin/products');
            });
        }
    },
    
    deleteProduct: (req, res) => {
        const productId = req.params.id;
        const query = 'DELETE FROM products WHERE product_id = ?';
    
        db.query(query, [productId], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/products');
            }
    
            res.redirect('/admin/products');
        });
    },
    
    showOrders: (req, res) => {
        const query = 'SELECT * FROM orders';
    
        db.query(query, (err, orders) => {
            if (err) {
                console.error(err);
                return res.render('admin/orders/list_orders', {
                    orders: [],
                    error: 'Có lỗi xảy ra khi lấy danh sách đơn hàng.',
                    success: null
                });
            }
    
            res.render('admin/orders/list_orders', {
                orders: orders,
                success: req.query.success || null,
                error: req.query.error || null,
                formatCurrency: formatCurrency
            });
        });
    },
    
    viewOrderDetails: (req, res) => {
        const orderId = req.params.id;
        const query = `
            SELECT orders.*, users.name AS user_name, users.email AS user_email 
            FROM orders 
            JOIN users ON orders.user_id = users.user_id 
            WHERE orders.order_id = ?`;
    
        db.query(query, [orderId], (err, orderDetails) => {
            if (err) {
                console.error(err);
                return res.render('admin/orders/view_order', { 
                    error: 'Có lỗi xảy ra khi lấy chi tiết đơn hàng.', 
                    orderItems: [],
                    formatCurrency: formatCurrency 
                });
            }
    
            if (orderDetails.length === 0) {
                return res.render('admin/orders/view_order', { 
                    error: 'Đơn hàng không tồn tại.', 
                    orderItems: [],
                    formatCurrency: formatCurrency 
                });
            }
    
            const order = orderDetails[0];
            const orderItemsQuery = `
                SELECT order_items.*, products.name AS product_name 
                FROM order_items 
                JOIN products ON order_items.product_id = products.product_id 
                WHERE order_items.order_id = ?`;
    
            db.query(orderItemsQuery, [orderId], (err, orderItems) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/orders/view_order', { 
                        error: 'Có lỗi xảy ra khi lấy chi tiết sản phẩm trong đơn hàng.', 
                        orderItems: [],
                        formatCurrency: formatCurrency 
                    });
                }
    
                res.render('admin/orders/view_order', { 
                    orderItems: orderItems, 
                    user_name: order.user_name, 
                    user_email: order.user_email, 
                    total_amount: order.total_amount,
                    order_date: order.order_date,
                    status: order.status,
                    error: null,
                    formatCurrency: formatCurrency 
                });
            });
        });
    },
    approveOrder: (req, res) => {
        const orderId = req.params.id;
    
        const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
        const newStatus = 'completed';
    
        db.query(query, [newStatus, orderId], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/orders?error=' + encodeURIComponent('Có lỗi xảy ra khi duyệt đơn hàng.'));
            }
    
            const emailQuery = 'SELECT email FROM users WHERE user_id = (SELECT user_id FROM orders WHERE order_id = ?)';
            db.query(emailQuery, [orderId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/orders?error=' + encodeURIComponent('Có lỗi xảy ra khi lấy email người dùng.'));
                }
    
                if (results.length > 0) {
                    const userEmail = results[0].email;
    
                    const emailTemplatePath = path.join(__dirname, '../views/emailTemplates/emailTemplate.html');
                    fs.readFile(emailTemplatePath, 'utf8', (err, html) => {
                        if (err) {
                            console.error(err);
                            return res.redirect('/admin/orders?error=' + encodeURIComponent('Có lỗi xảy ra khi đọc template email.'));
                        }
    
                        const emailHtml = html.replace('{{orderId}}', orderId);
    
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'nguyenhoangtuminh14@gmail.com',
                                pass: 'locd hgen szqu flow'
                            }
                        });
    
                        const mailOptions = {
                            from: 'Nguyen Minh Computer <nguyenhoangtuminh14@gmail.com>',
                            to: userEmail,
                            subject: 'Thông Báo Đơn Hàng Đã Duyệt',
                            html: emailHtml
                        };
    
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error(error);
                                return res.redirect('/admin/orders?error=' + encodeURIComponent('Có lỗi xảy ra khi gửi email.'));
                            }
                            console.log('Email sent: ' + info.response);
                            
                            res.redirect('/admin/orders?success=' + encodeURIComponent('Đơn hàng đã được duyệt và email thông báo đã được gửi.'));
                        });
                    });
                } else {
                    res.redirect('/admin/orders?error=' + encodeURIComponent('Không tìm thấy email người dùng.'));
                }
            });
        });
    },
    
    showUsers: (req, res) => {
        const query = `
            SELECT users.*, order_count, contact_count 
            FROM users
        `;
    
        db.query(query, (err, users) => {
            if (err) {
                console.error(err);
                return res.render('admin/users/user', {
                    users: [],
                    error: 'Có lỗi xảy ra khi lấy danh sách người dùng.'
                });
            }
            res.render('admin/users/user', { users: users });
        });
    },
    
    showAdd: (req, res) => {
        res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: null });
    },
    
    add: (req, res) => {
        const { name, email, password, confirm_password } = req.body;
    
        if (!name || !email || !password || !confirm_password) {
            return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Vui lòng điền đầy đủ thông tin.' });
        }
    
        if (password !== confirm_password) {
            return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
        }
    
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkUserQuery, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Có lỗi xảy ra khi kiểm tra tên đăng nhập.' });
            }
            if (results.length > 0) {
                return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Email đã tồn tại. Vui lòng chọn email khác.' });
            }
    
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Có lỗi xảy ra khi mã hóa mật khẩu.' });
                }
    
                const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
                db.query(query, [name, email, hash], (err) => {
                    if (err) {
                        console.error(err);
                        return res.render('admin/users/addUser', { title: 'Thêm Người Dùng', error: 'Có lỗi xảy ra khi thêm người dùng.' });
                    }
                    console.log('Dữ liệu nhận được:', req.body);
                    res.redirect('/admin/users');
                });
            });
        });
    },
    showEdit: (req, res) => {
        const userId = req.params.id;
        const query = 'SELECT * FROM users WHERE user_id = ?';
        db.query(query, [userId], (err, results) => {
            if (err || results.length === 0) {
                console.error(err);
                return res.redirect('/admin/users');
            }
            res.render('admin/users/editUser', { user: results[0], error: null });
        });
    },
    
    edit: (req, res) => {
        const userId = req.params.id;
        const { name, email, password } = req.body;
    
        if (password) {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/users');
                }
    
                const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE user_id = ?';
                db.query(query, [name, email, hash, userId], (err) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/admin/users');
                    }
                    res.redirect('/admin/users');
                });
            });
        } else {
            const query = 'UPDATE users SET name = ?, email = ? WHERE user_id = ?';
            db.query(query, [name, email, userId], (err) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/users');
                }
                res.redirect('/admin/users');
            });
        }
    },
    
    delete: (req, res) => {
        const userId = req.params.id;
        const query = 'DELETE FROM users WHERE user_id = ?';
        db.query(query, [userId], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin/users');
            }
            res.redirect('/admin/users');
        });
    },
    
    userDetails: (req, res) => {
        const userId = req.params.user_id;
    
        const queryUser = 'SELECT * FROM users WHERE user_id = ?';
        db.query(queryUser, [userId], (err, userResults) => {
            if (err || userResults.length === 0) {
                console.error(err);
                return res.redirect('/admin/users');
            }
    
            const user = userResults[0];
    
            const queryOrders = 'SELECT * FROM orders WHERE user_id = ?';
            db.query(queryOrders, [userId], (err, orderResults) => {
                if (err) {
                    console.error(err);
                    return res.redirect('/admin/users');
                }
    
                const queryContacts = 'SELECT * FROM contact WHERE user_id = ?';
                db.query(queryContacts, [userId], (err, contactResults) => {
                    if (err) {
                        console.error(err);
                        return res.redirect('/admin/users');
                    }
    
                    res.render('admin/users/user-details', {
                        user: user,
                        orders: orderResults,
                        contacts: contactResults,
                        formatCurrency: require('./utils').formatCurrency
                    });
                });
            });
        });
    },
    
    listAdmins: (req, res) => {
        const query = 'SELECT * FROM admins';
    
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/admin');
            }
    
            res.render('admin/users/admin-list', {
                title: 'Danh Sách Tài Khoản Admin',
                admins: results
            });
        });
    },
    
    showContactManagement: (req, res) => {
        const query = 'SELECT * FROM contact ORDER BY created_at DESC';
        db.query(query, (err, contacts) => {
            if (err) {
                console.error(err);
                return res.render('admin/contact', { contacts: [] });
            }
            res.render('admin/contact/contact', { contacts: contacts });
        });
    },
    
    };
    
    module.exports = adminController;