exports.up = function(connection, Promise) {
  return connection.schema.createTable("comment", table => {
    table.increments("comment_id").primary();
    table
      .string("username")
      .references("users.username")
      .notNullable();
    table.integer("article_id").references("articles.article_id");
    table.integer("votes");
    table.dateTime("created_at");
    table.text("body").notNullable();
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("comment");
};

/*
- comment_id which is the primary key
- username field that references a user's primary key
- article_id field that references an article's primary key
-votes defaults to 0
-created_at defaults to the current date
-body


body:
    "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
belongs_to: "They're not exactly dogs, are they?",
created_by: 'butter_bridge',
votes: 16,
created_at: 1511354163389,

belong to needs to be the aticle id 
*/
