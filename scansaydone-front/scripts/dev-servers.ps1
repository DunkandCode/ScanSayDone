<#
.SYNOPSIS
    Lista y detiene servidores de desarrollo/prueba de ScanSayDone (este repo).

.DESCRIPTION
    List (default) es solo lectura: muestra procesos node.exe cuya linea de comando
    referencia la raiz del proyecto (verificacion por ruta), puerto de escucha,
    PIDs, URL y estado (escuchando / fila TCP sin State = ocupacion viva /
    colgado sin listener). Las filas TCP con State VACIO se reportan como
    ocupacion viva (nunca como libres): Get-NetTCPConnection puede devolver
    State vacio en listeners vivos.

    Stop detiene SOLO procesos verificados por ruta, tras confirmacion
    (ShouldProcess), con taskkill /PID <pid> /T /F (el PID y sus hijos vivos).
    NUNCA mata procesos por nombre de imagen (node.exe), NUNCA toca procesos de
    otros proyectos/MCP, NUNCA detiene PIDs sin ruta verificada (se listan como
    "no verificado" y se dejan intactos). -WhatIf SIEMPRE prevalece sobre -Yes
    (-Yes -WhatIf = dry-run puro: no se mata nada). Exit del Stop: 0 sin
    supervivientes verificados / 1 si queda alguno vivo (incluido si se
    cancelo la confirmacion).

    Nota: los wrappers npm/npx de procesos huerfanos no llevan la ruta del
    proyecto en su comando; se muestran como informativos y NO se detienen.

.PARAMETER Action
    List (solo lectura, default) | Stop (pide confirmacion; -WhatIf simula y
    prevalece sobre -Yes) | CheckPort (lectura; veredicto por sonda de bind
    exclusivo en 127.0.0.1 + dueno de -Port si es identificable; exit 0 libre /
    1 ocupado / 2 sin determinar).

.PARAMETER Port
    Solo con -Action CheckPort: puerto a verificar (1-65535).

.PARAMETER Yes
    En Stop: omite la confirmacion interactiva (uso explicito/scripts/CI).
    Solo afecta a PIDs verificados por ruta; nunca amplia el alcance.
    -WhatIf SIEMPRE prevalece sobre -Yes: con -Yes -WhatIf NO se detiene nada.

.EXAMPLE
    powershell -File scripts\dev-servers.ps1 -Action List
    powershell -File scripts\dev-servers.ps1 -Action CheckPort -Port 3000
    powershell -File scripts\dev-servers.ps1 -Action Stop
    powershell -File scripts\dev-servers.ps1 -Action Stop -WhatIf
    powershell -File scripts\dev-servers.ps1 -Action Stop -Confirm:$false
    powershell -File scripts\dev-servers.ps1 -Action Stop -Yes
    powershell -File scripts\dev-servers.ps1 -Action Stop -Yes -WhatIf
#>
[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'High')]
param(
    [ValidateSet('List', 'Stop', 'CheckPort')]
    [string]$Action = 'List',
    [switch]$Yes,
    [int]$Port = 0
)

$ErrorActionPreference = 'Stop'

# Con -WhatIf, la autocarga de modulos (alias CIM/NetTCPIP) ensucia el dry-run
# con lineas "Whatif: Establecer alias...". Se importan antes con la preferencia
# desactivada para que la simulacion muestre solo lo relevante.
if ($WhatIfPreference) {
    $WhatIfPreference = $false
    Import-Module CimCmdlets, NetTCPIP -ErrorAction SilentlyContinue
    $WhatIfPreference = $true
}

# --- Raiz del proyecto: carpeta padre de scripts\ (normalizada: minusculas, \) ---
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path -replace '/', '\'
$ProjectRootNorm = $ProjectRoot.ToLowerInvariant()

function Normalize-CommandLine {
    param([string]$CommandLine)
    if (-not $CommandLine) { return '' }
    return ($CommandLine -replace '/', '\').ToLowerInvariant()
}

# Verificacion por ruta con FRONTERA: el match de la raiz normalizada debe
# terminar en un limite de ruta REAL: barra invertida, comilla o fin de linea.
# Un Contains simple daria falso positivo con hermanos de nombre prefijo:
#   - "...\scansaydone-front-v2\node_modules" contiene "...\scansaydone-front"
#     (guion tras la raiz) -> RECHAZADO.
#   - "...\scansaydone-front - copia\..." (hermano con espacio y guion, el caso
#     del repo real "ScanSayDone - copia") -> RECHAZADO: tras el espacio viene
#     "- copia", que NO es una bandera (guion suelto + espacio + palabra).
# Un espacio SOLO cuenta como frontera si lo que sigue (tras espacios) es una
# bandera (-x, --x, /x) o el fin de la linea: cubre lineas del tipo
# "... <raiz> --port 3000" sin abrir la puerta a hermanos con espacios.
# Se revisan TODAS las ocurrencias de la raiz (fail-closed si ninguna vale).
function Test-ProjectCommandLine {
    param([string]$CommandLine)
    $norm = Normalize-CommandLine $CommandLine
    if ($norm -eq '') { return $false }
    $idx = $norm.IndexOf($ProjectRootNorm, [System.StringComparison]::Ordinal)
    while ($idx -ge 0) {
        $after = $idx + $ProjectRootNorm.Length
        if ($after -ge $norm.Length) { return $true } # fin de la linea de comando
        $next = $norm[$after]
        if ($next -eq '\' -or $next -eq [char]34 -or $next -eq [char]39) { return $true }
        if ($next -eq ' ') {
            $rest = $norm.Substring($after).TrimStart()
            # Espacio-frontera solo con bandera despues o solo espacios hasta EOL.
            # "- copia" (guion + espacio) NO matchea: [A-Za-z] exige letra pegada
            # al(los) guion(es). Tokens normales (hermanos con espacio) tampoco.
            if ($rest -eq '' -or $rest -match '^[/-]-?[A-Za-z]') { return $true }
        }
        $idx = $norm.IndexOf($ProjectRootNorm, $after, [System.StringComparison]::Ordinal)
    }
    return $false
}

# Diagnostico de dueno de puerto: PID, nombre de imagen, comando (truncado) y
# verificacion de pertenencia a ESTE proyecto. Lo usa CheckPort tanto para el
# caso "ocupado" como para el aviso de listener en otra direccion/interfaz.
function Write-PortOwner {
    param([uint32]$OwnerPid, [int]$Port)
    $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$OwnerPid" -ErrorAction SilentlyContinue
    $isProject = Test-ProjectCommandLine $(if ($owner) { $owner.CommandLine } else { $null })
    Write-Host ("PUERTO {0} OCUPADO por PID {1} ({2})" -f $Port, $OwnerPid, $(if ($owner) { $owner.Name } else { 'desconocido' })) -ForegroundColor Yellow
    $ocmd = ''
    if ($owner -and $owner.CommandLine) {
        $ocmd = $owner.CommandLine
        if ($ocmd.Length -gt 160) { $ocmd = $ocmd.Substring(0, 160) + '...' }
    }
    if ($ocmd) { Write-Host ("  Comando: {0}" -f $ocmd) -ForegroundColor Yellow }
    if ($isProject) {
        Write-Host '  Verificado como proceso de ESTE proyecto (puedes detenerlo con -Action Stop).' -ForegroundColor Yellow
    } else {
        Write-Host '  NO verificado como proyecto (puede ser ajeno: MCP, otro proyecto...). NO se toca.' -ForegroundColor Yellow
    }
}

Write-Host "Proyecto: $ProjectRoot"
Write-Host "Accion  : $Action"

# --- PID del proceso que invoco este script (wrapper cmd del BAT, shell, npm):
# se anota para (1) marcarlo en List como wrapper y (2) NO ofrecerlo como
# objetivo de Stop (matarlo detendria este mismo comando a mitad de ejecucion).
$CallerPid = $null
try {
    $CallerPid = [uint32](Get-CimInstance Win32_Process -Filter "ProcessId=$PID" -ErrorAction SilentlyContinue).ParentProcessId
    if (-not $CallerPid) { $CallerPid = $null }
} catch { $CallerPid = $null }

# --- 0. CheckPort (lectura + sonda de bind; no se toca ningun proceso) ---
# Exit: 0 = libre | 1 = ocupado (se imprime el dueno si es identificable) |
# 2 = no verificable. Lo usa dev-saydone.bat como preflight de "start"/"test":
# si el puerto esta ocupado se muestra el dueno y el BAT se niega a arrancar
# otro servidor.
#
# Veredicto por SONDA DE BIND EXCLUSIVO en 127.0.0.1 (la direccion exacta a la
# que bindea el servidor dev). Mediciones en vivo (2026-11-11) demostraron que
# netstat -ano -p tcp PUEDE OMITIR filas de listeners activos y que
# Get-NetTCPConnection PUEDE devolver State vacio en listeners: filtrar por
# "LISTENING" en cualquiera de las dos fuentes produce falsos "LIBRE" ->
# EADDRINUSE en el servidor que arranca despues + servidor original perturbado.
# La sonda reproduce el bind real (TcpListener en 127.0.0.1:Port con
# ExclusiveAddressUse=true): si la sonda no puede bindear, el servidor tampoco
# podra; si la sonda falla por razon no determinable, NO se afirma nada
# (exit 2, fail-closed: se rechaza arrancar).
#
# TOCTOU asumido y documentado: entre el Stop() de la sonda y el bind real del
# servidor existe una ventana minuscula en la que el puerto queda de nuevo sin
# reservar. Esta sonda NO transfiere ninguna reserva al proceso servidor; solo
# certifica que el bind era posible en el instante de la comprobacion.
if ($Action -eq 'CheckPort') {
    if ($Port -lt 1 -or $Port -gt 65535) {
        Write-Host "Puerto invalido (1-65535): $Port" -ForegroundColor Red
        exit 2
    }

    # Diagnostico de dueno (best-effort, NO decide el veredicto): filas de
    # Get-NetTCPConnection para el puerto SIN filtro de State (en listeners
    # vivos se ha medido State vacio; la fila aun identifica al OwningProcess)
    # + PIDs LISTENING de netstat. netstat vacio ya no es fatal: solo degrada
    # el diagnostico de dueno, nunca el veredicto (que es de la sonda).
    $hits = @()
    try {
        $hits = @(Get-NetTCPConnection -ErrorAction SilentlyContinue |
            Where-Object { [int]$_.LocalPort -eq $Port })
    } catch { $hits = @() }
    $nsRaw = @()
    $nsOk = $false
    try {
        $nsRaw = @(& netstat.exe -ano -p tcp 2>$null | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' })
        $nsOk = ($nsRaw.Count -gt 0)
    } catch { $nsRaw = @() }
    $nsPids = @($nsRaw | ForEach-Object {
        if ($_ -match ('^TCP\s+\S+:' + $Port + '\s+\S+\s+LISTENING\s+(\d+)$')) { [uint32]$Matches[1] }
    })
    $ownerIds = @(@($hits | ForEach-Object { [uint32]$_.OwningProcess }) + $nsPids | Sort-Object -Unique)

    # Sonda de bind exclusivo (veredicto).
    $bindVerdict = $null # 'free' | 'inuse' | 'error'
    $bindErr = ''
    $probe = $null
    try {
        $probe = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, [int]$Port)
        $probe.ExclusiveAddressUse = $true
        $probe.Start()
        $bindVerdict = 'free'
    } catch [System.Net.Sockets.SocketException] {
        $bindVerdict = 'inuse'
        $bindErr = $_.Exception.SocketErrorCode.ToString()
    } catch {
        $bindVerdict = 'error'
        $bindErr = $_.Exception.Message
    } finally {
        if ($probe) { try { $probe.Stop() } catch { } }
    }

    if ($bindVerdict -eq 'error') {
        Write-Warning "No se pudo sondear el bind de 127.0.0.1:$Port ($bindErr)."
        Write-Host "Puerto ${Port}: NO VERIFICABLE — por seguridad se considera NO libre." -ForegroundColor Red
        exit 2
    }

    if ($bindVerdict -eq 'inuse') {
        $detail = $(if ($bindErr) { " [$bindErr]" } else { '' })
        Write-Host ("Puerto {0}: OCUPADO (bind exclusivo de 127.0.0.1:{0} rechazado{1})." -f $Port, $detail) -ForegroundColor Yellow
        if ($ownerIds.Count -eq 0) {
            Write-Host '  Dueno no identificable por netstat/WMI (listener oculto para ambas fuentes).' -ForegroundColor Yellow
            Write-Host '  NO se arranca nada sobre ese puerto.' -ForegroundColor Yellow
            if (-not $nsOk) { Write-Warning '  (ademas netstat no respondio: diagnostico de dueno degradado)' }
            exit 1
        }
        foreach ($op in $ownerIds) { Write-PortOwner -OwnerPid $op -Port $Port }
        exit 1
    }

    # bindVerdict = 'free'
    if ($ownerIds.Count -gt 0) {
        # El bind de 127.0.0.1 seria posible, pero existe(n) fila(s) TCP del
        # mismo puerto en otra direccion/interfaz o estado. Medido en vivo
        # (2026-11-11): Windows PERMITE que un bind especifico 127.0.0.1 coexista
        # con un listener 0.0.0.0 ajeno — el servidor nuevo quedaria "tapando"
        # al original en loopback (lo altera). Un preflight que busca exclusividad
        # del puerto NO debe dejar pasar ese caso: se rechaza (fail-closed).
        Write-Host ("Puerto {0}: OCUPADO (bind posible en 127.0.0.1, pero hay listener/conexion del mismo puerto en otra direccion — arrancar alteraria al existente)." -f $Port) -ForegroundColor Yellow
        foreach ($op in $ownerIds) { Write-PortOwner -OwnerPid $op -Port $Port }
        exit 1
    }
    Write-Host ("Puerto {0}: LIBRE (bind exclusivo de 127.0.0.1:{0} verificado; nadie escucha)." -f $Port) -ForegroundColor Green
    exit 0
}

# --- 1. Inventariar procesos node/cmd ---
$procs = @(Get-CimInstance Win32_Process -Filter "Name='node.exe' OR Name='cmd.exe'" -ErrorAction SilentlyContinue)
$byPid = @{}
foreach ($p in $procs) { $byPid[[uint32]$p.ProcessId] = $p }

# --- 2. Verificados: ruta del proyecto en la linea de comando (con frontera) ---
$verified = @{} # pid -> proc
foreach ($p in $procs) {
    if (Test-ProjectCommandLine $p.CommandLine) {
        $verified[[uint32]$p.ProcessId] = $p
    }
}

if ($verified.Count -eq 0) {
    Write-Host ''
    Write-Host 'No hay procesos de este proyecto (ninguna linea de comando referencia la raiz).' -ForegroundColor Green
    exit 0
}

# --- 3. Arboles entre verificados (enlaces padre vivo; los huerfanos quedan singleton) ---
$childrenOf = @{}
foreach ($p in $verified.Values) {
    $ppid = [uint32]$p.ParentProcessId
    if ($verified.ContainsKey($ppid) -and $ppid -ne [uint32]$p.ProcessId) {
        if (-not $childrenOf.ContainsKey($ppid)) { $childrenOf[$ppid] = @() }
        $childrenOf[$ppid] += $p
    }
}

function Get-VerifiedDescendants {
    param([object]$Root)
    $out = @()
    $queue = @(, $Root)
    $seen = @{ [uint32]$Root.ProcessId = $true }
    while ($queue.Count -gt 0) {
        $cur = $queue[0]
        $queue = @($queue | Select-Object -Skip 1)
        $ck = [uint32]$cur.ProcessId
        $out += $cur
        if ($childrenOf.ContainsKey($ck)) {
            foreach ($c in $childrenOf[$ck]) {
                $cc = [uint32]$c.ProcessId
                if (-not $seen.ContainsKey($cc)) {
                    $seen[$cc] = $true
                    $queue += $c
                }
            }
        }
    }
    return $out
}

$trees = @() # @{ Root; Members(PIDs) }
$assigned = @{}
foreach ($v in $verified.Values) {
    $pidV = [uint32]$v.ProcessId
    $ppid = [uint32]$v.ParentProcessId
    if ($verified.ContainsKey($ppid) -and $ppid -ne $pidV) { continue } # no es raiz
    $members = @(Get-VerifiedDescendants $v)
    foreach ($m in $members) { $assigned[[uint32]$m.ProcessId] = $true }
    $trees += @{ Root = $v; MemberPids = @($members | ForEach-Object { [uint32]$_.ProcessId }) }
}
# Defensa: cualquier verificado fuera de arbol (ciclo por PID reusado) como singleton
foreach ($pidV in $verified.Keys) {
    if (-not $assigned.ContainsKey($pidV)) {
        $trees += @{ Root = $verified[$pidV]; MemberPids = @($pidV) }
    }
}

# --- 4. Puertos de escucha/ocupacion ---
# DOS mapas por PID. $listeners: State='Listen' (listener confirmado).
# $blankState: fila TCP con State VACIO/nulo — medido en vivo (2026-11-11):
# Get-NetTCPConnection PUEDE devolver State vacio en listeners vivos. Esas
# filas son OCUPACION VIVA de puerto: se listan (nunca se etiquetan libres)
# pero se DISTINGUEN del listener confirmado. PID 0 (TimeWait, sistema) se
# ignora. Estados transitorios cerrados explicitos (TimeWait, Closed...) no
# cuentan como ocupacion de un servidor.
$listeners = @{}   # pid -> [ports] con State 'Listen'
$blankState = @{}  # pid -> [ports] con fila TCP sin State (ocupacion viva)
try {
    # Nota: NO usar "-State Listen" en el filtro del cmdlet: es poco fiable
    # (omite algunos binds de loopback y puede vaciar State). Se pide todo y
    # se clasifica en PowerShell.
    $conns = @(Get-NetTCPConnection -ErrorAction SilentlyContinue)
    foreach ($c in $conns) {
        $op = [uint32]$c.OwningProcess
        if ($op -eq 0) { continue }
        $st = ''
        if ($null -ne $c.State) { $st = [string]$c.State }
        $lp = [int]$c.LocalPort
        if ($st -eq 'Listen') {
            if (-not $listeners.ContainsKey($op)) { $listeners[$op] = @() }
            if ($listeners[$op] -notcontains $lp) { $listeners[$op] += $lp }
        } elseif ([string]::IsNullOrWhiteSpace($st)) {
            if (-not $blankState.ContainsKey($op)) { $blankState[$op] = @() }
            if ($blankState[$op] -notcontains $lp) { $blankState[$op] += $lp }
        }
    }
} catch {
    Write-Warning "No se pudieron consultar puertos: $($_.Exception.Message)"
}

# --- 5. Reporte ---
Write-Host ''
Write-Host '=== Servidores de este proyecto (verificados por ruta en linea de comando) ==='
$treeRows = @()
foreach ($t in $trees) {
    $rootPid = [uint32]$t.Root.ProcessId
    $lports = @()
    $bports = @()
    foreach ($mp in $t.MemberPids) {
        if ($listeners.ContainsKey($mp)) { $lports += $listeners[$mp] }
        if ($blankState.ContainsKey($mp)) { $bports += $blankState[$mp] }
    }
    $lports = @($lports | Sort-Object -Unique)
    # Sin doble cuenta: puerto ya listado como listener no se repite como fila sin State
    $bports = @($bports | Where-Object { $lports -notcontains $_ } | Sort-Object -Unique)
    $allPorts = @(@($lports) + @($bports) | Sort-Object -Unique)
    $state = if ($lports.Count -gt 0) { 'escuchando' }
             elseif ($bports.Count -gt 0) { 'fila TCP sin State (ocupacion viva; listener no confirmado)' }
             else { 'SIN listener (posible colgado)' }
    if ($CallerPid -and $rootPid -eq $CallerPid) { $state = 'wrapper de ESTE comando (no es un servidor)' }
    $url = if ($allPorts.Count -gt 0) { ($allPorts | ForEach-Object { "http://localhost:$_" }) -join ', ' } else { '-' }
    $cmd = $t.Root.CommandLine
    if ($cmd -and $cmd.Length -gt 100) { $cmd = $cmd.Substring(0, 100) + '...' }
    $treeRows += [pscustomobject]@{
        Puerto    = ($allPorts -join ', ')
        URL       = $url
        PidRaiz   = $rootPid
        PidsArbol = ($t.MemberPids -join ' ')
        Estado    = $state
        Comando   = $cmd
    }
}
$treeRows | Sort-Object PidRaiz | Format-List

# Wrappers npm/npx sin ruta del proyecto: solo informativos, NUNCA se detienen
$wrapperPattern = '(npm-cli\.js|npx-cli\.js)'
$allVerifiedPids = @($verified.Keys)
$wrapperRows = @()
foreach ($p in $procs) {
    if ($p.Name -ne 'node.exe') { continue }
    $pidP = [uint32]$p.ProcessId
    if ($allVerifiedPids -contains $pidP) { continue }
    $norm = Normalize-CommandLine $p.CommandLine
    if ($norm -eq '' -or $norm -notmatch $wrapperPattern) { continue }
    if ($norm -notmatch '(next|run dev)') { continue }
    $cmd = $p.CommandLine
    if ($cmd -and $cmd.Length -gt 100) { $cmd = $cmd.Substring(0, 100) + '...' }
    $wrapperRows += [pscustomobject]@{ Pid = $pidP; Comando = $cmd }
}
if ($wrapperRows.Count -gt 0) {
    Write-Host '=== Posibles wrappers npm/npx huerfanos (SIN ruta verificada — NO se detienen) ==='
    $wrapperRows | Sort-Object Pid | Format-Table -AutoSize
    Write-Host 'Estos procesos no referencian la raiz del proyecto en su comando, por lo que no se'
    Write-Host 'puede probar que son de este proyecto. Si ya no sirven, cierralos manualmente por PID.'
}

# Puertos vigilados (3000 manual, 3120 a11y) con dueno NO verificado.
# Se mira $listeners Y $blankState: un ocupante con fila sin State (viva)
# tambien es ocupacion — nunca se declara "libre" un puerto con fila TCP viva.
$watched = 3000, 3120
Write-Host ''
Write-Host '=== Puertos vigilados (3000 dev manual, 3120 a11y) ==='
$foundWatch = $false
$watchPids = @(@($listeners.Keys) + @($blankState.Keys) | Sort-Object -Unique)
foreach ($op in $watchPids) {
    $lp = @()
    $bp = @()
    if ($listeners.ContainsKey($op)) { $lp = @($listeners[$op] | Where-Object { $watched -contains $_ }) }
    if ($blankState.ContainsKey($op)) { $bp = @($blankState[$op] | Where-Object { $watched -contains $_ }) }
    if ($lp.Count -eq 0 -and $bp.Count -eq 0) { continue }
    if ($allVerifiedPids -contains $op) { continue }
    $foundWatch = $true
    $stTxt = if ($lp.Count -gt 0 -and $bp.Count -gt 0) { 'Listen + fila sin State' }
             elseif ($lp.Count -gt 0) { 'Listen' }
             else { 'fila sin State (listener no confirmado)' }
    $owner = Get-CimInstance Win32_Process -Filter "ProcessId=$op" -ErrorAction SilentlyContinue
    $ocmd = ''
    if ($owner -and $owner.CommandLine) { $ocmd = $owner.CommandLine; if ($ocmd.Length -gt 100) { $ocmd = $ocmd.Substring(0, 100) + '...' } }
    Write-Host ("PUERTO OCUPADO POR PROCESO NO VERIFICADO (TCP {0}): puerto {1} PID {2} ({3})" -f $stTxt, ((@($lp) + @($bp) | Sort-Object -Unique) -join ','), $op, $(if ($owner) { $owner.Name } else { 'desconocido' })) -ForegroundColor Yellow
    Write-Host ("  Comando: {0}" -f $ocmd) -ForegroundColor Yellow
    Write-Host '  Este script NO lo detiene (no pertenece a este proyecto). Liberalo manualmente.' -ForegroundColor Yellow
}
if (-not $foundWatch) {
    $occ = @()
    foreach ($mp in $allVerifiedPids) {
        if ($listeners.ContainsKey($mp)) { $occ += $listeners[$mp] }
        if ($blankState.ContainsKey($mp)) { $occ += $blankState[$mp] }
    }
    $projWatched = @($occ | Where-Object { $watched -contains $_ } | Sort-Object -Unique)
    if ($projWatched.Count -gt 0) {
        Write-Host ("Puertos vigilados en uso por ESTE proyecto: {0}" -f ($projWatched -join ', '))
    } else {
        Write-Host '3000 y 3120 libres (sin listener y sin fila TCP viva conocida).'
    }
}

# --- 6. Stop: solo PIDs verificados, confirmacion por arbol, taskkill /T /F ---
if ($Action -eq 'Stop') {
    Write-Host ''
    Write-Host '=== Detencion (solo arboles verificados de este proyecto) ==='
    foreach ($row in ($treeRows | Sort-Object PidRaiz)) {
        if ($CallerPid -and [uint32]$row.PidRaiz -eq $CallerPid) {
            Write-Host "Omitido: PID $($row.PidRaiz) es el wrapper de este mismo comando (no un servidor)."
            continue
        }
        # Re-verificacion ANTES de cada taskkill: los arboles verificados pueden
        # solaparse en el SO a traves de wrappers NO verificados (npm/npx u
        # otros intermedios), de modo que un taskkill /T anterior puede haber
        # eliminado ya esta raiz. Si la raiz ya no existe, se registra como
        # "ya detenido" y se continua con el resto; NUNCA se lanza taskkill
        # contra un PID muerto (su exit != 0 + stderr abortaban todo el Stop).
        $stillRoot = $null
        try {
            $stillRoot = Get-CimInstance Win32_Process -Filter "ProcessId=$($row.PidRaiz)" -ErrorAction SilentlyContinue
        } catch { $stillRoot = $null }
        if (-not $stillRoot) {
            Write-Host ("Ya detenido: PID raiz {0} no existe (eliminado al detener un arbol solapado) — se registra y se continua." -f $row.PidRaiz) -ForegroundColor Yellow
            continue
        }
        $target = "PID raiz $($row.PidRaiz) (puertos: $($row.Puerto); estado: $($row.Estado))"
        $doStop = $false
        if ($WhatIfPreference) {
            # -WhatIf SIEMPRE prevalece sobre -Yes (fix MED): dry-run puro.
            # Con -Yes -WhatIf NO se ejecuta ningun taskkill; solo se muestra
            # que se detendria. continue -> siguiente arbol.
            Write-Host ("WhatIf: se detendria {0} — SIMULACION, no se toca nada." -f $target) -ForegroundColor Cyan
            continue
        }
        if ($Yes) {
            $doStop = $true
        } else {
            try {
                $doStop = $PSCmdlet.ShouldProcess($target, 'taskkill /PID <raiz> /T /F')
            } catch {
                # Host sin prompt interactivo: fallo cerrado (no se detiene nada)
                Write-Host "  Sin confirmacion interactiva disponible para $target — OMITIDO." -ForegroundColor Yellow
                Write-Host '  (En terminal real se pregunta; o usa -Yes / -Confirm:$false para omitir la pregunta.)'
                $doStop = $false
            }
        }
        if ($doStop) {
            Write-Host "Deteniendo $target ..."
            # PS 5.1: con $ErrorActionPreference='Stop', el stderr de un nativo
            # (taskkill exit != 0, p. ej. PID ya muerto) se materializa como
            # error terminante y abortaba TODO el Stop antes de la verificacion
            # post-stop. Se degrada EAP SOLO alrededor de la llamada nativa y se
            # envuelve en try/catch: el fallo de UN arbol nunca interrumpe los
            # demas arboles ni la verificacion final (taskkill != 0 sigue siendo
            # no-fatal: puede que el proceso ya muriera por otro arbol).
            $out = @()
            $code = -1
            $prevEap = $ErrorActionPreference
            try {
                $ErrorActionPreference = 'Continue'
                $out = @(& taskkill.exe /PID $row.PidRaiz /T /F 2>&1)
                $code = $LASTEXITCODE
            } catch {
                Write-Host "  Excepcion en taskkill: $($_.Exception.Message)" -ForegroundColor Yellow
            } finally {
                $ErrorActionPreference = $prevEap
            }
            $out | ForEach-Object { Write-Host "  $_" }
            if ($code -eq 0) {
                Write-Host "  OK (exit $code)" -ForegroundColor Green
            } else {
                Write-Host "  taskkill exit $code — puede que el proceso ya muriera (hijo de otro PID detenido)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Omitido: $target"
        }
    }

    # Verificacion post-stop
    if ($WhatIfPreference) {
        # Dry-run: no se detuvo nada por diseño; los procesos siguen vivos y
        # eso NO es un fallo. Se reporta la simulacion y se sale limpio (0):
        # nunca se afirma "no queda ninguno" ni se advierten falsos
        # supervivientes en modo simulacion.
        Write-Host ''
        Write-Host 'SIMULACION (WhatIf) completada: NO se detuvo nada (-WhatIf prevalece sobre -Yes).' -ForegroundColor Cyan
        Write-Host 'Nota: procesos NO verificados (otros proyectos, MCP, wrappers huerfanos) NO se tocan.'
        exit 0
    }
    Start-Sleep -Milliseconds 500
    $alive = @()
    foreach ($pidV in $allVerifiedPids) {
        # El wrapper de este mismo comando (BAT/shell que invoco el Stop) sigue
        # vivo por definicion: no es un servidor residual ni se reporta como tal.
        if ($CallerPid -and $pidV -eq [uint32]$CallerPid) { continue }
        $still = Get-CimInstance Win32_Process -Filter "ProcessId=$pidV" -ErrorAction SilentlyContinue
        if ($still) { $alive += $pidV }
    }
    Write-Host ''
    if ($alive.Count -eq 0) {
        Write-Host 'Verificado: no queda ningun proceso verificado de este proyecto.' -ForegroundColor Green
        if ($CallerPid) {
            $callerStill = Get-CimInstance Win32_Process -Filter "ProcessId=$CallerPid" -ErrorAction SilentlyContinue
            if ($callerStill) {
                Write-Host "  (PID $CallerPid es el wrapper de este comando y sigue vivo: esperado, no es un servidor.)"
            }
        }
        Write-Host ''
        Write-Host 'Nota: procesos NO verificados (otros proyectos, MCP, Adobe, wrappers huerfanos) NO se tocan.'
        exit 0
    } else {
        # Nunca exit 0 con un servidor verificado del proyecto vivo: las raices
        # ya muertas por solape se saltaron arriba sin error; los que queden
        # (fallo real de taskkill o confirmacion cancelada) hacen el Stop
        # INCOMPLETO -> exit 1.
        Write-Host ("Quedan vivos (revisa manualmente): {0}" -f ($alive -join ' ')) -ForegroundColor Yellow
        Write-Host 'Stop INCOMPLETO: exit 1 (no se reporta exito con procesos verificados vivos).' -ForegroundColor Yellow
        Write-Host 'Nota: procesos NO verificados (otros proyectos, MCP, Adobe, wrappers huerfanos) NO se tocan.'
        exit 1
    }
}
