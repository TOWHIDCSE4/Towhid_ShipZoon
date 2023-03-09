exports.up = function (knex) {
    return knex.schema.table('document_templates', function (table) {
      table.integer('Active_status').defaultTo(1).nullable().comment("0: Inactive, 1: Active");
    })
  };
  
  exports.down = function (knex) {
    return knex.schema.table('document_templates', function (table) {
      table.dropColumn('Active_status');
    })
  };