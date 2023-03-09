
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "roleId": "1",
      "permissionId": "1",
      "value": "31",
      "key": "root",
    },
    {
      "id": "2",
      "roleId": "2",
      "permissionId": "2",
      "value": "15",
      "key": "users",
    },
    {
      "id": "3",
      "roleId": "2",
      "permissionId": "3",
      "value": "31",
      "key": "tenants",
    },
    {
      "id": "4",
      "roleId": "2",
      "permissionId": "4",
      "value": "15",
      "key": "roles",
    },
    // {
    //   "id": "5",
    //   "roleId": "2",
    //   "permissionId": "5",
    //   "value": "2",
    //   "key": "adminDecentralization",
    // },
    {
      "id": "6",
      "roleId": "2",
      "permissionId": "6",
      "value": "4",
      "key": "Power_bi",
    },
    {
      "id": "7",
      "roleId": "2",
      "permissionId": "12",
      "value": "4",
      "key": "invoices",
    },
    {
      "id": "8",
      "roleId": "2",
      "permissionId": "8",
      "value": "15",
      "key": "document_templates",
    },
    {
      "id": "9",
      "roleId": "2",
      "permissionId": "9",
      "value": "4",
      "key": "documents",
    },
    {
      "id": "10",
      "roleId": "2",
      "permissionId": "10",
      "value": "16",
      "key": "documents_Approval_reject_ad",
    },

  ]

  // Deletes ALL existing entries
  return knex('role_permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('role_permissions').insert(data);
      await knex.raw('select setval(\'role_permissions_id_seq\', max(id)) from role_permissions');
    });
};
