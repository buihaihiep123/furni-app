const categoryCtrl = require('../controllers/category.controller')
module.exports = function (app) {
    app.get('/category',categoryCtrl.index);
    app.get('/category-add',categoryCtrl.add);
    app.post('/category-add',categoryCtrl.store);
    app.get('/category-edit/:id',categoryCtrl.edit);
    app.post('/category-update/:id',categoryCtrl.update);
    app.get('/category-delete/:id',categoryCtrl.delete);
}