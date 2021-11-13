const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

router.post("/auth/register", (req, res) => {
  console.log(req.body);
  const { email, password, name, gender, mobile } = req.body;
  // Create OTP Code
  const otpCode = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
    digits: true,
  });
  // Hash Password
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  // Create New User Object
  const newUser = new User({
    email: email,
    password: hash,
    name: name,
    gender: gender,
    mobile: mobile,
    otp: otpCode,
  });
  // Save User
  newUser
    .save()
    .then((data) => {
      res.send({ success: true, message: "New User Created", data: data });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

router.post("/auth/verify", (req, res) => {
  console.log(req.body);
  const { email, otp } = req.body;
  User.findOne({ email: email, otp: otp })
    .then((data) => {
      if (data) {
        // User Exists
        // Credentials are correct
        data.update({ otp: null, verified: true }).then((data2) => {
          res.send({
            success: true,
            message: "User has been verified",
            data: data2,
          });
        });
      } else {
        // User does not exist
        // Invalid Credentials
        res.send({
          success: false,
          message: "Incorrect Credentials",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const hash = User.findOne({ email: email })
    .then((data) => {
      if (data) {
        if (data.email.includes("yahoo.com")) {
          return res.status(400).send({
            success: false,
            message:
              "User with only Gmail is allowed to register on this platform",
          });
        }
        if (data.verified == false) {
          return res.status(400).send({
            success: false,
            message: "User is not verified",
          });
        }
        // User Exists
        // Compare Password with Hash
        console.log(data);
        bcrypt.compare(password, data.password, function (err, isValid) {
          if (isValid === true) {
            //Create and Assign token
            const privateKey = require("../config/db.config").key;
            const token = jwt.sign({ email: data.email }, privateKey);
            //res.header("auth-token", token).send(token);
            //res.send({ success: "Logged in" });
            // Password is correct
            res.send({
              success: true,
              message: "Password is Correct",
              token: token,
              data: data,
            });
          } else {
            // Invalid Password
            console.log(err);
            res.status(400).send({
              success: false,
              message: "Invalid Password",
            });
          }
        });
      } else {
        // User does not exist
        res.status(404).send({
          success: false,
          message: "User does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

module.exports = router;
