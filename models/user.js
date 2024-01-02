// import mongoose
const mongoose = require("mongoose");
const uniqueValidor = require("mongoose-unique-validator");

// create the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    minLength: 3,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidor);

// format the document object returned from the db
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the password shouldn't be revealed
    delete returnedObject.passwordHash;
  },
});

// create the User model
const User = mongoose.model("User", userSchema);

// export the User model object
module.exports = User;
