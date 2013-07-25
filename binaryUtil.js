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
	guidbuffer.write(guid,0,36);
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
function unPackRemote(data,unpackcb) {
	unpackCallBack = unpackcb;
	_internalBuffer = bufferAppend(_internalBuffer, data);
	var avaiable = true;
	do{
		avaiable = unPackInternal();
	}while(avaiable);
}

function unPackInternal() {
	if(_internalBuffer.length<4)
		return false;
	var cmdLen = _internalBuffer.readUInt32LE(0);
	if (cmdLen + 6 > _internalBuffer.length)
		return false;
	var pkdata = _internalBuffer.slice(0, cmdLen + 6);
	var guid = pkdata.slice(8,8+36).toString();
	var clientData = pkdata.slice(8+48);
	var tmp = _internalBuffer.slice(cmdLen + 8);
	_internalBuffer = tmp;
	unpackCallBack(guid,clientData);
	return true;
}

exports.pack = packRemote;

exports.unpack = unPackRemote;