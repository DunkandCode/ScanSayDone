@echo off
REM DelayedExpansion DESACTIVADO globalmente: la expansion de "!" en el
REM parseo corrompe argumentos del usuario que contengan "!" (puertos,
REM rutas). Solo se habilita en un setlocal puntual y de solo lectura
REM (mensaje de puerto invalido, mas abajo), nunca en un ambito que
REM procese argumentos arbitrarios.
setlocal EnableExtensions DisableDelayedExpansion
REM ============================================================
REM  ScanSayDone front - dev-saydone.bat
REM  Envoltorio CMD (amistoso) del manager de servidores:
REM    scripts\dev-servers.ps1  (verificacion por ruta, kills por
REM    PID verificado, nunca por nombre de imagen).
REM
REM  Uso (verbos, tambien desde terminal):
REM    dev-saydone.bat start [puerto]   arranca npm run dev en primer
REM                                     plano en 127.0.0.1:puerto
REM                                     (default 3000). Preflight: si el
REM                                     puerto esta ocupado muestra el
REM                                     dueno exacto y SE NIEGA a arrancar
REM                                     (Next nunca deriva a 3001+ oculto).
REM                                     El puerto se valida de forma
REM                                     inyeccion-segura (solo digitos,
REM                                     1-65535; nunca se interpola en CMD).
REM    dev-saydone.bat list             lista procesos/servidores de este
REM                                     proyecto (solo lectura).
REM    dev-saydone.bat stop             detiene SOLO arboles verificados de
REM                                     este proyecto, con confirmacion por
REM                                     arbol. SIN passthrough de argumentos
REM                                     (anti-inyeccion).
REM    dev-saydone.bat stop-whatif      simulacion (WhatIf): muestra que se
REM                                     detendria sin matar nada. En el
REM                                     manager, -WhatIf SIEMPRE gana a -Yes.
REM    dev-saydone.bat test             preflight del 3120 y luego
REM                                     npm run test:a11y (servidor
REM                                     gestionado por Playwright).
REM
REM  Sin argumentos: menu interactivo (doble clic).
REM  Codigos de salida: 0 ok | 1 puerto ocupado / accion cancelada |
REM  2 uso invalido o puerto no verificable.
REM ============================================================

set "APP_DIR=%~dp0"
cd /d "%APP_DIR%" || (echo ERROR: no se pudo entrar en %APP_DIR% & exit /b 1)

set "PSMGR=powershell -NoProfile -ExecutionPolicy Bypass -File scripts\dev-servers.ps1"

if "%~1"=="" goto :menu

set "VERB=%~1"
if /i "%VERB%"=="start"       goto :start
if /i "%VERB%"=="list"        goto :list
if /i "%VERB%"=="stop"        goto :stop
if /i "%VERB%"=="stop-whatif" goto :stop_whatif
if /i "%VERB%"=="test"        goto :test
REM Mensaje de verbo invalido ESTATICO: el verbo es input del usuario y
REM expandirlo sin comillas (echo ... %VERB%) permitia inyeccion CMD
REM ("unknown&<comando>" ejecutaba <comando> como comando separado).
REM Nunca se hace echo del verbo ni de los argumentos recibidos.
echo Verbo desconocido (por seguridad el texto recibido no se muestra).
echo Uso: %~nx0 [start [puerto] ^| list ^| stop ^| stop-whatif ^| test]
exit /b 2

:menu
cls
echo ============================================================
echo   ScanSayDone front - servidores dev/prueba
echo ============================================================
echo   1. start  - arrancar servidor dev en 127.0.0.1:3000
echo               (start [puerto] por linea de comandos)
echo   2. list   - listar servidores de este proyecto (solo lectura)
echo   3. stop   - detener servidores verificados de este proyecto
echo               (pide confirmacion; nunca toca procesos ajenos)
echo               (por terminal: "stop-whatif" simula sin detener nada)
echo   4. test   - npm run test:a11y (servidor 3120 de Playwright)
echo   5. salir
echo.
REM Despacho por ETIQUETAS. En la version anterior "if errorlevel N cmd & cmd2"
REM ejecutaba cmd2 SIEMPRE ("&" no queda dentro del if): las opciones 1-3
REM volvian al menu tras un pause SIN ejecutar su accion (bug P1 de review).
choice /c 12345 /n /m "Opcion: "
if errorlevel 5 exit /b 0
if errorlevel 4 goto :opt_test
if errorlevel 3 goto :opt_stop
if errorlevel 2 goto :opt_list
if errorlevel 1 goto :opt_start
REM Entrada inutil/EOF (choice sin seleccion valida): salir, nunca hacer bucle.
exit /b 2

:opt_test
call :test
pause
goto :menu

:opt_stop
call :stop
pause
goto :menu

:opt_list
call :list
pause
goto :menu

:opt_start
call :start
goto :menu

:start
REM El valor del usuario se guarda SIEMPRE entre comillas y se valida desde la
REM variable de entorno con un comando PowerShell ESTATICO: el valor NUNCA se
REM interpola en una linea de comandos de CMD (anti-inyeccion; ej. "3000&...").
REM Solo despues de validar digitos y rango se expande %DEV_SERVER_PORT%.
set "DEV_SERVER_PORT=%~2"
if not defined DEV_SERVER_PORT set "DEV_SERVER_PORT=3000"
powershell -NoProfile -ExecutionPolicy Bypass -Command "if ($env:DEV_SERVER_PORT -notmatch '^[1-9][0-9]{0,4}$' -or ([int]$env:DEV_SERVER_PORT -gt 65535)) { exit 1 } else { exit 0 }"
if not errorlevel 1 goto :start_port_ok
REM Display del valor invalido con DelayedExpansion PUNTUAL: la linea se
REM parsea con la expansion ya activa y su resultado NO se re-parsea como CMD,
REM asi que "3000&echo INJECTED" se muestra inerte (ningun marcador externo).
setlocal EnableDelayedExpansion
echo Puerto invalido ^(solo digitos, 1-65535^): !DEV_SERVER_PORT!
endlocal
exit /b 2
:start_port_ok

echo.
echo === Preflight del puerto %DEV_SERVER_PORT% (lectura; no se toca nada) ===
%PSMGR% -Action CheckPort -Port %DEV_SERVER_PORT%
if errorlevel 2 (
    echo No se pudo verificar el puerto %DEV_SERVER_PORT%. Por seguridad NO se arranca nada.
    exit /b 2
)
if errorlevel 1 (
    echo.
    echo PUERTO %DEV_SERVER_PORT% OCUPADO: NO se arranca otro servidor.
    echo   - Si el dueno es de este proyecto: cierra su terminal o usa "%~nx0 stop".
    echo   - Si es ajeno: cierralos manualmente en su proceso dueño, o usa otro
    echo     puerto: "%~nx0 start ^<puerto^>".
    exit /b 1
)

echo.
echo Arrancando servidor de desarrollo en http://127.0.0.1:%DEV_SERVER_PORT%
echo (primer plano: Ctrl+C en esta ventana para detenerlo)
echo.
call npm run dev -- --hostname 127.0.0.1 --port %DEV_SERVER_PORT%
exit /b %errorlevel%

:list
%PSMGR% -Action List
exit /b %errorlevel%

:stop
REM SIN passthrough de argumentos (anti-inyeccion): la version anterior
REM concatenaba tokens arbitrarios tras "-Action Stop" en la linea del
REM manager (stop "& <cmd>" o flags inventados podian colarse). Formas fijas:
REM "stop" (confirmacion por arbol) y el verbo dedicado "stop-whatif".
if not "%~2"=="" goto :stop_badargs
echo El manager pedira confirmacion POR ARBOL verificado antes de detener algo.
%PSMGR% -Action Stop
exit /b %errorlevel%

:stop_whatif
if not "%~2"=="" goto :stop_badargs
echo SIMULACION ^(WhatIf^): se muestra que se detendria; NO se toca nada.
echo ^(En el manager, -WhatIf SIEMPRE prevalece sobre -Yes.^)
%PSMGR% -Action Stop -WhatIf
exit /b %errorlevel%

:stop_badargs
echo Argumentos extra no admitidos; por seguridad NO se reenvian al manager.
echo Formas validas:
echo   "%~nx0 stop"          detiene con confirmacion por arbol
echo   "%~nx0 stop-whatif"   simulacion completa, no detiene nada
echo   scripts/CI: powershell -File scripts\dev-servers.ps1 -Action Stop [-Yes ^| -Confirm:$false]
exit /b 2

:test
echo.
echo === Preflight del puerto 3120 (lectura; no se toca nada) ===
%PSMGR% -Action CheckPort -Port 3120
if errorlevel 2 (
    echo No se pudo verificar el 3120; Playwright lo validara al arrancar.
    goto :test_run
)
if errorlevel 1 (
    echo.
    echo Puerto 3120 OCUPADO: el test fallaria al arrancar su servidor.
    echo   - Si el dueno es de este proyecto: cierra su terminal o usa "%~nx0 stop".
    echo   - Si es ajeno: cierralos manualmente en su proceso dueño.
    exit /b 1
)
:test_run
echo.
echo Ejecutando npm run test:a11y ^(build + servidor 3120 gestionado por Playwright^)...
call npm run test:a11y
exit /b %errorlevel%
