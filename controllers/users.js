const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  // put username, name, password into variables
  const { username, name, password } = request.body;

  // for username or pwd empty return 400
  if (!username || !password) {
    response.status(400).json({ error: "username or password invalid" });

    return;
  }

  // if username or pwd length < 3 return 400 status
  if (username.length < 3 || password.length < 3) {
    response
      .status(400)
      .json({ error: "username or password less than 3 characters" });
    return;
  }

  // create the pwd hash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // create the new user with his password hash
  const user = new User({
    username,
    name,
    passwordHash,
  });

  // save the user to the db
  const savedUser = await user.save();

  // return the status and user saved as json
  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    likes: 1,
  });
  response.status(201).json(users);
});

// exports the usersRouter object
module.exports = usersRouter;
