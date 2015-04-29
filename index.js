var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ host: 'localhost',port: 3003 });

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

server.register([
  {
    register: require('markdown'),
    options: {} // options for 'markdown'
  }
], function (err) {
  if (err) {
    console.error('Failed to load a plugin:', err);
  }
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});