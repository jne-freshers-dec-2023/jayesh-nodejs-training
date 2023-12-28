const express = require("express");
const app = express();
const route = express.Router();

// app level
// route level
// error handling

const checkOnReqAge = (req, resp, next) => {
  if (!req.query.age) {
    resp.send("Please provide age.");
  } else if (req.query.age < 18) {
    resp.send("You cannot access this page.");
  } else {
    req.Username = "Jayesh";
    console.log("Hello from middleware 1");
    next();
  }
};

const middleware2 = (req, resp, next) => {
  console.log("Hello from middleware 2 ", req.Username);
  next();
};

const fakeAuth = (req, res, next) => {
  const authStatus = false;
  if (authStatus) {
    console.log("User authStatus : ", authStatus);
    next();
  } else {
    res.status(401);
    throw new Error("User is not authorized");
  }
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  switch (statusCode) {
    case 401:
      res.json({
        message: "Unauthorized",
      });
      break;
    case 404:
      res.json({
        message: "Not Found",
      });
      break;
    case 500:
      res.json({
        message: "Server Error",
      });
      break;
    default:
      break;
  }
};

// app.use(reqFilter)
// app.use(middleware2)

route.use(checkOnReqAge);
route.use(middleware2);
route.use(fakeAuth);
route.use(errorHandler);

app.use("/", route);

route.get("/", (req, res) => {
  res.send("Welcome to the Home page.");
  console.log("from Home page ", req.Username);
});

route.get("/about", (req, res) => {
  res.send("Welcome to the about page.");
  console.log("from About page ", req.Username);
});

app.get("/about-req-check", reqFilter, (req, res) => {
  res.send("Welcome to the about page.");
  console.log("from about page ", req.Username);
});

// This is the helper function
app.get("/help", (req, res) => {
  res.send("Welcome to the Help page.");
  console.log("from Help page ", req.Username);
});

app.listen(3000, () => {
  console.log("server is listening on port : 3000");
});
