const Blog = require("../models/blog");
const User = require("../models/user");

// the user propperty refers to the root id
// if you run the test that creates the initial user
// the id will change and you will have to replace here
const initialBlogs = [
  {
    title: "The path of spiritual enlightment",
    author: "Moise Kongolo",
    url: "www.google.com",
    likes: 5,
    user: "6593cf58ff609bd879e83914",
  },
  {
    title: "How to walk in light in 2024",
    author: "Moise Kongolo",
    url: "www.google.com",
    likes: 10,
    user: "659342d6b6e7a413af9df424",
  },
];
//
// const nonExistingId = async () => {
//   const note = new Note({ content: "willremovethissoon" });
//   await note.save();
//   await note.deleteOne();
//
//   return note._id.toString();
// };

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
