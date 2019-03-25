'use strict';

exports.up = async (knex) => {

    await knex.schema
        .createTable('Users', (table) => {

            table.increments('id').primary();
            table.specificType('email', 'citext').notNullable().unique();
            table.binary('password');
            table.binary('resetToken');
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
            table.timestamp('lastLoginAt');
        })
        .createTable('Tokens', (table) => {

            table.string('id').primary();
            table.integer('userId')
                .references('id')
                .inTable('Users')
                .onDelete('CASCADE');
            table.timestamp('createdAt');
        });
};

exports.down = async (knex) => {

    // This code gets run outside of lab's view, so doesn't get counted in coverage
    // $lab:coverage:off$
    await knex.schema.dropTable('Tokens')
        .dropTable('Users');
    // $lab:coverage:on$
};
