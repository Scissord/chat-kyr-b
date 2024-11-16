import knex from './knex.js';

const db = knex();

export const get = async function () {
  return await db('instance').select('*')
};

export const findByBuyerPhone = async function (buyer_phone) {
  return await db('instance')
    .select('*')
    .where('buyer_phone', buyer_phone)
    .first();
};
