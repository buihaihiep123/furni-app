const accountCtrl = require('../controllers/api.account.controller');
module.exports = function(app){
    app.get('/api/account',accountCtrl.index);
    app.post('/api/account',accountCtrl.store);
    app.get('/api/account/:id',accountCtrl.edit);
    app.put('/api/account/:id',accountCtrl.update);
    app.delete('/api/account/:id',accountCtrl.delete);
    app.post('/api/account/login',accountCtrl.login);
}