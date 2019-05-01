'use strict';

const Path = require('path');
const Schmervice = require('schmervice');
const Uuid = require('uuid');

module.exports = class FileService extends Schmervice.Service {

    async upload(stream, fileId, txn) {

        const { awsService } = this.server.services();

        const { Key: uploadedFileId } = await awsService.upload(fileId || Uuid.v4(), stream);

        return uploadedFileId;
    }

    async insertWithMetadata(fileId, txn) {

        const { awsService } = this.server.services();
        const { File } = this.server.models();

        const { ETag, ContentLength, LastModified } = await awsService.getMetadata(fileId);

        await File.query(txn)
            .insert({
                id: fileId,
                etag: ETag.replace(/"/g, ''),
                createdAt: LastModified && LastModified.toISOString(),
                size: ContentLength
            });
    }

    async findById(id, txn) {

        const { File } = this.server.models();

        return await File.query(txn).findById(id).throwIfNotFound();
    }

    async deleteById(id, txn) {

        const { awsService } = this.server.services();
        const { File } = this.server.models();

        await File.query(txn).deleteById(id);

        return await awsService.deleteById(id);
    }

    getLinkForFile(id) {

        return `https://${this.options.aws.s3bucket}.s3.amazonaws.com/${id}`;
    }
};
