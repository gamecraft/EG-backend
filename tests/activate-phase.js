var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When activating phase')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Phase").expect(200).next()
    .post("/Phase", {_id: "phaseID"})
        .expect(200).next()
    .put("/Phase/phaseID/active")
        .expect(200)
        .expect("should return the phase active", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
        }).next()
    .put("/Phase/phaseID/active")
        .expect(400)
.export(module);
