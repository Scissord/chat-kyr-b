/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('user', (table) => {
      table.bigIncrements('id').primary();
      table.string('name', 50).notNullable();
      table.string('phone', 15).notNullable();
      table.string('email', 50).nullable();
      table.string('password', 255).notNullable();
      table.tinyint('gender').notNullable();
      table.string('avatar', 255).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.timestamp('deleted_at').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('user');
};
