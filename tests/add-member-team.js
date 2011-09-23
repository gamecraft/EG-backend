var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding member to team')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .post("/Team", { _id: "teamID", name: "testTeam", members: [] })
        .expect(200)
    .next()
    .post("/TeamMember", { _id: "memberID", name: "testMember" })
        .expect(200)
    .next()
    .put("/Team/teamID/member", { memberId: 'memberID' })
        .expect(200)
        .expect('should respond with proper response', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.member.teamId, "teamID");
            assert.equal(response.data.team.members[0].memberId, "memberID");
        })
.export(module);
