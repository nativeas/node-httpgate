var express = require("express");
var guid = require("./guid");
var client = require("./tcp_client");

client.start();
var app = express();


app.get("/",function(req,res){
	var guidx= guid.guid();
	client.send(req,res,guidx);
  
});


var port = process.env.PORT || 8080;
app.listen(port,function(){
  console.log("listen on"+port);
})
