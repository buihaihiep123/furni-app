const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Category = require('../models/category.model')


exports.index = async function (req, res) {
    try {
        let _name = req.query.name;

        // Truy vấn để tính tổng số dòng trong một bảng
        let _sql_total = "SELECT COUNT(*) as total FROM categories";
        if (_name) {
            _sql_total += " WHERE category_name LIKE '%" + _name + "%'";
        }
        let rowData = await query(_sql_total);
        let totalRow = rowData[0].total;

        // Truy vấn để lấy tất cả các dòng dữ liệu
        let sql = "SELECT * FROM categories";
        if (_name) {
            sql += " WHERE category_name LIKE '%" + _name + "%'";
        }
        sql += " ORDER BY category_id  DESC";

        let data = await new Promise((resolve, reject) => {
            ketnoi.query(sql, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });

        res.send({
            result: data ? data : [],
            message:"",
            code:200,
            _name: _name
        });
    } catch (err) {
        // Xử lý lỗi nếu có
        res.status(500).send({
            message: "Internal server error",
            code: 500
        });
    }
};


exports.store = (req, res) => {
    
    Category.store(req,function(err, data){
        if (err) {
            res.send({
                result:"",
                message: err.msg,
                code: err.errno
            });
        } else {
            req.body.id = data.insertId;
            res.send({
                result: req.body,   
                message: 'them thanh cong',
                code: 200
            });
        }
    });
};


exports.edit = (req, res) => {
    let id = req.params.id;
    Category.getOne(id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:err.errno
            });
        } else {
            res.send({
                result:data,
                message: "",
                code: 200
            });
        }
    });
    
};
exports.update = (req, res) => {
    Category.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            Category.update(req,function(err,data){
                if (err) {
                    res.send({
                        message: err.msg,
                        code: err.errno
                    });
                } else {
                    req.body.id = req.params.id;
                    res.send({               
                        result:req.body,
                        message: 'cap nhat thanh cong',
                        code: 200
                    });
                }
            });
        }
    });
    
};
exports.delete = function (req, res) {
    Category.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            Category.delete(req, function (err, data) {
                if (err) {
                    res.send({
                        result:"",
                        message: err.msg,
                        code: err.errno
                    });
                } else {
                    res.send({
                        message: 'xoa thanh cong',
                        code: 200
                    });
                }
            });
        }
    });
    
};