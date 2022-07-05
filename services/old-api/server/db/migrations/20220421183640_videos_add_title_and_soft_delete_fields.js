/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .alterTable('videos', function (table) {
    table.string('title', 250).after('channels_id');
    table.datetime('deleted_on').after('blacklisted');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .alterTable('videos', function (table) {
      table.dropColumn('deleted_on');
      table.dropColumn('title');
  });
};
