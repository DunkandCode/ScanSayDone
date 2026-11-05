@echo off
chcp 65001 >nul
setlocal

set "ACTION=menu"
if not "%~1"=="" set "ACTION=%~1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ops\servidor.ps1" -Action %ACTION%

endlocal
