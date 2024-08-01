const categoryCtrl = require('../controllers/api.category.controller')
module.exports = function (app) {
    app.get('/api/category',categoryCtrl.index);
    app.post('/api/category',categoryCtrl.store);
    app.get('/api/category/:id',categoryCtrl.edit);
    app.put('/api/category/:id',categoryCtrl.update);
    app.delete('/api/category/:id',categoryCtrl.delete);
}