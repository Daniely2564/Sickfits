require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");
const jwt = require("jsonwebtoken");

const server = createServer();

// use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// use express middleware to populate current user
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId on the req to access
    req.userId = userId;
  }
  next();
});

// create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in skip,
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, permissions, email, name }"
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log("The server is now running on port ", deets.port);
  }
);
