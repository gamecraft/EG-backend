var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When adding achievement to member')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .del("/Achievement").expect(200).next()
    .post("/Team", {_id: "teamID", members: [], achievements: []})
        .expect(200).next()
    .post("/Achievement", { _id: "achievementID", name: "testAchievement" })
        .expect(200).next()
    .get("/Achievement/achievementID")
        .expect(200).next()
    .put("/Team/teamID/achievement", { achievementId: 'achievementID' })
        .expect(200)
        .expect('should respond with achievement added to the team', function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.achievements[0].achievementId, "achievementID");
        }).next()
.export(module);
