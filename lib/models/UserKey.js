'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class UserKey extends Model {

    static get tableName() {

        return 'UserKeys';
    }

    static get idColumn() {

        return ['userId', 'secretId'];
    }

    static get joiSchema() {

        return Joi.object({
            userId: Model.schema.numericId.required(),
            secretId: Model.schema.numericId.required(),
            encryptedKey: Joi.string()
        });
    }

    static get relationMappings() {

        const Secret = require('./Secret');

        return {
            secret: {
                relation: Model.HasOneRelation,
                modelClass: Secret,
                join: {
                    from: 'UserKeys.secretId',
                    to: 'Secrets.id'
                }
            }
        };
    }
};
