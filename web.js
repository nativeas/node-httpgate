#!/usr/bin/env node


var express = require("express");
var guid = require("./guid");
var tcpclient = require("./tcp_client");
var app = express();

var httpport = -1;
var backend = '-1';
var backendPort = -1;


app.get("/", function(req, res) {

	res.send("Hello,World! This is 7cool's HttpGate ");
});

app.post("/", function(req, res) {
	var guidx = guid.guid();
	tcpclient.send(req, res, guidx);
})


if (require.main == module) {
	var hidx, ipidx, portidx;
	process.argv.forEach(function(val, index, array) {
		switch (val) {
			case "-h":
				hidx = index + 1;
				break;
			case "-r":
				ipidx = index + 1;
				break;
			case "-p":
				portidx = index + 1;
				break;
		}
	});
	httpport = process.argv[hidx];
	backend = process.argv[ipidx];
	backendPort = process.argv[portidx];

	tcpclient.start(backend, backendPort);
	app.listen(httpport, function() {
		console.log("Web Server Started! ");
		console.log("Listen on " + httpport);
	})

}