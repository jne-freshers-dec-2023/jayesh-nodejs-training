const express = require("express");

const app = express();
const PORT = 3333;

app.use("/", (req, res, next) => {
    console.log("Middleware always running!");
    res.send("<h2>hello</h2>");
  });

app.use("/add-user", (req, res, next) => {
  console.log("In the middlware-add-users");
  res.send("<h1>These are the users!</h1>");
});

app.use("/", (req, res, next) => {
  console.log("In the middlware-root");
  res.send("<h1>Hello from Express JS!</h1>");
});


app.listen(PORT, () => {
  console.log("Server is linstenning on port : 3333");
});
