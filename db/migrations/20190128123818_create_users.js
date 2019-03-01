exports.up = function(connection, Promise) {
  return connection.schema.createTable("users", table => {
    table
      .string("username")
      .primary()
      .notNullable();
    table.string("avatar_url", 500).notNullable();
    table.string("name").notNullable();
  });
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("users");
};
