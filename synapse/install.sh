#!/usr/bin/env bash
# SYNAPSE LOCAL CORE installer — mac & linux
# installs Ollama, picks models for your memory, starts SearXNG search
set -e

echo "⚡ SYNAPSE LOCAL CORE INSTALLER"
echo "--------------------------------"

# ---- 1. install ollama if missing
if ! command -v ollama >/dev/null 2>&1; then
  echo "▸ installing ollama…"
  if command -v brew >/dev/null 2>&1 && [ "$(uname -s)" = "Darwin" ]; then
    brew install -cask ollama || curl -fsSL https://ollama.com/install.sh | sh
  else
    curl -fsSL https://ollama.com/install.sh | sh
  fi
else
  echo "▸ ollama already installed"
fi

# ---- 2. size the models to the machine
RAM_KB=0
if [ "$(uname -s)" = "Darwin" ]; then RAM_KB=$(( $(sysctl -n hw.memsize) / 1024 ));
elif [ -r /proc/meminfo ]; then RAM_KB=$(awk '/MemTotal/{print $2}' /proc/meminfo);
else RAM_KB=0; fi
RAM_GB=$(( RAM_KB / 1024 / 1024 ))
echo "▸ detected ${RAM_GB} GB memory"

if [ "$RAM_GB" -ge 28 ]; then
  BRAIN="hf.co/orcarouter/Qwen3.8-27B-Uncensored-GGUF:Q4_K_M"
  CODER="qwen3-coder:30b"
elif [ "$RAM_GB" -ge 14 ]; then
  BRAIN="hf.co/bartowski/cognitivecomputations_Dolphin3.0-Mistral-24B-GGUF:Q3_K_M"
  CODER="qwen3-coder:30b"
else
  BRAIN="hf.co/bartowski/gemma-2-9b-it-abliterated-GGUF:Q4_K_M"
  CODER="qwen2.5-coder:7b"
  echo "▸ light machine detected: using the 9B brain and 7B coder"
fi

# ---- 3. pull the models (the big download)
echo "▸ pulling brain: $BRAIN  (this is the big one, several GB)"
ollama pull "$BRAIN"
echo "▸ pulling coder: $CODER"
ollama pull "$CODER"

# ---- 4. search engine (optional, needs docker)
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "▸ starting searxng on :8888"
  docker rm -f synapse-search >/dev/null 2>&1 || true
  docker run -d --name synapse-search -p 8888:8080 searxng/searxng >/dev/null
  SEARCH_URL="http://localhost:8888/search"
else
  echo "▸ docker not found — skipping searxng (the agent still works, just without web search)"
  SEARCH_URL=""
fi

# ---- 5. write the config synapse reads
cat > synapse-local.json <<EOF
{
  "brain": "$BRAIN",
  "coder": "$CODER",
  "ollama": "http://localhost:11434",
  "search": "$SEARCH_URL"
}
EOF

echo "--------------------------------"
echo "✓ local core online. test it:"
echo "  curl http://localhost:11434/api/tags"
echo "  chat now:  ollama run ${BRAIN}"
echo "⚡ synapse local core — installed"