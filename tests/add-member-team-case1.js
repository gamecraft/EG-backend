var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding 3 members to team')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .del("/TeamMember").expect(200).next()
    .post("/Team", { _id: "teamID", name: "testTeam", members: [] })
        .expect(200).next()
    .post("/TeamMember", { _id: "memberID", name: "testMember" })
        .expect(200).next()
    .post("/TeamMember", { _id: "memberID1", name: "testMember" })
        .expect(200).next()
    .post("/TeamMember", { _id: "memberID2", name: "testMember" })
        .expect(200).next()
    .put("/Team/teamID/member", { memberId: 'memberID' })
        .expect(200).next()
    .put("/Team/teamID/member", { memberId: 'memberID1' })
        .expect(200).next()
    .put("/Team/teamID/member", { memberId: 'memberID2' })
        .expect(200).next()
    .get("/Team/teamID")
        .expect(200)
        .expect("should return team with 3 members", function(req, res, body) {
            var response = JSON.parse(body);
            assert.isArray(response.data.members);
            assert.equal(response.data.members[0].memberId, "memberID");
            assert.equal(response.data.members[1].memberId, "memberID1");
            assert.equal(response.data.members[2].memberId, "memberID2");
        })
.export(module);
