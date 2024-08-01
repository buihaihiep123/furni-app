const mysql = require('mysql2');
const ketnoi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    database: 'doanqlnt'
});
ketnoi.connect(function(err){
    if(err){
        console.log('Kết nối CSDL không thành công, kiểm tra lại CSDL')
    }
});
module.exports = ketnoi;