const newCtrl = require('../controllers/new.controller')
const upload = require('../upload-multer');
module.exports = function (app) {
    app.get('/new',newCtrl.index);
    app.get('/new-add',newCtrl.add);
    app.post('/new-add',upload.single('image'),newCtrl.store);
    app.get('/new-edit/:id',newCtrl.edit);
    app.post('/new-edit/:id',upload.single('image'),newCtrl.update);
    app.get('/new-delete/:id',newCtrl.delete);
}