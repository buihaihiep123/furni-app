const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

const Category = function () { }
Category.getAll = async function (req, callback) {
    let _name = req.query.name;
    //lấy trang hiện tại vd 123
    let _page = req.query.page ? req.query.page : 1;
    //truy vấn tính tổng số dòng trong một bảng
    let _sql_total = "SELECT COUNT(*) as total FROM categories";
    if (_name) {
        _sql_total += " WHERE category_name LIKE '%" + _name + "%'"
    }
    let rowData = await query(_sql_total);
    let totalRow = rowData[0].total;
    //số trang thực tế sẽ có

    let _limit = 5;
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    let sql = "SELECT*FROM categories";

    if (_name) {
        sql += " WHERE category_name LIKE '%" + _name + "%'"
    }
    sql += " order by category_id ASC LIMIT " + _start + "," + _limit;
    ketnoi.query(sql, function (err, data) {
        callback(err, data, totalPage, _page, _name);
    });

};
//truyền theo req(vd: lưu trữ cho thêm mới)
Category.store = function (req, myFun) {
    let sql = " INSERT INTO categories SET ? ";
    ketnoi.query(sql, req.body, (err, data) => {
        if (err) {
            let msg = '';
            if (err.errno == 1062) {
                msg = 'Trùng tên'
            } else {
                msg = 'đã có lỗi, vui lòng kiểm tra'
            }
            myFun({ msg, errno: err.errno }, null) //khi có lỗi data = null
        } else {
            myFun(false, data);
        }
    });
}


//truyền trực tiếp(vd:edit) truyền tham số
// Category.getOne = function (id, myFun) {
//     ketnoi.query("SELECT*FROM categories WHERE category_id = ?", [id], (err, data) => {
//         if (data) {
//             myFun(false,data)
//         } else {
//             myFun({ msg: 'không tìm thấy dữ liệu', errno: 404 }, null)
//         }

//     });
// };


Category.getOne = function (id,myFun){

    ketnoi.query('SELECT * FROM categories WHERE category_id = ?', [id], (err, data) => {
        if (err) {
            return myFun({ msg: 'Lỗi khi lấy danh mục', errno: err.errno });
        }
        myFun(null, data);
    });
}



Category.getByNameAndId = async (name, id) => {
    const sql = "SELECT COUNT(category_id) as count FROM categories WHERE category_name = ? AND category_id != ?";
    return query(sql, [name, id]);
}

Category.update = (id, data, callback) => {
    const sql = "UPDATE categories SET ? WHERE category_id = ?";
    ketnoi.query(sql, [data, id], (err, results) => {
        callback(err, results);
    });
}



// Category.update =  async (req, myFun)=> {
//     let id = req.params.id;
//     let checkExist = await query("select count(id) as count from categories where category_name =? AND category_id !=?",[req.body.name,id]);
//     let sql = " UPDATE categories SET ? WHERE category_id = ?";
//     ketnoi.query(sql, [req.body, id], (err, data) => {
//         if (err) {
//             let msg = '';
//             if (err.errno == 1062) {
//                 msg = 'Trùng tên'
//             } else {
//                 msg = 'đã có lỗi, vui lòng kiểm tra'
//             }
//             myFun({ msg, errno: err.errno }, null) //khi có lỗi data = null
//         } else {
//             myFun(false, data);
//         }
//     });
// }
Category.delete = function (req, myFun) {
    let id = req.params.id;
    let sql_delete = "DELETE FROM categories WHERE category_id =?";
    ketnoi.query(sql_delete, [id], function (err, data) {
        if (err) {
            let msg = '';
            if (err.errno == 404) {
                msg = 'đường dẫn hoặc tài nguyên bạn cố gắng xóa không tồn tại';
            }
            else if (err.errno == 500) {
                msg = 'mã lỗi chung cho nhiều vấn đề khác nhau ở phía máy chủ. Có thể có lỗi trong mã nguồn xóa dữ liệu hoặc có vấn đề về cơ sở dữ liệu.';
            }
            else if (err.errno == 1451) {
                msg = 'Danh mục đang có sản phẩm,không thể xóa';
            }
            else {
                msg = 'đã có lỗi, vui lòng thử lại'
            }
            myFun({ msg, errno: err.errno }, null) //khi có lỗi data = null
        } else {
            myFun(false, data);
        }
    })
}
Category.dataComboBox = function (myFun) {
    ketnoi.query("SELECT category_id, category_name FROM categories ORDER BY  category_name ASC ", (err, data) => {
        myFun(err, data);
    })
}


module.exports = Category;