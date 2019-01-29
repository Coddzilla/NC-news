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
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("slug", "description");
          // expect(body.topics).to.include(toPost);
          // expect(body.topics).to.contain(toPost);
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
