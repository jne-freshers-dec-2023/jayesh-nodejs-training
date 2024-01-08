const express = require("express");

const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: "secret-key",
    saveUninitialized: false,
    resave: false,
  })
);

const user = {
  name: "Jayesh",
  Roll_number: 43,
  Address: "Pune",
};

app.post("/login", (req, res) => {
  req.session.user = "jayesh";
  req.session.save();
  return res.send("Your are logged in");
});

app.get("/user", (req, res) => {
  console.log("req", req);
  const sessionuser = req.session.user;
  console.log(sessionuser);
  res.send(sessionuser);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Your are logged out ");
});

app.listen(3001, () => {
  console.log("Server is listning on port ", 3001);
});
