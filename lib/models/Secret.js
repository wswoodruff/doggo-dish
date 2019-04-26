'use strict';

const Joi = require('joi');
const { Model, ...Helpers } = require('./helpers');
const FileModel = require('./File');

module.exports = class Secret extends Model {

    static get tableName() {

        return 'Secrets';
    }

    static get joiSchema() {

        return Joi.object({
            // General
            id: Model.schema.numericId,
            fileId: FileModel.field('id'),
            contents: Joi.string(),
            name: Joi.string().required(),
            type: Joi.string().valid(module.exports.TYPES).allow(null),
            // Timestamps
            createdAt: Model.schema.timestamp,
            updatedAt: Model.schema.timestamp
        })
            .or('fileId', 'contents');
    }

    static get relationMappings() {

        const File = require('./File');

        return {
            file: {
                relation: Model.HasOneRelation,
                modelClass: File,
                join: {
                    from: 'Secrets.fileId',
                    to: 'Files.id'
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

module.exports.TYPES = Helpers.makeConstants({
    DOG_TAG: 'dog-tag',
    FILE: 'file'
});
