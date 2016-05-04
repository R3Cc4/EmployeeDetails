var User = require('./user');
var jwt = require('jwt-simple');
var config = require('./config');

module.exports = function(req, res, next) {
  // code goes here
  console.log("Code in JW Token...");
  var token = req.headers['x-access-token'];
  console.log("Token in jwtoken"+token);
  if (token) {
  try {
    var decoded = jwt.decode(token, config.secret);

    // handle token here
    if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
        }
        User.findOne({ _id: decoded.iss }, function(err, user) {
         console.log("Tjhis is in JW TOKEN and user is =="+user);
  req.user = user;
  return next();
});

  } catch (err) {
    return next();
  }
} else {
  next();
}
};