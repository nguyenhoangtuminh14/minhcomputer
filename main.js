const express = require('express');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const ejsLayouts = require('express-ejs-layouts');
const indexRoutes = require('./routes/indexRoutes');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({ dest: 'public/img/' });

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/', adminRoutes);

app.listen(port, () => {
    console.log(`Ứng dụng đang chạy ở http://localhost:${port}`);
});