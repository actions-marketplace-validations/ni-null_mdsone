@echo off
REM Build and generate documentation locally

echo [1/4] Building mdsone package...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo [2/4] Creating output directory...
if not exist "docs-dist" mkdir docs-dist

echo [3/4] Building single-locale pages...
call npx mdsone ./docs/[en] -m -o ./docs-dist/en.html --template normal --site-title "MDSone Documentation - English"
if %errorlevel% neq 0 exit /b %errorlevel%
call npx mdsone ./docs/[zh-TW] -m -o ./docs-dist/zh-TW.html --template normal --site-title "MDSone Documentation - Traditional Chinese"
if %errorlevel% neq 0 exit /b %errorlevel%

echo [4/4] Building combined i18n page...
call npx mdsone ./docs --i18n-mode=zh-TW --template normal --site-title "MDSone Documentation" -o ./docs-dist/index.html
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo Done. Output directory: ./docs-dist
echo Generated files:
echo   - en.html
echo   - zh-TW.html
echo   - index.html
