const express = require("express");
const axios = require("axios");

const app = express();

// Express.js Middleware
// Add this to your Express app (usually in app.js or server.js)

app.use((req, res, next) => {
  // Send tracking request asynchronously (non-blocking)
  fetch("http://localhost:5000/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-website-key": "TrJTkBIpvFGV1ANS3YRqIsaJ"
    },
    body: JSON.stringify({
      ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
      route: req.originalUrl || req.url,
      method: req.method,
      userAgent: req.headers["user-agent"] || ""
    })
  }).catch(() => {
    // Silently fail - don't block user's request
  });
  next();
});





app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

// Home Page → list of news
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const news = response.data;

    res.render("news", { news });
  } catch (err) {
    console.log("NEWS ERROR:", err.message);
    res.send("Error fetching news");
  }
});

// Detail Page → single article
app.get("/news/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${req.params.id}`
    );
    const article = response.data;

    res.render("detail", { article });
  } catch (err) {
    console.log("DETAIL ERROR:", err.message);
    res.send("Error loading article");
  }
});

// Start server
app.listen(4000, () =>
  console.log("Vulnerable News website running at http://localhost:4000")
);










