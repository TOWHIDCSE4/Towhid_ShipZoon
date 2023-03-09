
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "password": "$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi", // 123456@
      "firstName": "Admin",
      "lastName": "root",
      "roleId": "1",
      "code" : '5c5652e878449245a480bb2ded80fadd',
      "email" : 'Admin_root@gmail.com',
      "twofaKey": "LZBV2L3YO5RXU42TKE3SYJL3IR6UY5RZ",
      "twofa": "0",
      "isFirst": "1",
      "Active_status": "1",
    },
    {
      "id": "2",
      "password": "$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi", // 123456@
      "firstName": "BSEZ",
      "lastName": "admin",
      "roleId": "2",
      "email" : 'Admin_bsez@gmail.com',
      "code" : '5a52a09382ba69e234694a3d08f05688',
      "twofaKey": "LZBV2L3YO5RXU42TKE3SYJL3IR6UY5RR",
      "twofa": "0",
      "isFirst": "1",
      "tenantId": "1",
      "Active_status": "1",
    }
  ]

  // Deletes ALL existing entries
  return knex('users').del()
    .then(async () => {
      // Inserts seed entries
      await knex('users').insert(data);
      await knex.raw('select setval(\'users_id_seq\', max(id)) from users');
    });
};