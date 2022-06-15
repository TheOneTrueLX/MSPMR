/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
      table.boolean('age_restricted').notNullable().defaultTo(false)
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
        table.dropColumn('age_restricted')
    });
  };
  