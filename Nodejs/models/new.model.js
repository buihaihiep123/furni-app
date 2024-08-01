const { log } = require('node:console');
const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

const New = function () { }
New.getAll = async function (req, callback) {
    let _name = req.query.name;
    //lấy trang hiện tại vd 123
    let _page = req.query.page ? req.query.page : 1;
    //truy vấn tính tổng số dòng trong một bảng
    let _sql_total = "SELECT COUNT(*) as total FROM news";
    if (_name) {
        _sql_total += " WHERE title LIKE '%" + _name + "%'"
    }
    let rowData = await query(_sql_total);
    let totalRow = rowData[0].total;
    //số trang thực tế sẽ có

    let _limit = 5;
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    let sql = "SELECT*FROM news";

    if (_name) {
        sql += " WHERE title LIKE '%" + _name + "%'"
    }
    sql += " order by new_id  DESC LIMIT " + _start + "," + _limit;
    ketnoi.query(sql, function (err, data) {
        callback(err, data, totalPage, _page, _name);
    });

};
//truyền theo req(vd: lưu trữ cho thêm mới)
New.store = function (req, myFun) {


    let sql = `INSERT INTO news 
(title, content, upload_date,image ) 
VALUES (?, ?, CURRENT_TIMESTAMP,?)`;
    ketnoi.query(sql,  [req.title, req.content, req.image], (err, data) => {
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
New.getOne = function (id, myFun) {
    ketnoi.query("SELECT*FROM news WHERE new_id = ?", [id], (err, data) => {
        if (data.length) {
            myFun(false, data[0])
        } else {
            myFun({ msg: 'không tìm thấy dữ liệu', errno: 404 }, null)
        }

    });
};
New.update = function (req, myFun) {
    let id = req.params.id;
    if (req.file || req.file != undefined) {
        req.body.image = req.file.filename;
    }
    let sql = " UPDATE news SET ? WHERE new_id = ?";
    ketnoi.query(sql, [req.body, id], (err, data) => {
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
New.delete = function (req, myFun) {
    let id = req.params.id;
    let sql_delete = "DELETE FROM news WHERE new_id =?";
    ketnoi.query(sql_delete, [id], function (err, data) {
        if (err) {
            let msg = '';
            if (err.errno == 404) {
                msg = 'đường dẫn hoặc tài nguyên bạn cố gắng xóa không tồn tại';
            }
            else if (err.errno == 500) {
                msg = 'mã lỗi chung cho nhiều vấn đề khác nhau ở phía máy chủ. Có thể có lỗi trong mã nguồn xóa dữ liệu hoặc có vấn đề về cơ sở dữ liệu.';
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
module.exports = New;