process.env.NODE_ENV = "test";
const app = require("../../app");
const request = require("supertest")(app);
const { expect } = require("chai");
const connection = require("../connection");

// vote test for if it is a number... /^-?[0-9]+$
//change all error handles to match the msg in the erro handling function
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
    it("POST request responds with 201 and body accepts an object containing a slug and a description ", () => {
      const topic = {
        slug: "lizzie",
        description: "heyheyhey!"
      };
      return request
        .post("/api/topics")
        .send({ topic })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an("object");
          expect(body.topic).to.eql({
            slug: "lizzie",
            description: "heyheyhey!"
          });
        });
    });
    it("POST request responds with 422 if a bad post request has been made with a duplicate slug", () => {
      const topic = {
        slug: "mitch",
        description: "heyheyhey!"
      };
      return request
        .post("/api/topics")
        .send({ topic })
        .expect(422)
        .then(({ body }) => {
          expect(body.topic).to.eql(undefined);
          //how do I make this test better?
        });
    });

    it("POST request responds with 400 if a bad post request has been made with no description", () => {
      const topic = {
        slug: "dinosaur"
      };
      return request
        .post("/api/topics")
        .send({ topic })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("sorry there was a 400, bad request!");
          //how do I make this test better?
        });
    });
    describe("/api/topics/:topic/articles", () => {
      //think this end point isn't working...
      it("GET request responds with a 200 and an article array of article objects", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.total_count).to.eql(11);
          });
      });
      it("GET request responds with a 200 and an article array of article objects, defaults to a limit of 10", () => {
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
            expect(body.articles).to.have.length(5);
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "votes",
              "created_at",
              "topic",
              "comment_count"
            );
          });
      });
      it("GET request responds with a 200 and an article array of article objects in sorded order  (default sort column as date) ", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql(
              "Living in the shadow of a great man"
            );
          });
      });
      it("GET request responds with a 200 and an article array of article objects in sorded order when the sort column in specified (default sort column as date) ", () => {
        return request
          .get("/api/topics/cats/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql(
              "UNCOVERED: catspiracy to bring down democracy"
            );
          });
      });

      it("GET request responds with a 200 and an article array of article objects in sorded order (default sort column as date and sort order as descending)", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({ body }) => {
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
          .get("/api/topics/cats/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.eql(1);
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "votes",
              "created_at",
              "topic",
              "comment_count"
            );
          });
      });
      //here
      it("GET request responds with a 404 when the topic doesn't exist", () => {
        return request
          .get("/api/topics/33/articles")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry, that was not found");
            //this is giving me all of the articles - how do I test for this?
          });
      });
      //here
      it("GET request responds with a 200 and all of the articles when the limit is larger than the total size", () => {
        return request
          .get("/api/topics/mitch/articles?limit=999999")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql(
              "Living in the shadow of a great man"
            );
            //this is giving me all of the articles - is this okay since you would expect to see all items on a website if it gives you a limit larger than the size
          });
      });
      it("GET request responds with a 400 when the limit does not exist... the limit doesn't exist!", () => {
        return request
          .get("/api/topics/mitch/articles?limit=shackalacka")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
          });
        //why is this not working?
      });
      it("GET request responds with a 400 when the sort-by column does not exist", () => {
        return request
          .get("/api/topics/mitch/articles?sort_by=shackalacka")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
          });
      });
      it("GET request responds with a 400 when the page is not a number", () => {
        return request
          .get("/api/topics/mitch/articles?p=shackalacka")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
          });
      });
      it("GET request responds with a 404 when the page number is too large", () => {
        return request
          .get("/api/topics/mitch/articles?p=50000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry, that was not found");
          });
      });
      it("GET request responds with a 200 and the default order when the order does not exist", () => {
        return request
          .get("/api/topics/mitch/articles?order=50000")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Moustache");
          });
      });
      it("GET request responds with a 200 and the default order when the order does not exist", () => {
        return request
          .get("/api/topics/mitch/articles?order=gooooood")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Moustache");
          });
      });
    });

    describe("/api/topics/:topic/articles", () => {
      it("POST - request body accepts an object containing a title , body and a username property responds with the posted article and a 201 status", () => {
        const article = {
          title: "yoyoyo",
          body: "body of yoyoyo",
          username: "icellusedkars"
        };
        return request
          .post("/api/topics/mitch/articles")
          .send({ article })
          .expect(201)
          .then(({ body }) => {
            expect(body.title).to.eql("yoyoyo");
          });
      });
      //here
      it("POST - responds with a 400 if the post data is malformed", () => {
        const article = {
          title: "yoyoyo"
        };
        return request
          .post("/api/topics/mitch/articles")
          .send({ article })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
          });
      });
      it("POST - responds with a 400 bad request if the username does not exists", () => {
        const article = {
          title: "yoyoyo",
          body: "body of yoyoyo",
          username: "Coddzilla"
        };
        return request
          .post("/api/topics/mitch/articles")
          .send({ article })
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
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.be.an("object");
          });
      });
      it("GETs a total_count property, displaying the total number of articles and an articles array of article objects with the correct keys", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "body",
              "votes",
              "comment_count",
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
      it("GETs a total_count property and article array with a limit, which limits the number of responses (defaults to 10)", () => {
        return request
          .get("/api/articles?limit=five")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
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
      //change
      it("GETs a total_count property and article array which is sorted to a specific column when specified (default sorted by date)", () => {
        return request
          .get("/api/articles?sort_by=yooooo")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
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

      it("GETs a 200 and responds with the default date order when the sort order is not found", () => {
        return request
          .get("/api/articles?order=ascondinggg")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.eql("Moustache");
          });
      });
      //should this be a 404? here
      it("GETs sends a 400 bad request when the sort column does not exist", () => {
        return request
          .get("/api/articles?sort_by=cdbu")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("sorry there was a 400, bad request!");
          });
      });
      it("GETs a total_count property and article array which is split into pages, gives the correct amount of information for each page number (default limit of 10)", () => {
        return request
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.length(2);
          });
      });
      it("GETs 400, bad request when the page is a negative number)", () => {
        return request.get("/api/articles?p=-2").expect(400);
      });
      //how to deal with how limit is a string in req.params - is it regex?
      it("GETs a total_count property and article array which is split into pages, gives the correct amount of information for each page number when a limit is specified", () => {
        return request
          .get("/api/articles?p=2&limit=7")
          .expect(200)
          .then(({ body }) => {
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
                "comment_count",
                "created_at",
                "topic"
              );
              expect(body.article.article_id).to.eql(2);
            });
        });
        it("gets 404 when an article when an non-existant article id is specified", () => {
          return request
            .get("/api/articles/99999999")
            .expect(404)
            .then(({ body }) => {
              expect(body).to.eql({
                msg: "sorry, that was not found"
              });
            });
        });
        it("gets 400 when an article when an non-existant article id is specified", () => {
          return request
            .get("/api/articles/word")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        it("status 200 can change the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/3")
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body }) => {
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
        it("status 400 can change the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/3")
            .send({ inc_votes: "four" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry that is a bad request");
            });
        });
        it("status 400 can change the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/yooo")
            .send({ inc_votes: 4 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        it("status 400 when the input data is empty", () => {
          return request
            .patch("/api/articles/yooo")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        it("status 200 can decrement the votes and respond with updated article", () => {
          return request
            .patch("/api/articles/3")
            .send({ inc_votes: -7 })
            .expect(200)
            .then(({ body }) => {
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
        it("DELETE's an article by article id, status 204'", () => {
          return request.delete("/api/articles/2").expect(204);
        });
        //here
        it("DELETE status 404 when given a non-existant article_id", () => {
          return request.delete("/api/articles/90").expect(404);
        });
        it("DELETE status 400 when given an article_id in the wrong format", () => {
          return request.delete("/api/articles/nine").expect(400);
        });
      });
      describe("/api/articles/:article_id/comments", () => {
        it("GETs the comments for an article with a specific article_id, status 200", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
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
              expect(body.comments).to.have.length(10);
            });
        });

        it("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments[0].author).to.eql("butter_bridge");
            });
        }); //
        it("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/one/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        }); //
        it("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/90000/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?limit=five")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?sort_by=title")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?sort_by=hooo")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?p=hooo")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?order=hooo")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?p=3")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql("");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql("");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?sort_by=title")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql("");
            });
        });
        xit("GETs the comments for an article with a specific article_id, articles sorted by column (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/2/comments?limit=2")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.eql("");
            });
        });
        it("GETs the comments for an article with a specific article_id, articles sorted by column when specified (default to sort by date) status 200", () => {
          return request
            .get("/api/articles/1/comments?sort_by=comment_id")
            .expect(200)
            .then(({ body }) => {
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
              expect(body.comments[0].body).to.eql(
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              );
            });
        });
        it("GETs the comments for an article with a specific article_id, and gives the correct amount of responses for a specific page number (limit defaults to 10) status 200", () => {
          return request
            .get("/api/articles/1/comments?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(3);
            });
        });
        it("GETs the comments for an article with a specific article_id, and gives the correct amount of responses for a specific page number and a specific limit (limit defaults to 10) status 200", () => {
          return request
            .get("/api/articles/1/comments?p=2&limit=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.have.length(2);
            });
        });
        //here //is this right? looks like there should be a post
        it("GETs the comments for an article with a specific article_id, and gives the correct amount of responses for a specific page number and a specific limit (limit defaults to 10) status 200", () => {
          return request
            .post("/api/articles/1/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.eql(
                "sorry, that request is not supported at this end point"
              );
            });
        });
      });
      describe("/api/articles/:article_id/comments/:comment_id", () => {
        it("PATCH request body accepts an object in the form { inc_votes: newVote } with a status 200 and increments the votes", () => {
          return request
            .patch("/api/articles/1/comments/1")
            .send({
              inc_votes: 4
            })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.eql(20);
            });
        });
        //here getting error: Can't set headers after they are sent
        it("PATCH request body accepts an object in the form { inc_votes: newVote } with a status 200 and increments the votes", () => {
          return request
            .patch("/api/articles/1/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.msg).to.eql("unmodified");
            });
        });
        it("PATCH responds with 400 when the comment id does not exist", () => {
          return request
            .patch("/api/articles/1/comments/80000")
            .send({
              inc_votes: 4
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        it("PATCH responds with 400 when the comment id does not exist", () => {
          return request
            .patch("/api/articles/1/comments/word")
            .send({
              inc_votes: 4
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("sorry there was a 400, bad request!");
            });
        });
        it("DELETEs a comment by comment id, status 204", () => {
          return request.delete("/api/articles/2/comments/3").expect(204);
        });
        it("DELETE - 400 bad request if comment_id is non-existant", () => {
          return request.delete("/api/articles/2/comments/3000").expect(400);
        });
      });
      describe("/api/users", () => {
        it("GETs users and responds with 200 and an array of user objects", () => {
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
        it("POST request - body accepts an object containing a username , avatar_url and a name property responds with the posted user responds with 201", () => {
          const user = {
            username: "coddzilla",
            name: "lizzie",
            avatar_url: "https://www.yoyoyo.com"
          };
          return request
            .post("/api/users")
            .send({ user })
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
        it("get a user when a username is specified", () => {
          return request
            .get("/api/users/lizzie")
            .expect(404)
            .then(({ body }) => {
              console.log(body);
              expect(body.msg).to.eql("sorry, that was not found");
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
                "comment_count"
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
                "comment_count"
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
                "comment_count"
              );
              expect(body.articles[0].title).to.eql(
                "Living in the shadow of a great man"
              );
            });
        });
        it("get the articles when a username is specified, status 200 and sorts by title when specified (default sorted by date) and default sort order as descending", () => {
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
                "comment_count"
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
                "comment_count"
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
                "comment_count"
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
