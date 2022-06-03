/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .alterTable('users', function (table) {
        table.boolean('beta_authorized').defaultTo(false)
        table.boolean('eula_accepted').defaultTo(false)
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
    .alterTable('users', function (table) {
        table.dropColumn('eula_accepted');
        table.dropColumn('beta_authorized');
    })
  };