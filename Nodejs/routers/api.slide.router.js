const slideCtrl = require('../controllers/api.slide.controller')
const ketnoi = require('../connect-mysql');
module.exports = function (app) {
    app.post('/api/slide', slideCtrl.store);
    app.get('/api/slide/:id', slideCtrl.edit);
    app.put('/api/slide/:id', slideCtrl.update);
    app.delete('/api/slide/:id', slideCtrl.delete);
    app.get('/api/slides',slideCtrl.index);
}