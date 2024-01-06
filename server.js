require("dotenv").config();
const express = require("express");
const redis = require("redis");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// Middleware for API Key validation
function validateApiKey(req, res, next) {
  const apiKey = req.get("Authorization");
  if (apiKey && apiKey === process.env.API_KEY) {
    return next();
  }
  return res.status(401).send("Invalid or missing API key");
}

// Redirect endpoint
app.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;

    // Check if key is alphanumeric
    if (!/^[a-z0-9]+$/i.test(key)) {
      return res.status(400).send("Key must be alphanumeric");
    }
    const url = await redisClient.get(req.params.key);
    if (url) {
      return res.redirect(url);
    } else {
      return res
        .status(404)
        .sendFile("key-not-found.html", { root: "./public" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Read all key-value pairs endpoint
app.get("/api/read_all", validateApiKey, async (req, res) => {
  try {
    const keys = await redisClient.keys("*");
    const data = {};
    for (const key of keys) {
      data[key] = await redisClient.get(key);
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add a new key-value pair endpoint
app.post("/api/add", validateApiKey, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res.status(400).send("Missing key or value");
    }

    // Check if key is alphanumeric
    if (!/^[a-z0-9]+$/i.test(key)) {
      return res.status(400).send("Key must be alphanumeric");
    }

    // Regular expression for URL validation
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/gim;
    if (!urlRegex.test(value)) {
      return res.status(400).send("Invalid URL format");
    }

    const exists = await redisClient.exists(key);
    if (exists) {
      return res.status(400).send("Key already exists");
    }

    await redisClient.set(key, value);
    res.status(201).send("Key-Value pair added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.put("/api/update", validateApiKey, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      return res.status(400).send("Missing key or value");
    }

    // Check if key is alphanumeric
    if (!/^[a-z0-9]+$/i.test(key)) {
      return res.status(400).send("Key must be alphanumeric");
    }

    // Regular expression for URL validation
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/gim;
    if (!urlRegex.test(value)) {
      return res.status(400).send("Invalid URL format");
    }

    const exists = await redisClient.exists(key);
    if (!exists) {
      return res.status(404).send("Key does not exist");
    }

    await redisClient.set(key, value);
    res.status(200).send("Key-Value pair updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
