var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding points to team')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .post("/Team", {_id: "teamID", members: [], achievements: [], totalPoints: 0})
        .expect(200).next()
    .get("/Team/teamID")
        .expect(200).next()
    .put("/Team/teamID/points", { points: 100 })
        .expect(200)
        .expect('should respond with points added to the team', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.totalPoints, 100);
        }).next()
.export(module);
