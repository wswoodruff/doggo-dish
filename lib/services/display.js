'use strict';

const Schmervice = require('schmervice');

const internals = {};

module.exports = class DisplayService extends Schmervice.Service {

    async userBasic(users, txn) {

        const { toUserBasic } = DisplayService;
        const { mapResults } = internals;

        return mapResults(users, toUserBasic);
    }

    async fileBasic(files, txn) {

        const { toFileBasic } = DisplayService;
        const { mapResults } = internals;

        return mapResults(files, toFileBasic);
    }

    async secretBasic(secrets, txn) {

        const { toSecretBasic } = DisplayService;
        const { mapResults } = internals;

        return mapResults(secrets, toSecretBasic);
    }

    static toUserBasic(user) {

        const {
            id,
            email,
            createdAt,
            updatedAt,
            lastLoginAt
        } = user;

        return {
            id,
            email,
            createdAt,
            updatedAt,
            lastLoginAt
        };
    }

    static toFileBasic(file) {

        const {
            id,
            name,
            extension
        } = file;

        return {
            id,
            name,
            extension
        };
    }

    static toSecretBasic(secret) {

        const {
            name,
            updatedAt
        } = secret;

        return {
            name,
            updatedAt
        };
    }
};

internals.mapResults = (results, mapFunc) => {

    return Array.isArray(results) ? results.map(mapFunc) : mapFunc(results);
};
