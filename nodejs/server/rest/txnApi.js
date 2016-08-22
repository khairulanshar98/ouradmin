var express   = require('express');
var uuid      = require('node-uuid');
var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
module.exports = function(app,User,config,jwt) {
  var route = express.Router();
  route.post('/register', function(req, res) {
    var newUser = new User({
      email: req.body.email,
      password: req.body.passwd
    });
    newUser.save(function(err) {
      if (err) {
        return res.status(400).send({success: false, msg: "This email: "+data["email"]+" has been used by other user."});
      }else{
        var token = jwt.encode(newUser, config.secret);
        res.json({success: true, msg: 'Successful created new record.',token:'JWT ' + token});
      }
    });
  });
  route.post('/authenticate', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) {
        console.log(err)
        return res.status(500).send({success: false, msg: err.msg});
      }
      if (!user) {
        return res.status(402).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.passwd, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            return res.status(402).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });
  // create a new (GET http://localhost:8080/txn/get)
  route.get('/api', function(req, res) {
    var token = getToken(req.headers);
  });

  app.use('/user', route);
};
