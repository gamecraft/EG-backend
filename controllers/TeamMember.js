var teamCtrl = require("./Team");

var getObjectID = function(value){
    if(/^[0-9a-fA-F]{24}$/.test(value))
        return db.toMongoID(value);
    else
        return value;
}

exports.registerRoutes = function(app) {
    
    // add/update skill to member
    app.put("/TeamMember/:id/skill", function(req, res, next) {
        var memberPattern = {_id: getObjectID(req.params.id)};
        var skillPattern = {_id: getObjectID(req.body.skillId)};

        req.db.withDocument("TeamMember")
            .findOne(memberPattern, function(err, member){
                if(member == null) {
                    res.send({success: false, msg: "member not found "+req.params.id}, 404);
                    console.log("member not found "+req.params.id);
                } else {
                    req.db.withDocument("Skill")
                        .findOne(skillPattern, function(err, skill){
                            if(skill == null) {
                                res.send({success: false, msg: "skill not found "+req.body.skillId}, 404);
                                return;
                            }
                            if(typeof member.skills == "undefined")
                                member.skills = [];

                            var found = -1;
                            for(var i in member.skills)
                                if(member.skills[i].skillId == req.body.skillId)
                                    found = i;

                            var level = null;
                            if(req.body.level)
                                level = req.body.level;
                            else
                                level = skill.level;

                            if(level == null || level == undefined) {
                                res.send({success: false, msg: "skill does not have level "+req.body.skillId}, 400);
                                return;
                            }

                            if(found == -1)
                                member.skills.push({skillId: req.body.skillId, level: level});
                            else
                                member.skills[found].level = level;
                            
                            member.save(function(){
                                if(member.teamId != null)
                                    teamCtrl.setSkill(req, member.teamId, skill, function(){
                                        res.send({success: true, data: member});
                                    });
                                else {
                                    res.send({success: true, data: member});
                                }
                            });
                        });
                }
            });
    });

    // add/update skill to member
    app.put("/TeamMember/:id/achievement", function(req, res, next) {
       var memberPattern = {_id: getObjectID(req.params.id)};
       var achievementPattern = {_id: getObjectID(req.body.achievementId)};

        req.db.withDocument("TeamMember")
            .findOne(memberPattern, function(err, member){
                if(member == null) {
                    res.send({success: false, msg: "member not found "+req.params.id}, 404);
                    console.log("member not found "+req.params.id);
                } else {
                    req.db.withDocument("Achievement")
                        .findOne(achievementPattern, function(err, achievement){
                            if(achievement == null) {
                                res.send({success: false, msg: "achievement not found "+req.body.achievementId}, 404);
                                return;
                            }
                            if(typeof member.achievements == "undefined")
                                member.achievements = [];

                            for(var i in member.achievements)
                                if(member.achievements[i].achievementId == req.body.achievementId) {
                                    res.send({success: false, msg: "achievement already added "+req.body.achievementId}, 400);
                                    return;
                                }

                            member.achievements.push({ achievementId: achievement._id.toString() });
                            
                            member.save(function(){
                                if(member.teamId != null)
                                    teamCtrl.setAchievement(req, member.teamId, achievement, function(){
                                        res.send({success: true, data: member});
                                    });
                                else {
                                    res.send({success: true, data: member});
                                }
                            });
                        });
                }
            });
    });
}
