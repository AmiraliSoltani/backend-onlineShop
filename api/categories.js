const mongoose = require("mongoose");
const cors = require("micro-cors")();

// Import your Mongoose model

mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const categorySchema = new mongoose.Schema({
  categoryPicture: String,
  iconPic: String,
  description: String,
  id: Number,
  order: Number,
  parentId: Number,
  title: String,
});

const Category = mongoose.model("categories", categorySchema);

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Use the "Product" model to find all products
    const foundCategories = await Category.find();
    console.log(foundCategories);
    res.status(200).json(foundCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error while fetching categories" });
  }
}

const corsHandler = cors(handler);

// Export the modified handler
export default corsHandler;
