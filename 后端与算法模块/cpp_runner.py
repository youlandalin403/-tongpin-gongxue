# cpp_runner.py
import subprocess
import json
import os

CPP_EXE_PATH = "cpp_modules/algorithm.exe"
INPUT_JSON = "cpp_modules/input.json"
OUTPUT_JSON = "cpp_modules/result.json"


def run_cpp_mode(mode, input_data):
    # 写入 input.json
    with open(INPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(input_data, f, ensure_ascii=False, indent=2)

    # 调用 C++ exe
    cmd = [CPP_EXE_PATH, mode, INPUT_JSON, OUTPUT_JSON]
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        return {
            "success": False,
            "error": f"C++ 执行失败，返回码 {result.returncode}",
            "stderr": result.stderr
        }

    if not os.path.exists(OUTPUT_JSON):
        return {"success": False, "error": "C++ 未生成 result.json"}

    with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
        output_data = json.load(f)

    return output_data


def call_interest_match(user_id, user_tags, joined_group_ids, groups, top_n=5):
    input_data = {
        "user_id": user_id,
        "user_tags": user_tags,
        "joined_group_ids": joined_group_ids,
        "top_n": top_n,
        "groups": groups
    }
    return run_cpp_mode("match", input_data)


def call_score_calc(user_id, group_id, duration, content, continuous_days, is_duplicate_today=False):
    input_data = {
        "user_id": user_id,
        "group_id": group_id,
        "duration": duration,
        "content": content,
        "continuous_days": continuous_days,
        "is_duplicate_today": is_duplicate_today
    }
    return run_cpp_mode("score", input_data)


def call_ranking_calc(group_id, users, top_n=10, type="week"):
    input_data = {
        "group_id": group_id,
        "type": type,
        "top_n": top_n,
        "users": users
    }
    return run_cpp_mode("ranking", input_data)