// PACKAGES REQUIRED
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bp= require("body-parser");

// TO ENABLE BODY PARSING
app.use(bp.urlencoded({extented:true}));

// TO INTIMATE EXPRESS TO LOOK IN THAT Dir
app.use(express.static('public'));

// CONNECTING THE DATABASE TO THE SERVER
mongoose.connect('mongodb://localhost/HypayDb', {
	
  useNewUrlParser: true,
  useUnifiedTopology: true

});

// MODEL REQUIREMENTS
const User = require("./models/user");

// FUNCTION TO DISPALY THE ENTIRE DB
function displayUsers(){

	User.find({},function(err,res){
		if(err){
			console.log("Cannot display all user data");
		}else{
			console.log(res);
		}
	});

}

// FUNCTION TO ADD A NEW USER
function addUser(formResult){

	User.create(formResult,function(err,res){
		if(err){
			console.log("messed up");
		}else{
			console.log("added successfully");
			displayUsers();
		}
	});	

}

// SETTING UP THE VIEW ENGINE
app.set("view engine","ejs");

// GET REQUESTS
app.get("/",function(req,res){
	//CALLING THE LOGIN PAGE
	res.render("login");
	
	// TO DO -> VALIDATE THE LOGIN DATA
});

// RENDERS THE SIGN IN PAGE
var exists = false ;
app.get("/signup",function(req,res){
	//CALLING THE SIGNUP PAGE
	res.render("signup",{exists:exists});
	exists = false;
});

// POST REQUESTS
// LOGIN PAGE POST REQUEST
app.post("/validate",function(req,res){
	// TODO
});

//	SIGNUP POST REQUEST
app.post("/addUser",function(req,res){
	var FormResult=req.body;
	User.find({uno:FormResult.uno},function(err,result){
		if(err){
			console.log("Cannot check availaiblity");
		}else{
			if(result.length===0){
				
				addUser(FormResult);
				res.redirect("/");	
			}else{
				exists=true;
				res.redirect("/signup");
				
			}
		}
	});
	
});

// LISTENING PORT
app.listen(3000,function(){
	console.log("HyPaY Server started");
});