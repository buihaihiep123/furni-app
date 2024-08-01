// const express = require('express');
// const router = express.Router();

// const { log } = require('node:console');
// const ketnoi = require('../connect-mysql');
// const util = require('node:util');
// const query = util.promisify(ketnoi.query).bind(ketnoi);;

// // POST /api/checkout
// router.post('/createbill', async (req, res) => {
//   console.log(req.body);
//   const bill = req.body.bill;
//   const billDetails = req.body.billDetails;

//   try {
//     // Chèn hóa đơn
//     bill.bill_date = new Date(bill.bill_date).toISOString().slice(0, 19).replace('T', ' ');
//     const result = await query('INSERT INTO bill SET ?', bill);
//     const bill_id = result.insertId; // Giả sử trả về ID của hóa đơn vừa chèn

//     // Thêm bill_id vào mỗi chi tiết hóa đơn
//     const billDetailsWithBillId = billDetails.map(detail => ({
//       ...detail,
//       bill_id
//     }));

//     // Chèn các chi tiết hóa đơn
//     await query('INSERT INTO bill_detail (bill_id, product_id, quantity, price, subtotal) VALUES ?', 
//       [billDetailsWithBillId.map(detail => [detail.bill_id, detail.product_id, detail.quantity, detail.price, detail.subtotal])]);

//     res.status(201).json({ message: 'Đặt hàng thành công!' });
//   } catch (error) {
//     console.error('Error inserting bill:', error);
//     res.status(500).json({ error: 'Đã xảy ra lỗi khi đặt hàng.' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const util = require('util');
const ketnoi = require('../connect-mysql');
const query = util.promisify(ketnoi.query).bind(ketnoi);

// Thiết lập transporter cho nodemailer
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
router.post('/createbill', async (req, res) => {
  console.log(req.body);
  const bill = req.body.bill;
  const billDetails = req.body.billDetails;

  try {
    // Chèn hóa đơn
    bill.bill_date = new Date(bill.bill_date).toISOString().slice(0, 19).replace('T', ' ');
    const result = await query('INSERT INTO bill SET ?', bill);
    const bill_id = result.insertId; // Giả sử trả về ID của hóa đơn vừa chèn
    const total_amount = bill.total_amount;

    // Thêm bill_id vào mỗi chi tiết hóa đơn
    const billDetailsWithBillId = billDetails.map(detail => ({
      ...detail,
      bill_id
    }));

    // Chèn các chi tiết hóa đơn
    await query('INSERT INTO bill_detail (bill_id, product_id, quantity, price, subtotal) VALUES ?', 
  [billDetailsWithBillId.map(detail => [detail.bill_id, detail.product_id, detail.quantity, detail.price, detail.subtotal])]);

for (const detail of billDetails) {
  await query('UPDATE detail_product SET quantity = quantity - ? WHERE product_id = ?', [detail.quantity, detail.product_id]);
  
  // Kiểm tra nếu số lượng sản phẩm bằng 0 thì cập nhật trạng thái về 0
  await query('UPDATE detail_product SET status = 0 WHERE product_id = ? AND quantity = 0', [detail.product_id]);
}
    // Truy vấn thông tin chi tiết để gửi email
    const [account] = await query('SELECT account_name, email FROM account WHERE account_id = ?', [bill.account_id]);
    const products = await query(
      'SELECT p.product_name, bd.quantity, bd.price, bd.subtotal FROM bill_detail bd JOIN detail_product p ON bd.product_id = p.product_id WHERE bd.bill_id = ?',
      [bill_id]
    );

    // Tạo nội dung email
    // const mailOptions = {
    //   from: '"Furni. 👻" <buihaihiep15042002@gmail.com>',
    //   to: account.email,
    //   subject: 'Thông tin đơn hàng của bạn',
    //   html: `
    //     <p>cảm ơn bạn đã lựa chọn cửa hàng Furni để sử dụng dịch vụ.Sau đây là thông tin chi tiết đơn hàng của bạn:</p>
    //     <h1>Thông tin đơn hàng</h1>
    //     <p>Mã đơn hàng: ${bill_id}</p>
    //     <p>Người đặt: ${account.account_name}</p>
    //     <p>Ngày đặt: ${bill.bill_date}</p>
    //     <p>Tổng số tiền: ${bill.total_amount}</p>
    //     <p>Phương thức thanh toán: ${bill.payment_method}</p>
    //     <p>Trạng thái: ${bill.status}</p>
    //     <h2>Chi tiết sản phẩm</h2>
    //     <ul>
    //       ${products.map(product => `
    //         <li>
    //           <p>Tên sản phẩm: ${product.product_name}</p>
    //           <p>Số lượng: ${product.quantity}</p>
    //           <p>Giá: ${product.price}</p>
    //           <p>Tổng cộng: ${product.subtotal}</p>
    //         </li>
    //       `).join('')}
    //     </ul>
    //     <p>chúc bạn một ngày vui vẻ và đừng quên phản hồi lại cho Furni nhé!</p>
    //   `
    // };

    // // Gửi email
    // await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Đặt hàng thành công và email đã được gửi!' ,bill_id,total_amount});
  } catch (error) {
    console.error('Error inserting bill:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi đặt hàng.' });
  }
});

module.exports = router;
