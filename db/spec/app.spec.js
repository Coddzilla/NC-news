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
      ////////
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
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
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
        it("gets 404 an article when an article id is specified", () => {
          return request
            .get("/api/articles/99999999")
            .expect(404)
            .then(({ body }) => {
              expect(body).to.eql({
                msg: "sorry, that was not found"
              });
            });
        });
        it("status 200 can change the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/3")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
              console.log(body, "body");
              expect(body.article).to.have.all.keys(
                "article_id",
                "username",
                "title",
                "votes",
                "body",
                "created_at",
                "topic"
              );
              expect(body.article.votes).to.eql(4);
            });
        });
        it("status 200 can decrement the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/3")
            .send({ inc_votes: -7 })
            .expect(200)
            .then(({ body }) => {
              console.log(body, "body");
              expect(body.article).to.have.all.keys(
                "article_id",
                "username",
                "title",
                "votes",
                "body",
                "created_at",
                "topic"
              );
              expect(body.article.votes).to.eql(-7);
            });
        });
        xit("DELETE yet to be written...", () => {
          return request
            .delete("/api/articles/:article_id")
            .expect(204)
            .then(); //do I need a then block?
        });
      });
      describe("/api/articles/:article_id/comments", () => {
        it("GETs the comments for an article with a specific article_id, status 200", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments[0]).to.have.all.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GETs the comments for an article with a specific article_id and a default limit of 10, status 200", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments).to.have.length(10);
            });
        });
        it("GETs the comments for an article with a specific article_id and a specified limit, status 200", () => {
          return request
            .get("/api/articles/1/comments?limit=0")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments).to.have.length(0);
            });
        });
        it("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments[0].author).to.eql("butter_bridge");
            });
        });
        it("GETs the comments for an article with a specific article_id, articles sorted by column when specified (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments[0].body).to.eql(
                "This morning, I showered for nine minutes."
              );
            });
        });
        it("GETs the comments for an article with a specific article_id, articles sorted by column when specified and sort order specified (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
            .expect(200)
            .then(({ body }) => {
              console.log("body", body);
              expect(body.comments[0].body).to.eql(
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              );
            });
        });
        it("GETs the comments for an article with a specific article_id, articles sorted by column when specified and sort order specified (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(3);
            });
        });
      });
      describe("/api/articles/:article_id/comments/:comment_id", () => {
        xit("PATCH request body accepts an object in the form { inc_votes: newVote } with a status 200", () => {
          return request
            .patch("/api/articles/1/comments/1")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].votes).to.eql(4);
            });
        });
        xit("DELETE request body accepts an object in the form { inc_votes: newVote } with a status 200", () => {
          return request
            .delete("/api/articles/:article_id/comments/:comment_id")
            .expect(204)
            .then(); //do I need a then block?
        });
      });
      describe("/api/users", () => {
        it("GETs users and responds with 200", () => {
          return request
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              expect(body.users[0]).to.have.all.keys(
                "avatar_url",
                "name",
                "username"
              );
            });
        });
        it("request body accepts an object containing a username , avatar_url and a name property responds with the posted user responds with 201", () => {
          const toPost = {
            username: "coddzilla",
            name: "lizzie",
            avatar_url: "https://www.yoyoyo.com"
          };
          return request
            .post("/api/users")
            .send(toPost)
            .expect(201)
            .then(({ body }) => {
              expect(body.user).to.eql({
                username: "coddzilla",
                name: "lizzie",
                avatar_url: "https://www.yoyoyo.com"
              });
            });
        });
      });
      describe("/api/users/:username", () => {
        it("get a user when a username is specified", () => {
          return request
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body.user.name).to.eql("jonny");
            });
        });
      });
      describe("/api/users/:username/articles", () => {
        it("get the articles when a username is specified, status 200 and a default limit of 10", () => {
          return request
            .get("/api/users/butter_bridge/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles).to.have.length(3);
              expect(body.articles[1].author).to.eql("butter_bridge");
            });
        });
        it("get the articles when a username is specified and a limit is specified, status 200", () => {
          return request
            .get("/api/users/butter_bridge/articles?limit=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles).to.have.length(2);
              expect(body.articles[1].author).to.eql("butter_bridge");
            });
        });
        it("get the articles when a username is specified, status 200 and default sorted by date and default sort order as descending", () => {
          return request
            .get("/api/users/butter_bridge/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles[0].title).to.eql(
                "Living in the shadow of a great man"
              );
            });
        });
        it("get the articles when a username is specified, status 200 and default sorted by date and default sort order as descending", () => {
          return request
            .get("/api/users/butter_bridge/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles[0].title).to.eql(
                "They're not exactly dogs, are they?"
              );
            });
        });
        it("get the articles when a username is specified, status 200 and sorted by column when specified and sort order when specified", () => {
          return request
            .get(
              "/api/users/butter_bridge/articles?sort_by=article_id&order=asc"
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles[0].title).to.eql(
                "Living in the shadow of a great man"
              );
            });
        });
        it("get the articles when a username is specified, status 200, sorted by column when specified, sort order when specified and is split into pages when page number is specified", () => {
          return request
            .get(
              "/api/users/butter_bridge/articles?sort_by=article_id&order=asc&limit=2&p=2"
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "votes",
                "created_at",
                "topic",
                "count"
              );
              expect(body.articles).to.have.length(1);
            });
        });
        it("gets a 404 not found when the user does not exist", () => {
          return request
            .get("/api/users/butter_bride/articles")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry, that was not found");
            });
        });
        it("gets a 404, not found when the user is in the wrong format", () => {
          return request
            .get("/api/users/4/articles")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry, that was not found");
            });
        });
      });
      describe("/api", () => {
        it("GETs a JSON describing all of the available end points", () => {
          return request
            .get("/api")
            .expect(200)
            .then(({ body }) =>
              expect(body.apiObject).to.have.all.keys(
                "/api/topics",
                "/api/topics/:topic/articles",
                "/api/articles",
                "/api/articles/:article_id",
                "/api/articles/:article_id/comments",
                "/api/articles/:article_id/comments/:comment_id",
                "/api/users",
                "/api/users/:username",
                "/api/users/:username/articles"
              )
            );
        });
      });
    });
  });
});

// it("gets 404 an article when an article id is specified", () => {
//   return request
//     .get("/api/articles/99999999")
//     .expect(404)
//     .then(({ body }) => {
//       expect(body).to.eql({
//         msg: "sorry, that was not found"
//       });
//     });
// });
