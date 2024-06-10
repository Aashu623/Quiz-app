const app = require("./app");
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database')

// Handling UncaughtException.
process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exceptions`);
    process.exit(1);
})

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: 'server/config/config.env' })
}

//connecting to database
connectDatabase();

//starting the server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});

//Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});
