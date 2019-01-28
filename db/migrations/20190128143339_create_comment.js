
exports.up = function(connection, Promise) {
  return connection.schema.createTable("comment", table => {
    table.integer("comment_id").primary();
    table
      .string("username")
      .references("users.username")
      .notNullable();
    table
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    table.integer("votes").notNullable();
   table.dateTime("created_at");
    table.string("body").notNullable();
  });
};

exports.down = function(connection, Promise) {
   return connection.schema.dropTable("comment");
};

/*
- comment_id which is the primary key
- username field that references a user's primary key
- article_id field that references an article's primary key
- votes defaults to 0
- created_at defaults to the current date
- body
*/
