"use strict";

const nconf = require("nconf");
const repl = require("repl");
const util = require("util");
const SagepayAdminApiClient = require("./client");

const config = nconf.argv().env();

const client = new SagepayAdminApiClient({
    endpoint: config.get("endpoint"),
    user: config.get("user"),
    password: config.get("password"),
    vendor: config.get("vendor")
});

function writer(output) {
    function log(data) {
        console.log("\nPromise resolved:\n", util.inspect(data, {
            depth: 5
        }));
        process.stdout.write("> ");
    }
    if (typeof output.then === "function") {
        output.then(log, log);
        return "Promise waiting...";
    } else {
        return output;
    }
}

repl.start({
    prompt: "> ",
    writer: writer
}).context.request = client.request.bind(client);