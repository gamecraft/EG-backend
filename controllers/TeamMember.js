exports.registerRoutes = function(app) {
    // add skill to member
    app.put("/TeamMember/:id/skill", function(req, res, next) {
        var memberPattern = null;
        if(/^[0-9a-fA-F]{24}$/.test(req.params.id))
            memberPattern = {_id: db.toMongoID(req.params.id)};
        else
            memberPattern = {_id: req.params.id};

        var skillPattern = null;
        if(/^[0-9a-fA-F]{24}$/.test(req.body.skillId))
            skillPattern = {_id: db.toMongoID(req.body.skillId)};
        else
            skillPattern = {_id: req.body.skillId};

        db.withDocument("TeamMember")
            .findOne(memberPattern, function(err, member){
                if(member == null) {
                    res.send({success: false, msg: "member not found "+req.params.id}, 404);
                } else {
                    db.withDocument("Skill")
                        .findOne(skillPattern, function(err, skill){
                            if(typeof member.skills == "undefined")
                                member.skills = [];

                            var found = false;
                            for(var i in member.skills)
                                if(member.skills[i].skillId == req.body.skillId)
                                    found = true;
                            if(!found)
                                member.skills.push({skillId: req.body.skillId});
                            member.save(function(){
                                res.send({success: true, data: member});
                            });
                        });
                }
            });
    });
}
