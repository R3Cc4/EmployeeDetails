var express = require('express');
var router = express.Router();
var results = require('../public/javascripts/employeeDataMongo.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('test');
});
router.get('/employees', function (req, res, next) {
    results.getEmployeeDetails(function (err, employees) {
        //console.log(employees);
        res.json(employees);
    });
});

router.get('/deleteEmployees', function (req, res, next) {
    console.log("Got here!!");

    var ids = req.query.id;
    console.log("IDS in index =" + ids);
    
    results.deleteEmployeeDetails(ids, function (err, response) {
        //console.log(response);
        //res.json(employees);
    });
    //res.json();
});
module.exports = router;