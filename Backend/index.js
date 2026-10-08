const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const config = require("./utils/config");

const app = express();

app.use(cors());
app.use(express.json());

// --- 2. MONGOOSE SCHEMAS & MODELS ---

// Blog Schema (UPDATED: Linked to User model)
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Blog = mongoose.model("Blog", blogSchema);

// User Schema
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: { type: String, required: true },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
const User = mongoose.model("User", userSchema);

// --- 3. DATABASE CONNECTION ---
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

// --- 4. ROUTES ---

// Create a User
app.post("/api/users", async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    response.status(400).json({ error: "username must be unique" });
  }
});

// Real Login Route using MongoDB
app.post("/api/login", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    name: user.name,
    token: `mock-jwt-token-for-${user.username}`,
  };

  response.status(200).send(userForToken);
});

// Blog Routes

// GET Blogs (UPDATED: Populates user data fields)
app.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// POST New Blog
app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);
  blog.save().then((result) => response.status(201).json(result));
});

// PUT Update Blog Likes (NEW: Handles like functionality)
app.put("/api/blogs/:id", async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  const blogUpdates = {
    title,
    author,
    url,
    likes,
    user,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogUpdates,
      { new: true, runValidators: true },
    );

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).json({ error: "blog not found" });
    }
  } catch (error) {
    response.status(400).json({ error: "malformatted id" });
  }
});

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
