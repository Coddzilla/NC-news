
exports.up = function(connection, Promise) {
  return connection.schema.createTable('topics', (table) => {
table.string('slug').primary().notNullable();
table.text('description').notNullable();
  })
};

exports.down = function(connection, Promise) {
  return connection.schema.dropTable("topics");
};
