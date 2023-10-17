const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "EliteZone API",
      version: "1.0.0",
      description: "API for EliteZone project",
    },
    basePath: "/",
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./swaggerYAML/*.js"], // files containing annotations as above
};

module.exports = swaggerOptions;
