exports.up = function(connection, Promise) {
  return connection.schema.createTable("comment", table => {
    table.increments("comment_id").primary();
    table
      .string("username")
      .references("users.username")
      .notNullable();
    table
      .integer("article_id")
      .references("articles.article_id")
      .onDelete("cascade");
    table.integer("votes").defaultTo(0);
    table.dateTime("created_at").defaultTo(connection.fn.now());
    table.text("body").notNullable();
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("comment");
};
