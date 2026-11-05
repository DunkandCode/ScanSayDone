param(
    [ValidateSet('menu','ver','dev','rebuild','limpiar','estado','navegador','')]
    [string]$Action = 'menu'
)

$ErrorActionPreference = 'Continue'
$projectRoot = 'E:\Trabajos\scan'
$nextDir = Join-Path $projectRoot '.next'
$buildIdFile = Join-Path $nextDir 'BUILD_ID'
$isMenuMode = ($Action -eq 'menu' -or $Action -eq '')

Write-Host "=== Servidor World B ===" -ForegroundColor Cyan
Write-Host "Proyecto: $projectRoot" -ForegroundColor Gray
Write-Host ""

function Get-PortOwner {
    param([int]$Port)
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                Where-Object { $_.State -eq 'Listen' } | 
                Select-Object -First 1
        if ($conn) {
            return $conn.OwningProcess
        }
    } catch {}
    
    try {
        $netstat = netstat -ano | Select-String ":$Port\s+.*LISTENING"
        if ($netstat) {
            $parts = $netstat[0] -split '\s+'
            if ($parts.Count -ge 5) {
                return [int]$parts[-1]
            }
        }
    } catch {}
    
    return $null
}

function Free-Port {
    param([int]$Port)
    
    $ownerPid = Get-PortOwner -Port $Port
    
    if (-not $ownerPid) {
        Write-Host "Puerto $Port ya estaba libre" -ForegroundColor Green
        return
    }
    
    try {
        $proc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
        $cmdLine = if ($proc) {
            $cim = Get-CimInstance Win32_Process -Filter "ProcessId=$ownerPid" -ErrorAction SilentlyContinue
            if ($cim) { $cim.CommandLine } else { $proc.Path }
        } else {
            "(proceso no encontrado)"
        }
        
        Write-Host "Puerto $Port ocupado por PID $ownerPid" -ForegroundColor Yellow
        Write-Host "  Comando: $($cmdLine.Substring(0,[Math]::Min(90,$cmdLine.Length)))" -ForegroundColor Gray
        
        $isOurProject = $cmdLine -like '*Trabajos\scan*'
        
        if (-not $isOurProject) {
            $owns3000 = (Get-PortOwner -Port 3000) -eq $ownerPid
            $owns3200 = (Get-PortOwner -Port 3200) -eq $ownerPid
            $isOurProject = $owns3000 -or $owns3200
        }
        
        if ($isOurProject) {
            Write-Host "  Matando proceso del proyecto..." -ForegroundColor Yellow
            Stop-Process -Id $ownerPid -Force -ErrorAction Stop
            Start-Sleep -Seconds 2
            
            $stillOwner = Get-PortOwner -Port $Port
            if ($stillOwner -eq $ownerPid) {
                Write-Host "  ERROR: Proceso sigue ocupando el puerto" -ForegroundColor Red
            } else {
                Write-Host "  OK: Puerto $Port liberado" -ForegroundColor Green
            }
        } else {
            Write-Host "  ERROR: Proceso no pertenece al proyecto, no se puede matar" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ERROR al liberar puerto: $_" -ForegroundColor Red
    }
}

function Get-ProjectProcesses {
    try {
        $procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
                 Where-Object { $_.CommandLine -like '*Trabajos\scan*' }
        return $procs
    } catch {
        Write-Host "ERROR al listar procesos: $_" -ForegroundColor Red
        return @()
    }
}

function Wait-ForUrl {
    param(
        [string]$Url,
        [int]$TimeoutSec = 60
    )
    
    $endTime = (Get-Date).AddSeconds($TimeoutSec)
    
    Write-Host "Esperando respuesta de $Url (max $TimeoutSec s)..." -ForegroundColor Gray
    
    while ((Get-Date) -lt $endTime) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "OK: Servidor respondiendo 200" -ForegroundColor Green
                return $true
            }
        } catch {}
        Start-Sleep -Seconds 2
    }
    
    Write-Host "ERROR: Timeout esperando respuesta" -ForegroundColor Red
    return $false
}

function Open-Browser {
    param([string]$Url)
    try {
        Start-Process $Url
        Write-Host "Navegador abierto: $Url" -ForegroundColor Green
    } catch {
        Write-Host "No se pudo abrir el navegador: $_" -ForegroundColor Yellow
    }
}

function Show-EndMessage {
    Write-Host ""
    Write-Host "=== IMPORTANTE ===" -ForegroundColor Yellow
    Write-Host "No mezcles 'npm run dev' con 'npm run build' en la misma sesion" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Rutas disponibles:" -ForegroundColor Yellow
    Write-Host "  / /aboutus /contactus /faqs /pricing /privacy /service-detail /services /terms" -ForegroundColor Gray
}

function Invoke-Estado {
    Write-Host "=== Estado del proyecto ===" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Git:" -ForegroundColor Yellow
    try {
        $log = git -C $projectRoot log --oneline -1 2>&1
        Write-Host "  $log" -ForegroundColor Gray
    } catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
    }
    
    try {
        $status = git -C $projectRoot status --short 2>&1 | Select-Object -First 10
        if ($status) {
            Write-Host "  Cambios:" -ForegroundColor Yellow
            $status | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        } else {
            Write-Host "  Working tree limpio" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    
    Write-Host "Build:" -ForegroundColor Yellow
    if (Test-Path $buildIdFile) {
        $buildInfo = Get-Item $buildIdFile
        Write-Host "  BUILD_ID existe: $($buildInfo.LastWriteTime)" -ForegroundColor Green
    } else {
        Write-Host "  BUILD_ID no existe (no hay build)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    Write-Host "Puertos:" -ForegroundColor Yellow
    foreach ($port in @(3000, 3200)) {
        $ownerPid = Get-PortOwner -Port $port
        if ($ownerPid) {
            Write-Host "  Puerto $port`: PID $ownerPid" -ForegroundColor Yellow
        } else {
            Write-Host "  Puerto $port`: libre" -ForegroundColor Green
        }
    }
}

function Invoke-Limpiar {
    Write-Host "=== Limpieza de procesos ===" -ForegroundColor Cyan
    Write-Host ""
    
    $procs = Get-ProjectProcesses
    
    if ($procs.Count -eq 0) {
        Write-Host "No hay procesos del proyecto activos" -ForegroundColor Green
    } else {
        Write-Host "Procesos encontrados: $($procs.Count)" -ForegroundColor Yellow
        Write-Host ""
        
        foreach ($proc in $procs) {
            $cmdPreview = $proc.CommandLine.Substring(0,[Math]::Min(90,$proc.CommandLine.Length))
            Write-Host "  PID $($proc.ProcessId) · $cmdPreview" -ForegroundColor Gray
        }
        
        Write-Host ""
        
        $shouldKill = $true
        if ($isMenuMode) {
            $answer = Read-Host "¿Matar todos estos procesos? (S/N)"
            $shouldKill = $answer -eq 'S' -or $answer -eq 's'
        }
        
        if ($shouldKill) {
            $killed = 0
            foreach ($proc in $procs) {
                try {
                    Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
                    Write-Host "  Matado PID $($proc.ProcessId)" -ForegroundColor Green
                    $killed++
                } catch {
                    Write-Host "  ERROR matando PID $($proc.ProcessId): $_" -ForegroundColor Red
                }
            }
            Write-Host ""
            Write-Host "Procesos matados: $killed" -ForegroundColor Green
        } else {
            Write-Host "Cancelado" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    
    Write-Host "Liberando puertos..." -ForegroundColor Yellow
    Free-Port -Port 3000
    Free-Port -Port 3200
    
    Write-Host ""
    
    if (Test-Path $nextDir) {
        try {
            Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
            Write-Host ".next eliminado" -ForegroundColor Green
        } catch {
            Write-Host "ERROR eliminando .next: $_" -ForegroundColor Red
        }
    } else {
        Write-Host ".next no existia" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Limpieza completada" -ForegroundColor Green
}

function Invoke-Ver {
    Write-Host "=== Iniciando servidor de produccion ===" -ForegroundColor Cyan
    Write-Host ""
    
    Free-Port -Port 3200
    Write-Host ""
    
    $needBuild = $true
    if (Test-Path $buildIdFile) {
        $buildTime = (Get-Item $buildIdFile).LastWriteTime
        $newestSrc = Get-ChildItem -Path (Join-Path $projectRoot 'src') -Include *.js,*.jsx,*.scss,*.css -Recurse -ErrorAction SilentlyContinue |
                     Sort-Object LastWriteTime -Descending |
                     Select-Object -First 1
        
        if ($newestSrc -and $newestSrc.LastWriteTime -lt $buildTime) {
            $needBuild = $false
            Write-Host "Build actualizado ($($buildTime.ToString('yyyy-MM-dd HH:mm')))" -ForegroundColor Green
        }
    }
    
    if ($needBuild) {
        Write-Host "Compilando proyecto..." -ForegroundColor Yellow
        try {
            Set-Location $projectRoot
            npm run build 2>&1 | ForEach-Object { Write-Host $_ }
            if ($LASTEXITCODE -ne 0) {
                Write-Host "ERROR: Build fallido" -ForegroundColor Red
                return
            }
            Write-Host "Build completado" -ForegroundColor Green
        } catch {
            Write-Host "ERROR en build: $_" -ForegroundColor Red
            return
        }
    }
    
    Write-Host ""
    Write-Host "Arrancando servidor en puerto 3200..." -ForegroundColor Yellow
    
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'npx'
        $psi.Arguments = 'next start -p 3200'
        $psi.WorkingDirectory = $projectRoot
        $psi.UseShellExecute = $true
        $psi.WindowStyle = 'Normal'
        
        $process = [System.Diagnostics.Process]::Start($psi)
        Write-Host "Servidor iniciado (PID: $($process.Id))" -ForegroundColor Green
    } catch {
        Write-Host "ERROR arrancando servidor: $_" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    
    if (Wait-ForUrl -Url 'http://localhost:3200/' -TimeoutSec 60) {
        Open-Browser -Url 'http://localhost:3200/'
        Show-EndMessage
    } else {
        Write-Host ""
        Write-Host "El servidor no respondio. Comando manual:" -ForegroundColor Yellow
        Write-Host "  cd $projectRoot" -ForegroundColor Gray
        Write-Host "  npx next start -p 3200" -ForegroundColor Gray
    }
}

function Invoke-Dev {
    Write-Host "=== Iniciando servidor de desarrollo ===" -ForegroundColor Cyan
    Write-Host ""
    
    Free-Port -Port 3000
    Write-Host ""
    
    Write-Host "Arrancando servidor dev en puerto 3000..." -ForegroundColor Yellow
    
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'npm'
        $psi.Arguments = 'run dev'
        $psi.WorkingDirectory = $projectRoot
        $psi.UseShellExecute = $true
        $psi.WindowStyle = 'Normal'
        
        $process = [System.Diagnostics.Process]::Start($psi)
        Write-Host "Servidor dev iniciado (PID: $($process.Id))" -ForegroundColor Green
    } catch {
        Write-Host "ERROR arrancando servidor dev: $_" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    
    if (Wait-ForUrl -Url 'http://localhost:3000/' -TimeoutSec 60) {
        Open-Browser -Url 'http://localhost:3000/'
        Show-EndMessage
    } else {
        Write-Host ""
        Write-Host "El servidor no respondio. Comando manual:" -ForegroundColor Yellow
        Write-Host "  cd $projectRoot" -ForegroundColor Gray
        Write-Host "  npm run dev" -ForegroundColor Gray
    }
}

function Invoke-Rebuild {
    Write-Host "=== Reconstruyendo proyecto ===" -ForegroundColor Cyan
    Write-Host ""
    
    Free-Port -Port 3200
    Write-Host ""
    
    if (Test-Path $nextDir) {
        try {
            Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
            Write-Host ".next eliminado" -ForegroundColor Green
        } catch {
            Write-Host "ERROR eliminando .next: $_" -ForegroundColor Red
            return
        }
    }
    
    Write-Host ""
    Write-Host "Compilando proyecto..." -ForegroundColor Yellow
    
    try {
        Set-Location $projectRoot
        npm run build 2>&1 | ForEach-Object { Write-Host $_ }
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Build fallido" -ForegroundColor Red
            return
        }
        Write-Host "Build completado" -ForegroundColor Green
    } catch {
        Write-Host "ERROR en build: $_" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "Arrancando servidor en puerto 3200..." -ForegroundColor Yellow
    
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = 'npx'
        $psi.Arguments = 'next start -p 3200'
        $psi.WorkingDirectory = $projectRoot
        $psi.UseShellExecute = $true
        $psi.WindowStyle = 'Normal'
        
        $process = [System.Diagnostics.Process]::Start($psi)
        Write-Host "Servidor iniciado (PID: $($process.Id))" -ForegroundColor Green
    } catch {
        Write-Host "ERROR arrancando servidor: $_" -ForegroundColor Red
        return
    }
    
    Write-Host ""
    
    if (Wait-ForUrl -Url 'http://localhost:3200/' -TimeoutSec 60) {
        Open-Browser -Url 'http://localhost:3200/'
        Show-EndMessage
    } else {
        Write-Host ""
        Write-Host "El servidor no respondio. Comando manual:" -ForegroundColor Yellow
        Write-Host "  cd $projectRoot" -ForegroundColor Gray
        Write-Host "  npx next start -p 3200" -ForegroundColor Gray
    }
}

function Invoke-Navegador {
    Write-Host "=== Abriendo navegador ===" -ForegroundColor Cyan
    Write-Host ""
    
    if (Wait-ForUrl -Url 'http://localhost:3200/' -TimeoutSec 5) {
        Open-Browser -Url 'http://localhost:3200/'
    } else {
        Write-Host "Servidor no respondiendo en 3200. Arranca con 'ver' o 'rebuild'." -ForegroundColor Yellow
    }
}

function Show-Menu {
    while ($true) {
        Write-Host "=== Menu principal ===" -ForegroundColor Cyan
        Write-Host "1) Ver servidor (produccion en 3200)" -ForegroundColor Gray
        Write-Host "2) Dev servidor (desarrollo en 3000)" -ForegroundColor Gray
        Write-Host "3) Rebuild (recompilar y arrancar)" -ForegroundColor Gray
        Write-Host "4) Limpiar (matar procesos y borrar .next)" -ForegroundColor Gray
        Write-Host "5) Navegador (abrir 3200 si responde)" -ForegroundColor Gray
        Write-Host "6) Estado (git, build, puertos)" -ForegroundColor Gray
        Write-Host "0) Salir" -ForegroundColor Gray
        Write-Host ""
        
        $choice = Read-Host "Elige opcion"
        
        switch ($choice) {
            '1' { Invoke-Ver }
            '2' { Invoke-Dev }
            '3' { Invoke-Rebuild }
            '4' { Invoke-Limpiar }
            '5' { Invoke-Navegador }
            '6' { Invoke-Estado }
            '0' { 
                Write-Host "Saliendo..." -ForegroundColor Green
                return 
            }
            default { Write-Host "Opcion no valida" -ForegroundColor Red }
        }
        
        Write-Host ""
        Write-Host "Presiona ENTER para continuar..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Clear-Host
    }
}

switch ($Action) {
    'menu' { Show-Menu }
    'ver' { Invoke-Ver }
    'dev' { Invoke-Dev }
    'rebuild' { Invoke-Rebuild }
    'limpiar' { Invoke-Limpiar }
    'estado' { Invoke-Estado }
    'navegador' { Invoke-Navegador }
    default { Show-Menu }
}
