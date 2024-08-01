const Product = require('../models/product.model')
const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);


exports.getAllProducts = async (req, res) => {
    try {
        let _name = req.query.name;

        // Truy vấn lấy dữ liệu có điều kiện tìm kiếm từ nhiều cột
        let sql = "SELECT p.*, c.category_name as catname FROM detail_product p JOIN categories c ON p.category_id = c.category_id";
        if (_name) {
            sql += " WHERE p.product_name LIKE '%" + _name + "%' OR p.description LIKE '%" + _name + "%' OR c.category_name LIKE '%" + _name + "%'";
        }
        sql += " ORDER BY p.product_id  DESC";

        let data = await query(sql);

        let result = [];
        data.forEach(prod => {
            prod.image = 'http://localhost:3000/uploads/' + prod.image;
            result.push(prod);
        });

        res.send({
            result: result,
            code: 200,
            message: ""
        });
    } catch (err) {
        res.send({
            result: "",
            code: 500,
            message: "Lỗi truy vấn cơ sở dữ liệu"
        });
    }
};
exports.store = (req, res) => {

    Product.store(req, function (err, data) {
        if (err) {
            res.send({
                result: "",
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
    Product.getOne(id, function (err, data) {
        if (err) {
            res.send({
                result: "",
                message: err.msg,
                code: err.errno
            });
        } else {
            res.send({
                result: data,
                message: "",
                code: 200
            });
        }
    });

};

exports.getByCategoryId = (req, res) => {
    let categoryId = req.params.id;
    let search = req.query.search || ''; // Lấy tham số tìm kiếm từ query parameter

    let query = "SELECT * FROM detail_product WHERE category_id = ?";
    let params = [categoryId];

    if (search) {
        query += " AND product_name LIKE ?";
        params.push('%' + search + '%');
    }

    ketnoi.query(query, params, (err, data) => {
        if (err) {
            return res.send({
                result: "",
                message: 'Lỗi truy vấn',
                code: 500
            });
        }
        if (data.length) {
            res.send({
                result: data,
                message: "",
                code: 200
            }); // Trả về mảng các sản phẩm theo mã loại sản phẩm
        } else {
            res.send({
                result: "",
                message: 'Không tìm thấy dữ liệu',
                code: 404
            });
        }
    });
};
exports.update = (req, res) => {
    Product.getOne(req.params.id, function (err, data) {
        if (err) {
            res.send({
                result: "",
                message: err.msg,
                code: 200
            });
        } else {
            Product.update(req, function (err, data) {
                if (err) {
                    res.send({
                        message: err.msg,
                        code: err.errno
                    });
                } else {
                    req.body.id = req.params.id;
                    res.send({
                        result: req.body,
                        message: 'cap nhat thanh cong',
                        code: 200
                    });
                }
            });
        }
    });

};
exports.delete = function (req, res) {
    Product.getOne(req.params.id, function (err, data) {
        if (err) {
            res.send({
                result: "",
                message: err.msg,
                code: 200
            });
        } else {
            Product.delete(req, function (err, data) {
                if (err) {
                    res.send({
                        result: "",
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


