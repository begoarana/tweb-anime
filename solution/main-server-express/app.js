// Importamos las librerías que vamos a usar en este servidor
// Express sirve para crear el servidor web
// Path nos ayuda a manejar rutas de archivos
// Axios se usa para pedir datos al otro servidor (el de Mongo)
// express-handlebars se usa para generar las páginas HTML
const express = require("express");
const path = require("path");
const axios = require("axios");
const { engine } = require("express-handlebars");

// Creamos la aplicación Express
const app = express();

// Puerto donde se va a ejecutar el servidor principal
const PORT = 3000;

/*
  CONFIGURACIÓN DE HANDLEBARS: aquí indicamos que vamos a usar Handlebars como motor de plantillas.
  También definimos un layout principal llamado "main".
  El helper "eq" nos permite comparar valores dentro de los templates
  (por ejemplo, para marcar opciones seleccionadas en un select).
*/
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b
    }
  })
);

// Indicamos a Express que use Handlebars
app.set("view engine", "handlebars");

// Indicamos dónde están los archivos .handlebars
app.set("views", path.join(__dirname, "views"));

/*
  MIDDLEWARES
  Estas líneas permiten:
  - Leer datos enviados en formato JSON
  - Leer datos enviados desde formularios
  - Servir archivos estáticos (CSS, imágenes, etc.)
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/*
  RUTA PRINCIPAL "/": esta ruta se ejecuta cuando entramos en http://localhost:3000
  Aquí no se hace ninguna búsqueda todavía.
  Solo se carga la página inicial y se piden los géneros al data server
  para rellenar el desplegable.
*/
app.get("/", async (req, res) => {
  try {
    // Pedimos la lista de géneros al servidor de datos (Mongo)
    const genresRes = await axios.get("http://localhost:4001/genres");

    // Renderizamos "home" con valores iniciales
    res.render("home", {
      title: "TWEB Anime Explorer",
      searched: false,
      q: "",
      genre: "",
      sort: "title_asc",
      genresList: genresRes.data.genres || [],
      results: [],
      total: 0,
      page: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      prevPage: 1,
      nextPage: 1
    });
  } catch (err) {
    // Si el servidor de datos no responde, mostramos un error
    console.error(err.message);

    res.render("home", {
      title: "TWEB Anime Explorer",
      searched: false,
      q: "",
      genre: "",
      sort: "title_asc",
      genresList: [],
      results: [],
      total: 0,
      page: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      prevPage: 1,
      nextPage: 1,
      error: "Could not reach the Mongo data server (is it running on port 4001?)."
    });
  }
});

/*
  RUTA "/search": esta ruta se ejecuta cuando el usuario envía el formulario de búsqueda.
  Aquí se recogen los valores introducidos y se envían al data server,
  que es el que realmente consulta MongoDB.
*/
app.get("/search", async (req, res) => {
  // Leemos los parámetros de la URL
  const q = (req.query.q || "").trim();
  const genre = (req.query.genre || "").trim();
  const sort = (req.query.sort || "title_asc").trim();
  const page = Math.max(1, Number(req.query.page || 1));

  // Si no hay ni texto ni género, volvemos a la página principal
  //if (!q && !genre) {
    //return res.redirect("/");
  //}

  try {
    // Construimos los parámetros que se enviarán al data server
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "10");

    const url = `http://localhost:4001/animes?${params.toString()}`;

    // Pedimos al mismo tiempo:
    // - los resultados de búsqueda
    // - la lista de géneros (para mantener el desplegable activo)
    const [response, genresRes] = await Promise.all([
      axios.get(url),
      axios.get("http://localhost:4001/genres")
    ]);

    const api = response.data;
    const from = api.total === 0 ? 0 : (api.page - 1) * api.limit + 1;
    const to = Math.min(api.total, api.page * api.limit);

    // renderizar resultados obtenidos
    res.render("home", {
      title: "TWEB Anime Explorer",
      searched: true,
      q,
      genre,
      sort,
      genresList: genresRes.data.genres || [],
      results: api.results || [],
      total: api.total ?? 0,
      page: api.page ?? page,
      totalPages: api.totalPages ?? 1,
      hasPrev: (api.page ?? page) > 1,
      hasNext: (api.page ?? page) < (api.totalPages ?? 1),
      prevPage: (api.page ?? page) - 1,
      nextPage: (api.page ?? page) + 1,
      from,
        to
    });
  } catch (err) {
    // Si ocurre un error, intentamos al menos recuperar los géneros que podríamos perder
    console.error(err.message);

    let genresList = [];
    try {
      const genresRes = await axios.get("http://localhost:4001/genres");
      genresList = genresRes.data.genres || [];
    } catch (_) {}

    res.render("home", {
      title: "TWEB Anime Explorer",
      searched: true,
      q,
      genre,
      sort,
      genresList,
      results: [],
      total: 0,
      page: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      prevPage: 1,
      nextPage: 1,
      error: "Could not reach the Mongo data server (is it running on port 4001?)."
    });
  }
});

/*
  ARRANQUE DEL SERVIDOR

  Aquí se pone el servidor a escuchar en el puerto 3000.
*/
app.listen(PORT, () => {
  console.log(`🚀 Main Server running at http://localhost:${PORT}`);
});
