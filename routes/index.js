var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');
var apps = express();
var results = require('../public/javascripts/employeeDataMongo');
var User = require('../public/javascripts/user');
var config = require('../public/javascripts/config'); // get our config file

var jwtauth = require('../public/javascripts/jwtauth.js');



/*// Asynchronous
var auth = express.basicAuth(function(user, pass, callback) {
 var result = (user === 'testUser' && pass === 'testPass');
 callback(null , result);
});
*/

apps.set("superSecret",config.secret);
/* GET home page. */
router.get('/login', jwtauth,function (req, res, next) {
    results.setupData(function(err,response){
        console.log("Data Set UP complete.");
    });
    res.render('test');
});

router.get('/',function(req, res, next) {
   
   res.render('login');
    
});

router.get('/loggedin',jwtauth,function(req, res, next) {
   
   res.redirect('/');
    
});


router.get('/loginuser',function(req, res, next) {
    console.log("in Login User =="+req.query.auth);
    var reqparams=JSON.parse(req.query.auth);
    var username = "\""+reqparams.name+"\"";
    var userpassword=reqparams.password;
   
    var finduser = "{ name: \""+username+"\"}";
    var query = User.find(finduser);
    console.log("find Query =="+finduser)
    User.findOne({'name':'asdfsdf'},function(err, user) {

    console.log("User type from DB =="+ typeof user)
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (typeof user !== undefined) {
       
        var userdetails=JSON.stringify(user);
        var parsedDetails = JSON.parse(userdetails);
        console.log("After parsing DB data =="+parsedDetails);
        var dbPass = parsedDetails.pass;
        
        
      // check if password matches
      if (userpassword != userpassword) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
       var expires = moment().add( 1,'days').valueOf();
       var token = jwt.encode({
                 iss: user.id,
                 exp: expires
              }, apps.get('superSecret'));
              
            
        //console.log(employees);
        res.json({
  token : token,
  expires: expires,
  user: parsedDetails
  
});
      
      }
        
    }
  });
    
   
    
});


router.get('/employees', function (req, res, next) {
    console.log(req.query.auth);
    var reqparams=JSON.parse(req.query.auth);
    var username = "\""+reqparams.name+"\"";
    var userpassword=reqparams.password;
   
    var finduser = "{ name: \""+username+"\"}";
    var query = User.find(finduser);
    
 User.
  find({
    'name': 'vamsikrishna123' }).
  select({ 'name': 1, 'pass': 1 }).
  exec(function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
       
        var userdetails=JSON.stringify(user);
        var parsedDetails = JSON.parse(userdetails);
        var dbPass = parsedDetails[0].pass;
        
        
      // check if password matches
      if (userpassword != userpassword) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
       var expires = moment().add( 1,'days').valueOf();
       var token = jwt.encode({
                 iss: user.id,
                 exp: expires
              }, apps.get('superSecret'));
              
             results.getEmployeeDetails(function (err, employees) {
        //console.log(employees);
        res.json({
  token : token,
  expires: expires,
  user: parsedDetails,
  employees:employees
});
      //  res.json(employees);
    });  


      }
        
    }
  });
    
 });

router.get('/deleteEmployees',jwtauth, function (req, res, next) {
    console.log("Access Token=="+req.headers['x-access-token']);

    var ids = req.query.id;
    console.log("IDS in index =" + ids);
    
    results.deleteEmployeeDetails(ids, function (err, response) {
        console.log(response);
       res.json(response);
    });
    //res.json();
});

router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    'name': 'vamsikrishna123', 
    'pass': 'test123',
    'admin': true 
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});
module.exports = router;