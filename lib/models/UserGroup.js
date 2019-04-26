'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class UserGroup extends Model {

    static get tableName() {

        return 'UserGroups';
    }

    static get idColumn() {

        return ['userId', 'groupId'];
    }

    static get joiSchema() {

        return Joi.object({
            userId: Model.schema.numericId.required(),
            groupId: Model.schema.numericId.required(),
            role: Joi.string()
        });
    }

    static get relationMappings() {

        const Group = require('./Group');

        return {
            group: {
                relation: Model.HasOneRelation,
                modelClass: Group,
                join: {
                    from: 'UserGroups.groupId',
                    to: 'Groups.id'
                }
            }
        };
    }
};
