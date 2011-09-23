
/**
 * Module dependencies.
 */

var express = require('express');
var mongodm = require("mongodm");

// global variable
db = null;

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

app.configure('test', function(){
  app.set("dbname", "EDE-test");
  app.set("dbconnection", {host: "localhost", port: 27017});

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
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

var boot = function(dbFacade){
    db = dbFacade;

    db.defineDocument(require("./models/Team"));
    db.defineDocument(require("./models/TeamMember"));
    db.defineDocument(require("./models/Skill"));

    console.log("Connected to MongoDB "+app.set("dbname"));

    // Routes
    require("./controllers/TeamMember").registerRoutes(app);
    require("./controllers/Team").registerRoutes(app);
    var mongoCRUD = require("./libs/mongoCRUD");
    mongoCRUD(app, "Skill");
    mongoCRUD(app, "Team");
    mongoCRUD(app, "TeamMember");
    mongoCRUD(app, "Page");
    mongoCRUD(app, "Phase");
    mongoCRUD(app, "Achievement");

    app.listen(3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

    var nowjs = require("now");
    var everyone = nowjs.initialize(app);
}

mongodm.withDatabase(app.set("dbname"), function(err, dbFacade){
    if(err) {
        console.log(err);
        return;
    }
    if(app.set("dbname") == "EDE-test") {
        dbFacade.drop(function(){
            console.log("Cleaned "+app.set('dbname'));
            setTimeout(function(){ 
                mongodm.withDatabase(app.set("dbname"), function(err, dbFacadeCleaned) {
                    boot(dbFacadeCleaned);
                });
            }, 1000);
        });
    } else
        boot(dbFacade);
});
