var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When activating phase check for current timeLeft')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Phase").expect(200).next()
    .post("/Phase", {_id: "phaseID", duration: 1000})
        .expect(200).next()
    .put("/Phase/next/active")
        .expect(200)
        .expect("should return the next phase active", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
        }).next()
    .get("/Phase/current")
        .expect(200)
        .expect("should return current active Phase with timeLeft", function(req, res, body){
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
            assert.equal(response.data._id, "phaseID");
            assert.isNumber(response.data.timeLeft);            
        })
.export(module);
