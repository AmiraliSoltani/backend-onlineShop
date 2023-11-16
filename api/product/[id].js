// api/products.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// Import your Mongoose model

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

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

app.use(async (req, res, next) => {
  if (req.method === "GET") {
    const productId = req.query.id;
    console.log(req.method);
    console.log("hiiiiiiiii");

    try {
      const foundProduct = await Product.findById(productId);
      if (foundProduct) {
        res.send(foundProduct);
      } else {
        res.status(404).send(`Product with ID not found`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error while fetching product");
    }
  } else if (req.method === "PATCH") {
    console.log("heeeeeeeeeee");
    console.log(req.body);

    const productId = req.query.id;
    const { vote, memberName, data, srcOfAvatar } = req.body;
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
});

module.exports = app;

// // api/products/[id].js
// async (req, res) => {
//   if (req.method == "GET") {
//     const productId = req.query.id;
//     console.log(req.method);
//     console.log("hiiiiiiiii");

//     try {
//       const foundProduct = await Product.findById(productId);
//       if (foundProduct) {
//         res.send(foundProduct);
//       } else {
//         res.status(404).send(`Product with ID not found`);
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error while fetching product");
//     }
//   } else if (req.method == "PATCH") {
//     console.log("heeeeeeeeeee");
//     console.log(req.body);

//     const productId = req.query.id;
//     const { vote, memberName, data, srcOfAvatar } = req.body;
//     console.log(req.body.memberName);
//     console.log("shttttttttttt");
//     l;
//     console.log(req.body.srcOfAvatar);

//     try {
//       const foundProduct = await Product.findById(productId);
//       if (foundProduct) {
//         // Add a new comment to the beginning of the product's comments array
//         foundProduct.comments.unshift({
//           vote: vote,
//           memberName: memberName,
//           date: {
//             day: new Date().getDate(),
//             month: new Date().getMonth() + 1,
//             year: new Date().getFullYear(),
//           },
//           srcOfAvatar: srcOfAvatar,
//           data: {
//             title: data.title,
//             body: data.body,
//           },
//         });

//         // Save the updated product with the new comment
//         const updatedProduct = await foundProduct.save();
//         res.status(200).send(updatedProduct);
//       } else {
//         res.status(404).send(`Product with ID ${productId} not found`);
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error while updating product");
//     }
//   } else {
//     res.status(405).send("Method Not Allowed");
//   }
// };
// module.exports = app;
