const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the Product schema and model
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  title: String,
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
    type: Map,
    of: String,
  },
  videoUrl: String,
  vote: Number,
  dailyRentalRate: [Number],
  visited: Number,
  sold: Number,
  productHighlights: String,
  specifications: {
    material: String,
    fit: String,
    suitableSeason: String,
    pattern: String,
    occasion: String,
    sleeveLength: String,
    collarType: String,
    closureType: String,
    careInstructions: String,
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function handler(req, res) {
  console.log("req.params",req.params)
  console.log("req.query",req.query)

  //const { id } = req.query; // Extract 'id' from the request query
  const { id } = req.query;
  console.log("Received ID:", id);

  if (req.method === "GET") {
    // Fetch product by ID
    try {
      const foundProduct = await Product.findOne({ id });
      if (foundProduct) {
        foundProduct.visited = (foundProduct.visited || 0) + 1; // Increment visited count
        await foundProduct.save();
        res.status(200).json(foundProduct);
      } else {
        res.status(404).send(`Product with ID ${id} not found`);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Error while fetching product");
    }
  } else if (req.method === "PATCH") {
    // Handle update or comment addition, or increment visit count
    const { vote, data, srcOfAvatar, memberName, visit } = req.body;

    if (visit) {
      // Handle visit increment specifically
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { id },
          { $inc: { visited: 1 } },
          { new: true }
        );

        if (updatedProduct) {
          res.status(200).json(updatedProduct);
        } else {
          res.status(404).send(`Product with ID ${id} not found`);
        }
      } catch (error) {
        console.error("Error updating visit count:", error);
        res.status(500).send("Error while updating visit count");
      }
    } else {
      // Handle adding comments or other product updates
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { id },
          {
            $push: {
              comments: {
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
              },
            },
          },
          { new: true }
        );

        if (updatedProduct) {
          res.status(200).send(updatedProduct);
        } else {
          res.status(404).send(`Product with ID ${id} not found`);
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error while updating product");
      }
    }
  } else if (req.method === "DELETE") {
    // Handle DELETE request to delete a product by id
    try {
      const deletedProduct = await Product.findOneAndDelete({ id });
      if (deletedProduct) {
        res.status(200).json({ message: "Product deleted successfully!" });
      } else {
        res.status(404).send(`Product with ID ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error while deleting product");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}

// Export the modified handler
module.exports = handler;


// // api/products.js
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("micro-cors")({
//   allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
//   allowHeaders: ["Authorization", "Content-Type"],
//   origin: "http://localhost:3000", // Replace with the origin of your React app
// });
// // Import your Mongoose model

// // Import your Mongoose model

// mongoose.connect(
//   "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
//   {
//     useUnifiedTopology: true,
//   }
// );
// // const productSchema = new mongoose.Schema({
// //   title: String,
// //   _id: Number,
// //   comments: [
// //     {
// //       vote: Number,
// //       memberName: String,
// //       date: {
// //         day: Number,
// //         month: Number,
// //         year: Number,
// //       },
// //       srcOfAvatar: Number,
// //       data: {
// //         title: String,
// //         body: String,
// //       },
// //     },
// //   ],
// //   title_En: String,
// //   description: String,
// //   price: Number,
// //   off: String,
// //   offerTime: String,
// //   categoryId: Number,
// //   categoryAttributes: [
// //     {
// //       id: String,
// //       items: [
// //         {
// //           id: Number,
// //           attItem: Number,
// //         },
// //       ],
// //       count: Number,
// //     },
// //   ],
// //   guarantee: {
// //     hasGuarantee: Boolean,
// //     guranteeDate: String,
// //     guranteeName: String,
// //   },
// //   productPic: {
// //     grey: String,
// //     grey2: String,
// //     grey3: String,
// //     grey4: String,
// //   },
// //   videoUrl: String,
// //   vote: Number,
// //   dailyRentalRate: [Number],
// //   visited: Number,
// //   sold: Number,
// // });

// const productSchema = new mongoose.Schema({
//   id:Number,
//   title: String,
//   _id: Number,
//   comments: [
//     {
//       vote: Number,
//       memberName: String,
//       date: {
//         day: Number,
//         month: Number,
//         year: Number,
//       },
//       srcOfAvatar: Number,
//       data: {
//         title: String,
//         body: String,
//       },
//     },
//   ],
//   title_En: String,
//   description: String,
//   price: Number,
//   off: String,
//   offerTime: String,
//   categoryId: Number,
//   categoryAttributes: [
//     {
//       id: String,
//       items: [
//         {
//           id: Number,
//           attItem: Number,
//         },
//       ],
//       count: Number,
//     },
//   ],
//   guarantee: {
//     hasGuarantee: Boolean,
//     guranteeDate: String,
//     guranteeName: String,
//   },
//   productPic: {
//     grey: String,
//     grey2: String,
//     grey3: String,
//     grey4: String,
//   },
//   videoUrl: String,
//   vote: Number,
//   dailyRentalRate: [Number],
//   visited: Number,
//   sold: Number,
//   productHighlights: String,
//   specifications: {
//     material: String,
//     fit: String,
//     suitableSeason: String,
//     pattern: String,
//     occasion: String,
//     sleeveLength: String,
//     collarType: String,
//     closureType: String,
//     careInstructions: String,
//   },
// });


// const Product = mongoose.model("products", productSchema);

// async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }

//   if (req.method === "GET") {
//     const productId = req.query.id;
//     console.log(req.method);
//     console.log("hiiiiiiiii");

//     try {
//       const foundProduct = await Product.findById(productId);
//       if (foundProduct) {
//         // Increment the visited count by 1
//         foundProduct.visited = (foundProduct.visited || 0) + 1;
//         // Save the updated visited count
//         await foundProduct.save();
//         res.send(foundProduct);
//       } else {
//         res.status(404).send(`Product with ID not found`);
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error while fetching product");
//     }
//   } else if (req.method === "PATCH") {
//     console.log("yeeeeees, ", "1",req.body,"2",req.query,"3",req.params)
//     const productId = req.query.id;  // Access dynamic id from the URL
//     const { vote, data, srcOfAvatar, memberName } = req.body;
  
//     try {
//       const foundProduct = await Product.findOne({ id: productId });  // Find by custom 'id'
//       if (foundProduct) {
//         // Update comments
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
  
//         const updatedProduct = await foundProduct.save();
//         res.status(200).send(updatedProduct);
//       } else {
//         res.status(404).send(`Product with ID ${productId} not found`);
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error while updating product");
//     }
//   }
  
  
//   else {
//     res.status(405).send("Method Not Allowed");
//   }
// }

// const corsHandler = cors(handler);

// // Apply CORS to the handler and export it
// module.exports = corsHandler;
