var teamCtrl = require("./Team");

var getObjectID = function(db, value){
    if(/^[0-9a-fA-F]{24}$/.test(value))
        return db.toMongoID(value);
    else
        return value;
}

exports.registerRoutes = function(app) {

    app.get("/Phase/current", function(req, res, next) {
        req.db.withDocument("Phase")
            .findOne({active: true}, function(err, phase) {
                if(phase == null) {
                    res.send({success: false, msg: "could not find active phase"}, 404);
                    return;
                }
                var phaseData = phase.toJSON();
                phaseData.timeLeft = (new Date()).getTime()-phase.activatedAt.getTime()-phase.duration;
                if(phaseData.timeLeft < 0)
                    phaseData.timeLeft = 0;
                res.send({success: true, data: phaseData});
            });
    });

    app.put("/Phase/:id/active", function(req, res, next) {
        req.db.withDocument("Phase")
            .find({active: true}, function(err, docs) {
                if(docs.length != 0) {
                    res.send({success: false, msg: "finish the current phase please"}, 400);
                    return;
                }
                var phasePattern = {_id: getObjectID(req.db, req.params.id)};
                if(req.params.id == "next")
                    phasePattern = {finished: false};

                req.db.withDocument("Phase")
                    .findOne(phasePattern, function(err, phase){
                        if(phase == null) {
                            res.send({success: false, msg: "phase "+req.params.id+" not found"}, 404);
                            return;
                        }

                        phase.active = true;
                        phase.activatedAt = new Date();
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
                
                var phasePattern = {_id: getObjectID(req.db, req.params.id)};
                if(req.params.id == "current")
                    phasePattern = {active: true};
                    
                req.db.withDocument("Phase")
                    .findOne(phasePattern, function(err, phase){
                        if(phase == null) {
                            res.send({success: false, msg: "phase "+req.params.id+" not found"}, 404);
                            return;
                        }
                        if(!req.body.length || Array.isArray(req.body) == false) {
                            res.send({success: false, msg: "body must be Array"}, 400);
                            return;
                        }
                
                        phase.active = false;
                        phase.finished = true;
                        phase.save(function(){
                            req.db.withDocument("Team")
                                .find({}, function(err, teams) {
                                    var allCount = teams.length;
                                    var handleRecord = function() {
                                        allCount -= 1;
                                        if(allCount == 0)
                                            res.send({success: true, data: teams});
                                    };
                                    
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
