const bcrypt = require('bcrypt');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('users').del();
  await knex('invoices').del();
  await knex('customers').del();
  await knex('revenue').del();

  // Seed users
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return knex('users').insert(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
        ['id'],
      );
    }),
  );
  console.log(`Seeded ${insertedUsers.length} users`);

  // Seed invoices
  const insertedInvoices = await Promise.all(
    invoices.map((invoice) =>
      knex('invoices').insert(
        {
          customer_id: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status,
          date: invoice.date,
        },
        ['id'],
      ),
    ),
  );
  console.log(`Seeded ${insertedInvoices.length} invoices`);

  // Seed customers
  const insertedCustomers = await Promise.all(
    customers.map((customer) =>
      knex('customers').insert(
        {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image_url: customer.image_url,
        },
        ['id'],
      ),
    ),
  );
  console.log(`Seeded ${insertedCustomers.length} customers`);

  // Seed revenue
  const insertedRevenue = await Promise.all(
    revenue.map((rev) =>
      knex('revenue').insert(
        {
          month: rev.month,
          revenue: rev.revenue,
        },
        ['month'],
      ),
    ),
  );
  console.log(`Seeded ${insertedRevenue.length} revenue`);
};
