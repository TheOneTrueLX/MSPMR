/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
      table.bigint('redeem_id').after('submitter');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema
    .alterTable('videos', function (table) {
        table.dropColumn('redeem_id');
    });
  };
  