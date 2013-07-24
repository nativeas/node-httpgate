var net = require('net');
//var host = '127.0.0.1'
var host = '172.16.2.57';
var port = 8001;

var client = null;

function start() {
	client = new net.Socket();
	client.connect(port, host, function() {

		console.log("connectd to host");
		
	});
	client.on('data', function(data) {

		console.log("data:" + data);
		var obj = reslist[data];
		//console.log(obj)
		if(obj!=null){
			obj.send(data);
			
			reslist[data] = null;
		}
	})
}


var reslist = {}
function send(req,res,guid) {
	 reslist[guid] =  res;
	 var sob = encode(guid,new Buffer([1,23,3,4,5,6,7,3,4,4]))
	 console.log(sob.length);
	 console.log(client.write(sob));

}

var st = require("./stest")
function encode(guid,data){
	return st.pack(guid,data);
}


exports.start = start;
exports.send = send;