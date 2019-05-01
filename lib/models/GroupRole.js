'use strict';

const Joi = require('joi');
const { Model, ...Helpers } = require('./helpers');

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
            role: Joi.string(),
            permissions: Joi.array().items(Joi.string().valid(GroupRole.PERMISSIONS)).required()
        });
    }
};

module.exports.PERMISSIONS = Helpers.makeConstants({
    ALL: 'all',
    READ: 'read',
    EDIT: 'edit',
    ADD: 'add',
    DELETE: 'delete'
});
