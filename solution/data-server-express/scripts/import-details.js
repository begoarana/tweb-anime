const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");


const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "tweb_anime";
const COLLECTION = "animes";

// ---- Read args ----
const csvPath = process.argv[2];
const LIMIT = Number(process.argv[3] || 10);

if (!csvPath) {
  console.log("Usage: node scripts/import-details.js <path_to_details.csv> [limit]");
  process.exit(1);
}


function parseGenres(raw) {
  if (!raw) return [];
  try {
    const jsonish = raw.replace(/'/g, '"');
    const arr = JSON.parse(jsonish);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function safeNumber(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

(async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const collection = client.db(DB_NAME).collection(COLLECTION);

 
  await collection.deleteMany({ _csv: true });

  let inserted = 0;
  const docs = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        if (inserted >= LIMIT) return;

        const title = (row.title || "").trim();
        if (!title) return;

        docs.push({
          title,
          year: safeNumber(row.year),
          genres: parseGenres(row.genres),
          score: safeNumber(row.score),
          episodes: safeNumber(row.episodes),
          type: (row.type || "").trim() || null,
          status: (row.status || "").trim() || null,
          _csv: true
        });

        inserted++;
      })
      .on("end", resolve)
      .on("error", reject);
  });

  if (docs.length > 0) {
    await collection.insertMany(docs);
  }

  console.log(`✅ Imported ${docs.length} animes from CSV into MongoDB (marked with _csv:true)`);

  await client.close();
})();
