exports.up = function(connection, Promise) {
  return connection.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.string("title").notNullable();
    table.text("body").notNullable();
    table.integer("votes").defaultTo(0);
    table
      .string("topic")
      .references("topics.slug")
      .onDelete("cascade")
      .notNullable();
    table
      .string("username")
      .references("users.username")
      .notNullable();
    table.timestamp("created_at").defaultTo(connection.fn.now());
    //table.datetime('created_at)
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("articles");
};
