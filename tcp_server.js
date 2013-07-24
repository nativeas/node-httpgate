var net  = require('net');

net.createServer(function(sock){
  console.log("CONNECTED: " + sock.remoteAddress + ":"+sock.remotePort);
  sock.on('data',function(data){
    console.log("recv data:"+data);
    console.log("recv data length:"+ data.length)
    sock.write(data);
  });

  sock.on('close',function(data){
    console.log("close");
  })
}).listen(8001,'127.0.0.1');

console.log("start listent")
