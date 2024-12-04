const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'minh', 
    password: '12345', 
    database: 'computers' 
});
db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối đến cơ sở dữ liệu: ' + err.stack);
        return;
    }
    console.log('Kết nối đến cơ sở dữ liệu thành công với ID: ' + db.threadId);
});

module.exports = db;