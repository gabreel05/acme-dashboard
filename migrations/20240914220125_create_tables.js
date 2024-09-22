/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createExtension('uuid-ossp')
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name', 255).notNullable();
      table.text('email').notNullable().unique();
      table.text('password').notNullable();
      table.enu('role', ['USER', 'ADMIN']).defaultTo('user').notNullable();
    })
    .createTable('invoices', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('customer_id').notNullable();
      table.integer('amount').notNullable();
      table.string('status', 255).notNullable();
      table.date('date').notNullable();
    })
    .createTable('customers', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable();
      table.string('image_url', 255).notNullable();
    })
    .createTable('revenue', (table) => {
      table.string('month', 4).primary().notNullable().unique();
      table.integer('revenue').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('invoices')
    .dropTable('customers')
    .dropTable('revenue')
    .dropExtension('uuid-ossp');
};
