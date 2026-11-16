@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "NODE_OPTIONS=--use-system-ca"

where node >nul 2>nul
if errorlevel 1 (
  echo 没有找到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)

where gh >nul 2>nul
if errorlevel 1 (
  echo 没有找到 GitHub CLI，请先安装：https://cli.github.com/
  pause
  exit /b 1
)

node tools\publish.js
if errorlevel 1 (
  echo.
  pause
  exit /b 1
)

start "" "https://liucuso4.github.io/chunhua/"
timeout /t 3 >nul
exit /b 0
