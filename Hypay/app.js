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

// CREATING A SCHEMA VARIABLE
const UserSchema = mongoose.Schema;

// DEFINING THE SCHEMA
const UserDb = new UserSchema({
  uname: String,
  uno: String,
  upass: String,
});

// USER WILL BE THE  TABLE NAME
var User = mongoose.model("User",UserDb);

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

var exists = false ;
app.get("/signup",function(req,res){
	//CALLING THE SIGNUP PAGE
	res.render("signup",{exists:exists});
});

// POST REQUESTS
// LOGIN PAGE POST REQUEST
app.post("/validate",function(req,res){
	var FormResult=req.body;
	if(checkAvail(FormResult.uno)){
		addUser(FormResult);
		res.redirect("/");
	}else{
		// to-do user name already exists
	}
});

//	SIGNUP POST REQUEST
app.post("/addUser",function(req,res){
	var FormResult=req.body;
	User.find({uno:FormResult.uno},function(err,result){
		if(err){
			console.log("Cannot check availaiblity");
		}else{
			console.log(result.length);
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