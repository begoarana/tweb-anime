#!/bin/bash
# Script to start all servers for TWEB Anime Explorer
# Run this script from the solution/ directory

echo "========================================"
echo "TWEB Anime Explorer - Starting Servers"
echo "========================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✓ Node.js: $(node --version)"
else
    echo "✗ Node.js not found. Please install Node.js."
    exit 1
fi

# Check Java
if command -v java &> /dev/null; then
    echo "✓ Java: $(java -version 2>&1 | head -n 1)"
else
    echo "✗ Java not found. Please install Java 17."
    exit 1
fi

# Check Maven
if command -v mvn &> /dev/null; then
    echo "✓ Maven: $(mvn --version | head -n 1)"
else
    echo "✗ Maven not found. Please install Maven."
    exit 1
fi

echo ""
echo "IMPORTANT: Make sure MongoDB and PostgreSQL are running!"
echo "  - MongoDB should be on localhost:27017"
echo "  - PostgreSQL should be on localhost:5432"
echo "  - Database name: tweb_anime_pg"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "Starting servers..."
echo ""

# Start Data Server (Express + MongoDB)
echo "Starting Data Server (Express + MongoDB) on port 4001..."
cd data-server-express
npm start &
DATA_PID=$!
cd ..

sleep 2

# Start Main Server (Express + Handlebars)
echo "Starting Main Server (Express + Handlebars) on port 3000..."
cd main-server-express
npm start &
MAIN_PID=$!
cd ..

sleep 2

# Start Spring Boot Server
echo "Starting Spring Boot Server (PostgreSQL) on port 8080..."
cd spring-server
mvn spring-boot:run &
SPRING_PID=$!
cd ..

echo ""
echo "========================================"
echo "All servers are starting..."
echo ""
echo "Access the application at:"
echo "  http://localhost:3000"
echo ""
echo "Health checks:"
echo "  Main Server: http://localhost:3000/health"
echo "  Data Server: http://localhost:4001/health"
echo "  Spring Boot: http://localhost:8080/health"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $DATA_PID $MAIN_PID $SPRING_PID 2>/dev/null; exit" INT TERM
wait
