var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When reseting all phases')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .del("/Phase").expect(200).next()
    .del("/Team").expect(200).next()
    .post("/Team", {_id: "teamID", name: "testTeam"})
        .expect(200).next()
    .post("/Team", {_id: "teamID2", name: "testTeam2" })
        .expect(200).next()
    .post("/Team", {_id: "teamID3", name: "testTeam3" })
        .expect(200).next()
    .post("/Phase", {_id: "phaseID"})
        .expect(200).next()
    .post("/Phase", {_id: "phaseID2"})
        .expect(200).next()
    .post("/Phase", {_id: "phaseID3"})
        .expect(200).next()
    .put("/Phase/next/active?c=3")
        .expect(200)
        .expect("should return the phase active", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
            assert.equal(response.data._id, "phaseID");
        }).next()
    .put("/Phase/current/finished?c=3", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
        .expect(200)
        .expect("should return the phase as finished", function(req, res, body){
            var response = JSON.parse(body);
            assert.equal(response.data.length, 3);
            assert.equal(response.data[0].finishedPhases[0].juryPoints, 1);
            assert.equal(response.data[1].finishedPhases[0].juryPoints, 1);
            assert.equal(response.data[2].finishedPhases[0].juryPoints, 0);
            assert.equal(response.data[0].totalPoints, 1);
            assert.equal(response.data[1].totalPoints, 1);
            assert.equal(response.data[2].totalPoints, 0);
        }).next()
    .put("/Phase/next/active?c=2")
        .expect(200)
        .expect("should return the phase active", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
            assert.equal(response.data._id, "phaseID2");
        }).next()
    .put("/Phase/current/finished?c=2", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
        .expect(200)
        .expect("should return the phase as finished", function(req, res, body){
            var response = JSON.parse(body);
            assert.equal(response.data.length, 3);
            assert.equal(response.data[0].finishedPhases[1].juryPoints, 1);
            assert.equal(response.data[1].finishedPhases[1].juryPoints, 1);
            assert.equal(response.data[2].finishedPhases[1].juryPoints, 0);
            assert.equal(response.data[0].totalPoints, 2);
            assert.equal(response.data[1].totalPoints, 2);
            assert.equal(response.data[2].totalPoints, 0);
        }).next()
    .put("/Phase/next/active?c=1")
        .expect(200)
        .expect("should return the phase active", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.active, true);
            assert.equal(response.data._id, "phaseID3");
        }).next()
    .put("/Phase/current/finished?c=1", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
        .expect(200)
        .expect("should return the phase as finished", function(req, res, body){
            var response = JSON.parse(body);
            assert.equal(response.data.length, 3);
            assert.equal(response.data[0].finishedPhases[2].juryPoints, 1);
            assert.equal(response.data[1].finishedPhases[2].juryPoints, 1);
            assert.equal(response.data[2].finishedPhases[2].juryPoints, 0);
            assert.equal(response.data[0].totalPoints, 3);
            assert.equal(response.data[1].totalPoints, 3);
            assert.equal(response.data[2].totalPoints, 0);
        }).next()
    .put("/Phase/resetAll")
        .expect(200).next()
    .get("/Team")
        .expect(200)
        .expect("teams should not have finishedPhases", function(req, res, body) {
            var response = JSON.parse(body);
            assert.equal(response.data.length, 3);
            assert.equal(response.data[0].finishedPhases.length, 0);
            assert.equal(response.data[1].finishedPhases.length, 0);
            assert.equal(response.data[2].finishedPhases.length, 0);
        }).next()
.export(module);
