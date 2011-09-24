var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When testing totalLevel of a Team')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
        .del("/Team").expect(200).next()
        .del("/TeamMember").expect(200).next()
        .post("/Team", {_id: "teamID", name: "testTeam" })
            .expect(200).next()
        .post("/TeamMember", { _id: "memberID", name: "testMember", teamId: "teamID" })
            .expect(200).next()
        .post("/TeamMember", { _id: "memberID2", name: "testMember", teamId: "teamID" })
            .expect(200).next()
        .post("/Skill", { _id: "skillID", name: "testSkill", level: 4 })
            .expect(200).next()
        .post("/Skill", { _id: "skillID1", name: "testSkill", level: 2 })
            .expect(200).next()
        .post("/Skill", { _id: "skillID2", name: "testSkill", level: 3 })
            .expect(200).next()
        .get("/Team/teamID")
            .expect(200).next()
        .get("/Team/teamID2")
            .expect(200).next()
        .put("/TeamMember/memberID2/skill", { skillId: 'skillID2' })
            .expect(200).next()
        .put("/TeamMember/memberID/skill", { skillId: 'skillID1' })
            .expect(200).next()
        .put("/TeamMember/memberID/skill", { skillId: 'skillID' })
            .expect(200).next()
        .put("/TeamMember/memberID2/skill", { skillId: 'skillID' })
            .expect(200).next()
        .get("/Team/teamID")
            .expect(200)
            .expect("avgLevel of team", function(req, res, body){
                var response = JSON.parse(body);
                var teamSkills = {};
                for(var i in response.data.skills)
                    teamSkills[response.data.skills[i].skillId] = response.data.skills[i];
                assert.equal(teamSkills.skillID1.totalLevel, 2);
                assert.equal(teamSkills.skillID2.totalLevel, 3);
                assert.equal(teamSkills.skillID.totalLevel, 8);
            }).next()
.export(module);
