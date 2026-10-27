import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevOps API',
      version: '1.0.0',
    },
  },
  apis: ['./docs/*.yml'],
};

const specs = swaggerJsdoc(options);

export default specs;
