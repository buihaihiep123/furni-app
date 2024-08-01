const express = require('express');
const path = require('path');
const util = require('node:util');
const ketnoi = require('./connect-mysql');
const app = express();
const bodyParser = require('body-parser');
const query = util.promisify(ketnoi.query).bind(ketnoi);
const sessionStorage = require('node-sessionstorage');
const cors = require('cors');
// const billRoute = require('./routers/bill');
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
const accountRoute = require('./routers/account');
app.use('/account',accountRoute);
// app.use('/bill',billRoute);
// require('./routers/api.checkout.router')(app);
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
require('./routers/login.router')(app);
app.use(function(req, res, next){
    let accountJSON =sessionStorage.getItem('admin_login');
    if(accountJSON){
        global.account = JSON.parse(accountJSON);
        next();
    }else{
        res.redirect('/login');
    }

})

require('./routers/home.router')(app);
require('./routers/account.router')(app);
require('./routers/bill.router')(app);
require('./routers/provider.router')(app);
require('./routers/category.router')(app);
require('./routers/product.router')(app);
require('./routers/new.router')(app);
require('./routers/slide.router')(app);
app.get('/error', function (req, res) {
    res.render('error');
});



require('./routers/api.product.router')(app);
// const dh = require('./routers/api.bill.router')
// app.use('/dh', dh);
require('./routers/api.category.router')(app);
require('./routers/api.account.router')(app);
require('./routers/api.new.router')(app);
require('./routers/api.slide.router')(app);
require('./routers/api.favorite.router')(app);
require('./routers/vnpay')(app);


const checkoutRouter = require('./routers/api.checkout.router');
app.use('/api', checkoutRouter);





app.listen(PORT, function () {
    console.log('Serve run on http://localhost:' + PORT)
})


// // Đường dẫn đến thư mục chứa view
// app.set('views', path.join(__dirname, 'views'));

// // Các route
// Tên file view (index.ejs)

