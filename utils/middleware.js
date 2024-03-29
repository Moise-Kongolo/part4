const User = require("../models/user");
const jwt = require("jsonwebtoken");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    return next();
  }
  request.token = null;
  return next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    request.user = null;
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      request.user = null;
    } else {
      // get the user document that created the note
      const user = await User.findById(decodedToken.id);
      request.user = user;
    }
  }

  next();
};

module.exports = { tokenExtractor, userExtractor };
