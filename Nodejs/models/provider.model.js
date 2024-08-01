const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);

const Provider = function () { }
Provider.getAll = async function (req, callback) {
    let _name = req.query.name;
    //lấy trang hiện tại vd 123
    let _page = req.query.page ? req.query.page : 1;
    //truy vấn tính tổng số dòng trong một bảng
    let _sql_total = "SELECT COUNT(*) as total FROM provider";
    if (_name) {
        _sql_total += " WHERE provider_name LIKE '%" + _name + "%'"
    }
    let rowData = await query(_sql_total);
    let totalRow = rowData[0].total;
    //số trang thực tế sẽ có

    let _limit = 5;
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    let sql = "SELECT*FROM provider";

    if (_name) {
        sql += " WHERE provider_name LIKE '%" + _name + "%'"
    }
    sql += " order by provider_id ASC LIMIT " + _start + "," + _limit;
    ketnoi.query(sql, function (err, data) {
        callback(err, data, totalPage, _page, _name);
    });

};
//truyền theo req(vd: lưu trữ cho thêm mới)
Provider.store = function (req, myFun) {
    let sql = " INSERT INTO provider SET ? ";
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
// Provider.getOne = function (id, myFun) {
//     ketnoi.query("SELECT*FROM provider WHERE Provider_id = ?", [id], (err, data) => {
//         if (data) {
//             myFun(false,data)
//         } else {
//             myFun({ msg: 'không tìm thấy dữ liệu', errno: 404 }, null)
//         }

//     });
// };


Provider.getOne = function (id,myFun){

    ketnoi.query('SELECT * FROM provider WHERE provider_id = ?', [id], (err, data) => {
        if (err) {
            return myFun({ msg: 'Lỗi khi lấy danh mục', errno: err.errno });
        }
        myFun(null, data);
    });
}



Provider.getByNameAndId = async (name, id) => {
    const sql = "SELECT COUNT(provider_id) as count FROM provider WHERE provider_name = ? AND provider_id != ?";
    return query(sql, [name, id]);
}

Provider.update = (id, data, callback) => {
    const sql = "UPDATE provider SET ? WHERE provider_id = ?";
    ketnoi.query(sql, [data, id], (err, results) => {
        callback(err, results);
    });
}

Provider.delete = function (req, myFun) {
    let id = req.params.id;
    let sql_delete = "DELETE FROM provider WHERE provider_id =?";
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
Provider.dataComboBox = function (myFun) {
    ketnoi.query("SELECT provider_id, provider_name FROM provider ORDER BY  provider_name ASC ", (err, data) => {
        myFun(err, data);
    })
}


module.exports = Provider;