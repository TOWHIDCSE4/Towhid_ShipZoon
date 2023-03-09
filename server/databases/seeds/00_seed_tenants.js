
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "code": "5c5652e878449245a480bb2ded80fadd",
      "name": "BSEZ",
      "email": "root",
      "state" : 'active',
    },
  ]

  // Deletes ALL existing entries
  return knex('tenants').del()
    .then(async () => {
      // Inserts seed entries
      await knex('tenants').insert(data);
      await knex.raw('select setval(\'tenants_id_seq\', max(id)) from tenants');
    });
};
