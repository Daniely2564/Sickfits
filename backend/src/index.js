require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();


// use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, deets => {
    console.log('The server is now running on port ', deets.port);
})