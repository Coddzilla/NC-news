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
    it("POST request responds with 400 if a bad post request has been made ", () => {
      const toPost = {
        slug: "mitch",
        description: "heyheyhey!"
      };
      return request
        .post("/api/topics")
        .send(toPost)
        .expect(400)
        .then(({ body }) => {
          expect(body.topic).to.eql(undefined);
          //how do I make this test better?
        });
    });
    describe("/api/topics/:topic/articles", () => {
      it("GET request responds with a 200 and an article array of article objects with the correct keys", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.eql(12);
          });
      });
      it("GET request responds with a 200 and an article array of article objects with the correct keys, defaults to a limit of 10", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
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
          .get("/api/topics/mitch/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Z");
          });
      });
      it("GET request responds with a 200 and an article array of article objects in sorded order (default sort column as date and sort order as descending)", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.articles[0].title).to.eql(
              "Living in the shadow of a great man"
            );
          });
      });
      it("GET request responds with a 200 and an article array of article objects in sorded order when sort order is specified (default sort column as date and sort order as descending)", () => {
        return request
          .get("/api/topics/mitch/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Moustache");
          });
      });
      it("GET request responds with a 200 and an article array of article objects with the correct keys", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.eql(12);
          });
      });
    });
    describe("/api/topics/:topic/articles", () => {
      it("POST - request body accepts an object containing a title , body and a username property responds with the posted article ", () => {
        const toPost = {
          title: "yoyoyo",
          body: "body of yoyoyo",
          username: "icellusedkars"
        };
        return request
          .post("/api/topics/mitch/articles")
          .send(toPost)
          .expect(201)
          .then(({ body }) => {
            expect(body.title).to.eql("yoyoyo");
          });
      });
      it("POST - request body accepts an object containing a title , body and a username property responds with the posted article ", () => {
        const toPost = {
          title: "yoyoyo",
          body: "body of yoyoyo",
          username: "Coddzilla"
        };
        return request
          .post("/api/topics/mitch/articles")
          .send(toPost)
          .expect(400)
          .then(({ body }) => {
            expect(body.title).to.eql(undefined);
          });
      });
    });
    describe("/api/articles", () => {
      it("GETs a total_count property, displaying the total number of articles and an articles array of article objects", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.have.all.keys("total_count", "articles");
          });
      });
      it("GETs a total_count property, displaying the total number of articles and an articles array of article objects", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            console.log("!!!!!", body.articles[0]);
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "body",
              "votes",
              "count",
              "created_at",
              "topic"
            );
          });
      });
      it("GETs a total_count property and article array with a limit, which limits the number of responses (defaults to 10)", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(10);
          });
      });
      it("GETs a total_count property and article array with a limit, which limits the number of responses when a limit is specified (defaults to 10)", () => {
        return request
          .get("/api/articles?limit=3")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(3);
          });
      });
      it("GETs a total_count property and article array which is sorted (default sorted by date", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql(
              "Living in the shadow of a great man"
            );
          });
      });
      it("GETs a total_count property and article array which is sorted to a specific column when specified (default sorted by date)", () => {
        return request
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Z");
          });
      });
      it("GETs a total_count property and article array which is sorted to a specific sort order when specified (default sorted by descending)", () => {
        return request
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Moustache");
          });
      });
      it("GETs a total_count property and article array which is sorted to a specific sort order when specified (default sorted by descending)", () => {
        return request
          .get("/api/articles?sort_by=cdbu")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("That sort order cannot be implimented");
          });
      });
      it("GETs a total_count property and article array which is sorted to a specific sort order when specified (default sorted by descending)", () => {
        return request
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.articles).to.have.length(2);
          });
      });
      it("GETs a total_count property and article array which is sorted to a specific sort order when specified (default sorted by descending)", () => {
        return request
          .get("/api/articles?p=2&limit=7")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.articles).to.have.length(5);
          });
      });
      describe("/articles/:article_id", () => {
        it("gets 200 and an article when an article id is specified", () => {
          return request
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
              expect(body.article.article_id).to.eql(2);
            });
        });
        it("gets 200 and an article when an article id is specified, including the correct key value pairs", () => {
          return request
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.have.all.keys(
                "article_id",
                "author",
                "title",
                "votes",
                "body",
                "count",
                "created_at",
                "topic"
              ); //why is the model not changing count to comment_count?
            });
        });
        it.only("gets 404 an article when an article id is specified", () => {
          return request
            .get("/api/articles/99999999")
            .expect(404)
            .then(({ body }) => {
              expect(body).to.eql({
                msg: "sorry, that was not found"
              });
            });
        });
      });
    });
    //write test for page...what the frig is this???
  });
});
