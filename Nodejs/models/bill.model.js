const { log } = require('node:console');
const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc bất kỳ dịch vụ email nào bạn muốn sử dụng
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: 'buihaihiep15042002@gmail.com',
        pass: 'nhld chzz zzot gwbv'
    }
});

const Bill = function () { }

Bill.getAll = async function (req, callback) {
    let _name = req.query.name;
    let _page = req.query.page ? req.query.page : 1;

    // Truy vấn tính tổng số dòng có điều kiện tìm kiếm từ nhiều cột
    let _sql_total = `
        SELECT COUNT(*) as total 
        FROM bill b 
        JOIN account a ON b.account_id = a.account_id
    `;
    if (_name) {
        _sql_total += " WHERE a.account_name LIKE '%" + _name + "%'";
    }
    let rowData = await query(_sql_total);
    let totalRow = rowData[0].total;

    // Tính toán phân trang
    let _limit = 5;
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    // Truy vấn lấy dữ liệu có điều kiện tìm kiếm từ nhiều cột
    let sql = `
        SELECT b.*, a.account_name 
        FROM bill b 
        JOIN account a ON b.account_id = a.account_id
    `;
    if (_name) {
        sql += " WHERE a.account_name LIKE '%" + _name + "%'";
    }
    sql += " ORDER BY b.bill_id  DESC LIMIT " + _start + "," + _limit;

    ketnoi.query(sql, function (err, data) {
        callback(err, data, totalPage, _page, _name);
    });
};
Bill.getBillDetails = async function (bill_id, callback) {
    try {
        const billQuery = 'SELECT b.*, a.* FROM bill b JOIN account a ON b.account_id = a.account_id WHERE b.bill_id = ?';
        const billDetailsQuery = 'SELECT bd.*, p.product_name FROM bill_detail bd JOIN detail_product p ON bd.product_id = p.product_id WHERE bd.bill_id = ?';

        const bill = await query(billQuery, [bill_id]);
        const billDetails = await query(billDetailsQuery, [bill_id]);

        if (bill.length && billDetails.length) {
            callback(null, { bill: bill[0], billDetails });
        } else {
            callback('No details found', null);
        }
    } catch (error) {
        callback(error, null);
    }
};
Bill.updateStatus = async function (bill_id, status, callback) {
    const sql = "UPDATE bill SET status = ? WHERE bill_id = ?";
    try {
       const result=await query(sql, [0, bill_id]);

        const sqlgetdetail = `
            SELECT * 
            FROM bill b
            JOIN account a ON b.account_id = a.account_id
            JOIN bill_detail c ON b.bill_id = c.bill_id
            JOIN detail_product p ON c.product_id = p.product_id
            WHERE b.bill_id = ?
        `;
        const getid = await query(sqlgetdetail, [bill_id]);
        if (getid[0].status != 0) {
            const mailOptions = {
                from: '"Furni. 👻" <buihaihiep15042002@gmail.com>',
                to: getid[0].email,
                subject: 'Thông tin đơn hàng của bạn',
                html: `
                    <p>cảm ơn bạn đã lựa chọn cửa hàng Furni để sử dụng dịch vụ.Sau đây là thông tin chi tiết đơn hàng của bạn:</p>
                    <h1>Thông tin đơn hàng</h1>
                    <p>Mã đơn hàng: ${getid[0].bill_id}</p>
                    <p>Người đặt: ${getid[0].account_name}</p>
                    <p>Ngày đặt: ${getid[0].bill_date}</p>
                    <p>Tổng số tiền: ${getid[0].total_amount}</p>
                    <p>Phương thức thanh toán: ${getid[0].payment_method}</p>
                    <p>Trạng thái: ${getid[0].status}</p>
                    <h2>Chi tiết sản phẩm</h2>
                    <ul>
                    ${getid.map(product => `
                        <li>
                        <p>Tên sản phẩm: ${product.product_name}</p>
                        <p>Số lượng: ${product.quantity}</p>
                        <p>Giá: ${product.price}</p>
                        <p>Tổng cộng: ${product.subtotal}</p>
                        </li>
                    `).join('')}
                    </ul>
                    <p>chúc bạn một ngày vui vẻ và đừng quên phản hồi lại cho Furni nhé!</p>
                `
            };
            // Gửi email
            await transporter.sendMail(mailOptions);
        }


        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
    
};

module.exports = Bill;
