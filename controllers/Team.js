var getObjectID = function(db, value){
    if(/^[0-9a-fA-F]{24}$/.test(value))
        return db.toMongoID(value);
    else
        return value;
}

exports.updateTotalLevel = function(req, team, skill, next) {
    req.db.withCollection("TeamMember")
        .find({teamId: getObjectID(req.db, team._id), }, function(err, members) {

            var totalLevel = 0;
            for(var i in members)
                for(var levelIndex in members[i].skills)
                    if(members[i].skills[levelIndex].skillId == skill._id.toString()) {
                        totalLevel += members[i].skills[levelIndex].level;
                    }
            for(var i in team.skills)
                if(team.skills[i].skillId == skill._id.toString())
                    team.skills[i].totalLevel = totalLevel;

            team.save(next);
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
                team.skills.push({skillId: skill._id.toString(), totalLevel: skill.level});
                team.save(next);
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
                team.save(next);
            } else
                next();
        });
};

exports.addPoints = function(req, teamId, value, next) {
    req.db.withDocument("Team")
        .findOne({_id: getObjectID(req.db, teamId)}, function(err, team) {
            team.totalPoints += value;
            team.save(next);
        });
}

exports.registerRoutes = function(app) {
    
    // add member to team
    app.put("/Team/:id/member", function(req, res, next) {
        var teamPattern = {_id: getObjectID(req.db, req.params.id)};        
        var memberPattern = {_id: getObjectID(req.db, req.body.memberId)};

        req.db.withDocument("Team")
            .findOne(teamPattern, function(err, team){
                if(team == null) {
                    res.send({success: false, msg: "team not found "+req.params.id}, 404);
                } else {
                    req.db.withDocument("TeamMember")
                        .findOne(memberPattern, function(err, member){
                            if(typeof team.members == "undefined")
                                team.members = [];

                            var found = false;
                            for(var i in team.members)
                                if(team.members[i].memberId == req.body.memberId)
                                    found = true;
                            if(!found)
                                team.members.push({memberId: req.body.memberId});
                            member.teamId = req.params.id;
                            member.save(function(){
                                if(!found)
                                    team.save(function(){
                                        res.send({success: true, data: { team: team, member: member }});
                                    });
                                else {
                                    res.send({success: true, data: { team: team, member: member }});
                                }
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

                            team.save(function(){
                                res.send({success: true, data: team });
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
                    team.totalPoints += req.body.points;
                    team.save(function(){
                        res.send({success: true, data: team});
                    });
                }
            });
    });
}
