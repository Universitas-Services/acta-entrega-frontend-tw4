# verify-docker.ps1
Write-Host "🐳 Docker Verification Script - Mi Proyecto Moderno (Frontend)" -ForegroundColor Cyan

# 1. Verificar que Docker y Docker Compose estén instalados y en ejecución
Write-Host "`n1. Checking Docker status..." -ForegroundColor Yellow
try {
    docker --version
    # Usamos docker compose (con espacio) para la nueva v2
    docker compose version
    Write-Host "✅ Docker is running." -ForegroundColor Green
} catch {
    Write-Host "❌ Docker or Docker Compose not found. Please ensure Docker Desktop is installed and running." -ForegroundColor Red
    exit 1
}

# 2. Revisar si hay contenedores activos
Write-Host "`n2. Checking running containers..." -ForegroundColor Yellow
docker ps

# 3. Probar el entorno de producción
Write-Host "`n3. Testing production environment..." -ForegroundColor Yellow

# Construir la imagen de producción
Write-Host "Building production image (this may take a few minutes)..."
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Docker image." -ForegroundColor Red
    exit 1
}

# Levantar el contenedor en modo detached (-d)
Write-Host "Starting production container..."
docker compose up -d

# Verificamos que el contenedor esté realmente en ejecución
Write-Host "Verifying container status..."
# ✅ --- CORRECCIÓN: Aumentamos el tiempo de espera de 3 a 10 segundos --- ✅
Start-Sleep -Seconds 10
$containerName = "mi-proyecto-moderno-frontend"
$runningContainer = docker ps --filter "name=$containerName" --filter "status=running" --quiet

if (-not $runningContainer) {
    Write-Host "❌ Failed to start Docker container. It's not in 'running' state." -ForegroundColor Red
    Write-Host "Showing container logs for debugging:" -ForegroundColor Yellow
    docker logs $containerName
    docker compose down # Intentar limpiar
    exit 1
}
Write-Host "✅ Container is running successfully." -ForegroundColor Green


# Esperar a que el servidor de Next.js esté listo
Write-Host "Waiting for the application to be ready (approx. 15 seconds)..."
Start-Sleep -Seconds 15

# 4. Verificar si la aplicación es accesible, con reintentos
Write-Host "Testing if the application is accessible at http://localhost:3000..."
$maxRetries = 4
$retryCount = 0
$success = $false

while ($retryCount -lt $maxRetries -and -not $success) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 15
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Production app is accessible! Status: $($response.StatusCode)" -ForegroundColor Green
            $success = $true
        } else {
            Write-Host "❌ App returned an unexpected status: $($response.StatusCode)" -ForegroundColor Red
            break
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "⏳ Attempt $retryCount failed. Retrying in 10 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
        } else {
            Write-Host "❌ Production app is not accessible after $maxRetries attempts." -ForegroundColor Red
            Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
}

# 5. Limpieza: Detener y eliminar los contenedores
Write-Host "`n5. Stopping production containers..." -ForegroundColor Yellow
docker compose down

if ($success) {
    Write-Host "`n🎉 Docker verification completed successfully!" -ForegroundColor Cyan
}