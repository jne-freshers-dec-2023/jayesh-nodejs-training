const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.get("/set-cookies", (req, res) => {
  res.setHeader("set-cookie", "isLoggedIn=true");
  res.send("<h1>Cookies is set.</h1>");
});

app.get("/get-cookies", (req, res) => {});

app.get("/del-cookies", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is listning on port ", 3000);
});
