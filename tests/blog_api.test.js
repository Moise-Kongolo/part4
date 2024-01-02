const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 100000);

describe("blogs as json", () => {
  test("returns blogs as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);
});

describe("blog post id", () => {
  test("verifies the unique identifier of the blog post is named id", async () => {
    const blogPosts = await api.get("/api/blogs");

    // expect(bp).toBeDefined(); //verify blogPost exist
    blogPosts.body.forEach((bp) => {
      expect(bp.id).toBeDefined(); //verify id property exists
      expect(bp.__id).toBeUndefined();
    });
  });
});

describe("post request", () => {
  test("verifies that http post req creates successfully a new blog", async () => {
    const initialBlogs = await api.get("/api/blogs");
    // get the initial blogs length
    const initialBlogsLength = initialBlogs.body.length;

    const user = {
      username: "root",
      password: "sekret",
    };

    // log the root user
    const loginUser = await api.post("/api/login").send(user);

    // create the new note
    const newBlog = {
      title: "I am a new creation",
      author: "Moise Kongolo",
      url: "www.google.com",
      likes: 4,
      userId: "659342d6b6e7a413af9df424",
    };

    // save the new note the db
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loginUser.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    // get the response
    const contents = response.body.map((r) => r.title);

    // test if the blogs length is increaseb by 1
    expect(response.body).toHaveLength(initialBlogsLength + 1);
    // check if blogs contain the last blog saved
    expect(contents).toContain("I am a new creation");
  });

  test("fails to create a new blog for unauthorized user", async () => {
    // create the new note
    const newBlog = {
      title: "new creation",
      author: "Moise Kongolo",
      url: "www.google.com",
      likes: 4,
      userId: "659342d6b6e7a413af9df424",
    };

    // save the new note the db
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("post /api/blogs", () => {
  test("returns status 400 if url or title property missing", async () => {
    const user = {
      username: "root",
      password: "sekret",
    };

    // log the root user
    const loginUser = await api.post("/api/login").send(user);

    const newBlog = {
      author: "Moise Kongolo",
      likes: 23,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loginUser.body.token} `)
      .send(newBlog)
      .expect(400);
  });
});

describe("likes property", () => {
  test("defaults likes property to 0 if missing from request", async () => {
    const user = {
      username: "root",
      password: "sekret",
    };

    // log the root user
    const loginUser = await api.post("/api/login").send(user);

    let newBlog = {
      title: "How to walk in light in 2024",
      author: "Moise Kongolo",
      url: "www.google.cdm",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loginUser.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    // get the response
    const contents = response.body.map((r) => r.likes);
    expect(contents[contents.length - 1]).toBe(0);
  });
});

describe("delete request", () => {
  test("deletes the targeted blog and returned 204 status", async () => {
    // make sure there is something in the db created by root before running the test
    const user = {
      username: "root",
      password: "sekret",
    };

    // log the root user
    const loginUser = await api.post("/api/login").send(user);
    const blogs = await api.get("/api/blogs");
    const blogId = blogs.body[0].id;

    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(204)
      .set("Authorization", `Bearer ${loginUser.body.token}`);
  }, 3000);
});

describe("update request", () => {
  test("updates the targeted blog", async () => {
    const user = {
      username: "root",
      password: "sekret",
    };

    // log the root user
    const loginUser = await api.post("/api/login").send(user);
    const blogs = await api.get("/api/blogs");
    const blogId = blogs.body[0].id;

    await api
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${loginUser.body.token}`)
      .send({ likes: 10 })
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
