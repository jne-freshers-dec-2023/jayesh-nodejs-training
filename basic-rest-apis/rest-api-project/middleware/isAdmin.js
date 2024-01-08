
module.exports = (req, res, next) => {
  const role = req.userRole;
  const userid = req.userId
  console.log("User Role ", role);
  console.log("User id ", userid);
  if (role === "admin") {
    return next();
  } else {
    const error = new Error("Not Authenticated.");
    error.status = 401;
    throw error;
  }
};
