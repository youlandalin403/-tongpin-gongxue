@echo off
chcp 65001 >nul
echo Building algorithm.exe ...
cl /std:c++17 /EHsc /utf-8 algorithm.cpp /Fe:algorithm.exe
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)
echo Build success: algorithm.exe generated.
pause
