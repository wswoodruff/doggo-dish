'use strict';

const Joi = require('joi');
const Hoek = require('hoek');

const { Model } = require('./helpers');

module.exports = class User extends Model {

    static get tableName() {

        return 'Users';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.numericId,
            email: Joi.string().email(),
            password: Joi.binary(),
            resetToken: Joi.binary().allow(null),
            // Key stuff
            fingerprint: Joi.string().max(40),
            publicKey: Joi.string(),
            // Timestamps
            createdAt: Model.schema.timestamp,
            updatedAt: Model.schema.timestamp,
            lastLoginAt: Model.schema.timestamp
        })
            .or('email', 'fingerprint');
    }

    static get relationMappings() {

        const Secret = require('./Secret');
        const Group = require('./Group');
        const UserSecret = require('./UserSecret');
        const UserGroup = require('./UserGroup');

        return {
            secrets: {
                relation: Model.ManyToManyRelation,
                modelClass: Secret,
                join: {
                    from: 'Users.id',
                    through: {
                        modelClass: UserSecret,
                        from: 'UserSecrets.userId',
                        to: 'UserSecrets.secretId'
                    },
                    to: 'Secrets.id'
                }
            },
            groups: {
                relation: Model.ManyToManyRelation,
                modelClass: Group,
                join: {
                    from: 'Users.id',
                    through: {
                        modelClass: UserGroup,
                        from: 'UserGroups.userId',
                        to: 'UserGroups.groupId'
                    },
                    to: 'Groups.id'
                }
            }
        };
    }

    $beforeInsert() {

        this.createdAt = this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {

        this.updatedAt = new Date().toISOString();
    }
};
