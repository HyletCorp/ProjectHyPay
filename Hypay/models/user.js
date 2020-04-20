var mongoose = require("mongoose");
// CREATING A SCHEMA VARIABLE
const UserSchema = mongoose.Schema;

// DEFINING THE SCHEMA
const UserDb = new UserSchema({
  uname: String,
  uno: String,
  upass: String,
});

// EXPORTING THE MODULE OBJECT
module.exports = mongoose.model("User",UserDb);
