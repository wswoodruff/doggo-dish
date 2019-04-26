'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class GroupRole extends Model {

    static get tableName() {

        return 'GroupRoles';
    }

    static get idColumn() {

        return ['groupId', 'role'];
    }

    static get joiSchema() {

        return Joi.object({
            groupId: Model.schema.numericId.required(),
            role: Joi.string()
        });
    }
};
