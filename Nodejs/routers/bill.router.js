const billCtr = require('../controllers/bill.controller')
module.exports = function (app) {
    app.get('/bill',billCtr.index);
    app.get('/bill/:bill_id', billCtr.getBillDetails);
    app.post('/bill/:bill_id/status', billCtr.updateStatus); 
}