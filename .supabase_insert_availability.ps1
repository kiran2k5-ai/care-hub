$envfile = '.env.local'
$lines = Get-Content $envfile
$url = ($lines | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' }) -replace '^NEXT_PUBLIC_SUPABASE_URL=' , ''
$key = ($lines | Where-Object { $_ -match '^SUPABASE_SERVICE_ROLE_KEY=' }) -replace '^SUPABASE_SERVICE_ROLE_KEY=' , ''
if (-not $url -or -not $key) {
  Write-Error 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  exit 1
}
Write-Host "Using URL: $url"
$uri = "$url/rest/v1/doctor_profiles?select=id&limit=1"
try {
  $doctors = Invoke-RestMethod -Uri $uri -Headers @{ apikey = $key; Authorization = "Bearer $key" } -ErrorAction Stop
} catch {
  Write-Error "Failed to fetch doctor_profiles: $_"
  exit 2
}
if (-not $doctors -or $doctors.Count -eq 0) {
  Write-Host 'No doctor_profiles rows found.'
  exit 0
}
$docid = $doctors[0].id
Write-Host "Found doctor id: $docid"
$body = @{ doctor_id = $docid; weekday = 1; start_time = '09:00'; end_time = '17:00' }
try {
  $resp = Invoke-RestMethod -Uri ("$url/rest/v1/doctor_availability") -Method Post -Headers @{ apikey = $key; Authorization = "Bearer $key"; 'Content-Type' = 'application/json' } -Body ($body | ConvertTo-Json -Depth 5) -ErrorAction Stop
  Write-Host 'Inserted availability:'
  Write-Host ($resp | ConvertTo-Json -Compress)
} catch {
  Write-Error "Failed to insert availability: $_"
  exit 3
}

# verify
try {
  $verify = Invoke-RestMethod -Uri ("$url/rest/v1/doctor_availability?doctor_id=eq.$docid") -Headers @{ apikey = $key; Authorization = "Bearer $key" } -ErrorAction Stop
  Write-Host 'Current availability for doctor:'
  Write-Host ($verify | ConvertTo-Json -Compress)
} catch {
  Write-Error "Failed to verify availability: $_"
}
