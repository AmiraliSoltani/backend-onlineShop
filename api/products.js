// products.js

const mongoose = require("mongoose");
const cors = require("micro-cors")();

// Connect to MongoDB (only once)
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Check if the model is already compiled before defining it
const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
  //_id: false, // Disable automatic `_id` field creation by Mongoose
  id: {
    type: Number,
    unique: true, // Ensure the id is unique
    required: true, // Make it required
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
      id: String, // id of the category attribute
      items: [
        {
          id: Number, // id of the item
          attItem: Number, // attItem inside the item
        },
      ],
      count: Number, // count of items
    },
  ],
  guarantee: {
    hasGuarantee: Boolean,
    guranteeDate: String,
    guranteeName: String,
  },
  productPic: {
    type: Map, // This allows you to dynamically add color names
    of: String, // The values will be URLs (strings)
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
}));

// The main handler function for GET, POST, DELETE methods
async function handler(req, res) {
  if (req.method === "GET") {
    // Get all products
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    // Add a new product (or multiple products)
    const products = req.body; // Expecting an array of products or a single product object

    const productArray = Array.isArray(products) ? products : [products]; // Ensure products are an array

    try {
      const createdProducts = await Product.insertMany(productArray);
      res.status(201).json({ message: "Products created successfully!", products: createdProducts });
    } catch (error) {
      console.error("Error creating products:", error);
      res.status(500).json({ error: "Error creating products" });
    }
  } else if (req.method === "DELETE") {
    // Delete all products
    try {
      await Product.deleteMany({});
      res.status(200).json({ message: "All products deleted successfully!" });
    } catch (error) {
      console.error("Error deleting products:", error);
      res.status(500).json({ error: "Error deleting products" });
    }
  } else {
    // Return 405 for unsupported methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Add CORS support
const corsHandler = cors(handler);

// Export the modified handler
module.exports = corsHandler;






// // api/products.js

// const mongoose = require("mongoose");
// const cors = require("micro-cors")();

// // Import your Mongoose model

// mongoose.connect(
//   "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );
// const productSchema = new mongoose.Schema({
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
// });
// const Product = mongoose.model("products", productSchema);

// async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     // Use the "Product" model to find all products
//     const foundProducts = await Product.find();
//     console.log(foundProducts);
//     res.status(200).json(foundProducts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error while fetching products" });
//   }
// }

// const updateProductSpecifications = async () => {
//   await Product.updateOne(
//     { _id: 1 },
//     {
//       $set: {
//         specifications: [
//           { key: "Material", value: "Cotton" },
//           { key: "Suitable Season", value: "Spring and Autumn" },
//           { key: "Fit", value: "Regular" },
//           { key: "Color", value: "Red" },
//           { key: "Size", value: "S, M, L, XL" },
//           { key: "Pattern", value: "Solid" },
//           { key: "Neckline", value: "Round Neck" },
//           { key: "Sleeve Length", value: "Long Sleeve" },
//           { key: "Care Instructions", value: "Machine Washable" },
//           { key: "Origin", value: "Made in Turkey" }
//         ]
//       }
//     }
//   );
// };

// updateProductSpecifications().then(() => {
//   console.log('Product specifications updated successfully');
// }).catch(err => {
//   console.error('Error updating product specifications:', err);
// });
// // Apply CORS middleware to the handler
// const corsHandler = cors(handler);

// // Export the modified handler
// export default corsHandler;

// // {
// //   "routes": [
// //     { "src": "/products", "dest": "/api/products.js" },
// //     { "src": "/categories", "dest": "/api/categories.js" },
// //     { "src": "/(.*)", "dest": "/index.html" }
// //   ],
