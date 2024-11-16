import knex from './knex.js';

const db = knex();

export const get = async function () {
  return await db('user').select('*')
};

export const getForChats = async function (role_id, role_id2) {
  return await db('user')
    .select('*')
    .where('role', role_id)
    .orWhere('role', role_id2)
};

export const create = async function (data) {
  const [user] = await db("user")
    .insert(data)
    .returning("id")

  data.id = user.id;
  return data;
};

export const update = async function (id, data) {
  return await db('user')
    .update(data)
    .where('id', id)
};

export const isExist = async function (name, phone) {
  return await db('user')
    .select('*')
    .where('name', name)
    .orWhere('phone', phone)
    .first();
};

export const find = async function (id) {
  return await db('user')
   .select('*')
   .where('id', id)
   .first();
};

export const findByName = async function (name) {
  return await db('user')
    .select('*')
    .where('name', name)
    .first();
};

export const destroy = async function (id) {
  await db("user")
    .del()
    .where("id", id)
};
