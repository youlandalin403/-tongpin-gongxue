@echo off
chcp 65001 >nul
g++ algorithm.cpp -std=c++17 -O2 -o algorithm.exe
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)
echo Build success: algorithm.exe generated.
pause
