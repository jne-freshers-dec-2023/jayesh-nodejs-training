const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.get("/set-cookies", (req, res) => {
  // res.setHeader("set-cookie", "isLoggedIn=true");
  res.cookie("isLoggedIn", true);
  res.cookie("userId", 12315, {
    // maxAge : 5000,
    expires: new Date("6 Jan 2024"),
    httpOnly: true,
    secure: true,
  });

  res.send("<h1>Cookies is set.</h1>");
});

app.get("/get-cookies", (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

app.get("/del-cookies", (req, res) => {
  res.clearCookie("userId");
  res.send(req.cookies);
});

app.listen(3000, () => {
  console.log("Server is listning on port ", 3000);
});
