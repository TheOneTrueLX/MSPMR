/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
        table.bigint('id').primary().unsigned().notNullable();
        table.string('username', 65).notNullable().unique();
        table.string('profile_image', 128).notNullable();
        table.string('email', 65).notNullable().unique();
        table.string('access_token', 128);
        table.string('refresh_token', 128);
        table.integer('expires_in').unsigned();
        table.timestamps(true, true);
    })
    .createTable('channels', function (table) {
        table.bigIncrements('id').primary().unsigned().notNullable();
        table.bigint('owner_id').notNullable().unsigned();
        table.foreign('owner_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
        table.timestamps(true, true);
    })
    .createTable('users_channels', function (table) {
        table.bigint('users_id').unsigned().notNullable();
        table.foreign('users_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
        table.bigint('channels_id').unsigned().notNullable();
        table.foreign('channels_id').references('channels.id').onDelete('CASCADE').onUpdate('CASCADE');
        table.primary(['users_id','channels_id']);
    })
    .createTable('blacklisted_submitters', function (table) {
        table.bigIncrements('id').unsigned().notNullable().primary();
        table.bigint('channels_id').unsigned();
        table.foreign('channels_id').references('channels.id').onDelete('SET NULL').onUpdate('CASCADE');
        table.string('submitter', 65).notNullable();
        table.tinyint('global').unsigned().notNullable().defaultTo(0);
    })
    .createTable('videos', function (table) {
        table.bigIncrements('id').unsigned().notNullable().primary();
        table.bigint('channels_id').unsigned().notNullable();
        table.foreign('channels_id').references('channels.id').onDelete('CASCADE').onUpdate('CASCADE');
        table.string('submitter', 65);
        table.string('service_type', 45);
        table.string('video_url', 200);
        table.integer('duration').unsigned();
        table.tinyint('copyright');
        table.tinyint('played').defaultTo(0);
        table.tinyint('blacklisted').defaultTo(0);
        table.timestamps(true, true);
    });      
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .alterTable('videos', function (table) {
            table.dropForeign('channels_id');
        })
        .alterTable('blacklisted_submitters', function (table) {
            table.dropForeign('channels_id');
        })
        .alterTable('users_channels', function (table) {
            table.dropForeign('channels_id');
            table.dropForeign('users_id');
        })
        .alterTable('channels', function (table) {
            table.dropForeign('owner_id');
        })
        .dropTable('videos')
        .dropTable('blacklisted_submitters')
        .dropTable('users_channels')
        .dropTable('channels')
        .dropTable('users');
};
