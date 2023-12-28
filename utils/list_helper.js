const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.map((blog) => blog.likes).reduce((a, b) => a + b, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const blog = blogs.filter((b) => b.likes === maxLikes)[0];
  return (({ _id, url, __v, ...result }) => result)(blog);
};

const mostBlogs = (blogs) => {
  const obj = {};
  // reduce author with their number of likes in an object
  blogs.forEach((b) =>
    obj[b.author] ? (obj[b.author] += 1) : (obj[b.author] = 1),
  );
  // transform obj into array
  const arr = Object.entries(obj);
  //get the top author
  const topAuthor = arr.reduce((a, b) => (a[1] > b[1] ? a : b));
  return { author: topAuthor[0], blogs: topAuthor[1] };
};

const mostLikes = (blogs) => {
  // reduce authors with their number of likes
  const obj = {};
  blogs.forEach((b) =>
    obj[b.author] ? (obj[b.author] += b.likes) : (obj[b.author] = b.likes),
  );
  const arr = Object.entries(obj);
  const topLikes = arr.reduce((a, b) => (a[1] > b[1] ? a : b));
  return { author: topLikes[0], likes: topLikes[1] };
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
