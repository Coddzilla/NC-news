process.env.NODE_ENV = "test";
const app = require("../../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const connection = require("../connection");

describe("/api", () => {
  //before each one, need to rollback, then migrate then seed
  beforeEach(() => {
    return connection.migrate
      .rollback()
      .then(() => {
        return connection.migrate.latest();
      })
      .then(() => {
        return connection.seed.run();
      });
  });

  after(() => {
    connection.destroy();
  });

  describe("/topics", () => {
    it("GET request responds with 200 and an array of topic objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("POST request responds with 201 and body accepts a objecy containing slug and description ", () => {
      const toPost = {
        slug: "lizzie",
        description: "heyheyhey!"
      };
      return request
        .post("/api/topics")
        .send(toPost)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an("object");
          expect(body.topic).to.eql({
            slug: "lizzie",
            description: "heyheyhey!"
          });
        });
    });
  });
  describe("/api/topics/:topic/articles", () => {
    it("GET request responds with a 200 and an article array of article objects with the correct keys", () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(({ body }) => {
          // console.log(body);
          expect(body.total_count).to.eql(12);
        });
    });
    it("GET request responds with a 200 and an article array of article objects with the correct keys, defaults to a limit of 10", () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(({ body }) => {
          // console.log(body);
          expect(body.articles).to.have.length(10);
        });
    });
    it("GET request responds with a 200 and an article array of article objects with the correct keys, with a limit when specified", () => {
      return request
        .get("/api/topics/mitch/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          console.log("body!!!!", body);
          expect(body.articles).to.have.length(5);
        });
    });
    it("GET request responds with a 200 and an article array of article objects in sorded order (default sort column as date", () => {
      return request
        .get("/api/topics/mitch/articles?sort_column=title")
        .expect(200)
        .then(({ body }) => {
          // console.log(body.articles[0].title);
          expect(body.articles[0].title).to.eql("A");
        });
    });
  });
});

// it('respond with 201 created', function (done) {
//   request(app)
//     .post('/users')
//     .send(data)
//     .set('Accept', 'application/json')
//     .expect('Content-Type', /json/)
//     .expect(201)
//     .end((err) => {
//       if (err) return done(err);
//       done();
//     });
