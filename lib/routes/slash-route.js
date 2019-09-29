'use strict';

module.exports = {
    method: 'get',
    path: '/',
    handler: (request, h) => ({ ping: `pong ${Date.now()}` })
};
