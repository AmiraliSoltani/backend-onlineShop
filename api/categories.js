const mongoose = require("mongoose");
const cors = require("micro-cors")();

// Connect to your MongoDB instance
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// Define the Category schema
const categorySchema = new mongoose.Schema({
  categoryPicture: String,
  iconPic: String,
  description: String,
  id: { type: Number, unique: true },  // Ensure ID is unique
  order: Number,
  parentId: Number,
  title: { type: String, required: true }  // Title is required
});

// Create the Category model
const Category = mongoose.model("categories", categorySchema);

async function handler(req, res) {
  if (req.method === "GET") {
    // GET all categories
    try {
      const foundCategories = await Category.find();
      res.status(200).json(foundCategories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error while fetching categories" });
    }
  } else if (req.method === "POST") {
    const categories = req.body;  // Expecting an array of categories or a single category object

    if (!Array.isArray(categories)) {
      // Single category case: wrap it in an array
      categories = [categories];
    }

    try {
      const createdCategories = await Category.insertMany(categories);
      res.status(201).json({ message: "Categories created successfully!", categories: createdCategories });
    } catch (error) {
      console.error("Error creating categories:", error);
      res.status(500).json({ error: "Error creating categories" });
    }
  } else if (req.method === "DELETE") {
    // DELETE all categories
    try {
      await Category.deleteMany({});
      res.status(200).json({ message: "All categories deleted successfully!" });
    } catch (err) {
      console.error("Error while deleting categories:", err);
      res.status(500).json({ error: "Error while deleting categories" });
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





// const mongoose = require("mongoose");
// const cors = require("micro-cors")();

// // Import your Mongoose model

// mongoose.connect(
//   "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );

// const categorySchema = new mongoose.Schema({
//   categoryPicture: String,
//   iconPic: String,
//   description: String,
//   id: Number,
//   order: Number,
//   parentId: Number,
//   title: String,
// });

// const Category = mongoose.model("categories", categorySchema);

// async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     // Use the "Product" model to find all products
//     const foundCategories = await Category.find();
//     console.log(foundCategories);
//     res.status(200).json(foundCategories);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error while fetching categories" });
//   }
// }

// const corsHandler = cors(handler);

// // Export the modified handler
// export default corsHandler;
