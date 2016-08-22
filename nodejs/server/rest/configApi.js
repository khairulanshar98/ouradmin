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
module.exports = function(app,Model,config,jwt,rest_name,id_attr) {
   var route = express.Router();
   // create a new {rest_name} (GET http://localhost:8080/{rest_name}/get)
   route.get('/api', function(req, res) {
     var token = getToken(req.headers);
     Model.find({}, function (err, results) {
       res.json(results);
     });
   });

   // create a new {rest_name} (GET http://localhost:8080/{rest_name}/get)
   route.get('/api/:attr_name/:attr_value', function(req, res) {
     var token = getToken(req.headers);
     var attr_name = req.params.attr_name;
     var attr_value = req.params.attr_value;
     var data={};
     data[attr_name]=attr_value;
     Model.findOne(data, function (err, results) {
       results.password="";
       res.json(results);
     });
   });
  // create a new {rest_name} (POST http://localhost:8080/{rest_name}/save)
  route.post('/createnew', function(req, res) {
    req.body["password"]="123456";
    var model = new Model(req.body);
    model.save(function(err) {
      if (err) {
        return res.status(400).send({success: false, msg: err.errmsg});
      }else{
        var token = jwt.encode(model, config.secret);
        res.json({success: true, model:model, msg: 'Successful created new record.',token:'JWT ' + token});
      }
    });
  });
  route.post('/deleteRecord', function(req, res) {
    Model.findOne({email:req.body.email}, function(err, record) {
      if (err) {
        return res.status(500).send({success: false, msg: err.errmsg});
      }else if (!record) {
        return res.status(500).send({success: false, msg: 'Data not found.'});
      } else {
        record.remove(function(err) {
           if (err)
             res.json({success: false, msg: err.errmsg});
           else
             res.json({success: true, msg: 'Successful Updated.'});
         });
      }
    })
  });
  route.post('/api', function(req, res) {
    var token = getToken(req.headers);
    //console.log(rest_name, id_attr);
          var data={};
          data[id_attr]=req.body[id_attr];
          //console.log(data);
          Model.findOne(data, function(err, record) {
            if (err) {
              return res.status(500).send({success: false, msg: err.errmsg});
            }else if (!record) {
              return res.status(500).send({success: false, msg: 'Data not found.'});
            } else {
              for (var key in req.body) {
                if (req.body.hasOwnProperty(key))
                   record[key]=req.body[key];
              }
              record.save(function(err) {
                 if (err)
                   res.json({success: false, msg: err.errmsg});
                 else
                   res.json({success: true, msg: 'Successful Updated.'});
               });
            }
          })
  });

  app.use(rest_name, route);
};
