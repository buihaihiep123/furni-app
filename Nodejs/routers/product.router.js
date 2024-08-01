const productCtrl = require('../controllers/product.controller')
const upload = require('../upload-multer');
module.exports = function (app) {
    app.get('/product',productCtrl.index);
    app.get('/product-add',productCtrl.add);
    app.post('/product-add',upload.single('image'),productCtrl.store);
    app.get('/product-edit/:id',productCtrl.edit);
    app.post('/product-edit/:id',upload.single('image'),productCtrl.update);
    app.get('/product-delete/:id',productCtrl.delete);
}