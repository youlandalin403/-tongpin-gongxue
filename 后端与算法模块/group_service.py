# group_service.py
import sqlite3

DB_FILE = "app.db"


# 1. 创建小组
def create_group(creator_uid, group_name, group_desc, tag, max_member=20, cycle_days=7):
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute('''INSERT INTO group_info(group_name, group_desc, creator_uid, tag, max_member, cycle_days, create_time)
                       VALUES(?,?,?,?,?,?,datetime('now'))''',
                    (group_name, group_desc, creator_uid, tag, max_member, cycle_days))
        conn.commit()
        return {"success": True, "msg": "创建成功", "gid": cur.lastrowid}
    except Exception as e:
        return {"success": False, "msg": str(e), "gid": None}
    finally:
        conn.close()


# 2. 小组广场（支持标签筛选）
def get_all_group(filter_tag=""):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    if filter_tag.strip() == "":
        sql = '''SELECT g.*, u.nick, 
                        (SELECT COUNT(id) FROM user_group WHERE gid=g.gid) as current_member
                 FROM group_info g 
                 LEFT JOIN user u ON g.creator_uid = u.id'''
        res = cur.execute(sql).fetchall()
    else:
        sql = '''SELECT g.*, u.nick,
                        (SELECT COUNT(id) FROM user_group WHERE gid=g.gid) as current_member
                 FROM group_info g 
                 LEFT JOIN user u ON g.creator_uid = u.id 
                 WHERE g.tag LIKE ?'''
        res = cur.execute(sql, ('%' + filter_tag + '%',)).fetchall()
    conn.close()

    group_list = []
    for item in res:
        group_list.append({
            "gid": item[0],
            "group_name": item[1],
            "desc": item[2],
            "creator_uid": item[3],
            "tag": item[4],
            "create_time": item[5],
            "max_member": item[6],
            "cycle_days": item[7],
            "creator_nick": item[8],
            "current_member": item[9]
        })
    return group_list


# 3. 小组详情
def get_group_detail(gid):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    g_info = cur.execute('''SELECT g.*, u.nick 
                            FROM group_info g 
                            LEFT JOIN user u ON g.creator_uid=u.id 
                            WHERE g.gid=?''', (gid,)).fetchone()

    if not g_info:
        conn.close()
        return None

    current_member = cur.execute("SELECT COUNT(id) FROM user_group WHERE gid=?", (gid,)).fetchone()[0]
    conn.close()

    return {
        "gid": g_info[0],
        "group_name": g_info[1],
        "desc": g_info[2],
        "creator_uid": g_info[3],
        "tag": g_info[4],
        "create_time": g_info[5],
        "max_member": g_info[6],
        "cycle_days": g_info[7],
        "creator_nick": g_info[8],
        "current_member": current_member
    }


# 4. 加入小组
def join_group(user_uid, target_gid):
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        exist = cur.execute("SELECT id FROM user_group WHERE uid=? AND gid=?", (user_uid, target_gid)).fetchone()
        if exist:
            return {"success": False, "msg": "你已加入该小组，不可重复加入"}
        cur.execute('''INSERT INTO user_group(uid, gid, join_time) VALUES(?,?,datetime('now'))''',
                    (user_uid, target_gid))
        conn.commit()
        return {"success": True, "msg": "入组成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    finally:
        conn.close()


# 5. 查询用户已加入的小组
def get_user_join_group(user_uid):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    sql = '''SELECT g.gid, g.group_name, g.tag, g.max_member,
                    (SELECT COUNT(id) FROM user_group WHERE gid=g.gid) as current_member
             FROM user_group ug 
             LEFT JOIN group_info g ON ug.gid=g.gid 
             WHERE ug.uid=?'''
    data = cur.execute(sql, (user_uid,)).fetchall()
    conn.close()

    return [{
        "gid": item[0],
        "group_name": item[1],
        "group_tag": item[2],
        "max_member": item[3],
        "current_member": item[4]
    } for item in data]