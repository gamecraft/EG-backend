var mongodm = require("mongodm");

exports.createDefaults = function(name) {
    var model = require("../models/"+name).instance.fields;
    return function(data, next) {
        for(var i in model)
            if(typeof data[i] == "undefined")
                data[i] = model[i];
        next();
    }
}

exports.connect = function(app, documentPaths){
    var db = null;
    mongodm.withDatabase(app.set("dbname"), function(err, dbFacade){
        if(err) {
            console.log(err);
            return;
        }
        var t = dbFacade.synch(true);
        for(var i in documentPaths)
            t.defineDocument(require("../"+documentPaths[i]));
        t.end(function(){
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
            console.log("Dropped "+app.set('dbname'));
        });
    });
}
