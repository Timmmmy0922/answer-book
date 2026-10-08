@echo off
rem ============================================================
rem  Answer Book - local dev server
rem  Double-click this file to start. Close the window to stop.
rem  (This file cd's to its own folder, so it always works.)
rem ============================================================

cd /d "%~dp0"
title Answer Book - dev server (http://localhost:3000)

echo.
echo   Answer Book / 答案之书
echo   ------------------------------------------------
echo   Folder : %CD%
echo   URL    : http://localhost:3000
echo.
echo   Keep this window OPEN while you browse the site.
echo   Press Ctrl+C (or just close the window) to stop.
echo.

if not exist "node_modules\next\package.json" (
  echo   node_modules not found - running npm install first...
  echo.
  call npm install
  echo.
)

call npm run dev

echo.
echo   Server stopped.
pause
