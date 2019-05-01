'use strict';

const Hoek = require('hoek');
const Schmervice = require('schmervice');

module.exports = class SecretService extends Schmervice.Service {

    async getByName(name, txn) {

        const { Secret } = this.server.models();

        return await Secret.query(txn)
            .where({ name })
            .first()
            .throwIfNotFound();
    }

    async listSecrets(userId, txn) {

        const { UserSecret } = this.server.models();

        return await UserSecret.query(txn)
            .where({ userId })
            .eager('secret')
            .map(({ secret }) => secret);
    }

    async create({ fileId, name, type }, txn) {

        const { Secret } = this.server.models();

        return await Secret.query(txn)
            .insert({ fileId, name, type })
            .returning('*');
    }

    async grantUserAccess(secretId, userId, txn) {

        const { UserSecret } = this.server.models();

        return await UserSecret.query(txn)
            .insert({ secretId, userId });
    }

    async _assertUserAccess(userId, criteria, txn) {

        const { UserSecret } = this.server.models();

        await UserSecret.query(txn)
            .where({ userId })
            .joinRelation('secret')
            .where(criteria)
            .throwIfNotFound();
    }
};
