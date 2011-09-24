var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When creating new team')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Team").expect(200).next()
    .post("/Team", {_id: "teamID"})
        .expect(200)
        .expect("team should have default values", function(req, res, body){
            var response = JSON.parse(body);

            assert.equal(response.data.totalPoints, 0);
            assert.isArray(response.data.members);
            assert.equal(response.data.members.length, 0);
            assert.isArray(response.data.skills);
            assert.equal(response.data.skills.length, 0);
            assert.isArray(response.data.achievements);
            assert.equal(response.data.achievements.length, 0);
        }).next()
.export(module);
