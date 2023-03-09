exports.up = function (knex) {
  return knex.schema.table('document_templates', function (table) {
    table.string('code').unique().nullable().comment("code generated from id")
  })
};

exports.down = function (knex) {
  return knex.schema.table('document_templates', function (table) {
    table.dropColumn('code');
  })
};