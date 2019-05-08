'use strict';

const Joi = require('joi');
const { Model, ...Helpers } = require('./helpers');

module.exports = class UserSecret extends Model {

    static get tableName() {

        return 'UserSecrets';
    }

    static get idColumn() {

        return ['userId', 'secretId'];
    }

    static get joiSchema() {

        const { ROLES, PERMISSIONS } = UserSecret;

        return Joi.object({
            userId: Model.schema.numericId.required(),
            secretId: Model.schema.numericId.required(),
            role: Joi.string().valid(ROLES),
            permission: Joi.string().valid(PERMISSIONS)
        });
    }

    static get relationMappings() {

        const Secret = require('./Secret');

        return {
            secret: {
                relation: Model.HasOneRelation,
                modelClass: Secret,
                join: {
                    from: 'UserSecrets.secretId',
                    to: 'Secrets.id'
                }
            }
        };
    }
};

module.exports.ROLES = Helpers.makeConstants({
    OWNER: 'owner',
    SHAREE: 'sharee'
});

module.exports.PERMISSIONS = Helpers.makeConstants({
    READ: 'read',
    WRITE: 'write',
    ADMIN: 'admin'
});
