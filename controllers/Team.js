var mongo = require("../libs/mongoExpressConnect");
var getObjectID = function(db, value){
    if(/^[0-9a-fA-F]{24}$/.test(value))
        return db.toMongoID(value);
    else
        return value;
}

var fact = function(value) {
    var sum = 0;
    for(var i = 0; i<=value; i++)
        sum += i;
    return sum;
}

exports.updateTotalLevel = function(req, team, skill, next) {
    req.db.withCollection("TeamMember")
        .find({teamId: team._id.toString() }, function(err, members) {

            var totalLevel = 0;
            for(var i in members)
                for(var levelIndex in members[i].skills) {
                    if(members[i].skills[levelIndex].skillId == skill._id.toString())
                        totalLevel += fact(members[i].skills[levelIndex].level);
                }
            team.totalLevel = 0;
            for(var i in team.skills) {
                if(team.skills[i].skillId == skill._id.toString())
                    team.skills[i].totalLevel = totalLevel;
                team.totalLevel += team.skills[i].totalLevel;
            }
            team.save(next);
            if(typeof everyone.now.handleEvent != "undefined")
            everyone.now.handleEvent("team.totalLevel.changed", { _id: team._id.toString(), totalLevel: team.totalLevel });
        });
};

exports.setSkill = function(req, teamId, skill, next) {
    req.db.withDocument("Team")
        .findOne({_id: getObjectID(req.db, teamId)}, function(err, team) {
            if(typeof team.skills == "undefined")
                team.skills = [];
            var found = -1;
            for(var i in team.skills) {
                if(team.skills[i].skillId == skill._id.toString())
                    found = i;
            }
            
            if(found == -1) {
                var teamSkill = {skillId: skill._id.toString(), totalLevel: fact(parseInt(skill.level))};
                team.skills.push(teamSkill);
                team.totalLevel += teamSkill.totalLevel;
                team.save(next);
                if(typeof everyone.now.handleEvent != "undefined")
                everyone.now.handleEvent("team.totalLevel.changed", { _id: team._id.toString(), totalLevel: team.totalLevel });
            }
            else
                exports.updateTotalLevel(req, team, skill, next)
        });
};

exports.setAchievement = function(req, teamId, achievement, next) {
    req.db.withDocument("Team")
        .findOne({_id: getObjectID(req.db, teamId)}, function(err, team) {
            if(typeof team.achievements == "undefined")
                team.achievements = [];
            var found = -1;
            for(var i in team.achievements) {
                if(team.achievements[i].achievementId == achievement._id.toString())
                    found = i;
            }
            
            if(found == -1) {
                team.achievements.push({achievementId: achievement._id.toString()});
                team.totalPoints += parseInt(achievement.teamPointsReward);
                team.save(next);
                if(typeof everyone.now.handleEvent != "undefined")
                everyone.now.handleEvent("team.totalPoints.changed", { _id: team._id.toString(), totalPoints: team.totalPoints });
            } else
                next();
        });
};

exports.addPoints = function(req, teamId, value, next) {
    req.db.withDocument("Team")
        .findOne({_id: getObjectID(req.db, teamId)}, function(err, team) {
            team.totalPoints += parseInt(value);
            team.save(next);
            if(typeof everyone.now.handleEvent != "undefined")
            everyone.now.handleEvent("team.totalPoints.changed", { _id: team._id.toString(), totalPoints: team.totalPoints });
        });
}

exports.recordFinishedPhase = function(req, team, phase, juryPoints, next) {
    team.totalPoints += parseInt(juryPoints);
    team.finishedPhases.push({ 
        phaseId: phase._id.toString(), 
        totalPoints: team.totalPoints, 
        juryPoints: juryPoints, 
        name: phase.name
    });
    team.save(next);
    if(typeof everyone.now.handleEvent != "undefined")
    everyone.now.handleEvent("team.totalPoints.changed", { _id: team._id.toString(), totalPoints: team.totalPoints });
}


exports.resetAllFinishedPhases = function(req, next) {
    var opt = { multi: true, safe: true };
    var teamUpdate = {$set: { finishedPhases: [], totalPoints: 0, totalLevel: 0, skills: [], achievements: [] }};
    var memberUpdate = {$set: { points: 0, skills: [], achievements: [] }};
    req.db.withCollection("Team")
        .update({}, teamUpdate, opt, function(err, docs){
            req.db.withCollection("TeamMember")
                .update({}, memberUpdate, opt, function(err, docs) {
                    next(err, docs);
                });
        });
}

exports.registerRoutes = function(app) {
    
    // add member to team
    app.put("/Team/:id/member",  function(req, res, next) {
        var teamPattern = {_id: getObjectID(req.db, req.params.id)};        
        var memberPattern = {_id: getObjectID(req.db, req.body.memberId)};

        req.db.withDocument("Team")
            .findOne(teamPattern, function(err, team){
                if(team == null) {
                    res.send({success: false, msg: "team not found "+req.params.id}, 404);
                } else {
                    req.db.withDocument("TeamMember")
                        .findOne(memberPattern, function(err, member){
                            if(member == null) {
                                res.send({success: false, msg: "member not found "+req.body.memberId}, 404);
                                return;
                            }

                            member.teamId = req.params.id;
                            member.save(function(){
                                res.send({success: true, data: { team: team, member: member }});
                            });
                        });
                }
            });
    });

    // add achievement to team
    app.put("/Team/:id/achievement", function(req, res, next) {
        var teamPattern = {_id: getObjectID(req.db, req.params.id)};        
        var achievementPattern = {_id: getObjectID(req.db, req.body.achievementId)};

        req.db.withDocument("Team")
            .findOne(teamPattern, function(err, team){
                if(team == null) {
                    res.send({success: false, msg: "team not found "+req.params.id}, 404);
                } else {
                    req.db.withDocument("Achievement")
                        .findOne(achievementPattern, function(err, achievement){
                            if(achievement == null) {
                                res.send({success: false, msg: "achievement not found "+req.body.achievementId}, 404);
                                return;
                            }
                            if(typeof team.achievements == "undefined")
                                team.achievements = [];

                            for(var i in team.achievements)
                                if(team.achievements[i].achievementId == req.body.achievementId) {
                                    res.send({success: false, msg: "achievement already added to this team"}, 400);
                                    return;
                                }

                            team.achievements.push({achievementId: req.body.achievementId});
                            team.totalPoints += parseInt(achievement.teamPointsReward);

                            team.save(function(){
                                res.send({success: true, data: team });
                                if(typeof everyone.now.handleEvent != "undefined")
                                everyone.now.handleEvent("team.totalPoints.changed", 
                                            { _id: team._id.toString(), totalPoints: team.totalPoints });
                            });
                        });
                }
            });
    });

    app.put("/Team/:id/points", function(req, res, next) {
        var teamPattern = {_id: getObjectID(req.db, req.params.id)};  
        req.db.withDocument("Team")
            .findOne(teamPattern, function(err, team){
                if(team == null) {
                    res.send({success: false, msg: "team not found "+req.params.id}, 404);
                } else {
                    team.totalPoints += parseInt(req.body.points);
                    team.save(function(){
                        res.send({success: true, data: team});
                        if(typeof everyone.now.handleEvent != "undefined")
                        everyone.now.handleEvent("team.totalPoints.changed", { _id: team._id.toString(), totalPoints: team.totalPoints });
                    });
                }
            });
    });
}
