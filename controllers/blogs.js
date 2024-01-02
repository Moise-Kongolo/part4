// importations
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
// const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

// isolates the token from the authorization header
// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

// routes handlers
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // add likes property if not found in request
  let blogContent;

  //verify the validity of the token and decode it
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if token invalid, JsonWebTokenError is raised
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  // get the user document that created the note
  const user = request.user;

  // if likes property is missing, add it with 0 as value
  if (request.body.likes) {
    blogContent = { user: user.id, ...request.body };
  } else {
    blogContent = { user: user.id, likes: "0", ...request.body };
  }

  // if title or url properties are missing, return 400 status code
  if (!request.body.title || !request.body.url) {
    response.status(400).end();
    return;
  }

  const blog = new Blog(blogContent); // create the new blog
  const savedBlog = await blog.save(); // save the blog
  // add the blog saved id to blogs array of the user
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save(); // save the user, with the blog id he created

  // return a status and the saved blog as json
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  // verify the validity of the token and decode it
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if token invalid, JsonWebTokenError is raised
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  // get the user document object of the token received
  const user = request.user;

  // get the blog document object to delete
  const blog = await Blog.findById(request.params.id);

  // the user.id and the blog.user might be different
  // delete the note only if it's the same id
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "not authorized" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = { likes: request.body.likes };
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedBlog);
});

// export this module
module.exports = blogsRouter;
