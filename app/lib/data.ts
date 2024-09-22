import knex from '@/knex';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  noStore();

  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await knex('revenue').select('*');

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const data = await knex('invoices')
      .select(
        'invoices.amount',
        'customers.name',
        'customers.image_url',
        'customers.email',
        'invoices.id',
      )
      .join('customers', 'invoices.customer_id', '=', 'customers.id')
      .orderBy('invoices.date', 'desc')
      .limit(5);

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      knex('invoices').count('* as count'),
      knex('customers').count('* as count'),
      knex('invoices')
        .select(
          knex.raw(
            "SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid",
          ),
          knex.raw(
            "SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending",
          ),
        )
        .first(),
    ]);

    const numberOfInvoices = Number(invoiceCount[0].count);
    const numberOfCustomers = Number(customerCount[0].count);
    const totalPaidInvoices = formatCurrency(invoiceStatus.paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatus.pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await knex('invoices')
      .select(
        'invoices.id',
        'invoices.amount',
        'invoices.date',
        'invoices.status',
        'customers.name',
        'customers.email',
        'customers.image_url',
      )
      .join('customers', 'invoices.customer_id', '=', 'customers.id')
      .whereRaw(
        'customers.name ILIKE ? OR customers.email ILIKE ? OR invoices.amount::text ILIKE ? OR invoices.date::text ILIKE ? OR invoices.status ILIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
      )
      .orderBy('invoices.date', 'desc')
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const count = await knex('invoices')
      .join('customers', 'invoices.customer_id', '=', 'customers.id')
      .whereRaw(
        'customers.name ILIKE ? OR customers.email ILIKE ? OR invoices.amount::text ILIKE ? OR invoices.date::text ILIKE ? OR invoices.status ILIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
      )
      .count('* as count')
      .first();

    const totalPages = Math.ceil(Number(count?.count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    const data = await knex('invoices')
      .select(
        'invoices.id',
        'invoices.customer_id',
        'invoices.amount',
        'invoices.status',
      )
      .where('invoices.id', id)
      .first();

    const invoice = {
      ...data,
      amount: data.amount / 100,
    };

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();

  try {
    const data = await knex('customers')
      .select('id', 'name')
      .orderBy('name', 'asc');

    const customers = data;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();

  try {
    const data = await knex('customers')
      .select(
        'customers.id',
        'customers.name',
        'customers.email',
        'customers.image_url',
        knex.raw('COUNT(invoices.id) AS total_invoices'),
        knex.raw(
          "SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending",
        ),
        knex.raw(
          "SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid",
        ),
      )
      .leftJoin('invoices', 'customers.id', '=', 'invoices.customer_id')
      .whereRaw('customers.name ILIKE ? OR customers.email ILIKE ?', [
        `%${query}%`,
        `%${query}%`,
      ])
      .groupBy(
        'customers.id',
        'customers.name',
        'customers.email',
        'customers.image_url',
      )
      .orderBy('customers.name', 'asc');

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  noStore();

  try {
    const user = (await knex('users').where('email', email).first()) as User;
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
