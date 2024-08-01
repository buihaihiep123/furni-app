const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Category = require('../models/category.model')


exports.index = async function (req, res) {
    Category.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('category', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}

//     ketnoi.query(sql, function (err, data) {
//         if (err) {
//             console.error("Query Error:", err);
//             return res.status(500).send("Internal Server Error");
//         }
//         console.log("Fetched Data:", data);
//         res.render('category', {
//             data: data ? data : [],
//             totalPage: totalPage,
//             _page: parseInt(_page),
//             _name: _name
//         });
//     });

// };
exports.add = function (req, res) {
    res.render('category-add');
};

exports.edit = (req, res) => {
    let id = req.params.id;
    Category.getOne(id, (err, data) => {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.render('category-edit', {
                cat: data.length ? data[0] : {}
            });
        }
    });
};

exports.store = (req, res) => {

    Category.store(req,function(err, data){
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/category');
        }
    });
};


// exports.edit = (req, res) => {
//     let id = req.params.id;
//     Category.getOne(id,function(err,data){
//         if(err){
//             res.render('error',{
//                 message: err.msg,
//                 code:err.errno
//             });
//         } else {
//             res.render('category-edit', {
//                 cat:data
//             });
//         }
//     });
    
// };
//cat:data.length?data[0]:{}
// exports.edit = (req, res) => {
//     let id = req.params.id;
//     ketnoi.query("SELECT*FROM categories WHERE category_id = ?", [id], (er, data) => {
//         if (data.length) {
//             res.render('category-edit', {
//                 cat: data[0]
//             });
//         } else {
//             res.render('error', {
//                 message: 'không tìm thấy dữ liệu',
//                 code: 404
//             })
//         }

//     });
// };

// exports.update = (req, res) => {
//     Category.update(req,function(err,data){
//         if (err) {
//             res.render('error', {
//                 message: err.msg,
//                 code: err.errno
//             });
//         } else {
//             res.redirect('/category');
//         }
//     });
// };
exports.delete = function (req, res) {
    Category.delete(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/category');
        }
    });
};

exports.update = async (req, res) => {
    let id = req.params.id;
    let name = req.body.category_name;

    try {
        // Kiểm tra xem tên danh mục đã tồn tại chưa, trừ trường hợp của chính danh mục đang cập nhật
        let checkExist = await Category.getByNameAndId(name, id);
        if (checkExist[0].count > 0) {
            return res.status(400).send('Tên loại sản phẩm đã tồn tại, hãy chọn tên khác');
        }

        // Cập nhật danh mục
        Category.update(id, req.body, (err, data) => {
            if (err) {
                let msg = '';
                if (err.errno == 1062) {
                    msg = 'Tên loại sản phẩm đã tồn tại, hãy chọn tên khác';
                } else if (err.errno == 2000) {
                    msg = 'Tên danh mục này bị trùng';
                } else {
                    msg = 'Đã có lỗi, vui lòng thử lại';
                }
                return res.status(500).send(msg);
            } else {
                res.redirect('/category');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Đã có lỗi, vui lòng thử lại');
    }
};
