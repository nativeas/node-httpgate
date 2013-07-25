var net = require('net');
var reslist = {};

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
		decode(data);
	})
}



function send(req, res, guid) {
	reslist[guid] = res;
	var sob = encode(guid, new Buffer([1, 23, 3, 4, 5, 6, 7, 3, 4, 4]))
	client.write(sob);
}

var st = require("./binaryUtil");

function encode(guid, data) {
	return st.pack(guid, data);
}

function decode(data) {
	st.unpack(data, callBack);
}

function callBack(guid, data) {
	var response = reslist[guid];
	if (response == null)
		return;
	response.send(data);
	delete reslist[guid]
}

exports.start = start;
exports.send = send;