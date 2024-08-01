// homeController.js

const home = require('../models/home.model');

exports.getHomeData = async (req, res) => {
    try {
        const data = await home.getData();
        res.render('home', { data });
    } catch (err) {
        console.error("Error fetching home data: ", err);
        res.status(500).send("Internal Server Error");
    }
};
