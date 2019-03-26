'use strict';

const Path = require('path');
const Schmervice = require('schmervice');
const Uuid = require('uuid');

module.exports = class FileService extends Schmervice.Service {

    async upload(stream, filename, txn) {

        const { awsService } = this.server.services();
        const { File } = this.server.models();

        const { Key: fileId } = await awsService.upload(Uuid.v4(), stream);
        const { ETag, ContentLength, LastModified } = await awsService.getMetadata(fileId);
        const extension = Path.extname(filename);

        await File.query(txn)
            .insert({
                id: fileId,
                extension: extension.slice(1),
                name: Path.basename(filename, extension),
                etag: ETag.replace(/"/g, ''),
                createdAt: LastModified && LastModified.toISOString(),
                size: ContentLength
            });

        return fileId;
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
