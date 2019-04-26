'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class UserSecret extends Model {

    static get tableName() {

        return 'UserSecrets';
    }

    static get idColumn() {

        return ['userId', 'secretId'];
    }

    static get joiSchema() {

        return Joi.object({
            userId: Model.schema.numericId.required(),
            secretId: Model.schema.numericId.required()
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
