// api/products.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("micro-cors")({
  allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
  origin: "http://localhost:3000", // Replace with the origin of your React app
});
// Import your Mongoose model

// Import your Mongoose model

mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
);
const productSchema = new mongoose.Schema({
  title: String,
  _id: Number,
  comments: [
    {
      vote: Number,
      memberName: String,
      date: {
        day: Number,
        month: Number,
        year: Number,
      },
      srcOfAvatar: Number,
      data: {
        title: String,
        body: String,
      },
    },
  ],
  title_En: String,
  description: String,
  price: Number,
  off: String,
  offerTime: String,
  categoryId: Number,
  categoryAttributes: [
    {
      id: String,
      items: [
        {
          id: Number,
          attItem: Number,
        },
      ],
      count: Number,
    },
  ],
  guarantee: {
    hasGuarantee: Boolean,
    guranteeDate: String,
    guranteeName: String,
  },
  productPic: {
    grey: String,
    grey2: String,
    grey3: String,
    grey4: String,
  },
  videoUrl: String,
  vote: Number,
  dailyRentalRate: [Number],
  visited: Number,
  sold: Number,
});
const Product = mongoose.model("products", productSchema);

async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const productId = req.query.id;
    console.log(req.method);
    console.log("hiiiiiiiii");

    try {
      const foundProduct = await Product.findById(productId);
      if (foundProduct) {
        // Increment the visited count by 1
        foundProduct.visited = (foundProduct.visited || 0) + 1;
        // Save the updated visited count
        await foundProduct.save();
        res.send(foundProduct);
      } else {
        res.status(404).send(`Product with ID not found`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error while fetching product");
    }
  } else if (req.method === "PATCH") {
    res.setHeader("Content-Type", "application/json"); // Set the content type if not set

    console.log("heeeeeeeeeee");
    console.log(req.body);
    //const bodyData = JSON.parse(req.body);

    const productId = req.query.id;
    const { vote, data, srcOfAvatar } = req.body;
    const memberName = "amir";
    console.log(memberName);
    console.log("shttttttttttt");
    console.log(srcOfAvatar);

    try {
      const foundProduct = await Product.findById(productId);
      if (foundProduct) {
        // Add a new comment to the beginning of the product's comments array
        foundProduct.comments.unshift({
          vote: vote,
          memberName: memberName,
          date: {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
          srcOfAvatar: srcOfAvatar,
          data: {
            title: data.title,
            body: data.body,
          },
        });

        // Save the updated product with the new comment
        const updatedProduct = await foundProduct.save();
        res.status(200).send(updatedProduct);
      } else {
        res.status(404).send(`Product with ID ${productId} not found`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error while updating product");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

const corsHandler = cors(handler);

// Apply CORS to the handler and export it
module.exports = corsHandler;
