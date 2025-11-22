# ─────────────────────────────────────────────────
# Test API Backend
# ─────────────────────────────────────────────────

# Lire la cle depuis .env
$envContent = Get-Content .env -Raw
$API_KEY = ($envContent -split "`n" | Where-Object { $_ -match '^API_KEY=' }) -replace 'API_KEY=', ''
$API_KEY = $API_KEY.Trim()

if (-not $API_KEY) {
    Write-Host "ERREUR: API_KEY introuvable dans .env" -ForegroundColor Red
    exit 1
}

Write-Host "OK: API_KEY chargee depuis .env" -ForegroundColor Green
Write-Host ""

# URL de ton backend Vercel
$API_URL = "https://prompt-generator-te7l703h5-francois-menguys-projects.vercel.app"

# Test 1: Health Check
Write-Host "TEST 1: Health check" -ForegroundColor Cyan
Write-Host "URL: $API_URL/api/health" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/health" -Method GET -ErrorAction Stop
    Write-Host "SUCCES!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Details: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 2: Generate Prompt
Write-Host "TEST 2: Generate prompt" -ForegroundColor Cyan
Write-Host "URL: $API_URL/api/generate-prompt" -ForegroundColor Gray
Write-Host "API Key: $($API_KEY.Substring(0,15))..." -ForegroundColor Gray
Write-Host ""

# Corps de la requete
$body = @{
    selectedTags = @("cinematic", "dramatic")
    subjectData = @{
        subject = "dragon flying"
        style = "photorealistic"
    }
}

$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = $API_KEY
}

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/generate-prompt" `
        -Method POST `
        -Headers $headers `
        -Body ($body | ConvertTo-Json -Depth 3) `
        -ErrorAction Stop
    
    Write-Host "SUCCES!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prompt genere:" -ForegroundColor Cyan
    Write-Host $response.prompt -ForegroundColor White
    
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Details: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host "Tests termines" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Gray
