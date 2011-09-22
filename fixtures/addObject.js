#!/usr/bin/env node
var augment = require("../libs/mongoCRUD").augment;

// parse command line arguments
var argv = require("optimist")
           .default("db", "EDE-dev")
           .default("name", null)
           .default("data", null)
           .argv;

var options = {};
options.augment = augment("create");

var createCommand = require("mongodb-rest2/commands/create");
createCommand( 
    {
        connection: {host: "localhost", port: 27017},
        db: argv.db,
        collection: argv.name
    },
    JSON.parse(argv.data),
    options,
    function(err, docs) {
        console.log(err);
        console.log(docs);
    });
