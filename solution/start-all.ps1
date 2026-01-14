# Script to start all servers for TWEB Anime Explorer
# Run this script from the solution/ directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TWEB Anime Explorer - Starting Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java not found. Please install Java 17." -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mavenVersion = mvn --version 2>&1 | Select-Object -First 1
    Write-Host "✓ Maven: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Maven not found. Please install Maven." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "IMPORTANT: Make sure MongoDB and PostgreSQL are running!" -ForegroundColor Yellow
Write-Host "  - MongoDB should be on localhost:27017" -ForegroundColor Yellow
Write-Host "  - PostgreSQL should be on localhost:5432" -ForegroundColor Yellow
Write-Host "  - Database name: tweb_anime_pg" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Starting servers in separate windows..." -ForegroundColor Cyan
Write-Host ""

# Start Data Server (Express + MongoDB)
Write-Host "Starting Data Server (Express + MongoDB) on port 4001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\data-server-express'; Write-Host 'Data Server (MongoDB)' -ForegroundColor Cyan; npm start"

Start-Sleep -Seconds 2

# Start Main Server (Express + Handlebars)
Write-Host "Starting Main Server (Express + Handlebars) on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\main-server-express'; Write-Host 'Main Server' -ForegroundColor Cyan; npm start"

Start-Sleep -Seconds 2

# Start Spring Boot Server
Write-Host "Starting Spring Boot Server (PostgreSQL) on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\spring-server'; Write-Host 'Spring Boot Server (PostgreSQL)' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Health checks:" -ForegroundColor Cyan
Write-Host "  Main Server: http://localhost:3000/health" -ForegroundColor White
Write-Host "  Data Server: http://localhost:4001/health" -ForegroundColor White
Write-Host "  Spring Boot: http://localhost:8080/health" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
