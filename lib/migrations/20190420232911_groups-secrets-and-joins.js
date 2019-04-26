'use strict';

const Secret = require('../models/Secret');

exports.up = async (knex) => {

    await knex.schema
        .createTable('Groups', (table) => {

            table.increments('id').primary();

            table.integer('ownerId')
                .references('id')
                .inTable('Users')
                .onDelete('CASCADE');

            table.timestamp('createdAt');
            table.timestamp('updatedAt');

            table.index('ownerId');
        })
        .createTable('UserSecrets', (table) => {

            table.integer('userId')
                .references('id')
                .inTable('Users')
                .onDelete('CASCADE');

            table.integer('secretId')
                .references('id')
                .inTable('Secrets')
                .onDelete('CASCADE');

            table.index(['userId', 'secretId']);
        })
        .createTable('UserGroups', (table) => {

            table.integer('userId')
                .references('id')
                .inTable('Users')
                .onDelete('CASCADE');

            table.integer('groupId')
                .references('id')
                .inTable('Groups')
                .onDelete('CASCADE');

            table.string('role');

            table.index(['userId', 'groupId']);
            table.index('role');
        })
        .createTable('GroupSecrets', (table) => {

            table.increments('id').primary();

            table.integer('groupId')
                .references('id')
                .inTable('Groups')
                .onDelete('CASCADE');

            table.integer('secretId')
                .references('id')
                .inTable('Secrets')
                .onDelete('CASCADE');

            table.specificType('accessRoles', 'text[]')
                .index(null, 'gin');

            table.index(['groupId', 'secretId']);
        })
        .createTable('GroupRoles', (table) => {

            table.integer('groupId')
                .references('id')
                .inTable('Groups')
                .onDelete('CASCADE');

            table.string('role').index();
        })
        .createTable('UserKeys', (table) => {

            table.integer('userId')
                .references('id')
                .inTable('Users')
                .onDelete('CASCADE');

            table.integer('secretId')
                .references('id')
                .inTable('Secrets')
                .onDelete('CASCADE');

            table.text('encryptedKey');

            table.index(['userId', 'secretId']);
        });
};

exports.down = async (knex) => {

    await knex.schema
        .dropTable('UserKeys')
        .dropTable('UserSecrets')
        .dropTable('UserGroups')
        .dropTable('GroupSecrets')
        .dropTable('GroupRoles')

        // Groups must be last because some of these others
        // depend on it
        .dropTable('Groups');
};
