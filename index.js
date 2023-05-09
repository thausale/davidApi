import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const schema = new mongoose.Schema(
  {
    title: String,
    body: String,
    photo: String,
    metadata: {},
  },
  { collection: "davidApi" }
);

const Post = mongoose.model("Post", schema);

app.use(express.json());

app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json({ data: posts });
});

app.post("/post", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/patch/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
