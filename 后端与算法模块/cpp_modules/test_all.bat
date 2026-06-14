@echo off
chcp 65001 >nul
if not exist algorithm.exe (
    echo algorithm.exe not found. Please run build_windows.bat first.
    pause
    exit /b 1
)
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
echo All tests finished. Please check result_samples folder.
pause
