var express     = require('express');
var path        = require('path');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var favicon     = require('serve-favicon');
var mongoose    = require('mongoose');
var User        = require('./server/models/user');
var port 	      = process.env.PORT || 5000;
var passport	  = require('passport');
var jwt 			  = require('jwt-simple');
var localdb     = require('./server/config/localdb');
var compressor  = require('node-minify');
var less        = require('less');


var loadjs=function(){
    new compressor.minify({
      type: 'gcc',
      fileIn: ['bower_components/ngprogress/build/ngprogress.js','client/js/app.js',  'client/js/service.js','client/js/ctrlmodule.js', 'client/js/rootcontroller.js'],
      fileOut: 'client/js/base.min.js',
      callback: function(err, min){
        console.log(err);
        //console.log(min);
      }
    });
};
loadjs();

// gzip/deflate outgoing responses
var compression = require('compression');
//var bytes = require('bytes');
app.use(compression({threshold:'200B'}));

//configure app
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"client/views"));

// log to console
app.use(morgan('dev'));

// favicon
app.use(favicon(path.join(__dirname,'client/images/favicon.ico')));

// get our request parameters
app.use(express.static(path.join(__dirname,'bower_components/bootstrap/dist')));
app.use(express.static(path.join(__dirname,'bower_components/jquery/dist')));
app.use(express.static(path.join(__dirname,'bower_components/angular')));
app.use(express.static(path.join(__dirname,'bower_components/angular-route')));
app.use(express.static(path.join(__dirname,'bower_components/angular-resource')));
app.use(express.static(path.join(__dirname,'bower_components/components-font-awesome')));
app.use(express.static(path.join(__dirname,'bower_components/ngprogress')));
app.use(express.static(path.join(__dirname,'client')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Use the passport package in our application
app.use(passport.initialize());

//set default page
app.get('/', function(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=31557600');
  //loadjs();
  res.render('pages/angular0');
});

// connect to database
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://admin:M17082016c@ds023465.mlab.com:23465/heroku_xwbj9c68';
//uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || localdb.database;
mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });
// pass passport for configuration
//require('./config/passport')(passport);

// RESTApi
require('./server/rest/configApi')(app,User,localdb,jwt,'/user','email');
require('./server/rest/txnApi')(app,User,localdb,jwt);

// Start the server
app.listen(port);
console.log('Our Admin is running on :' + port);
