@echo off
chcp 65001 >nul
echo Building algorithm.exe ...
cl /std:c++17 /EHsc /utf-8 algorithm.cpp /Fe:algorithm.exe
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)

echo Build success.
if not exist result_samples mkdir result_samples

echo Testing match mode...
algorithm.exe match input_samples\match_input_sample.json result_samples\match_result_sample.json

echo Testing score mode...
algorithm.exe score input_samples\score_input_sample.json result_samples\score_result_sample.json

echo Testing ranking mode...
algorithm.exe ranking input_samples\ranking_input_sample.json result_samples\ranking_result_sample.json

echo Testing validate mode...
algorithm.exe validate input_samples\validate_input_sample.json result_samples\validate_result_sample.json

echo.
echo Build and tests finished.
echo Please submit algorithm.exe, algorithm.cpp, input_samples, result_samples, and docs.
pause
