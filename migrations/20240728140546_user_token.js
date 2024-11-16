/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function(knex) {
  return knex.schema
    .createTable('user_token', (table) => {
      table.bigIncrements('id').primary();
      table.bigInteger('user_id').unsigned().notNullable();
      table.string('refresh_token', 255).notNullable();
      table.timestamp('expires_at').notNullable();

      // Установка внешнего ключа
      table.foreign('user_id')  // Определение внешнего ключа для user_id
        .references('id')  // Внешний ключ ссылается на столбец id
        .inTable('user')  // В таблице user
        .onDelete('CASCADE');  // При удалении пользователя все его токены также будут удалены
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function(knex) {
  return knex.schema.dropTableIfExists('user_token');
};
