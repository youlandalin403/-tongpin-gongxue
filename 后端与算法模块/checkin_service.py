# checkin_service.py
import sqlite3
from datetime import datetime
from cpp_runner import call_score_calc

DB_FILE = "app.db"


def checkin(uid, gid, title, content, duration, status="完成"):
    """用户打卡（积分由 C++ 计算）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        today = datetime.now().strftime("%Y-%m-%d")

        # 1. 检查今天是否已经打卡
        existing = cur.execute(
            "SELECT cid FROM checkin_record WHERE uid=? AND gid=? AND date(checkin_time)=?",
            (uid, gid, today)
        ).fetchone()

        if existing:
            conn.close()
            return {"success": False, "msg": "今天已经打过卡了"}

        # 2. 获取用户连续打卡天数
        user_row = cur.execute("SELECT continuous_days FROM user WHERE id=?", (uid,)).fetchone()
        continuous_days = user_row[0] if user_row else 0

        # 3. 调用 C++ 计算积分
        cpp_result = call_score_calc(
            user_id=uid,
            group_id=gid,
            duration=duration,
            content=content,
            continuous_days=continuous_days,
            is_duplicate_today=False
        )

        # 4. 解析 C++ 返回的积分
        if cpp_result.get("success") and cpp_result.get("data", {}).get("valid"):
            total_score = cpp_result["data"].get("checkin_score", 10)
            cpp_detail = cpp_result["data"]
        else:
            # 降级方案：C++ 调用失败时使用默认积分 10 分
            total_score = 10
            cpp_detail = {}
            print(f"⚠️ C++ 积分计算失败: {cpp_result}")

        # 5. 更新连续打卡天数
        last_checkin = cur.execute(
            "SELECT checkin_time FROM checkin_record WHERE uid=? AND gid=? ORDER BY checkin_time DESC LIMIT 1",
            (uid, gid)
        ).fetchone()

        new_continuous_days = 1
        if last_checkin:
            last_date = last_checkin[0][:10]
            yesterday = (datetime.now().timestamp() - 86400)
            yesterday_str = datetime.fromtimestamp(yesterday).strftime("%Y-%m-%d")
            if last_date == yesterday_str:
                new_continuous_days = continuous_days + 1

        # 6. 插入打卡记录
        checkin_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur.execute('''INSERT INTO checkin_record(uid, gid, title, content, duration, status, score, checkin_time)
                       VALUES(?,?,?,?,?,?,?,?)''',
                    (uid, gid, title, content, duration, status, total_score, checkin_time))

        # 7. 更新用户表统计信息
        cur.execute("""UPDATE user 
                       SET total_score = total_score + ?, 
                           continuous_days = ?, 
                           total_duration = total_duration + ?, 
                           last_checkin_time = ? 
                       WHERE id = ?""",
                    (total_score, new_continuous_days, duration, checkin_time, uid))

        conn.commit()
        conn.close()

        return {
            "success": True,
            "msg": "打卡成功",
            "score": total_score,
            "continuous_days": new_continuous_days,
            "cpp_detail": cpp_detail
        }

    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_today_checkin_status(uid, gid):
    """查询用户今天是否已经打卡"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        today = datetime.now().strftime("%Y-%m-%d")
        row = cur.execute(
            "SELECT cid, title, duration, score FROM checkin_record WHERE uid=? AND gid=? AND date(checkin_time)=?",
            (uid, gid, today)
        ).fetchone()
        conn.close()

        if row:
            return {
                "success": True,
                "has_checkin": True,
                "title": row[1],
                "duration": row[2],
                "score": row[3]
            }
        return {"success": True, "has_checkin": False}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_group_checkin_today(gid):
    """获取小组今日所有打卡记录（打卡墙）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        today = datetime.now().strftime("%Y-%m-%d")
        rows = cur.execute('''SELECT c.uid, c.title, c.content, c.duration, c.score, c.checkin_time, u.nick
                              FROM checkin_record c
                              LEFT JOIN user u ON c.uid = u.id
                              WHERE c.gid=? AND date(c.checkin_time)=?
                              ORDER BY c.checkin_time DESC''', (gid, today)).fetchall()
        conn.close()

        checkins = [{
            "uid": row[0],
            "title": row[1],
            "content": row[2],
            "duration": row[3],
            "score": row[4],
            "checkin_time": row[5],
            "nick": row[6] or f"用户{row[0]}"
        } for row in rows]

        return {"success": True, "checkins": checkins, "count": len(checkins)}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_user_checkin_history(uid, limit=30):
    """获取用户打卡历史"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        rows = cur.execute('''SELECT cid, gid, title, content, duration, status, score, checkin_time, g.group_name
                              FROM checkin_record c
                              LEFT JOIN group_info g ON c.gid = g.gid
                              WHERE c.uid=?
                              ORDER BY c.checkin_time DESC
                              LIMIT ?''', (uid, limit)).fetchall()
        conn.close()

        history = [{
            "cid": row[0],
            "gid": row[1],
            "title": row[2],
            "content": row[3],
            "duration": row[4],
            "status": row[5],
            "score": row[6],
            "checkin_time": row[7],
            "group_name": row[8]
        } for row in rows]

        return {"success": True, "history": history, "count": len(history)}
    except Exception as e:
        return {"success": False, "msg": str(e)}


def get_group_ranking_data(gid):
    """获取小组排行榜数据（供 C++ ranking 调用）"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        rows = cur.execute('''SELECT u.id, u.nick, u.total_score, u.continuous_days, u.total_duration, u.last_checkin_time
                              FROM user_group ug
                              LEFT JOIN user u ON ug.uid = u.id
                              WHERE ug.gid=?
                              ORDER BY u.total_score DESC''', (gid,)).fetchall()
        conn.close()

        users = [{
            "user_id": row[0],
            "nickname": row[1] or f"用户{row[0]}",
            "score": row[2] or 0,
            "continuous_days": row[3] or 0,
            "total_duration": row[4] or 0,
            "last_checkin_time": row[5] or ""
        } for row in rows]

        return {"success": True, "users": users}
    except Exception as e:
        return {"success": False, "msg": str(e), "users": []}