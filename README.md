# anime project - web technologies

Final project for Web Technologies course 2025-2026  
University of Turin - Department of Computer Science

## description

Data aggregation system for anime (like Rotten Tomatoes but for anime). Allows searching through 28,000+ anime with detailed information, images, user ratings, characters, etc.

## architecture

The project uses a 3-server architecture that communicates via HTTP with Axios:

```
┌─────────────┐
│   Client    │ (HTML + Handlebars + Bootstrap)
│   Browser   │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│Main Server  │ (Express - port 3001)
│ Coordinator │ Uses Axios to delegate
└──┬────────┬─┘
   │        │
   │ HTTP   │ HTTP (Axios)
   ↓        ↓
┌──────┐ ┌────────┐
│Mongo │ │Spring  │
│Express│ │Boot    │
│3002  │ │8080    │
└──┬───┘ └───┬────┘
   │         │
   ↓         ↓
MongoDB  PostgreSQL
```

### Main Server (Express - port 3001)
- **Role:** Main coordinator, does NOT perform heavy operations
- **Function:** Receives requests from client and delegates them via Axios HTTP to other servers
- **Technology:** Node.js + Express + Axios
- **Swagger:** http://localhost:3001/api-docs

### Express MongoDB Server (port 3002)
- **Role:** Handles dynamic data (ratings, user profiles, recommendations, favorites)
- **Database:** MongoDB
- **Data:** 124M+ ratings, 337K profiles, 105K recommendations, 4M+ favorites
- **Technology:** Node.js + Express + Mongoose
- **Communication:** Receives HTTP requests via Axios from Main Server
- **Swagger:** http://localhost:3002/api-docs

### Spring Boot Server (port 8080)
- **Role:** Handles static data (anime details, characters, actors/staff)
- **Database:** PostgreSQL
- **Data:** 28,955 anime, 209K characters, 76K people
- **Technology:** Java 17 + Spring Boot + JPA/Hibernate
- **Communication:** Receives HTTP requests via Axios from Main Server
- **Swagger:** http://localhost:8080/swagger-ui.html

### Client (Frontend)
- **Technology:** HTML5 + Bootstrap 5 + Handlebars.js + Axios
- **Features:** 
  - Anime search with images
  - Top rated anime display
  - Anime detail modal with full information
  - Responsive design
  - CSS animations
  - HTTP communication via Axios with Main Server

## prerequisites

- Node.js v18+
- Java JDK 17+
- Maven 3.8+
- MongoDB (port 27017)
- PostgreSQL (port 5432)

## installation

### 1. clone repository
```bash
git clone https://github.com/begoarana/tweb-anime.git
cd tweb-anime
```

### 2. install dependencies

**Main Server:**
```bash
cd main-server
npm install
```

**Express MongoDB Server:**
```bash
cd express-db-server
npm install
```

**Spring Boot Server:**
```bash
cd spring-boot-server
mvn clean install
```

### 3. configure databases

**PostgreSQL:**
```sql
CREATE DATABASE tweb_anime_pg;
```

**MongoDB:**
Created automatically when starting the server.

### 4. configure environment variables

**main-server/.env**
```
PORT=3001
EXPRESS_DB_URL=http://localhost:3002
SPRING_BOOT_URL=http://localhost:8080
NODE_ENV=development
```

**express-db-server/.env**
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/anime_db
NODE_ENV=development
```

**spring-boot-server/src/main/resources/application.properties**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tweb_anime_pg
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### 5. import data (optional)

CSV files are in the datasets folder. To import to PostgreSQL:

```sql
COPY details FROM 'path/to/details.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8';
```


## execution

Open 3 different terminals:

**Terminal 1 - Spring Boot:**
```bash
cd spring-boot-server
mvn spring-boot:run
```

**Terminal 2 - Express MongoDB:**
```bash
cd express-db-server
npm start
```

**Terminal 3 - Main Server:**
```bash
cd main-server
npm start
```

Then open `client/index.html` in the browser.

## main endpoints

### Main Server (port 3001)
- `GET /api/health` - Status of all servers
- `GET /api/anime/search?title=naruto` - Search anime (delegates to Spring Boot via Axios)
- `GET /api/anime/:id` - Anime details (combines data from both servers via Axios)
- `GET /api/anime/top-rated` - Top anime (delegates to Spring Boot)
- `GET /api/ratings/user/:userId` - User ratings (delegates to MongoDB via Axios)

### Express MongoDB (port 3002)
- `GET /health` - Server status
- `GET /api/ratings/anime/:id` - Ratings for an anime
- `GET /api/ratings/user/:userId` - User ratings
- `GET /api/profiles/:userId` - User profile
- `GET /api/recommendations/anime/:id` - Recommendations
- `GET /api/favorites/user/:userId` - User favorites

### Spring Boot (port 8080)
- `GET /api/health` - Server status
- `GET /api/anime/search?title=naruto` - Search anime
- `GET /api/anime/{id}` - Anime details with image
- `GET /api/anime/top-rated?limit=12` - Top rated anime
- `GET /api/anime/popular` - Most popular anime
- `GET /api/anime/type/{type}` - Filter by type (TV, Movie, OVA)
- `GET /api/characters/search?name=naruto` - Search characters
- `GET /api/people/search?name=hayao` - Search people/actors

## project structure

```
tweb-anime/
├── main-server/              # Express coordinator server
│   ├── server.js            # Main logic, uses Axios
│   ├── package.json
│   └── .env.example
├── express-db-server/       # MongoDB server
│   ├── server.js            # Endpoints for dynamic data
│   ├── package.json
│   └── .env.example
├── spring-boot-server/      # Spring Boot + PostgreSQL
│   ├── pom.xml
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tweb/anime/
│   │       │   ├── AnimeApplication.java
│   │       │   ├── controller/
│   │       │   │   ├── HealthController.java
│   │       │   │   ├── AnimeController.java
│   │       │   │   ├── CharacterController.java
│   │       │   │   └── PersonController.java
│   │       │   ├── model/
│   │       │   │   ├── Anime.java
│   │       │   │   ├── Character.java
│   │       │   │   └── Person.java
│   │       │   └── repository/
│   │       │       ├── AnimeRepository.java
│   │       │       ├── CharacterRepository.java
│   │       │       └── PersonRepository.java
│   │       └── resources/
│   │           └── application.properties
└── client/                   # Frontend
    ├── index.html           # Main page
    ├── css/
    │   └── styles.css       # Custom styles + animations
    └── js/
        ├── api.js           # Axios HTTP client
        └── app.js           # Handlebars logic + UI

```


## technologies used

### Backend
- **Node.js** with Express.js
- **Java 17** with Spring Boot
- **Axios** for HTTP inter-server communication
- **MongoDB** with Mongoose
- **PostgreSQL** with JPA/Hibernate

### Frontend
- **HTML5** + **CSS3**
- **Bootstrap 5** for responsive design
- **Handlebars.js** for templating
- **Axios** for HTTP requests

### Documentation
- **Swagger/OpenAPI** on all servers
- **JSDoc** for JavaScript
- **JavaDoc** for Java


## known issues and limitations

- MongoDB collections (ratings, profiles) are created but not yet populated with CSV data
- Character and Person entities exist but CSV import for these is pending
- Search only works with PostgreSQL anime data (MongoDB integration for ratings pending)
- No user authentication system implemented
- Frontend uses Bootstrap modal for anime details

## api documentation

- **Main Server:** http://localhost:3001/api-docs
- **Express MongoDB:** http://localhost:3002/api-docs
- **Spring Boot:** http://localhost:8080/swagger-ui.html

## health checks

To verify all servers are communicating correctly:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "mainServer": "healthy",
  "protocol": "HTTP",
  "communication": "Axios",
  "expressDB": "healthy",
  "springBoot": "healthy",
  "timestamp": "2026-02-04T..."
}
```

## team

Begoña Arana

- **Professor:** Fabio Ciravegna
- **Course:** TWEB 2025-2026
- **University:** Università di Torino

---

**Last Updated:** February 5, 2026
