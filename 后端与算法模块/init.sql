-- ============================================
-- 同频共学数据库建表脚本
-- 符合开发规范 V1.0：小写+下划线命名
-- ============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nick TEXT,
    avatar TEXT,
    school TEXT,
    college TEXT,
    grade TEXT,
    anon_name TEXT,
    anon_avatar TEXT,
    role INTEGER DEFAULT 0,
    is_anonymous INTEGER DEFAULT 1,
    total_score INTEGER DEFAULT 0,
    continuous_days INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0,
    last_checkin_time TEXT,
    create_time TEXT
);

-- 2. 用户-兴趣标签关联表（支持多标签）
CREATE TABLE IF NOT EXISTS user_tag (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    tag_name TEXT NOT NULL,
    FOREIGN KEY(uid) REFERENCES user(id)
);

-- 3. 兴趣小组表
CREATE TABLE IF NOT EXISTS group_info (
    gid INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT NOT NULL,
    group_desc TEXT,
    creator_uid INTEGER NOT NULL,
    tag TEXT,
    max_member INTEGER DEFAULT 20,
    cycle_days INTEGER DEFAULT 7,
    create_time TEXT,
    FOREIGN KEY(creator_uid) REFERENCES user(id)
);

-- 4. 用户-小组关联表
CREATE TABLE IF NOT EXISTS user_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    gid INTEGER NOT NULL,
    join_time TEXT,
    FOREIGN KEY(uid) REFERENCES user(id),
    FOREIGN KEY(gid) REFERENCES group_info(gid)
);

-- 5. 打卡记录表
CREATE TABLE IF NOT EXISTS checkin_record (
    cid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    gid INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    duration INTEGER DEFAULT 0,
    status TEXT DEFAULT '完成',
    score INTEGER DEFAULT 0,
    checkin_time TEXT,
    FOREIGN KEY(uid) REFERENCES user(id),
    FOREIGN KEY(gid) REFERENCES group_info(gid)
);

-- 6. 资源表
CREATE TABLE IF NOT EXISTS resource (
    rid INTEGER PRIMARY KEY AUTOINCREMENT,
    upload_uid INTEGER NOT NULL,
    gid INTEGER,
    res_name TEXT,
    description TEXT,
    res_url TEXT,
    tag TEXT,
    collect_count INTEGER DEFAULT 0,
    upload_time TEXT,
    FOREIGN KEY(upload_uid) REFERENCES user(id),
    FOREIGN KEY(gid) REFERENCES group_info(gid)
);

-- 7. 收藏资源表
CREATE TABLE IF NOT EXISTS fav_resource (
    fid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    rid INTEGER NOT NULL,
    FOREIGN KEY(uid) REFERENCES user(id),
    FOREIGN KEY(rid) REFERENCES resource(rid)
);

-- 8. 帖子表
CREATE TABLE IF NOT EXISTS post (
    pid INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    gid INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    create_time TEXT,
    FOREIGN KEY(uid) REFERENCES user(id),
    FOREIGN KEY(gid) REFERENCES group_info(gid)
);

-- 9. 评论表
CREATE TABLE IF NOT EXISTS comment (
    cid INTEGER PRIMARY KEY AUTOINCREMENT,
    pid INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    content TEXT NOT NULL,
    create_time TEXT,
    FOREIGN KEY(pid) REFERENCES post(pid),
    FOREIGN KEY(uid) REFERENCES user(id)
);