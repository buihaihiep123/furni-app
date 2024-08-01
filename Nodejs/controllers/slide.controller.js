const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Slide = require('../models/slide.model');

exports.index = async function (req, res) {
    Slide.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('slide', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}

exports.store = (req, res) => {
    let bodyData = req.body;
    bodyData.image = req.file.filename;
    // console.log(bodyData);
    Slide.store(bodyData, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/slide');
        }
    });
};
exports.add = function (req, res) {
    res.render('slide-add');
};

exports.edit = (req, res) => {
    let id = req.params.id;
    Slide.getOne(id,function(err,data){
        if(err){
            res.render('error',{
                message: err.msg,
                code:err.errno
            });
        } else {
            res.render('slide-edit', {
                sli:data
            });
        }
    });
    
};


exports.update = (req, res) => {
    // console.log(req.body);
    Slide.update(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/slide');
        }
    });
};


exports.delete = function (req, res) {
    Slide.delete(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/slide');
        }
    });
};

