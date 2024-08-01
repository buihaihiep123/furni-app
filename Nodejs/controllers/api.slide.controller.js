const Slide = require('../models/slide.model')
const ketnoi = require('../connect-mysql');
exports.index = (req, res) => {
    let _limit = req.query.limit;
    _limit = _limit != undefined ? _limit : 5;
    let sql = "SELECT * FROM slide ORDER BY slide_id ASC LIMIT " + _limit;

    ketnoi.query(sql, (err, data) => {

        let result = [];
        data.forEach(sli => {
            sli.image = 'http://localhost:3000/uploads/' + sli.image,
                result.push(sli)
        })
        res.send({
            result: data,
            code: 200,
            message: ""
        })
    })
}
exports.store = (req, res) => {

    Slide.store(req, function (err, data) {
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
    Slide.getOne(id, function (err, data) {
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

exports.update = (req, res) => {
    Slide.getOne(req.params.id, function (err, data) {
        if (err) {
            res.send({
                result: "",
                message: err.msg,
                code: 200
            });
        } else {
            Slide.update(req, function (err, data) {
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
    Slide.getOne(req.params.id, function (err, data) {
        if (err) {
            res.send({
                result: "",
                message: err.msg,
                code: 200
            });
        } else {
            Slide.delete(req, function (err, data) {
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