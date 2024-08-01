const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const New = require('../models/new.model')


exports.index = async function (req, res) {
    New.getAll(req, function (err, data, totalPage, _page, _name) {
        res.send({
            result: data ? data : [],
            message:"",
            code:200,
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}

exports.store = (req, res) => {
    
    New.store(req,function(err, data){
        if (err) {
            res.send({
                result:"",
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
    New.getOne(id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:err.errno
            });
        } else {
            res.send({
                result:data,
                message: "",
                code: 200
            });
        }
    });
    
};
exports.update = (req, res) => {
    New.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            New.update(req,function(err,data){
                if (err) {
                    res.send({
                        message: err.msg,
                        code: err.errno
                    });
                } else {
                    req.body.id = req.params.id;
                    res.send({               
                        result:req.body,
                        message: 'cap nhat thanh cong',
                        code: 200
                    });
                }
            });
        }
    });
    
};
exports.delete = function (req, res) {
    New.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            New.delete(req, function (err, data) {
                if (err) {
                    res.send({
                        result:"",
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