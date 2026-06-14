# post_service.py
import sqlite3

DB_FILE = "app.db"


# ========== 帖子相关 ==========

def create_post(uid, gid, title, content):
    """发布帖子"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute('''INSERT INTO post(uid, gid, title, content, create_time)
                       VALUES(?,?,?,?,datetime('now'))''',
                    (uid, gid, title, content))
        conn.commit()
        return {"success": True, "msg": "发布成功", "pid": cur.lastrowid}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    finally:
        conn.close()


def get_posts_by_group(gid, page=1, page_size=20):
    """获取小组内的帖子列表（分页，按时间倒序）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        offset = (page - 1) * page_size

        # 获取帖子列表，带上发布者昵称
        sql = '''SELECT p.pid, p.uid, p.title, p.content, p.like_count, p.create_time,
                        u.nick as author_nick
                 FROM post p
                 LEFT JOIN user u ON p.uid = u.id
                 WHERE p.gid = ?
                 ORDER BY p.pid DESC
                 LIMIT ? OFFSET ?'''
        rows = cur.execute(sql, (gid, page_size, offset)).fetchall()

        # 获取总数
        total = cur.execute("SELECT COUNT(*) FROM post WHERE gid=?", (gid,)).fetchone()[0]
        conn.close()

        posts = []
        for row in rows:
            posts.append({
                "pid": row[0],
                "uid": row[1],
                "title": row[2],
                "content": row[3],
                "like_count": row[4],
                "create_time": row[5],
                "author_nick": row[6]
            })

        return {"success": True, "posts": posts, "total": total, "page": page, "page_size": page_size}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_post_detail(pid):
    """获取帖子详情（包含评论）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        # 获取帖子信息
        post_row = cur.execute('''SELECT p.pid, p.uid, p.gid, p.title, p.content, p.like_count, p.create_time,
                                         u.nick as author_nick
                                  FROM post p
                                  LEFT JOIN user u ON p.uid = u.id
                                  WHERE p.pid = ?''', (pid,)).fetchone()

        if not post_row:
            conn.close()
            return {"success": False, "msg": "帖子不存在"}

        # 获取评论列表
        comment_rows = cur.execute('''SELECT c.cid, c.uid, c.content, c.create_time,
                                             u.nick as author_nick
                                      FROM comment c
                                      LEFT JOIN user u ON c.uid = u.id
                                      WHERE c.pid = ?
                                      ORDER BY c.cid ASC''', (pid,)).fetchall()
        conn.close()

        comments = []
        for row in comment_rows:
            comments.append({
                "cid": row[0],
                "uid": row[1],
                "content": row[2],
                "create_time": row[3],
                "author_nick": row[4]
            })

        post = {
            "pid": post_row[0],
            "uid": post_row[1],
            "gid": post_row[2],
            "title": post_row[3],
            "content": post_row[4],
            "like_count": post_row[5],
            "create_time": post_row[6],
            "author_nick": post_row[7],
            "comments": comments
        }

        return {"success": True, "post": post}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def like_post(uid, pid):
    """点赞帖子（简单实现：防止重复点赞的检查可选）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute("UPDATE post SET like_count = like_count + 1 WHERE pid = ?", (pid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "点赞成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def delete_post(pid, current_uid, current_role):
    """删除帖子（仅创建者或管理员可删）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        # 获取帖子信息
        post = cur.execute("SELECT uid FROM post WHERE pid=?", (pid,)).fetchone()
        if not post:
            conn.close()
            return {"success": False, "msg": "帖子不存在"}

        # 权限检查
        if current_role != 1 and post[0] != current_uid:
            conn.close()
            return {"success": False, "msg": "无权限删除"}

        # 先删除帖子的评论
        cur.execute("DELETE FROM comment WHERE pid=?", (pid,))
        # 再删除帖子
        cur.execute("DELETE FROM post WHERE pid=?", (pid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "删除成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}


# ========== 评论相关 ==========

def add_comment(uid, pid, content):
    """添加评论"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        # 检查帖子是否存在
        post = cur.execute("SELECT pid FROM post WHERE pid=?", (pid,)).fetchone()
        if not post:
            conn.close()
            return {"success": False, "msg": "帖子不存在"}

        cur.execute('''INSERT INTO comment(pid, uid, content, create_time)
                       VALUES(?,?,?,datetime('now'))''',
                    (pid, uid, content))
        conn.commit()
        return {"success": True, "msg": "评论成功", "cid": cur.lastrowid}
    except Exception as e:
        return {"success": False, "msg": str(e)}
    finally:
        conn.close()


def delete_comment(cid, current_uid, current_role):
    """删除评论（仅创建者或管理员可删）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        comment = cur.execute("SELECT uid FROM comment WHERE cid=?", (cid,)).fetchone()
        if not comment:
            conn.close()
            return {"success": False, "msg": "评论不存在"}

        if current_role != 1 and comment[0] != current_uid:
            conn.close()
            return {"success": False, "msg": "无权限删除"}

        cur.execute("DELETE FROM comment WHERE cid=?", (cid,))
        conn.commit()
        conn.close()
        return {"success": True, "msg": "删除成功"}
    except Exception as e:
        return {"success": False, "msg": str(e)}


# ========== 小组创建者/管理员专用 ==========

def pin_post(pid, current_uid, current_role):
    """置顶帖子（仅小组创建者或管理员）"""
    # 注意：当前 post 表没有 is_top 字段，如需置顶功能可添加
    # 这里先写框架，需要时再补充
    return {"success": False, "msg": "置顶功能开发中，需在post表添加is_top字段"}