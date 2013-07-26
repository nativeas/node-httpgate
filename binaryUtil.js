var ls = require('binstruct');

function packRemote(guid, buf) {
	var remote = packRemoteInternal(guid, buf);
	var result = null;
	var head = ls.def({
		littleEndian: true
	})
		.uint32(remote.length)
		.byte(0)
		.byte(0)
		.write();
	result = bufferAppend(head, remote);
	result = bufferAppend(result, new Buffer(2))
	return result
}

function packRemoteInternal(guid, buf) {
	var result = null;
	var def = ls.def({
		littleEndian: true
	});
	def.byte(1);
	def.byte(1);
	var buffxx = def.write();
	var guidbuffer = new Buffer(48);
	guidbuffer.write(guid, 0, 36);
	result = bufferAppend(buffxx, guidbuffer)
	var buflen = ls.def({
		littleEndian: true
	});
	buflen.int32(buf.length);
	result = bufferAppend(result, buflen.write());
	result = bufferAppend(result, buf);
	return result;
}


function bufferAppend(buf1, buf2) {
	var result = new Buffer(buf1.length + buf2.length);
	buf1.copy(result, 0, 0, buf1.length);
	buf2.copy(result, buf1.length)
	return result
}

var _internalBuffer = new Buffer(0);

var unpackCallBack = null;
var replyHeartBeatCallBack = null;

function unPackRemote(data, unpackcb, replyHeartBeat) {
	unpackCallBack = unpackcb;
	replyHeartBeatCallBack = replyHeartBeat;
	_internalBuffer = bufferAppend(_internalBuffer, data);
	var avaiable = true;
	do {
		avaiable = unPackInternal();
	} while (avaiable);
}

function unPackInternal() {
	if (_internalBuffer.length < 4)
		return false;
	var cmdLen = _internalBuffer.readUInt32LE(0);
	var fullLen =  cmdLen+6 + 8-(cmdLen+ 6)%8;
	console.log('cmdLen:',cmdLen);
	console.log('Full:',fullLen);
	if (fullLen > _internalBuffer.length)
		return false;

	var pkdata = _internalBuffer.slice(0, cmdLen + 6);
	if (pkdata[6] == 0xff && pkdata[7] == 0xfe) {
		console.log('do heat')
		replyHeatBeat();

	} else {
		var guid = pkdata.slice(8, 8 + 36).toString();
		var clientData = pkdata.slice(8 + 48+4);
		unpackCallBack(guid, clientData);
	}

	var tmp = _internalBuffer.slice(fullLen);
	_internalBuffer = tmp;
	
	return true;
}

function replyHeatBeat(){
	var def = ls.def({
		littleEndian: true
	});
	def.int32(4)
		.byte(0)
		.byte(0)
		.byte(0xff)
		.byte(0xfe)
		.byte(1)
		.byte(1)
		.int32(0)
		.byte(0)
		.byte(0);
	var data = def.write();
	replyHeartBeatCallBack(data);

}

exports.pack = packRemote;
exports.bufferAppend = bufferAppend;
exports.unpack = unPackRemote;