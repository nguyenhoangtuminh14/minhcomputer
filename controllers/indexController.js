const db = require('../db');
const bcrypt = require('bcrypt');
const { formatCurrency } = require('./utils');

const calculateTotalAmount = (cartItems) => {
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
};

const indexController = {
    showIndexPage: (req, res) => {
        const latestProductCategoryId = 2;
        const topRatedProductCategoryId = 3;
        const reviewProductCategoryId = 9;
    
        const queryLatestProducts = 'SELECT * FROM products WHERE category_id = ?';
        const queryTopRatedProducts = 'SELECT * FROM products WHERE category_id = ?';
        const queryReviewProducts = 'SELECT * FROM products WHERE category_id = ?';
    
        db.query(queryLatestProducts, [latestProductCategoryId], (err, latestProducts) => {
            if (err) {
                console.error(err);
                return res.render('partials/index', {
                    latestProducts: [],
                    topRatedProducts: [],
                    reviewProducts: [],
                    error: 'Có lỗi xảy ra khi lấy sản phẩm.',
                    user: req.session.user,
                    formatCurrency
                });
            }
    
            db.query(queryTopRatedProducts, [topRatedProductCategoryId], (err, topRatedProducts) => {
                if (err) {
                    console.error(err);
                    return res.render('partials/index', {
                        latestProducts,
                        topRatedProducts: [],
                        reviewProducts: [],
                        error: 'Có lỗi xảy ra khi lấy sản phẩm.',
                        user: req.session.user,
                        formatCurrency
                    });
                }
    
                db.query(queryReviewProducts, [reviewProductCategoryId], (err, reviewProducts) => {
                    if (err) {
                        console.error(err);
                        return res.render('partials/index', {
                            latestProducts,
                            topRatedProducts,
                            reviewProducts: [],
                            error: 'Có lỗi xảy ra khi lấy sản phẩm.',
                            user: req.session.user,
                            formatCurrency
                        });
                    }
    
                    res.render('partials/index', {
                        latestProducts,
                        topRatedProducts,
                        reviewProducts,
                        error: null,
                        user: req.session.user,
                        formatCurrency
                    });
                });
            });
        });
    },

    showRegisterPage: (req, res) => {
        const errorMessage = req.query.error || null;
        const user = req.session.user || null;
    
        res.render('partials/register', { 
            title: 'Đăng ký', 
            error: errorMessage,
            user: user
        });
    },

    register: (req, res) => {
        const { name, email, password, confirm_password } = req.body;
    
        if (!name || !email || !password || !confirm_password) {
            return res.render('partials/register', { title: 'Đăng ký', error: 'Vui lòng điền đầy đủ thông tin.' });
        }
    
        if (password !== confirm_password) {
            return res.render('partials/register', { title: 'Đăng ký', error: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
        }
    
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error(err);
                return res.render('partials/register', { title: 'Đăng ký', error: 'Có lỗi xảy ra khi mã hóa mật khẩu.' });
            }
    
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hash], (err) => {
                if (err) {
                    console.error(err);
                    return res.render('partials/register', { title: 'Đăng ký', error: 'Có lỗi xảy ra khi lưu tài khoản.' });
                }
                res.redirect('/login');
            });
        });
    },

    showLoginPage: (req, res) => {
        res.render('partials/login', {
            title: 'Đăng Nhập',
            error: null,
            user: req.session.user
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.render('partials/login', { 
                    title: 'Đăng Nhập', 
                    error: 'Có lỗi xảy ra.',
                    user: req.session.user 
                });
            }

            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) {
                        console.error(err);
                        return res.render('partials/login', { 
                            title: 'Đăng Nhập', 
                            error: 'Có lỗi xảy ra.',
                            user: req.session.user 
                        });
                    }

                    if (match) {
                        req.session.user = { id: user.user_id, name: user.name }; 
                        res.redirect('/');
                    } else {
                        return res.render('partials/login', { 
                            title: 'Đăng Nhập', 
                            error: 'Thông tin đăng nhập không chính xác.',
                            user: req.session.user 
                        });
                    }
                });
            } else {
                return res.render('partials/login', { 
                    title: 'Đăng Nhập', 
                    error: 'Thông tin đăng nhập không chính xác.',
                    user: req.session.user 
                });
            }
        });
    },
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.redirect('/login');
        });
    },
    
    showShopGrid: (req, res) => {
        const query = 'SELECT * FROM products';
        
        db.query(query, (err, products) => {
            if (err) {
                console.error(err);
                return res.render('partials/shop-grid', {
                    products: [],
                    groupedProducts: {},
                    categoryMap: {},
                    user: req.session.user || null,
                    error: 'Có lỗi xảy ra khi lấy sản phẩm.'
                });
            }
        
            const groupedProducts = products.reduce((acc, product) => {
                const categoryId = product.category_id;
                if (!acc[categoryId]) {
                    acc[categoryId] = [];
                }
                product.formattedPrice = formatCurrency(product.price);
                acc[categoryId].push(product);
                return acc;
            }, {});
        
            const categoryMap = {};
            const categoryQuery = 'SELECT * FROM product_catalog';
            db.query(categoryQuery, (err, categories) => {
                if (err) {
                    console.error(err);
                    return res.render('partials/shop-grid', {
                        products: [],
                        groupedProducts: {},
                        categoryMap: {},
                        user: req.session.user || null,
                        error: 'Có lỗi xảy ra khi lấy danh mục.'
                    });
                }
        
                categories.forEach(category => {
                    categoryMap[category.id] = category.name;
                });
        
                res.render('partials/shop-grid', {
                    products: products,
                    groupedProducts: groupedProducts,
                    categoryMap: categoryMap,
                    user: req.session.user || null,
                    error: null
                });
            });
        });
    },
    
    showProductDetail: (req, res) => {
        const productId = req.params.id;
        const user = req.session.user || null;
        const productQuery = 'SELECT * FROM products WHERE product_id = ?';
        db.query(productQuery, [productId], (err, productResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Có lỗi xảy ra khi truy vấn sản phẩm.');
            }
        
            const product = productResult[0];
            product.image = product.image || 'default.jpg';
            product.formattedPrice = formatCurrency(product.price);
        
            res.render('partials/product', { product, user });
        });
    },
    
    addToCart: (req, res) => {
        const productId = req.body.product_id;
        const quantity = parseInt(req.body.quantity, 10);
        const productQuery = 'SELECT * FROM products WHERE product_id = ?';
        db.query(productQuery, [productId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Có lỗi xảy ra khi truy vấn sản phẩm.');
            }
        
            if (results.length === 0) {
                return res.status(404).send('Sản phẩm không tồn tại.');
            }
        
            const product = results[0];
            req.session.cart = req.session.cart || [];
            const existingCartItemIndex = req.session.cart.findIndex(item => item.product_id === product.product_id);
        
            if (existingCartItemIndex > -1) {
                req.session.cart[existingCartItemIndex].quantity += quantity;
            } else {
                const cartItem = {
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.image
                };
                req.session.cart.push(cartItem);
            }
        
            res.redirect('/cart');
        });
    },
    
    showCart: (req, res) => {
        const user = req.session.user || null;
        const cartItems = req.session.cart || [];
        let totalAmount = 0;
        const successMessage = req.query.success || null;
        const errorMessage = req.query.error || null;
        
        const formattedCartItems = cartItems.map(item => {
            const price = item.price;
            const quantity = item.quantity;
        
            if (price === undefined || quantity === undefined) {
                console.error('Giá hoặc số lượng không hợp lệ cho sản phẩm:', item);
                return {
                    ...item,
                    formattedPrice: '0 VNĐ',
                    formattedTotal: '0 VNĐ',
                    image: 'default.jpg'
                };
            }
        
            const total = price * quantity;
            totalAmount += total;
        
            return {
                ...item,
                formattedPrice: formatCurrency(price),
                formattedTotal: formatCurrency(total),
                image: item.image || 'default.jpg'
            };
        });
        
        res.render('partials/cart', { 
            cartItems: formattedCartItems, 
            totalAmount: formatCurrency(totalAmount),
            success: successMessage,
            error: errorMessage,
            user
        });
    },
    removeFromCart: (req, res) => {
        const productId = req.params.id;
    
        if (!req.session.cart) {
            return res.redirect('/cart');
        }
    
        req.session.cart = req.session.cart.filter(item => item.product_id !== parseInt(productId));
        res.redirect('/cart');
    },
    
    updateCartQuantity: (req, res) => {
        const productId = parseInt(req.params.productId);
        const action = req.body.action;
    
        req.session.cart = req.session.cart || [];
        const item = req.session.cart.find(i => i.product_id === productId);
    
        if (item) {
            if (action === 'increase') {
                item.quantity += 1;
            } else if (action === 'decrease') {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                }
            }
        }
    
        res.redirect('/cart');
    },
    
    showCheckout: (req, res) => {
        const user = req.session.user || null;
        if (!user) {
            return res.redirect('/cart?error=' + encodeURIComponent('Bạn cần đăng nhập để thanh toán.'));
        }
    
        const cartItems = req.session.cart || [];
        const totalAmount = calculateTotalAmount(cartItems);
    
        res.render('partials/checkout', { 
            title: 'Thanh Toán', 
            cartItems: cartItems, 
            totalAmount: formatCurrency(totalAmount),
            user: user
        });
    },
    
    completeCheckout: (req, res) => {
        const userId = req.session.user ? req.session.user.id : null;
        const cartItems = req.session.cart || [];
        const totalAmount = calculateTotalAmount(cartItems);
    
        if (!userId) {
            return res.redirect('/cart?error=' + encodeURIComponent('Bạn cần đăng nhập để thanh toán.'));
        }
    
        const orderQuery = 'INSERT INTO orders (user_id, total_amount, order_date, status) VALUES (?, ?, NOW(), ?)';
        const orderStatus = 'pending';
    
        db.query(orderQuery, [userId, totalAmount, orderStatus], (err, orderResult) => {
            if (err) {
                console.error(err);
                return res.render('partials/checkout', { error: 'Có lỗi xảy ra khi lưu đơn hàng.' });
            }
    
            const orderId = orderResult.insertId;
    
            const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
            
            const orderItems = cartItems.map(item => {
                return new Promise((resolve, reject) => {
                    db.query(orderItemsQuery, [orderId, item.product_id, item.quantity, item.price], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            });
    
            Promise.all(orderItems)
                .then(() => {
                    const updateUserQuery = 'UPDATE users SET order_count = order_count + 1 WHERE user_id = ?';
                    db.query(updateUserQuery, [userId], (err) => {
                        if (err) {
                            console.error(err);
                            return res.render('partials/checkout', { error: 'Có lỗi xảy ra khi cập nhật số đơn hàng.' });
                        }
    
                        req.session.cart = [];
    
                        res.redirect('/cart?success=' + encodeURIComponent('Thanh toán thành công!'));
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.render('partials/checkout', { error: 'Có lỗi xảy ra khi lưu đơn hàng.' });
                });
        });
    },
    contact: (req, res) => {
        const user = req.session.user || null;
        const { name, email, message } = req.body;
        const userId = user ? user.id : null;
    
        if (!name || !email || !message) {
            return res.redirect('/contact?error=' + encodeURIComponent('Vui lòng điền đầy đủ thông tin.'));
        }
    
        const query = 'INSERT INTO contact (name, email, message, user_id) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, message, userId], (err) => {
            if (err) {
                console.error(err);
                return res.redirect('/contact?error=' + encodeURIComponent('Có lỗi xảy ra khi gửi liên hệ.'));
            }
    
            if (userId) {
                const updateUserQuery = 'UPDATE users SET contact_count = contact_count + 1 WHERE user_id = ?';
                db.query(updateUserQuery, [userId], (err) => {
                    if (err) {
                        console.error(err);
                    }
                    res.redirect('/contact?success=' + encodeURIComponent('Tin nhắn đã được gửi thành công!'));
                });
            } else {
                res.redirect('/contact?success=' + encodeURIComponent('Tin nhắn đã được gửi thành công!'));
            }
        });
    },
    
    };
    
    module.exports = indexController;