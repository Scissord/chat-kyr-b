import knex from './knex.js';

const db = knex();

export const get = async function () {
  return await db('ai_integrations').select('*')
};

export const create = async function (data) {
  const [attachment] = await db("attachment")
    .insert(data)
    .returning("id")

  data.id = attachment.id;
  return data;
};
