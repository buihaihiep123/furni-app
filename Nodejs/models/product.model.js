const { log } = require('node:console');
const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

const Product = function () { }
Product.getAll = async function (req, callback) {
    let _name = req.query.name;
    //lấy trang hiện tại vd 123
    let _page = req.query.page ? req.query.page : 1;
    //truy vấn tính tổng số dòng trong một bảng
    let _sql_total = "SELECT COUNT(*) as total FROM detail_product";
    if (_name) {
        _sql_total += " WHERE product_name LIKE '%" + _name + "%'"
    }
    let rowData = await query(_sql_total);
    let totalRow = rowData[0].total;
    //số trang thực tế sẽ có

    let _limit = 8;
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    let sql = "SELECT p.*, c.category_name as catname,prv.provider_name as provname FROM detail_product p JOIN categories c ON p.category_id = c.category_id JOIN provider prv ON p.provider_id = prv.provider_id";

    if (_name) {
        sql += " WHERE product_name LIKE '%" + _name + "%'"
    }
    sql += " order by product_id  DESC LIMIT " + _start + "," + _limit;
    ketnoi.query(sql, function (err, data) {
        callback(err, data ,totalPage,_page,_name);
    });

};

// Product.getAll = async function (req, callback) {
//     let _name = req.query.name;
//     //lấy trang hiện tại vd 123
//     let _page = req.query.page ? req.query.page : 1;
//     //truy vấn tính tổng số dòng trong một bảng
//     let _sql_total = "SELECT COUNT(*) as total FROM detail_product";
//     if (_name) {
//         _sql_total += " WHERE product_name LIKE '%" + _name + "%'"
//     }
//     let rowData = await query(_sql_total);
//     let totalRow = rowData[0].total;
//     //số trang thực tế sẽ có

//     let _limit = 5;
//     let totalPage = Math.ceil(totalRow / _limit);
//     _page = _page > 0 ? Math.floor(_page) : 1;
//     _page = _page <= totalPage ? Math.floor(_page) : totalPage;
//     let _start = (_page - 1) * _limit;

//     let sql = "SELECT p.*, c.category_name as catname FROM detail_product p JOIN categories c ON p.category_id = c.category_id ";

//     if (_name) {
//         sql += " WHERE product_name LIKE '%" + _name + "%'"
//     }
//     sql += " order by product_id ASC LIMIT " + _start + "," + _limit;
//     ketnoi.query(sql, function (err, data) {
//         callback(err, data ,totalPage,_page,_name);
//     });

// };
//truyền theo req(vd: lưu trữ cho thêm mới)
Product.store = function(req,myFun){
    // console.log(req);
    let sql = `INSERT INTO detail_product (category_id, product_name, old_price, price, description, image, quantity,provider_id) VALUES (${req.category_id},"${req.product_name}", ${req.old_price}, ${req.price}, "${req.description}","${req.image}", ${req.quantity},${req.provider_id})`;
    // console.log(sql);
    ketnoi.query(sql, req.body, (err, data) => {
        if (err) {
            let msg = '';
            if (err.errno == 1062) {
                msg = 'Trùng tên'
            } else {
                msg = 'đã có lỗi, vui lòng kiểm tra'
            }
            myFun({msg, errno: err.errno}, null) //khi có lỗi data = null
        } else {
            myFun(false,data);
        }
    });
}


//truyền trực tiếp(vd:edit) truyền tham số
Product.getOne = function(id,myFun){
    ketnoi.query("SELECT*FROM detail_product WHERE product_id = ?", [id], (err, data) => {
        if (data.length) {
           myFun(false, data[0])
        } else {
            myFun({msg: 'không tìm thấy dữ liệu',errno: 404},null)
        }

    });
};
Product.getByCategoryId = function(categoryId, myFun) {
    ketnoi.query("SELECT * FROM detail_product WHERE category_id = ?", [categoryId], (err, data) => {
        if (data.length) {
            myFun(false, data); // Trả về mảng các sản phẩm theo mã loại sản phẩm
        } else {
            myFun({ msg: 'Không tìm thấy dữ liệu', errno: 404 }, null);
        }
    });
};
Product.update = function(req, myFun){
    let id = req.params.id;
    if(req.file || req.file != undefined){
        req.body.image = req.file.filename;
    }
    let sql = " UPDATE detail_product SET ? WHERE product_id = ?";
    ketnoi.query(sql, [req.body, id], (err, data) => {
        if (err) {
            let msg = '';
            if (err.errno == 1062) {
                msg = 'Trùng tên'
            } else {
                msg = 'đã có lỗi, vui lòng kiểm tra'
            }
            myFun({msg, errno: err.errno}, null) //khi có lỗi data = null
        } else {
            myFun(false,data);
        }
    });
}
Product.delete = function(req, myFun){
    let id = req.params.id;
    let sql_delete = "DELETE FROM detail_product WHERE product_id =?";
    ketnoi.query(sql_delete, [id], function (err, data) {
        if (err) {
            let msg = '';
            if(err.errno == 404){
                msg ='đường dẫn hoặc tài nguyên bạn cố gắng xóa không tồn tại';
            }
            else if(err.errno == 500){
                msg = 'mã lỗi chung cho nhiều vấn đề khác nhau ở phía máy chủ. Có thể có lỗi trong mã nguồn xóa dữ liệu hoặc có vấn đề về cơ sở dữ liệu.';
            }
            else{
                msg = 'đã có lỗi, vui lòng thử lại'
            }
            myFun({msg, errno: err.errno}, null) //khi có lỗi data = null
        } else {
           myFun(false,data);
        }
    })
}
module.exports = Product;