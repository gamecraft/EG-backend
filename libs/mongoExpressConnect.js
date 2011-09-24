var mongodm = require("mongodm");

exports.connect = function(app){
    var db = null;
    mongodm.withDatabase(app.set("dbname"), function(err, dbFacade){
        if(err) {
            console.log(err);
            return;
        }
        dbFacade.synch(true).
            defineDocument(require("../models/Team")).
            defineDocument(require("../models/TeamMember")).
            defineDocument(require("../models/Skill")).
            end(function(){
                console.log("Connected to MongoDB "+app.set("dbname"));
                db = dbFacade;
            });
    });
    return function(req, res, next) {
        req.db = db;
        next();
    }
};

exports.close = function(req,res,next) {
    req.db.close();
    if(next)
        next();
    console.log("closed connection to MongoDB");
}

exports.drop = function(app){
    mongodm.withDatabase(app.set("dbname"), function(err, dbFacade){
        if(err) {
            console.log(err);
            return;
        }
        dbFacade.drop(function(){
            console.log("Cleaned "+app.set('dbname'));
        });
    });
}
