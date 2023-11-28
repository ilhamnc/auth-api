'use strict';
const Hapi = require('@hapi/hapi');
const registerUser = require('./src/api/registrasi/register');
const loginUser = require('./src/api/login/login');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  // Define routes for registration and login
  server.route([
    { method: 'POST', path: '/register', handler: registerUser },
    { method: 'POST', path: '/login', handler: loginUser },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();