import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'acme',
    password: 'acme',
    database: 'acme',
  },
  useNullAsDefault: true,
});

export default db;
