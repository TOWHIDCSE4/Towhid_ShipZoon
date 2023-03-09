exports.up = function (knex) {
    return knex.schema.table('users', function (table) {
      table.string('phone').nullable().alter();
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('users', function (table) {
        table.integer('phone').nullable().alter();
    })
  };
  