exports.registerRoutes = function(app) {
    // add member to team
    app.put("/Team/:id/member", function(req, res, next) {
        var teamPattern = null;
        if(/^[0-9a-fA-F]{24}$/.test(req.params.id))
            teamPattern = {_id: db.toMongoID(req.params.id)};
        else
            teamPattern = {_id: req.params.id};

        var memberPattern = null;
        if(/^[0-9a-fA-F]{24}$/.test(req.body.memberId))
            memberPattern = {_id: db.toMongoID(req.body.memberId)};
        else
            memberPattern = {_id: req.body.memberId};

        db.withDocument("Team")
            .findOne(teamPattern, function(err, team){
                if(team == null) {
                    res.send({success: false, msg: "team not found "+req.params.id}, 404);
                } else {
                    db.withDocument("TeamMember")
                        .findOne(memberPattern, function(err, member){
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
                                else
                                    res.send({success: true, data: { team: team, member: member }});
                            });
                        });
                }
            });
    });
}
