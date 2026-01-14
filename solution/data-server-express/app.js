// Este servidor es el “data server”: aquí es donde hablamos con MongoDB.
// El main server (puerto 3000) le pide datos a este servidor (puerto 4001)
// y este devuelve JSON (no HTML).

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const fs = require("fs");
const csv = require("csv-parser");


const app = express();
const PORT = 4001;

// Datos de conexión a Mongo en local
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "tweb_anime";
const COLLECTION = "animes";

// Middleware básico
app.use(cors());          // para permitir peticiones desde otro puerto (3000 -> 4001)
app.use(express.json());  // para poder leer JSON en POST/PUT

// Aquí guardamos la colección cuando Mongo esté conectado
let collection;

/**
 * Nos conectamos a Mongo una vez al arrancar y dejamos "collection" preparada.
 * Así no estamos conectando/desconectando en cada request.
 */
async function connectMongo() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION);
  console.log(`✅ Connected to MongoDB (${DB_NAME})`);
}

/**
 * Endpoint simple para comprobar que el servidor está vivo.

 */
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "data-server-express", database: DB_NAME });
});


app.post("/seed-demo", async (req, res) => {
  const demo = [
  { title: "-Socket-", year: 2010, genres: ["Comedy"], type: "Movie", episodes: 1, score: 6.2, _demo: true },
  { title: "......", year: 2023, genres: ["Horror", "Supernatural"], type: "Music", episodes: 1, score: 6.53, _demo: true },
  { title: ".hack//G.U. Returner", year: 2007, genres: ["Adventure", "Drama", "Fantasy"], type: "OVA", episodes: 1, score: 6.65, _demo: true },
  { title: ".hack//G.U. Trilogy", year: 2007, genres: ["Adventure", "Drama", "Fantasy"], type: "Movie", episodes: 1, score: 7.06, _demo: true },
  { title: "Naruto", year: 2002, genres: ["Action", "Adventure"], type: "TV", episodes: 220, score: 7.9, _demo: true },
  { title: "One Piece", year: 1999, genres: ["Action", "Adventure"], type: "TV", episodes: 1000, score: 8.7, _demo: true },
  { title: "Death Note", year: 2006, genres: ["Mystery", "Thriller"], type: "TV", episodes: 37, score: 8.6, _demo: true },
  { title: "Attack on Titan", year: 2013, genres: ["Action", "Thriller"], type: "TV", episodes: 87, score: 9.0, _demo: true },
  { title: "Fullmetal Alchemist: Brotherhood", year: 2009, genres: ["Action", "Adventure"], type: "TV", episodes: 64, score: 9.1, _demo: true },
  { title: "Your Name", year: 2016, genres: ["Drama", "Romance"], type: "Movie", episodes: 1, score: 8.8, _demo: true }
];




  await collection.deleteMany({ _demo: true });
  await collection.insertMany(demo);

  res.json({ ok: true, inserted: demo.length });
});

/**
 * Endpoint “simple” de búsqueda solo por título.
 * (Si ya usas /animes con filtros, este es opcional, pero lo dejo por compatibilidad.)
 */
app.get("/animes/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ ok: false, error: "Missing query parameter q" });
  }

  const results = await collection
    .find({ title: { $regex: q, $options: "i" } })
    .project({ _id: 0 })
    .limit(20)
    .toArray();

  res.json({ ok: true, q, count: results.length, results });
});

/**
 * Endpoint “completo” para la UI:
 * GET /animes?page=1&limit=10&q=naruto&genre=Action&sort=title_asc
 * - q: busca por título
 * - genre: filtra por género
 * - sort: ordena
 * - page/limit: paginación
 */
app.get("/animes", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const genre = (req.query.genre || "").trim();
    const sort = (req.query.sort || "title_asc").trim();

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    // Construimos el filtro según lo que haya puesto el usuario
    const query = {};
    if (q) query.title = { $regex: q, $options: "i" };
    if (genre) query.genres = { $in: [genre] };

    // Orden por defecto: título A-Z
    let sortObj = { title: 1 };
    if (sort === "title_desc") sortObj = { title: -1 };
    if (sort === "year_asc") sortObj = { year: 1, title: 1 };
    if (sort === "year_desc") sortObj = { year: -1, title: 1 };

    // Pedimos total y resultados a la vez (más rápido)
    const [total, results] = await Promise.all([
      collection.countDocuments(query),
      collection
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .project({ _id: 0, title: 1, year: 1, genres: 1, type: 1, episodes: 1, score: 1 })

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
      totalPages: Math.max(1, Math.ceil(total / limit)),
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch animes" });
  }
});

/**
 * Devuelve la lista de géneros únicos.
 * Esto es para que el main server rellene el desplegable (dropdown).
 */
app.get("/genres", async (req, res) => {
  try {
    const genres = await collection.distinct("genres");

    // Distinct ya devuelve valores únicos; solo limpiamos y ordenamos.
    const clean = (genres || [])
      .filter(g => typeof g === "string" && g.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    res.json({ ok: true, count: clean.length, genres: clean });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Failed to fetch genres" });
  }
});

// Importar animes desde details.csv (dataset real)
// Se llama así: POST /import-details?file=C:\ruta\details.csv&limit=20000
app.post("/import-details", async (req, res) => {
  try {
    const file = (req.query.file || "").trim();
    const limit = Math.max(1, Number(req.query.limit || 20000));

    if (!file) {
      return res.status(400).json({
        ok: false,
        error: "Missing query param 'file'. Example: ?file=C:\\path\\details.csv"
      });
    }

    if (!fs.existsSync(file)) {
      return res.status(400).json({ ok: false, error: `File not found: ${file}` });
    }

    let inserted = 0;
    let seen = 0;

    // Opcional: limpiar antiguos importados (si quieres)
    // await collection.deleteMany({ _imported: true });

    const bulk = [];

    const parseGenres = (raw) => {
      // En tu CSV vienen como "['Action', 'Drama']" (string)
      // Convertimos a array limpio
      if (!raw || typeof raw !== "string") return [];
      const trimmed = raw.trim();
      if (!trimmed.startsWith("[")) return [];
      return trimmed
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map(s => s.replace(/'/g, "").replace(/"/g, "").trim())
        .filter(Boolean);
    };

    const toNumber = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    await new Promise((resolve, reject) => {
      fs.createReadStream(file)
        .pipe(csv())
        .on("data", (row) => {
          if (inserted >= limit) return;

          seen++;

          const title = (row.title || "").trim();
          if (!title) return;

          const year = toNumber(row.year);
          const score = toNumber(row.score);
          const episodes = toNumber(row.episodes);
          const type = (row.type || "").trim();

          const genres = parseGenres(row.genres);

          // Documento que guardamos en Mongo
          const doc = {
            title,
            year: year ?? undefined,
            genres,
            type: type || undefined,
            episodes: episodes ?? undefined,
            score: score ?? undefined,
            _imported: true
          };

          bulk.push({ insertOne: { document: doc } });

          if (bulk.length >= 1000) {
            // metemos en bloques para ir rápido
            collection.bulkWrite(bulk, { ordered: false }).catch(() => {});
            bulk.length = 0;
          }

          inserted++;
        })
        .on("end", async () => {
          if (bulk.length) {
            try {
              await collection.bulkWrite(bulk, { ordered: false });
            } catch (_) {}
          }
          resolve();
        })
        .on("error", reject);
    });

    res.json({
      ok: true,
      message: "Import finished",
      file,
      scannedRows: seen,
      inserted
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Import failed" });
  }
});


/**
 * Arranque del servidor: primero conecto a Mongo y luego escucho el puerto.
 */
connectMongo()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Data Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
