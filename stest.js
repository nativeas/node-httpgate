var ls= require('binstruct');

function packRemote(guid,buf){

	
	var remote = packRemoteInternal(guid,buf);
	var result = null;

	console.log(remote.length.toString(16))


	var head = ls.def({littleEndian:true})
				.uint32(remote.length)
				.byte(0)
				.byte(0)
				.write();
	result = bufferAppend(head,remote);
	result = bufferAppend(result,new Buffer(2))
	return result
}

function packRemoteInternal(guid,buf){

  var result =null ;
  var def = ls.def({littleEndian:true});
  def.byte(1);
  def.byte(1);

  var buffxx = def.write();
  var guidbuffer = new Buffer(48);
  guidbuffer.write(guid);
  result = bufferAppend(buffxx,guidbuffer)
  var buflen = ls.def();
  buflen.int32(buf.length);
  
  result = bufferAppend(result,buflen.write());
  result = bufferAppend(result,buf);
  return result;
}


function bufferAppend(buf1,buf2){
	var result = new Buffer(buf1.length+ buf2.length);
	buf1.copy(result,0,0,buf1.length);
	buf2.copy(result,buf1.length)
	return result
}

exports.pack = packRemote;