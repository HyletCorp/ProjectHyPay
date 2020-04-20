// PACKAGES REQUIRED
var express               = require("express"),
    mongoose              = require("mongoose"),
    bodyparser            = require("body-parser"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"); 

var app = express();

// TO ENABLE BODY PARSING
app.use(bodyparser.urlencoded({extented:true}));

app.use(require("express-session")({
	secret : "i love my doggy",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// TO INTIMATE EXPRESS TO LOOK IN THAT Dir
app.use(express.static('public'));


// CONNECTING THE DATABASE TO THE SERVER
mongoose.connect('mongodb://localhost/HypayDb', {
	
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex:true

});



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
// ************
// GET REQUESTS
// ************

app.get("/",function(req,res){
	//CALLING THE LOGIN PAGE
	res.render("login");
	
	// TO DO -> VALIDATE THE LOGIN DATA
});


// RENDERS THE SIGN IN PAGE

app.get("/signup",function(req,res){
	//CALLING THE SIGNUP PAGE
	res.render("signup");
});

app.get("/logged",isLoggedIn,function(req,res){
	res.render("logged");
});

// ************
// POST REQUESTS
// ************



//	SIGNUP POST REQUEST

app.post("/register",function(req,res){
	var FormResult=req.body;	
	User.register(new User({uname:FormResult.uname,username:FormResult.username}),FormResult.upass,function(err,user){
		if(err){
			console.log(err);
			res.send("could not be added to the db");
		}else{
			
				// passport.authenticate('local',req,res,
				// function() {
				// res.redirect('/secret');
				// });
			res.redirect("/");
		}
		
	});	
});

// LOGIN PAGE POST REQUEST

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/',successRedirect: "/logged"}),
  function(req, res) {
    res.redirect('/logged');
  });

// FUNCTION TO CHECK LOG-IN STATUS

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}
// LOGOUT POST REQUEST

app.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
});

// LISTENING PORT
app.listen(3000,function(){
	console.log("HyPaY Server started");
});