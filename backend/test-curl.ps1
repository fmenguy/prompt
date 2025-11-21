# ─────────────────────────────────────────────────
# 📁 backend/test-curl.ps1
# ─────────────────────────────────────────────────

# Lire la clé depuis .env
$envContent = Get-Content .env -Raw
$API_KEY = ($envContent -split "`n" | Where-Object { $_ -match '^API_KEY=' }) -replace 'API_KEY=', ''

if (-not $API_KEY) {
    Write-Host "❌ API_KEY introuvable dans .env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ API_KEY chargée depuis .env" -ForegroundColor Green

# URL de ton backend Vercel
$API_URL = "https://prompt-generator-d1gj3beak-francois-menguys-projects.vercel.app"

# Test 1: Health check
Write-Host "`n🔍 Test 1: Health check..." -ForegroundColor Cyan
curl.exe "$API_URL/api/health"

# Test 2: Generate prompt
Write-Host "`n🔍 Test 2: Generate prompt..." -ForegroundColor Cyan
$body = @{
    selectedTags = @("cinematic", "dramatic")
    subjectData = @{
        subject = "sunset over mountains"
        style = "photorealistic"
    }
} | ConvertTo-Json

curl.exe -X POST "$API_URL/api/generate-prompt" `
    -H "Content-Type: application/json" `
    -H "x-api-key: $API_KEY" `
    -d $body
