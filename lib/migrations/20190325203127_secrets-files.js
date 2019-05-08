'use strict';

const Helpers = require('../models/helpers');

exports.up = async (knex) => {

    const SECRET_TYPES = Helpers.makeConstants({
        DOG_TAG: 'dog-tag',
        FILE: 'file'
    });

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
            table.string('name').index();
            table.enum('type', SECRET_TYPES, {
                useNative: true,
                enumName: 'secret_type'
            });
            table.timestamp('createdAt');
            table.timestamp('updatedAt');
        });
};

exports.down = async (knex) => {

    await knex.schema
        .dropTable('Secrets')
        .dropTable('Files')
        .raw('drop type secret_type');
};
