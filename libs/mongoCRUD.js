var listCommand = require("mongodb-rest2/commands/list");
var createCommand = require("mongodb-rest2/commands/create");
var updateCommand = require("mongodb-rest2/commands/update");
var deleteCommand = require("mongodb-rest2/commands/delete");

var augment = function(command) {
    if(command == "create")
        return function(data, next) {
            data.createdAt = new Date();
            data.updatedAt = new Date();
            next();
        };
    if(command == "update")
        return function(data, next) {
            data.updatedAt = new Date();
            next();
        }
};

module.exports = function(app, name) {

    var renderResponse = function(res, err, data, allCount) {
	  	res.header('Content-Type', 'application/json');
	  	if(err == null) {
		  	if(typeof allCount == "undefined")
			  	res.send({data: data, success: true});
		  	else
			  	res.send({allCount: allCount, data: data, success: true});
	  	} else {
  			sys.log(sys.inspect(err));
  			res.send({success: false, error:err.message});
	  	}
	};

    app.get("/"+name+"/:id?", function(req,res,next) {
        // JSON decode query or spec
		var spec = req.query.spec? JSON.parse(req.query.spec) : {};
        // JSON decode options
	    var options = req.query.options?JSON.parse(req.query.options) : {};
            options.countQueryHits = true;
            options.dereference = true;

        if(req.params.id)
            spec._id = req.params.id;
        if(req.query.limit)
            options.limit = parseInt(req.query.limit);
        if(req.query.skip)
            options.skip = parseInt(req.query.skip);

        listCommand(
            {
                connection: app.set("dbconnection"),
                db: app.set("dbname"),
                collection: name
            },
            spec,
            options,
            function(err, docs, allCount) {
                renderResponse(res, err, docs, allCount);
            });
    });

    app.post("/"+name, function(req,res,next) {
        var options = {};
        options.augment = augment("create");

        createCommand( 
            {
                connection: app.set("dbconnection"),
                db: app.set("dbname"),
                collection: name
            },
            req.body,
            options,
            function(err, docs) {
                if(err != null)
	                app.renderResponse(res, err, docs);
                else
	                if(Array.isArray(req.body))
		                renderResponse(res, err, docs);
	                else
		                renderResponse(res, err, docs[0]);
            });
    });

    app.del("/"+name+"/:id?", function(req, res, next) {
        // JSON decode query or spec
		var spec = req.query.spec? JSON.parse(req.query.spec) : {};
        var options = req.query.options? JSON.parse(req.query.options) : {};

        if(req.params.id)
            spec._id = req.params.id;
        if(req.query.limit)
            options.limit = parseInt(req.query.limit);
        if(req.query.skip)
            options.skip = parseInt(req.query.skip);

        deleteCommand(
            {
                connection: app.set("dbconnection"),
                db: app.set("dbname"),
                collection: name
            },
            spec,
            options,
            function(err, docs) {
                renderResponse(res, err, docs);
            });
    });

    app.put("/"+name+"/:id?", function(req, res, next) {
         // JSON decode query or spec
		var spec = req.query.spec? JSON.parse(req.query.spec) : {};
        var options = req.query.options? JSON.parse(req.query.options) : {};

        if(req.params.id)
            spec._id = req.params.id;

        // check does the body contains $inc, & etc... specific mongodb update ops 
        // determines to use $set: {...} or not 
        if(JSON.stringify(req.body).indexOf("$") != -1) // TODO ugly way to check the entire body for $ char, improve
            options.set = false;
        else
            options.set = true;

        if(req.query.limit)
            options.limit = parseInt(req.query.limit);
        if(req.query.skip)
            options.skip = parseInt(req.query.skip);
    
        if(options.set)
            options.augment = augment("update");

		updateCommand(
            {
                connection: app.set("dbconnection"),
                db: app.set("dbname"), 
                collection: name
            },
            spec,
            req.body,
            options,
            function(err, docs) {
                if(err != null)
					renderResponse(res, err);
				else
					renderResponse(res, err, docs);
            });
    });
};

// expose augment function for other modules
module.exports.augment = augment;
