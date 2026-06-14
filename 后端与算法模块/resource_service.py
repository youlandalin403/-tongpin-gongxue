# resource_service.py
import sqlite3

DB_FILE = "app.db"


# ========== 资源上传 ==========

def upload_resource(uid, gid, res_name, description, res_url, tag=""):
    """上传资源（第一版以链接为主）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute('''INSERT INTO resource(upload_uid, gid, res_name, description, res_url, tag, collect_count, upload_time)
                       VALUES(?,?,?,?,?,?,0,datetime('now'))''',
                    (uid, gid, res_name, description, res_url, tag))
        conn.commit()
        return {"success": True, "msg": "上传成功", "rid": cur.lastrowid}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    finally:
        conn.close()


# ========== 资源查询 ==========

def get_resources_by_group(gid, tag_filter="", page=1, page_size=20):
    """获取小组内的资源列表（支持标签筛选）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        offset = (page - 1) * page_size

        if tag_filter.strip() == "":
            sql = '''SELECT r.rid, r.upload_uid, r.res_name, r.description, r.res_url, 
                            r.tag, r.collect_count, r.upload_time, u.nick as uploader_nick
                     FROM resource r
                     LEFT JOIN user u ON r.upload_uid = u.id
                     WHERE r.gid = ?
                     ORDER BY r.rid DESC
                     LIMIT ? OFFSET ?'''
            rows = cur.execute(sql, (gid, page_size, offset)).fetchall()
            total = cur.execute("SELECT COUNT(*) FROM resource WHERE gid=?", (gid,)).fetchone()[0]
        else:
            sql = '''SELECT r.rid, r.upload_uid, r.res_name, r.description, r.res_url, 
                            r.tag, r.collect_count, r.upload_time, u.nick as uploader_nick
                     FROM resource r
                     LEFT JOIN user u ON r.upload_uid = u.id
                     WHERE r.gid = ? AND r.tag LIKE ?
                     ORDER BY r.rid DESC
                     LIMIT ? OFFSET ?'''
            rows = cur.execute(sql, (gid, '%' + tag_filter + '%', page_size, offset)).fetchall()
            total = cur.execute("SELECT COUNT(*) FROM resource WHERE gid=? AND tag LIKE ?",
                                (gid, '%' + tag_filter + '%')).fetchone()[0]

        conn.close()

        resources = []
        for row in rows:
            resources.append({
                "rid": row[0],
                "upload_uid": row[1],
                "res_name": row[2],
                "description": row[3],
                "res_url": row[4],
                "tag": row[5],
                "collect_count": row[6],
                "upload_time": row[7],
                "uploader_nick": row[8]
            })

        return {"success": True, "resources": resources, "total": total, "page": page, "page_size": page_size}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_all_resources(tag_filter="", page=1, page_size=20):
    """获取所有资源（用于资源中心页）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        offset = (page - 1) * page_size

        if tag_filter.strip() == "":
            sql = '''SELECT r.rid, r.upload_uid, r.gid, r.res_name, r.description, r.res_url, 
                            r.tag, r.collect_count, r.upload_time, u.nick as uploader_nick,
                            g.group_name
                     FROM resource r
                     LEFT JOIN user u ON r.upload_uid = u.id
                     LEFT JOIN group_info g ON r.gid = g.gid
                     ORDER BY r.collect_count DESC
                     LIMIT ? OFFSET ?'''
            rows = cur.execute(sql, (page_size, offset)).fetchall()
            total = cur.execute("SELECT COUNT(*) FROM resource").fetchone()[0]
        else:
            sql = '''SELECT r.rid, r.upload_uid, r.gid, r.res_name, r.description, r.res_url, 
                            r.tag, r.collect_count, r.upload_time, u.nick as uploader_nick,
                            g.group_name
                     FROM resource r
                     LEFT JOIN user u ON r.upload_uid = u.id
                     LEFT JOIN group_info g ON r.gid = g.gid
                     WHERE r.tag LIKE ?
                     ORDER BY r.collect_count DESC
                     LIMIT ? OFFSET ?'''
            rows = cur.execute(sql, ('%' + tag_filter + '%', page_size, offset)).fetchall()
            total = cur.execute("SELECT COUNT(*) FROM resource WHERE tag LIKE ?",
                                ('%' + tag_filter + '%',)).fetchone()[0]

        conn.close()

        resources = []
        for row in rows:
            resources.append({
                "rid": row[0],
                "upload_uid": row[1],
                "gid": row[2],
                "res_name": row[3],
                "description": row[4],
                "res_url": row[5],
                "tag": row[6],
                "collect_count": row[7],
                "upload_time": row[8],
                "uploader_nick": row[9],
                "group_name": row[10]
            })

        return {"success": True, "resources": resources, "total": total, "page": page, "page_size": page_size}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_resource_detail(rid):
    """获取资源详情"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        row = cur.execute('''SELECT r.rid, r.upload_uid, r.gid, r.res_name, r.description, r.res_url, 
                                    r.tag, r.collect_count, r.upload_time, u.nick as uploader_nick
                             FROM resource r
                             LEFT JOIN user u ON r.upload_uid = u.id
                             WHERE r.rid = ?''', (rid,)).fetchone()
        conn.close()

        if not row:
            return {"success": False, "msg": "资源不存在"}

        return {"success": True, "resource": {
            "rid": row[0],
            "upload_uid": row[1],
            "gid": row[2],
            "res_name": row[3],
            "description": row[4],
            "res_url": row[5],
            "tag": row[6],
            "collect_count": row[7],
            "upload_time": row[8],
            "uploader_nick": row[9]
        }}
    except Exception as e:
        return {"success": False, "msg": str(e)}


# ========== 收藏功能 ==========

def collect_resource(uid, rid):
    """收藏资源"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        # 检查是否已收藏
        exist = cur.execute("SELECT fid FROM fav_resource WHERE uid=? AND rid=?", (uid, rid)).fetchone()
        if exist:
            conn.close()
            return {"success": False, "msg": "已经收藏过了"}

        cur.execute("INSERT INTO fav_resource(uid, rid) VALUES(?,?)", (uid, rid))
        cur.execute("UPDATE resource SET collect_count = collect_count + 1 WHERE rid=?", (rid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "收藏成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def uncollect_resource(uid, rid):
    """取消收藏"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute("DELETE FROM fav_resource WHERE uid=? AND rid=?", (uid, rid))
        cur.execute("UPDATE resource SET collect_count = collect_count - 1 WHERE rid=?", (rid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "取消收藏成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_user_collections(uid):
    """获取用户收藏的资源列表"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        rows = cur.execute('''SELECT r.rid, r.res_name, r.description, r.res_url, r.tag, r.collect_count
                              FROM fav_resource f
                              LEFT JOIN resource r ON f.rid = r.rid
                              WHERE f.uid = ?
                              ORDER BY f.fid DESC''', (uid,)).fetchall()
        conn.close()

        collections = []
        for row in rows:
            collections.append({
                "rid": row[0],
                "res_name": row[1],
                "description": row[2],
                "res_url": row[3],
                "tag": row[4],
                "collect_count": row[5]
            })
        return {"success": True, "collections": collections}
    except Exception as e:
        return {"success": False, "msg": str(e)}


# ========== 资源删除（管理员/上传者） ==========

def delete_resource(rid, current_uid, current_role):
    """删除资源（仅上传者或管理员可删）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        resource = cur.execute("SELECT upload_uid FROM resource WHERE rid=?", (rid,)).fetchone()
        if not resource:
            conn.close()
            return {"success": False, "msg": "资源不存在"}

        if current_role != 1 and resource[0] != current_uid:
            conn.close()
            return {"success": False, "msg": "无权限删除"}

        # 删除收藏记录
        cur.execute("DELETE FROM fav_resource WHERE rid=?", (rid,))
        # 删除资源
        cur.execute("DELETE FROM resource WHERE rid=?", (rid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "删除成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}