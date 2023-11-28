const Hapi = require('@hapi/hapi');
const registerHandler = require('./src/api/registrasi/register');
const loginHandler = require('./src/api/login/login');
const dashboardHandler = require('./src/api/login/dashboard');
const HapiJWT = require('@hapi/jwt');
const crypto = require('crypto');


const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
  });

  // Registrasi plugin JWT
  await server.register(HapiJWT);

  // Generate JWT secret key
  const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
  };

  // Menghasilkan kunci rahasia
  const secretKey = generateSecretKey();

  // Strategi autentikasi JWT
  server.auth.strategy('jwt', 'jwt', {
    keys: secretKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3600,
    },
    validate: async (decoded, request, h) => {
      return { isValid: true };
    }
  });

  // Endpoint registrasi
  server.route({
    method: 'POST',
    path: '/register',
    handler: registerHandler
  });

  // Endpoint login
  server.route({
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      auth: false // Tidak perlu autentikasi untuk endpoint ini
    }
  });

  // Endpoint dashboard
  server.route({
    method: 'GET',
    path: '/dashboard',
    handler: dashboardHandler,
    options: {
      auth: 'jwt' // Menggunakan strategi autentikasi jwt untuk endpoint ini
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();