@echo off
REM SYNAPSE LOCAL CORE installer - windows
title SYNAPSE LOCAL CORE installer
echo SYAPSE LOCAL CORE INSTALLER
echo --------------------------------

REM ---- 1. install ollama if missing
where ollama >nul 2>&1
if %errorlevel%==0 (
  echo ollama already installed
) else (
  echo installing ollama via winget...
  winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements
  if errorlevel 1 (
    echo winget failed. grab the installer from https://ollama.com/download/windows then run this again.
    pause
    exit /b 1
  )
)

REM ---- 2. size the models to the machine
for /f "tokens=2 delims==" %%a in ('wmic OS get TotalVisibleMemorySize /value ^| find "="') do set RAM_KB=%%a
set /a RAM_GB=%RAM_KB%/1048576
echo detected %RAM_GB% GB memory

if %RAM_GB% GEQ 28 (
  set BRAIN=hf.co/orcarouter/Qwen3.8-27B-Uncensored-GGUF:Q4_K_M
  set CODER=qwen3-coder:30b
) else if %RAM_GB% GEQ 14 (
  set BRAIN=hf.co/bartowski/cognitivecomputations_Dolphin3.0-Mistral-24B-GGUF:Q3_K_M
  set CODER=qwen3-coder:30b
) else (
  set BRAIN=hf.co/bartowski/gemma-2-9b-it-abliterated-GGUF:Q4_K_M
  set CODER=qwen2.5-coder:7b
  echo light machine detected: using the 9B brain and 7B coder
)

REM ---- 3. pull the models
echo pulling brain: %BRAIN%  (this is the big one, several GB)
ollama pull %BRAIN%
echo pulling coder: %CODER%
ollama pull %CODER%

REM ---- 4. search engine (optional, needs docker)
where docker >nul 2>&1
if %errorlevel%==0 (
  echo starting searxng on :8888
  docker rm -f synapse-search >nul 2>&1
  docker run -d --name synapse-search -p 8888:8080 searxng/searxng
  set SEARCH_URL=http://localhost:8888/search
) else (
  echo docker not found - skipping searxng ^(the agent still works, just without web search^)
  set SEARCH_URL=
)

REM ---- 5. write the config
(
  echo {
  echo   "brain": "%BRAIN%",
  echo   "coder": "%CODER%",
  echo   "ollama": "http://localhost:11434",
  echo   "search": "%SEARCH_URL%"
  echo }
) > synapse-local.json

echo --------------------------------
echo local core online. chat now:  ollama run %BRAIN%
pause
