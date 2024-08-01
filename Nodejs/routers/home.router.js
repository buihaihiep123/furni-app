// routes/homeRoute.js

const express = require('express');
const homeController = require('../controllers/home.controller');
module.exports=function (app){
    app.get('/', homeController.getHomeData);

}