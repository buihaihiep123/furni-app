const ketnoi = require('../connect-mysql');
const util = require('node:util');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const Bill = require('../models/bill.model');


exports.index = async function (req, res) {
    Bill.getAll(req, function (err, data, totalPage, _page, _name) {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        // console.log("Fetched Data:", data);
        res.render('bill', {
            data: data ? data : [],
            totalPage: totalPage,
            _page: parseInt(_page),
            _name: _name
        });
    });

}
exports.getBillDetails = (req, res) => {
    const bill_id = req.params.bill_id;

    Bill.getBillDetails(bill_id, (err, data) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.render('billDetails', {
            bill: data.bill,
            billDetails: data.billDetails
        });
    });
};
exports.updateStatus = async function (req, res) {
    const bill_id = req.params.bill_id;
    const newStatus = req.body.status;

    Bill.updateStatus(bill_id, newStatus, function (err, result) {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.status(200).json({ message: "Trạng thái đã được cập nhật thành công" });
    });
};
