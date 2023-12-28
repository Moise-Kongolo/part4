// importations
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// routes handlers
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // add likes property if not found in request
  let blogContent;

  // if likes property is missing, add it with 0 as value
  if (request.body.likes) {
    blogContent = request.body;
  } else {
    blogContent = { likes: "0", ...request.body };
  }

  // if title or url properties are missing, return 400 status code
  // else save the note
  if (!request.body.title || !request.body.url) {
    response.status(400).end();
  } else {
    const blog = new Blog(blogContent);
    const result = await blog.save();
    response.status(201).json(result);
  }
});

// export this module
module.exports = blogsRouter;
