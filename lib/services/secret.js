'use strict';

const Hoek = require('hoek');
const Schmervice = require('schmervice');

module.exports = class SecretService extends Schmervice.Service {

    async getByName(name) {

        const { Secret } = this.server.models();

        return await Secret.query()
            .where({ name })
            .throwIfNotFound()
    }

    async _assertUserAccess(userId, criteria, txn) {

        const { UserSecret } = this.server.models();

        const userSecretAccess = await UserSecret.query()
            .where({ userId })
            .joinRelation('secret')
            .where({ ...criteria })
            .throwIfNotFound()

        return userSecretAccess;
    }
};
