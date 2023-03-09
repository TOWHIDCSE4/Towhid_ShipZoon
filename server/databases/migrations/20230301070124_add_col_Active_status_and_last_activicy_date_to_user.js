exports.up = function (knex) {
    return knex.schema.table('users', function (table) {
      table.integer('Active_status').defaultTo(0).nullable().comment("0: Inactive, 1: Active");
      table.timestamp('last_activicy_date').nullable()
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('users', function (table) {
      table.dropColumn('Active_status');
      table.dropColumn('last_activicy_date');
    })
  };