@echo off
rem ============================================================
rem  Push this project to GitHub
rem
rem  BEFORE running this file:
rem    1. Go to https://github.com/new
rem    2. Repository name: answer-book
rem    3. Do NOT tick "Add a README file" / .gitignore / license
rem    4. Click "Create repository"
rem
rem  THEN double-click this file.
rem ============================================================

cd /d "%~dp0"
title Push to GitHub

echo.
echo   ================================================
echo    Push "answer-book" to GitHub
echo   ================================================
echo.
echo   Make sure you already created an EMPTY repo named
echo   "answer-book" at https://github.com/new
echo.
echo   (Do not tick README / .gitignore / license there.)
echo.

set "GHUSER="
set /p "GHUSER=Your GitHub username: "
if "%GHUSER%"=="" (
  echo.
  echo   Cancelled - no username entered.
  pause
  exit /b 1
)

set "REPOURL=https://github.com/%GHUSER%/answer-book.git"

echo.
echo   Remote will be: %REPOURL%
echo.
echo   A browser window may pop up asking you to sign in
echo   to GitHub. That is normal - sign in and the upload starts.
echo.

git remote remove origin 2>nul
git remote add origin "%REPOURL%"
git push -u origin main

echo.
if errorlevel 1 (
  echo   Push FAILED. Read the red text above.
  echo   Most common causes:
  echo     - the repo name is not exactly "answer-book"
  echo     - the repo was created WITH a README (not empty)
  echo     - the username is misspelled
) else (
  echo   Push OK. Now go to https://vercel.com/new
  echo   and import this repository.
)
echo.
pause
