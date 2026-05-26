const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Across Assist Vendor Management API',
      version: '1.0.0',
      description: 'Vendor Management Portal API Documentation',
    },

    servers: [
        {
          url: 'https://vendor-managment-r829.onrender.com/api',
          description: 'Production API'
        },
        {
          url: 'http://localhost:3000/api',
          description: 'Local Development'
        }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: [
    './src/modules/**/*.js'
  ]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;