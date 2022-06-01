/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
      table.integer('sort_index').nullable()
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
        table.dropColumn('sort_index')
    });
  };
  