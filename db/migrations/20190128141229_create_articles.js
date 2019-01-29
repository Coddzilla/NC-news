exports.up = function(connection, Promise) {
  return connection.schema.createTable("articles", table => {
    table.increments("article_id").primary();
    table.string("title").notNullable();
    table.text("body").notNullable();
    table.integer("votes");
    table
      .string("topic")
      .references("topics.slug")
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

// defaultTo — column.defaultTo(value) on insert

// title: 'Running a Node App',
//     topic: 'coding',
//     created_by: 'jessjelly',
//     body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
//     created_at:
