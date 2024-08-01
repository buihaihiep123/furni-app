const newCtrl = require('../controllers/api.new.controller')
module.exports = function (app) {
    app.get('/api/new',newCtrl.index);
    app.post('/api/new',newCtrl.store);
    app.get('/api/new/:id',newCtrl.edit);
    app.put('/api/new/:id',newCtrl.update);
    app.delete('/api/new/:id',newCtrl.delete);
}