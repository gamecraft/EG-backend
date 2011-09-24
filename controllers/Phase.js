var teamCtrl = require("./Team");

var getObjectID = function(db, value){
    if(/^[0-9a-fA-F]{24}$/.test(value))
        return db.toMongoID(value);
    else
        return value;
}

exports.registerRoutes = function(app) {

    app.put("/Phase/:id/active", function(req, res, next) {
        req.db.withDocument("Phase")
            .find({active: true}, function(err, docs) {
                if(docs.length != 0) {
                    res.send({success: false, msg: "finish the current phase please"}, 400);
                    return;
                }

                req.db.withDocument("Phase")
                    .findOne({_id: getObjectID(req.db, req.params.id)}, function(err, phase){
                        if(phase == null) {
                            res.send({success: false, msg: "phase "+req.params.id+" not found"}, 404);
                            return;
                        }

                        phase.active = true;
                        phase.save(function(){
                            res.send({success: true, data: phase});
                        });
                    });
            });
    });

    app.put("/Phase/:id/finished", function(req, res, next) {
        req.db.withDocument("Phase")
            .find({active: true}, function(err, docs) {
                if(docs.length != 1) {
                    res.send({success: false, msg: "there are "+docs.length+" phases active. Can not continue."}, 400);
                    return;
                }

                req.db.withDocument("Phase")
                    .findOne({_id: getObjectID(req.db, req.params.id)}, function(err, phase){
                        if(phase == null) {
                            res.send({success: false, msg: "phase "+req.params.id+" not found"}, 404);
                            return;
                        }
                        if(!req.body.length || Array.isArray(req.body) == false) {
                            res.send({success: false, msg: "body must be Array"}, 400);
                            return;
                        }
                
                        phase.active = false;
                        phase.save(function(){
                            var allCount = req.body.length;
                            var handleRecord = function() {
                                allCount -= 1;
                                if(allCount == 0)
                                    res.send({success: true, data: phase});
                            };
                            req.db.withDocument("Team")
                                .find({}, function(err, teams) {
                                    for(var i in teams) {
                                        var juryPoints = 0;
                                        for(var inputTeamIndex in req.body)
                                            if(req.body[inputTeamIndex].teamId == teams[i]._id.toString()) {
                                                juryPoints = req.body[inputTeamIndex].juryPoints;
                                                break;
                                            }

                                        teamCtrl.recordFinishedPhase(req, teams[i], phase, juryPoints, handleRecord);
                                    }
                                });
                        });
                    });
            });
    });
}
