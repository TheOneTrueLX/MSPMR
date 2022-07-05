/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .alterTable('users', function (table) {
    table.dropColumn('expires_in');
    table.datetime('expires_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .alterTable('users', function (table) {
    table.dropColumn('expires_at');
    table.integer('expires_in').unsigned();
  })
};
