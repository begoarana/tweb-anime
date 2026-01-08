// Este servidor es el “data server”: aquí es donde hablamos con MongoDB.
// El main server (puerto 3000) le pide datos a este servidor (puerto 4001)
// y este devuelve JSON (no HTML).

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

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
 * Muy útil cuando algo “no funciona” y quieres saber si está corriendo.
 */
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "data-server-express", database: DB_NAME });
});

/**
 * Inserta 3 animes de demo y borra los antiguos de demo.
 * Esto sirve para probar rápido aunque no hayas importado todo el dataset.
 */
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

/**
 * Arranque del servidor: primero conectamos a Mongo y luego escuchamos el puerto.
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
