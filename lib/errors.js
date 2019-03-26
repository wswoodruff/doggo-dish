'use strict';

const internals = {};

internals.Error = class extends Error {
    constructor(...args) {

        super(...args);

        this.name = this.constructor.name;
    }
};

exports.TransactionRollback = class TransactionRollback extends internals.Error {};
