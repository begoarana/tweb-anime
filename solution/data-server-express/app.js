const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 4001;

// MongoDB local
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "tweb_anime";
const COLLECTION = "animes";

app.use(cors());
app.use(express.json());

let collection;

// Connect to MongoDB
async function connectMongo() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION);
  console.log(`✅ Connected to MongoDB (${DB_NAME})`);
}

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "data-server-express", database: DB_NAME });
});

// Seed demo data
app.post("/seed-demo", async (req, res) => {
  const demo = [
    { title: "Naruto", year: 2002, genres: ["Action", "Adventure"], _demo: true },
    { title: "One Piece", year: 1999, genres: ["Action", "Adventure"], _demo: true },
    { title: "Death Note", year: 2006, genres: ["Mystery", "Thriller"], _demo: true }
  ];

  await collection.deleteMany({ _demo: true });
  await collection.insertMany(demo);

  res.json({ ok: true, inserted: demo.length });
});

// Search by title
app.get("/animes/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ ok: false, error: "Missing query parameter q" });

  const results = await collection
    .find({ title: { $regex: q, $options: "i" } })
    .project({ _id: 0 })
    .limit(20)
    .toArray();

  res.json({ ok: true, q, count: results.length, results });
});
// GET /animes?page=1&limit=10&q=naruto&genre=Action&sort=title_asc
app.get("/animes", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const genre = (req.query.genre || "").trim();
    const sort = (req.query.sort || "title_asc").trim();

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (q) query.title = { $regex: q, $options: "i" };
    if (genre) query.genres = { $in: [genre] };

    let sortObj = { title: 1 };
    if (sort === "title_desc") sortObj = { title: -1 };
    if (sort === "year_asc") sortObj = { year: 1 };
    if (sort === "year_desc") sortObj = { year: -1 };

    const [total, results] = await Promise.all([
      collection.countDocuments(query),
      collection
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0 })
        .toArray()
    ]);

    res.json({
      ok: true,
      q,
      genre,
      sort,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch animes" });
  }
});


// Start server
connectMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Data Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
