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

        return toFileBasic(users, toFileBasic);
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
};

internals.mapResults = (results, mapFunc) => {

    return Array.isArray(results) ? results.map(mapFunc) : mapFunc(results);
};
