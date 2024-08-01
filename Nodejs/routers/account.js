const express = require('express');
const connection = require('../connect-mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth =require('../services/authentication');
var checkRole = require('../services/checkRole');



router.post('/signupUSER', (req, res) => {
    let user = req.body;
    query = "select email, password, role, status from account where email =?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into account(account_name,email,password,role,created_at,status,phone_number,address)value(?,?,?,'customer',NOW(),'1',?,?)"
                connection.query(query, [user.account_name, user.email, user.password, user.phone_number,user.address], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Đăng ký thành công" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "email đã truy cập." });
            }
        }
        else {
            return res.status(500).json(err)
        }
    })

});

router.post('/loginUSER', (req, res) => {
    const user = req.body;
    query = "select account_name,account_id, email,password,role,status ,address, phone_number from account where email=? ";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Người dùng hoặc mật khẩu không chính xác" });
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Vui lòng chờ phê duyệt" })
            } else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role ,address:results[0].address,phone_number:results[0].phone_number}
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken ,account_name:results[0].account_name, account_id:results[0].account_id});
            } else {
                return res.status(400).json({ message: "Có gì đó không ổn! Vui lòng thử lại!" });
            }
        } else {
            console.log("err",err)
            return res.status(500).json(err)
        }
    })
})
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

router.post('/forgotPasswordUSER', (req, res) => {
 
    const user = req.body;
    console.log(user)

    query = "select email, password from account where email = ?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                console.log(results)
                var mailOption = {
                    from: 'buihaihiep15042002@gmail.com',
                    to: results[0].email,
                    subject: 'mật khẩu theo hệ thống quản lý website nội thất Furni',
                    html: '<p><b>Thông tin đăng nhập chi tiết</b><br><b>Email:</b>' + results[0].email + '<br><b>Password: </br>' + results[0].password + '<br><a href ="http://localhost:4200/">Nhấn vào đây để đăng nhập</a></p>'
                };
                transporter.sendMail(mailOption, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent:' + info.response);
                    }
                });
                return res.status(200).json({ message: "Mật khẩu được gửi thành công tới email của bạn." });
            } else {
                
                return res.status(500).json({ message: "Mật khẩu không gửi thành công tới email của bạn." });
            }
        }else{
            return res.status(500).json(err)
        }

    })
})
router.get('/getUSER',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    var query = "select account_id,email,phone_number,status,account_name,address from account where role = 'customer'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);

        }
    })
})
router.get('/getUSERById/:id', auth.authenticateToken, (req, res) => {
    const userId = req.params.id;
    var query = "select account_id, email, phone_number, status, account_name, address from account where account_id = ?";
    connection.query(query, [userId], (err, results) => {
        if (!err) {
            if (results.length > 0) {
                return res.status(200).json(results[0]);
            } else {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
        } else {
            return res.status(500).json(err);
        }
    });
});
router.put('/updateUSER', auth.authenticateToken,(req,res)=>{
    let user = req.body;
    console.log(user)
    var query = `
    UPDATE account 
    SET account_name = ?, 
        email =?,
        role = 'customer', 
        created_at = NOW(), 
        status = '1', 
        phone_number = ?, 
        address = ? 
    WHERE account_id = ?
  `;
    connection.query(query,[user.account_name,user.email,user.phone_number,user.address,user.account_id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Người dùng không tồn tại"});
            }
            return res.status(200).json({message:"cập nhật thành công!"})
        }else{
            return res.status(500).json(err);
        }
    })
})
router.get('/checkTokenUSER',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:"true"});
})
router.post('/changePasswordUSER',auth.authenticateToken,(req,res)=>{
    const user = req.body;
    console.log(user)
    var query ="select * from account where email =? and password = ?";
    connection.query(query,[user.email,user.oldPassword],(err,results)=>{
        if(!err){
            if(results.length <= 0){
                return res.status(400).json({message:"Mật khẩu cũ không chính xác!"});
            }else if(results[0].password ==user.oldPassword){
                query= "update account set password=? where email =?";
                connection.query(query,[user.newPassword,user.email],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Đã cập nhật thành công mật khẩu!"});
                    }else{
                        return res.status(500).json(err);
                    }
                })
            }else{
                return res.status(400).json({message:"Có gì đó không ổn! Vui lòng thử lại"});
            }
        }else{
            return res.status(500).json(err);
        }
    })
})
module.exports = router;