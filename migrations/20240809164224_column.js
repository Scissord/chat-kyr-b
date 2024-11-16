/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('column', (table) => {
      table.bigIncrements('id').primary()
      table.string('title').notNullable();
      table.specificType('cards_ids', 'TEXT[]').defaultTo(knex.raw('ARRAY[]::TEXT[]'));
      table.integer('position').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('column');
};
