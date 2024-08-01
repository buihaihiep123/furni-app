const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Account = require('../models/accountadmin.model')


exports.index = async function (req, res) {
    Account.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('account', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}
exports.add = function (req, res) {
    res.render('account-add');
};



exports.store = (req, res) => {

    Account.store(req,function(err, data){
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/account');
        }
    });
};


exports.edit = (req, res) => {
    let id = req.params.id;
    Account.getOne(id,function(err,data){
        if(err){
            res.render('error',{
                message: err.msg,
                code:err.errno
            });
        } else {
            res.render('account-edit', {
                cus:data
            });
        }
    });
    
};
exports.update = (req, res) => {
    Account.update(req,function(err,data){
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/account');
        }
    });
};
exports.delete = function (req, res) {
    Account.delete(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/account');
        }
    });
};