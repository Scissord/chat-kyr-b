/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('card_item', (table) => {
      table.bigIncrements("id").primary();
      table.bigInteger('card_id').notNullable();
      table.bigInteger('product_id').notNullable();
      table.tinyint('progress').defaultTo(1);

      table.timestamp("deleted_at").defaultTo(null);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTable('card_item');
};
