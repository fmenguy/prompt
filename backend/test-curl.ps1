# Configuration
$VERCEL_URL = "https://prompt-generator-gyd6j9grg-francois-menguys-projects.vercel.app"
$API_KEY = "sk_prod_e378005a6c584b1a841f125839fc4924" //leak lol donc révoqué

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Test 1 : Health Check" -ForegroundColor Yellow
Write-Host "=======================================`n" -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri "$VERCEL_URL/api/health" -Method GET
    Write-Host "OK : Health Check reussi" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "ERREUR : $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "Test 2 : Generate Prompt (cle valide)" -ForegroundColor Yellow
Write-Host "=======================================`n" -ForegroundColor Cyan

$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = $API_KEY
}

$body = @{
    selectedTags = @("cinematic", "dramatic lighting")
    subjectData = @{
        subject = "dragon"
        details = "flying over mountains"
    }
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$VERCEL_URL/api/generate-prompt" -Method POST -Headers $headers -Body $body
    Write-Host "OK : Prompt genere" -ForegroundColor Green
    Write-Host "`nPrompt :`n" -ForegroundColor Cyan
    Write-Host $result.prompt -ForegroundColor White
    Write-Host "`nMetadonnees :`n" -ForegroundColor Cyan
    $result | ConvertTo-Json
} catch {
    Write-Host "ERREUR : $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details : $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "Test 3 : Mauvaise cle (doit echouer)" -ForegroundColor Yellow
Write-Host "=======================================`n" -ForegroundColor Cyan

$badHeaders = @{
    "Content-Type" = "application/json"
    "x-api-key" = "wrong_key"
}

try {
    Invoke-RestMethod -Uri "$VERCEL_URL/api/generate-prompt" -Method POST -Headers $badHeaders -Body $body
    Write-Host "PROBLEME : Cle invalide acceptee !" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
        Write-Host "OK : Cle invalide rejetee (401)" -ForegroundColor Green
    } else {
        Write-Host "Erreur inattendue : $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host "`n=======================================" -ForegroundColor Cyan
Write-Host "Tests termines" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
