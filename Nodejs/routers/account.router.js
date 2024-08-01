const accountCtrl = require('../controllers/accountadmin.controller')
const upload = require('../upload-multer');
module.exports = function (app) {
    app.get('/account',accountCtrl.index);
    // app.get('/account-add',accountCtrl.add);
    // app.post('/account-add',accountCtrl.store);
    // app.get('/account-edit/:id',accountCtrl.edit);
    // app.post('/account-edit/:id',accountCtrl.update);
    // app.get('/account-delete/:id',accountCtrl.delete);
}