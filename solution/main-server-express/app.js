const express = require("express");
const path = require("path");
const axios = require("axios");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 3000;

// Handlebars setup (WITH helpers)
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b
    }
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
  res.render("home", { title: "TWEB Anime Explorer" });
});

// Search (uses the advanced endpoint /animes)
app.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const genre = (req.query.genre || "").trim();
  const sort = (req.query.sort || "title_asc").trim();
  const page = Math.max(1, Number(req.query.page || 1));

  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "10");

    const url = `http://localhost:4001/animes?${params.toString()}`;
    const response = await axios.get(url);

    res.render("home", {
      title: "TWEB Anime Explorer",
      q,
      genre,
      sort,
      results: response.data.results,
      total: response.data.total,
      page: response.data.page,
      totalPages: response.data.totalPages,
      hasPrev: response.data.page > 1,
      hasNext: response.data.page < response.data.totalPages,
      prevPage: response.data.page - 1,
      nextPage: response.data.page + 1
    });
  } catch (err) {
    console.error(err.message);
    res.render("home", {
      title: "TWEB Anime Explorer",
      error: "Could not reach the Mongo data server (is it running on port 4001?)."
    });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Main Server running at http://localhost:${PORT}`);
});
