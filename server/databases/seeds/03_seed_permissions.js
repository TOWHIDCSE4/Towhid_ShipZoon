
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "name": "root",
      "description": "root",
      "value": "31",
      "key": "root",
    },
    {
      "id": "2",
      "name": "users",
      "description": "users",
      "value": "15",
      "key": "users",
    },
    {
      "id": "3",
      "name": "tenants",
      "description": "tenants",
      "value": "31",
      "key": "tenants",
    },
    {
      "id": "4",
      "name": "roles",
      "description": "roles",
      "value": "15",
      "key": "roles",
    },
    // {
    //   "id": "5",
    //   "name": "adminDecentralization",
    //   "description": "adminDecentralization",
    //   "value": "2",
    //   "key": "adminDecentralization",
    // },
    {
      "id": "6",
      "name": "Power_bi",
      "description": "Power_bi",
      "value": "4",
      "key": "Power_bi",
    },
    // {
    //   "id": "7",
    //   "name": "overView",
    //   "description": "overView",
    //   "value": "4",
    //   "key": "overView",
    // },
    {
      "id": "8",
      "name": "document_templates",
      "description": "document_templates",
      "value": "15",
      "key": "document_templates",
    },
    {
      "id": "9",
      "name": "documents",
      "description": "documents",
      "value": "15",
      "key": "documents",
    },
    {
      "id": "10",
      "name": "approval_reject(AD)",
      "description": "documents_Approval_reject",
      "value": "16",
      "key": "documents_Approval_reject_ad",
    },
    {
      "id": "11",
      "name": "approval_reject(EM)",
      "description": "documents_Approval_reject",
      "value": "16",
      "key": "documents_Approval_reject_em",
    },
    {
      "id": "12",
      "name": "invoices",
      "description": "invoices",
      "value": "4",
      "key": "invoices",
    },
  ]

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('permissions').insert(data);
      await knex.raw('select setval(\'permissions_id_seq\', max(id)) from permissions');
    });
};
