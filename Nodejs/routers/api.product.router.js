const productCtrl = require('../controllers/api.product.controller')
const ketnoi = require('../connect-mysql');
module.exports = function (app) {
    // app.get('/api/category',categoryCtrl.index);
    app.post('/api/product', productCtrl.store);
    app.get('/api/product/:id', productCtrl.edit);
    app.put('/api/product/:id', productCtrl.update);
    app.delete('/api/product/:id', productCtrl.delete);
    app.get('/api/product/category/:id', productCtrl.getByCategoryId);
    app.get('/api/products',productCtrl.getAllProducts);
}