const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://asoltani7:wXxeR5GlT4n4X6z1@cluster0.efuoscy.mongodb.net/onlineShop?retryWrites=true&w=majority",
  {
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
  const productId = req.query.id || req.params.id; // Get the ID from URL params
  console.log("Received ID:", productId);

  if (!productId) {
    return res.status(400).json({ error: "ID is required" });
  }

  if (req.method === "GET") {
    // Handle GET request - Fetch product by custom `id` field and increment the `visited` count
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { id: Number(productId) }, // Query by custom `id` field
        { $inc: { visited: 1 } },  // Increment the visited count
        { new: true }  // Return the updated product
      );

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).send(`Product with ID ${productId} not found`);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Error while fetching product");
    }
  } else if (req.method === "PATCH") {
    // Handle PATCH request - Update product or add a comment or increment visit count
    const { vote, data, srcOfAvatar, memberName, visit } = req.body;

    if (visit) {
      // Increment visit count
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { id: Number(productId) }, // Query by `id`, not `_id`
          { $inc: { visited: 1 } },
          { new: true }
        );

        if (updatedProduct) {
          res.status(200).json(updatedProduct);
        } else {
          res.status(404).send(`Product with ID ${productId} not found`);
        }
      } catch (error) {
        console.error("Error updating visit count:", error);
        res.status(500).send("Error while updating visit count");
      }
    } else {
      // Add a comment
      try {
        const updatedProduct = await Product.findOneAndUpdate(
          { id: Number(productId) }, // Query by `id`, not `_id`
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
          res.status(404).send(`Product with ID ${productId} not found`);
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error while updating product");
      }
    }
  } else if (req.method === "DELETE") {
    // Handle DELETE request - Delete a product by ID
    try {
      const deletedProduct = await Product.findOneAndDelete({ id: Number(productId) }); // Query by `id`, not `_id`
      if (deletedProduct) {
        res.status(200).json({ message: "Product deleted successfully!" });
      } else {
        res.status(404).send(`Product with ID ${productId} not found`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error while deleting product");
    }
  } else {
    // Handle unsupported methods
    res.status(405).send("Method not allowed");
  }
}

module.exports = handler;
