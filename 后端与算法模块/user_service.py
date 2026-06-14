# user_service.py
import sqlite3
import hashlib
import time

DB_FILE = "app.db"


def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()


# 注册新用户
def register(username, password, nick="", school="", college="", grade=""):
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        hashed_pwd = hash_password(password)
        create_time = time.strftime("%Y-%m-%d %H:%M:%S")
        sql = """INSERT INTO user(username, password, nick, school, college, grade, create_time) 
                 VALUES(?,?,?,?,?,?,?)"""
        cur.execute(sql, (username, hashed_pwd, nick, school, college, grade, create_time))
        conn.commit()
        return {"success": True, "msg": "注册成功", "uid": cur.lastrowid}
    except sqlite3.IntegrityError:
        return {"success": False, "msg": "用户名已存在", "uid": None}
    finally:
        conn.close()


# 登录验证
def login(username, password):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    hashed_pwd = hash_password(password)
    row = cur.execute(
        "SELECT id, role, nick FROM user WHERE username=? AND password=?",
        (username, hashed_pwd)
    ).fetchone()
    conn.close()
    if row:
        return {"success": True, "uid": row[0], "role": row[1], "nick": row[2]}
    return {"success": False, "error": "用户名或密码错误"}


# 保存用户兴趣标签（支持多标签）
def save_user_tag(uid, tag_list):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("DELETE FROM user_tag WHERE uid=?", (uid,))
    for tag in tag_list:
        cur.execute("INSERT INTO user_tag (uid, tag_name) VALUES (?, ?)", (uid, tag))
    conn.commit()
    conn.close()


# 获取用户已选标签
def get_user_tag(uid):
    conn = sqlite3.connect(DB_FILE)
    rows = conn.execute("SELECT tag_name FROM user_tag WHERE uid=?", (uid,)).fetchall()
    conn.close()
    return [row[0] for row in rows]


# 修改用户角色
def set_user_role(uid, new_role):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("UPDATE user SET role=? WHERE id=?", (new_role, uid))
    conn.commit()
    conn.close()


# 自测
if __name__ == "__main__":
    # 1. 注册
    print(register("admin", "123456", "管理员"))

    # 2. 登录
    result = login("admin", "123456")
    print(result)

    if result["success"]:
        uid = result["uid"]

        # 3. 保存标签
        save_user_tag(uid, ["Python", "考研", "机器学习"])

        # 4. 读取标签
        print("用户标签：", get_user_tag(uid))

        # 5. 修改角色为管理员
        set_user_role(uid, 1)
        print("修改角色完成")