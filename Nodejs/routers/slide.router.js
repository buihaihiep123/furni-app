const slideCtrl = require('../controllers/slide.controller')
const upload = require('../upload-multer');
module.exports = function (app) {
    app.get('/slide',slideCtrl.index);
    app.get('/slide-add',slideCtrl.add);
    app.post('/slide-add',upload.single('image'),slideCtrl.store);
    app.get('/slide-edit/:id',slideCtrl.edit);
    app.post('/slide-edit/:id',upload.single('image'),slideCtrl.update);
    app.get('/slide-delete/:id',slideCtrl.delete);
}