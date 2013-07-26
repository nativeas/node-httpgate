var net = require('net');
var reslist = {};
var bu = require('./binaryUtil');
var client = new net.Socket();

function start(ip, port) {
	console.log(ip, port)
	client.on('error', function() {
		console.log("ERROR: socket error!");
	})
	client.connect(port, ip, function() {
		console.log("Socket Client Started!");
		console.log("Socket Client connectd to host: " + ip + ":" + port);
	});
	client.on('data', function(data) {
		console.log('recv', data.length);
		decode(data);
	})
}



function send(req, res, guid) {

	var tmp = new Buffer(0);

	req.on("data", function(data) {
		tmp = bu.bufferAppend(tmp, data);
	});
	req.on('end', function() {
		console.log("post end");
		reslist[guid] = res;
		var sob = encode(guid, tmp);
		console.log("SEND GUID:", guid);
		console.log("SEND data:", tmp);
		console.log("send data length", sob.length)
		console.log(client.write(sob));
		// client.write(sob);
		console.log("send complet!");
	});


}

var st = require("./binaryUtil");

function encode(guid, data) {
	return st.pack(guid, data);
}

function decode(data) {
	console.log('decode',data);
	st.unpack(data, callBack, replyHeartBeat);
}

function callBack(guid, data) {
	console.log("callback",guid,data);
	var response = reslist[guid];
	if (response == null)
		return;
	console.log("Callback GUID", guid)
	console.log("Callback", data)
	response.send(data);
	delete reslist[guid]
}

function replyHeartBeat(data) {
	console.log("replyHeartBeat", data.length);
	console.log(data);
	client.write(data);
}

exports.start = start;
exports.send = send;