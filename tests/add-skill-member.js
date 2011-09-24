var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding skill to member')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .del("/TeamMember").expect(200).next()
    .post("/TeamMember", { _id: "memberID", name: "testMember", skills: [] })
        .expect(200).next()
    .post("/Skill", { _id: "skillID", name: "testSkill", level: 4 })
        .expect(200).next()
    .put("/TeamMember/memberID/skill", { skillId: 'skillID' })
        .expect(200)
        .expect('should respond with proper response', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.skills[0].skillId, "skillID");
        }).next()
.export(module);
