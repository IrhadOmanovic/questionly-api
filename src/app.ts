require('dotenv').config();
import Fastify from 'fastify';
// import fastifyRawBody from 'fastify-raw-body';
// import fastifyFormBody from '@fastify/formbody';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
// import fastifyBasicAuth from '@fastify/basic-auth';
import cors from '@fastify/cors';
// import fastifyMultipart from '@fastify/multipart';
import fastifyCookie from '@fastify/cookie';

import { openApiOptions, openApiUiOptions } from './openApi';
import { UserModule, QuestionModule, AnswerModule, RatingModule, AuthModule } from './modules';
import rootRoutes from './modules/routes';

import { authMiddleware } from './modules/auth/middlewares/auth.middleware';

const startApp = async () => {
  console.log('Starting the server...');

  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: ['http://localhost:3001', 'https://dev.heartbeat.mop.ba', 'https://heartbeat.mop.ba'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  await fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'questionly_secret',
  });

  // await fastify.register(fastifyFormBody);
  // await fastify.register(fastifyMultipart);
  await fastify.register(fastifySwagger, openApiOptions);

  // await fastify.register(fastifyBasicAuth, {
  //   validate: async (username, password, _req, _reply, done) => {
  //     if (
  //       username === process.env.BASIC_AUTH_USERNAME &&
  //       password === process.env.BASIC_AUTH_PASSWORD
  //     ) {
  //       done();
  //     } else {
  //       done(new Error('Access denied'));
  //     }
  //   },
  //   authenticate: true,
  // });

  // Protect the documentation with basic auth
  await fastify.register(fastifySwaggerUi, {
    ...openApiUiOptions,
    uiHooks: {
      // onRequest: fastify.basicAuth,
    },
  });

  // Added to handle verification of Slack requests
  // await fastify.register(fastifyRawBody, {
  //   field: 'rawBody', // change the default request.rawBody property name
  //   global: false, // add the rawBody to every request. **Default true**
  //   encoding: 'utf8', // set it to false to set rawBody as a Buffer **Default utf8**
  //   runFirst: true, // get the body before any preParsing hook change/uncompress it. **Default false**
  //   routes: ['/feedback/slack/interactive-endpoint'], // array of routes, **`global`** will be ignored, wildcard routes not supported
  //   jsonContentTypes: [], // array of content-types to handle as JSON. **Default ['application/json']**
  // });

  // Register modules
  await fastify.register(rootRoutes);
  await fastify.register(UserModule, { prefix: '/user' });
  await fastify.register(QuestionModule, { prefix: '/question' });
  await fastify.register(AnswerModule, { prefix: '/answer' });
  await fastify.register(RatingModule, { prefix: '/rating' });
  await fastify.register(AuthModule, { prefix: '/auth' });

  // Register middleware for protected routes
  fastify.addHook('onRequest', async (req, reply) => {
    const openRoutes = ['/auth'];
    const isProtected = !openRoutes.some((route) => req.routerPath?.startsWith(route));

    if (isProtected) {
      await authMiddleware(req, reply);
    }
  });

  // Run the server
  // Add host: '0.0.0.0' to run Fastify on Docker - by default it will run on the address 127.0.0.1 which is not reachable from outside
  fastify.listen({ port: +(process.env.PORT || 3000), host: '0.0.0.0' }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

startApp();
