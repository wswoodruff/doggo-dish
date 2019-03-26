'use strict';

exports.up = async (knex) => {

    await knex.schema
        .createTable('Files', (table) => {

            table.string('id').primary();
            table.string('name');
            table.string('etag');
            table.integer('size');
            table.string('extension');
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
        })
        .createTable('Secrets', (table) => {

            table.increments('id').primary();
            table.string('fileId')
                .references('id')
                .inTable('Files');
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
        });
};

exports.down = async (knex) => {

    await knex.schema
        .dropTable('Secrets')
        .dropTable('Files');
};