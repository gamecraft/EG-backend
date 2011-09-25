var APIeasy = require('api-easy'),
    assert = require('assert');

var suite = APIeasy.describe('localhost:3000/Team');

suite.discuss('When finishing phase')
    .use('localhost', 3000)
    .setHeader('Content-Type', 'application/json')
    .discuss("using Phase._id")
        .del("/Phase").expect(200).next()
        .del("/Team").expect(200).next()
        .del("/TeamMember").expect(200).next()
        .post("/Team", {_id: "teamID", name: "testTeam"})
            .expect(200).next()
        .post("/Team", {_id: "teamID2", name: "testTeam2" })
            .expect(200).next()
        .post("/Team", {_id: "teamID3", name: "testTeam3" })
            .expect(200).next()
        .post("/Phase", {_id: "phaseID"})
            .expect(200).next()
        .put("/Phase/phaseID/active")
            .expect(200)
            .expect("should return the phase active", function(req, res, body) {
                var response = JSON.parse(body);
                assert.equal(response.data.active, true);
            }).next()
        .put("/Phase/phaseID/finished", [{teamId: "teamID", juryPoints: 100}, {teamId: "teamID2", juryPoints: 200}])
            .expect(200)
            .expect("should return the phase as finished", function(req, res, body){
                var response = JSON.parse(body);
                assert.equal(response.data.length, 3);
                assert.equal(response.data[0].finishedPhases[0].juryPoints, 100);
                assert.equal(response.data[1].finishedPhases[0].juryPoints, 200);
                assert.equal(response.data[2].finishedPhases[0].juryPoints, 0);
                assert.equal(response.data[0].totalPoints, 100);
                assert.equal(response.data[1].totalPoints, 200);
                assert.equal(response.data[2].totalPoints, 0);
            }).next()
    .undiscuss()
    .next()
    .discuss("using current and next")
        .del("/Phase").expect(200).next()
        .del("/Team").expect(200).next()
        .del("/TeamMember").expect(200).next()
        .post("/Team", {_id: "teamID", name: "testTeam"})
            .expect(200).next()
        .post("/Team", {_id: "teamID2", name: "testTeam2" })
            .expect(200).next()
        .post("/Team", {_id: "teamID3", name: "testTeam3" })
            .expect(200).next()
        .post("/Phase", {_id: "phaseID"})
            .expect(200).next()
        .put("/Phase/next/active")
            .expect(200)
            .expect("should return the phase active", function(req, res, body) {
                var response = JSON.parse(body);
                assert.equal(response.data.active, true);
            }).next()
        .put("/Phase/current/finished", [{teamId: "teamID", juryPoints: 100}, {teamId: "teamID2", juryPoints: 200}])
            .expect(200)
            .expect("should return the phase as finished", function(req, res, body){
                var response = JSON.parse(body);
                assert.equal(response.data.length, 3);
                assert.equal(response.data[0].finishedPhases[0].juryPoints, 100);
                assert.equal(response.data[1].finishedPhases[0].juryPoints, 200);
                assert.equal(response.data[2].finishedPhases[0].juryPoints, 0);
                assert.equal(response.data[0].totalPoints, 100);
                assert.equal(response.data[1].totalPoints, 200);
                assert.equal(response.data[2].totalPoints, 0);
            }).next()
    .undiscuss()
    .next()
    .discuss("using current and next several times")
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
        .put("/Phase/next/active")
            .expect(200)
            .expect("should return the phase active", function(req, res, body) {
                var response = JSON.parse(body);
                assert.equal(response.data.active, true);
                assert.equal(response.data._id, "phaseID");
            }).next()
        .put("/Phase/current/finished", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
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
        .put("/Phase/next/active")
            .expect(200)
            .expect("should return the phase active", function(req, res, body) {
                var response = JSON.parse(body);
                assert.equal(response.data.active, true);
                assert.equal(response.data._id, "phaseID2");
            }).next()
        .put("/Phase/current/finished", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
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
        .put("/Phase/next/active")
            .expect(200)
            .expect("should return the phase active", function(req, res, body) {
                var response = JSON.parse(body);
                assert.equal(response.data.active, true);
                assert.equal(response.data._id, "phaseID3");
            }).next()
        .put("/Phase/current/finished", [{teamId: "teamID", juryPoints: 1}, {teamId: "teamID2", juryPoints: 1}])
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
    .undiscuss()
.export(module);
