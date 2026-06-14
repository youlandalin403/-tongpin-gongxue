# init_db.py
import sqlite3

# 使用规范要求的数据库名
conn = sqlite3.connect("app.db")
cur = conn.cursor()

with open("init.sql", "r", encoding="utf-8") as f:
    sql = f.read()

cur.executescript(sql)
conn.commit()
conn.close()

print("数据库 app.db 创建成功！")