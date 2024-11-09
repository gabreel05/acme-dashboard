import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: process.env.DB_URL,
  useNullAsDefault: true,
});

export default db;
