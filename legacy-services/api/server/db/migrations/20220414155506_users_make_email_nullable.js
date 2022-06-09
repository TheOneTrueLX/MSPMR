/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// Whenever a new user "signs up", we want to pre-seed the users table with
// that new user's moderators, so that they can do RBAC stuff.  For moderators,
// we leave their email field blank until they log in themselves through
// the Twitch oauth2 routine.  In order to do that, we need to make the email
// field in the users table nullable.
exports.up = function(knex) {
  return knex.schema
  .alterTable('users', function (table) {
    table.string('email', 65).nullable().alter();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .alterTable('users', function (table) {
    table.string('email', 65).notNullable().alter();
  })    
};
