const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Account = require('../models/account.model')


exports.index = async function (req, res) {
    Account.getAll(req, function (err, data, totalPage, _page, _name) {
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
    Account.store(req,function(err, data){
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
    Account.getOne(id,function(err,data){
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
    Account.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            Account.update(req,function(err,data){
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
    Account.getOne(req.params.id,function(err,data){
        if(err){
            res.send({
                result:"",
                message: err.msg,
                code:200
            });
        } else {
            Account.delete(req, function (err, data) {
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

exports.login = function(req, res){
    let bodyData ={
        email: req.body.email,
        password: req.body.password
    }
    Account.checkLogin(bodyData, function(err, data){
       if(data){
        res.send({
            result: data,
            message:"",
            code: 200
        })
       }else{
        res.send({
            result: data,
            message:"Tài khoản hoặc mật khẩu không chính xác!!!",
            code: 404
        })
       }
    })
}