
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
});

app.configure('development', function(){
  app.set("dbname", "EDE-dev");
  app.set("dbconnection", {host: "localhost", port: 27017});

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set("dbname", "EDE-prod");
  app.set("dbconnection", {host: "localhost", port: 27017});

  app.use(express.errorHandler()); 
});

// Routes
var mongoCRUD = require("./libs/mongoCRUD");
mongoCRUD(app, "Skill");
mongoCRUD(app, "Team");
mongoCRUD(app, "TeamMember");
mongoCRUD(app, "Page");
mongoCRUD(app, "Phase");
mongoCRUD(app, "Achievment");

console.log("using database "+app.set("dbname"));

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var nowjs = require("now");
var everyone = nowjs.initialize(app);
