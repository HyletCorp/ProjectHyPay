// PACKAGES REQUIRED
var express = require("express");
var app = express();

// SETTING UP THE VIEW ENGINE
app.set("view engine","ejs");

// GET REQUESTS
app.get("/",function(req,res){
	//CALLING THE LANDING PAGE
	res.render("landing");
});

// LISTENING PORT
app.listen(3000,function(){
	console.log("HyPaY Server started");
});