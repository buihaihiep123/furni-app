const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Provider = require('../models/provider.model')
exports.index = async function (req, res) {
    Product.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('product', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}

exports.add = async function (req, res) {
    try {
        const [cats, prov] = await Promise.all([
            new Promise((resolve, reject) => {
                Category.dataComboBox((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            }),
            new Promise((resolve, reject) => {
                Provider.dataComboBox((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            })
        ]);

        res.render('product-add', {
            cats: cats.length ? cats : [],
            prov: prov.length ? prov : []
        });
    } catch (err) {
        console.error("Error fetching data: ", err);
        res.status(500).send("Error fetching data");
    }
};

exports.store = (req, res) => {
    let bodyData = req.body;
    bodyData.image = req.file.filename;
    console.log(bodyData);
    Product.store(bodyData, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/product');
        }
    });
};


exports.edit = async (req, res) => {
    let id = req.params.id;
    let sql_cats = "SELECT category_id, category_name FROM categories order by category_name ASC ";
    let queryCat = await query(sql_cats);
    let sql_prv = "SELECT provider_id, provider_name FROM provider order by provider_name ASC ";
    let queryPrv = await query(sql_prv);
    // console.log(queryCat)
    Product.getOne(id, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.render('product-edit', {
                pro: data,
                cats:queryCat,
                prov:queryPrv
            });
        }
    });

};

exports.update = (req, res) => {
    // console.log(req.body);
    Product.update(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/product');
        }
    });
};


exports.delete = function (req, res) {
    Product.delete(req, function (err, data) {
        if (err) {
            res.render('error', {
                message: err.msg,
                code: err.errno
            });
        } else {
            res.redirect('/product');
        }
    });
};

