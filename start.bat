@echo off
setlocal
cd /d "%~dp0"
title Chat Video - Serveur

echo ============================================
echo       CHAT VIDEO - SERVEUR LOCAL
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERREUR : Node.js n'est pas installe ou n'est pas dans le PATH.
  echo Installe Node.js LTS depuis https://nodejs.org/
  echo.
  pause
  exit /b 1
)

node --version
echo.

if not exist "node_modules" (
  echo Installation des dependances...
  call npm install
  if errorlevel 1 (
    echo.
    echo ERREUR pendant npm install.
    pause
    exit /b 1
  )
  echo.
)

echo Demarrage du serveur...
echo.
echo Ouvre ensuite : http://localhost:3000
echo.
echo Pour arreter le serveur : Ctrl+C
echo.
call npm start

if errorlevel 1 (
  echo.
  echo Le serveur s'est arrete avec une erreur.
  pause
)
