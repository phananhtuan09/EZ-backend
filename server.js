const app = require("./app");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const server = app.listen(process.env.SERVER_PORT || 3500, () => {
  console.log(`Server is working on port ${process.env.SERVER_PORT}`);
  console.log(
    `To testing api visit link:http://localhost:${process.env.SERVER_PORT}/swagger`
  );
});

server.setTimeout(50000);

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
