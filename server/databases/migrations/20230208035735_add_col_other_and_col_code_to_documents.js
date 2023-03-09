exports.up = function (knex) {
  return knex.schema.table('documents', function (table) {
    table.string('code').unique().nullable().comment("code generated from id")
    table.jsonb('others').nullable().defaultTo('{}').comment("more information");
  })
};

exports.down = function (knex) {
  return knex.schema.table('documents', function (table) {
    table.dropColumn('code');
    table.dropColumn('others');
  })
};
 
