
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('code').unique().nullable().comment("code generated from id")
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    
    //thong tin ca nhan
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.integer('phone').nullable();
    table.timestamp('birthday').nullable();
    table.string('photo').nullable();
    table.string('gender').nullable();
    table.string('commuteMethod').nullable();
    table.string('marriedStatus').nullable();
    
    //2fa
    table.string('twofaKey').unique().notNullable().comment("key verify 2fa")
    table.integer('twofa').defaultTo(1).notNullable().comment("check 2fa on and off")
    table.integer('isFirst').defaultTo(1).notNullable().comment("is login first")
    
    //link role
    table.integer('roleId').index().references('id').inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('CASCADE');
    table.integer('tenantId').nullable().index().references('id').inTable('tenants')
    .onUpdate('CASCADE')
    .onDelete('SET NULL');
    table.jsonb('others').defaultTo('{}').comment("more information");
    
      table.integer('createdBy').nullable().index().references('id').inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
      table.integer('updatedBy').nullable().index().references('id').inTable('users')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};