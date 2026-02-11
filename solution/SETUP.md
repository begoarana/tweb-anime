# Setup Instructions for TWEB Anime Explorer

This document provides detailed instructions for setting up and running the project on a new computer.

## Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js** (v14 or higher) and npm
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Make sure MongoDB service is running on `localhost:27017`
   - Verify: `mongosh` or check MongoDB Compass

3. **Java 17** (JDK)
   - Download from: https://adoptium.net/ or Oracle JDK
   - Verify installation: `java -version`

4. **Maven**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn --version`

5. **PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Default port: 5432
   - Create a database named `tweb_anime_pg`

## Database Setup

### MongoDB Setup

1. Start MongoDB service
2. The application will automatically create the database `tweb_anime` and collection `animes`
3. To import data, use the endpoint: `POST http://localhost:4001/import-details?file=path/to/details.csv`
4. Or use the demo data: `POST http://localhost:4001/seed-demo`

### PostgreSQL Setup

1. Start PostgreSQL service
2. Create the database:
   ```sql
   CREATE DATABASE tweb_anime_pg;
   ```
3. Configure credentials in `solution/spring-server/src/main/resources/application.properties`:
   - Default username: `postgres`
   - Default password: `postgres`
   - Or set environment variables:
     ```bash
     export DB_USERNAME=your_username
     export DB_PASSWORD=your_password
     ```
4. The application will automatically create tables on first run (via Hibernate)

## Running the Project

### Option 1: Using the Start Scripts (Recommended)

**Windows (PowerShell):**
```powershell
cd solution
.\start-all.ps1
```

**Linux/Mac:**
```bash
cd solution
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Manual Start (3 Separate Terminals)

**Terminal 1 - Data Server (Express + MongoDB):**
```bash
cd solution/data-server-express
npm install
npm start
```
Server runs on: http://localhost:4001

**Terminal 2 - Main Server (Express + Handlebars):**
```bash
cd solution/main-server-express
npm install
npm start
```
Server runs on: http://localhost:3000

**Terminal 3 - Spring Boot Server (PostgreSQL):**
```bash
cd solution/spring-server
mvn spring-boot:run
```
Server runs on: http://localhost:8080

## Verifying Installation

1. **Check Main Server:** http://localhost:3000
2. **Check Health Endpoints:**
   - Main Server: http://localhost:3000/health
   - Data Server: http://localhost:4001/health
   - Spring Boot: http://localhost:8080/health

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify connection: `mongosh` or MongoDB Compass

### PostgreSQL Connection Issues
- Ensure PostgreSQL service is running
- Check if port 5432 is available
- Verify database exists: `psql -U postgres -l`
- Check credentials in `application.properties`

### Port Already in Use
- Change ports in respective configuration files:
  - Main Server: `solution/main-server-express/app.js` (PORT = 3000)
  - Data Server: `solution/data-server-express/app.js` (PORT = 4001)
  - Spring Boot: `solution/spring-server/src/main/resources/application.properties` (server.port=8080)

### Node Modules Not Found
- Run `npm install` in both Express server directories:
  - `solution/data-server-express/`
  - `solution/main-server-express/`

### Maven Dependencies Not Found
- Run `mvn clean install` in `solution/spring-server/`

## Project Structure

```
solution/
├── data-server-express/    # Express server for MongoDB
├── main-server-express/    # Main Express server with Handlebars
├── spring-server/          # Spring Boot server for PostgreSQL
├── start-all.ps1          # Windows start script
└── start-all.sh            # Linux/Mac start script
```

## Notes

- The main server communicates with both backend servers (Express and Spring Boot)
- MongoDB stores dynamic data (anime details, reviews, etc.)
- PostgreSQL stores static data (features, people details, etc.)
- All servers must be running for the application to work correctly
