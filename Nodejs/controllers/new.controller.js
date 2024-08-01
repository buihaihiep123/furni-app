const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const New = require('../models/new.model')


exports.index = async function (req, res) {
    New.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('new', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}

exports.add = function (req, res) {
    res.render('new-add');
};


exports.store = (req, res) => {
    let bodyData = req.body;
    bodyData.image = req.file.filename;
    New.store(bodyData, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/new');
        }
    });
};


exports.edit = (req, res) => {
    let id = req.params.id;
    New.getOne(id,function(err,data){
        if(err){
            res.render('error',{
                message: err.msg,
                code:err.errno
            });
        } else {
            res.render('new-edit', {
                ne:data
            });
        }
    });
    
};

exports.update = (req, res) => {
    New.update(req,function(err,data){
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/new');
        }
    });
};
exports.delete = function (req, res) {
    New.delete(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/new');
        }
    });
};