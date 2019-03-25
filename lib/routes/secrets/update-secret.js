'use strict';

module.exports = {
    method: 'post',
    path: '/secrets',
    options: {
        handler: async (request, h) => {

            return 'oooya';
        }
    }
};
