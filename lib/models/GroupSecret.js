'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class GroupSecret extends Model {

    static get tableName() {

        return 'GroupSecrets';
    }

    static get joiSchema() {

        return Joi.object({
            id: Model.schema.numericId.required(),
            groupId: Model.schema.numericId.required(),
            secretId: Model.schema.numericId.required(),
            // A whitelist of roles that have access to this secret
            // If unspecified, everyone in the group has access
            accessRoles: Joi.array().items(Joi.string())
        });
    }
};
