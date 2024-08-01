const providerCtrl = require('../controllers/provider.controller')
module.exports = function (app) {
    app.get('/provider',providerCtrl.index);
    app.get('/provider-add',providerCtrl.add);
    app.post('/provider-add',providerCtrl.store);
    app.get('/provider-edit/:id',providerCtrl.edit);
    app.post('/provider-update/:id',providerCtrl.update);
    app.get('/provider-delete/:id',providerCtrl.delete);
}