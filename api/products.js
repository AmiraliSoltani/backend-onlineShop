// products.js

const mongoose = require("mongoose");
const cors = require("micro-cors")();

// Connect to MongoDB (only once)
if (!mongoose.connection.readyState) {
  mongoose.connect(
    "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

// Define the Product schema and model (check if already compiled)
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
  Brand: String,
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
    type: Map, // Dynamically allows adding color names
    of: String, // The values will be URLs (strings)
  },
  videoUrl: String,
  vote: Number,
  dailyRentalRate: [Number],
  visited: Number,
  sold: Number,
  productDescriptions:[],
});

// Check if the Product model is already compiled
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// The main handler function for GET, POST, DELETE methods
async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const foundProducts = await Product.find();
      console.log(foundProducts);
      return res.status(200).json(foundProducts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error while fetching products" });
    }
  }

  if (req.method === "POST") {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      return res.status(201).json(savedProduct);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Error while creating product" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const deletedProduct = await Product.findOneAndDelete({ id });
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error while deleting product" });
    }
  }

  if (req.method === "PUT") {
    console.log("hiiiii")
    try {
      const { id } = req.query; // Get the product ID from the query
      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }
  
      const updatedData = req.body; // Get the updated product data from the request body
  
      // Find and update the product
      const updatedProduct = await Product.findOneAndUpdate(
        { id }, // Find by `id`
        updatedData, // Update with new data
        { new: true } // Return the updated document
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      return res.status(200).json(updatedProduct);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error while updating product" });
    }
  }
  

  return res.status(405).json({ error: "Method Not Allowed!" });
}

// Apply CORS middleware to the handler
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
