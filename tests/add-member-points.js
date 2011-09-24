var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding points to member')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .del("/TeamMember").expect(200).next()
    .post("/TeamMember", {_id: "memberID", teamId: "teamID", points: 0})
        .expect(200).next()
    .post("/TeamMember", {_id: "memberID2", teamId: "teamID", points: 0})
        .expect(200).next()
    .post("/Team", {_id: "teamID", members: [ { memberId: "memberID" }, { memberId: "memberID2" } ], totalPoints: 0})
        .expect(200).next()
    .get("/Team/teamID")
        .expect(200).next()
    .put("/TeamMember/memberID/points", { points: 100 })
        .expect(200)
        .expect('should respond with points added to the member', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.points, 100);
        }).next()
    .put("/TeamMember/memberID2/points", { points: 100 })
        .expect(200)
        .expect('should respond with points added to the member', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.points, 100);
        }).next()
    .get("/Team/teamID")
        .expect(200)
        .expect("should response with points added to team also", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.totalPoints, 200);
        }).next()
.export(module);
