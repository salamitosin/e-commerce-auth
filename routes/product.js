const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth_middleware = require("../middleware/verifytoken");

// Get ALl Product
router.get("/product", auth_middleware, (req, res) => {
  //console.log("All Users Route Connected");
  Product.find()
    .then((product) => {
      res.send({ message: "List All Product", data: product });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occured" });
    });
});

// Get Single Product
router.get("/product/:id", auth_middleware, (req, res) => {
  const id = req.params.id;
  Product.findOne({ _id: id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("No Product Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

//Add New Product
router.post("/product", auth_middleware, (req, res) => {
  //   console.log(req.body);
  //   const title = req.body.title;
  //   const description = req.body.description;
  //   const duration = req.body.duration;
  //   const price = req.body.price;
  //const { name, price, image } = req.body;

  // Create a Course Object
  const newProduct = new Product({
    name,
    price,
    image,
  });

  // Save Course in Database
  // Save Note in the database
  newProduct
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Edit Single Product
router.put("/product/:id", auth_middleware, (req, res) => {
  const id = req.params.id;
  Product.findOneAndUpdate({ _id: id }, req.body)
    .then((data) => {
      if (data) {
        res.send({ msg: "Product Updated", data });
      } else {
        res.send("No Product Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Delete Single Course
router.delete("/product/:id", auth_middleware, (req, res) => {
  const id = req.params.id;
  Product.findOneAndDelete({ _id: id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("No Data Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

module.exports = router;
