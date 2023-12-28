const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

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

    // create the new note
    const newBlog = {
      title: "The path of spiritual enlightment",
      author: "Moise Kongolo",
      url: "www.google.com",
    };

    // save the new note the db
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    // get the response
    const contents = response.body.map((r) => r.title);

    // test if the blogs length is increaseb by 1
    expect(response.body).toHaveLength(initialBlogsLength + 1);
    // check if blogs contain the last blog saved
    expect(contents).toContain("The path of spiritual enlightment");
  });
});

describe("post /api/blogs", () => {
  test("returns status 400 if url or title property missing", async () => {
    const newBlog = {
      author: "Moise Kongolo",
      likes: 23,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("likes property", () => {
  test("defaults likes property to 0 if missing from request", async () => {
    let newBlog = {
      title: "How to walk in light in 2024",
      author: "Moise Kongolo",
      url: "www.google.cdm",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    // get the response
    const contents = response.body.map((r) => r.likes);
    expect(contents[contents.length - 1]).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
