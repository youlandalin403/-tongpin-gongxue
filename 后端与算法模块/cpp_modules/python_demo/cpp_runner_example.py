import json
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EXE = BASE_DIR / "algorithm.exe"
INPUT = BASE_DIR / "input_samples" / "score_input_sample.json"
OUTPUT = BASE_DIR / "result.json"

cmd = [str(EXE), "score", str(INPUT), str(OUTPUT)]
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("C++ module failed")
    print(result.stderr)
else:
    print("C++ module executed successfully")
    data = json.loads(OUTPUT.read_text(encoding="utf-8"))
    print(json.dumps(data, ensure_ascii=False, indent=2))
