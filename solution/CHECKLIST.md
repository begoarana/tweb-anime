# Pre-Submission Checklist

Use this checklist to verify your project is ready for submission and will work on the professor's computer.

## ✅ Project Structure

- [x] Code is in `solution/` directory
- [x] Report is in `report/` directory (or will be)
- [x] README.md exists and is clear
- [x] SETUP.md exists with detailed instructions

## ✅ Dependencies

- [x] All dependencies are in `package.json` files (Node.js)
- [x] All dependencies are in `pom.xml` (Maven/Java)
- [x] No hardcoded credentials (using environment variables)
- [x] `.gitignore` excludes `node_modules/` and `target/`

## ✅ Database Configuration

- [x] PostgreSQL password uses environment variables (not hardcoded)
- [x] Default credentials are documented
- [x] MongoDB connection string is configurable
- [x] Database names are clearly documented

## ✅ Server Communication

- [x] Main server communicates with Express data server (MongoDB)
- [x] Main server communicates with Spring Boot server (PostgreSQL)
- [x] Health check endpoint verifies all servers
- [x] URLs are configurable (not hardcoded in multiple places)

## ✅ Documentation

- [x] README.md explains the project
- [x] SETUP.md has detailed installation instructions
- [x] Code has comments (especially in Spanish/English as needed)
- [x] Java code has Javadoc-style comments
- [x] JavaScript code has clear comments

## ✅ Execution

- [x] Start scripts exist (start-all.ps1 and start-all.sh)
- [x] Manual start instructions are clear
- [x] Prerequisites are documented
- [x] Troubleshooting section exists

## ✅ Assignment Requirements

- [x] Architecture matches assignment (Main Server → Express Server + Spring Boot Server)
- [x] Frontend uses Handlebars (or React if necessary)
- [x] Backend uses Express and Spring Boot
- [x] MongoDB for dynamic data
- [x] PostgreSQL for static data
- [x] Communication via Axios

## ⚠️ Before Submission

1. **Test on a clean machine** (or virtual machine) to ensure it works
2. **Remove any personal data** or test data
3. **Ensure all node_modules are excluded** from git (but package.json and package-lock.json are included)
4. **Ensure target/ is excluded** from git
5. **Verify the report/ directory** has your report
6. **Check that the repository is private** and shared with the professors
7. **Verify commit history** shows work from all group members

## 🚀 Quick Test

Run these commands to verify everything works:

```bash
# 1. Check prerequisites
node --version
npm --version
java -version
mvn --version

# 2. Install dependencies
cd solution/data-server-express && npm install && cd ../..
cd solution/main-server-express && npm install && cd ../..

# 3. Start MongoDB and PostgreSQL

# 4. Start servers (use start-all script or manual)
cd solution
# Windows: .\start-all.ps1
# Linux/Mac: ./start-all.sh

# 5. Test endpoints
curl http://localhost:3000/health
curl http://localhost:4001/health
curl http://localhost:8080/health
```

## 📝 Notes for Professor's Computer

- The project uses standard ports (3000, 4001, 8080)
- MongoDB must be running on localhost:27017
- PostgreSQL must be running on localhost:5432
- Database `tweb_anime_pg` must exist in PostgreSQL
- Default PostgreSQL credentials: postgres/postgres (can be changed via env vars)
- All dependencies will be installed via `npm install` and `mvn`
- No additional applications needed beyond Node.js, Java, Maven, MongoDB, and PostgreSQL
