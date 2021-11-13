const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Function to verified token that can be use in other API
module.exports = function auth(req, res, next) {
  const token = req.header("authorization");
  if (!token) {
    res.status(401).send({
      success: false,
      message: "No Token Found",
    });
  }
  try {
    const privateKey = require("../config/db.config").key;
    const verified = jwt.verify(token, privateKey);
    console.log("verified", verified);
    // Get User Details
    User.find({ email: verified.email })
      .then((data) => {
        req.auth = data;
        console.log("req.auth", req.auth);
        next();
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred",
        });
      });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: "Invalid Token",
    });
  }
};
