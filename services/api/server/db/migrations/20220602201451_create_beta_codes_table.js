/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('beta_codes', function (table) {
        table.bigIncrements('id').primary().unsigned().notNullable();
        table.bigint('users_id').notNullable().unsigned()
        table.foreign('users_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
        table.string('beta_key', 64).notNullable()
        table.datetime('expires_at').notNullable().defaultTo(knex.raw('(CURRENT_TIMESTAMP + INTERVAL 10 DAY)'))
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable('beta_codes', function (table) {
        table.dropForeign('users_id');
    })
    .dropTable('beta_codes')
};
