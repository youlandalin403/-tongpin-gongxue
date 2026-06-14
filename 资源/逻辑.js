const 初始数据 = {
  当前页面: "home",
  当前兴趣: null,
  当前筛选: "全部",
  资源筛选: "全部",
  资源方向筛选: "全部",
  资源排序: "精选优先",
  资源只看收藏: false,
  用户: {
    姓名: "林知夏",
    学院: "计算机学院",
    年级: "大二",
    兴趣: ["数学建模", "考研数学", "科研阅读"],
    已入组: [1, 3, 6],
    已收藏: [1, 4, 8],
    连续天数: 12,
    累计时长: 1840
  },
  兴趣地图: [
    { 名称:"考试学习", 图标:"卷", 色:"#c46b58", 位置:[80,90], 简介:"考研、四六级、资格考试、公考等长期目标。", 方向:["考研数学","考研英语","四级六级","雅思托福","公考教资","专业课复习"], 建议:"先确定考试日期，再反推每周任务，适合加入周期型打卡小组。"},
    { 名称:"专业技能", 图标:"技", 色:"#4f7c67", 位置:[360,180], 简介:"编程、数据分析、网页开发、人工智能等能力成长。", 方向:["编程入门","数据分析","网页开发","人工智能","算法练习","设计工具"], 建议:"以项目练习为主，把学习任务拆成可展示的小作品。"},
    { 名称:"科研提升", 图标:"研", 色:"#677bb7", 位置:[650,92], 简介:"文献阅读、论文写作、组会汇报、实验记录。", 方向:["文献精读","论文写作","组会汇报","实验记录","学术表达","选题训练"], 建议:"采用每周一篇文献、一页笔记、一轮复述的节奏。"},
    { 名称:"竞赛实践", 图标:"赛", 色:"#d49a42", 位置:[970,210], 简介:"数学建模、程序设计、创新创业、挑战杯等竞赛备赛。", 方向:["数学建模","程序设计","创新创业","挑战杯","案例复盘","队伍招募"], 建议:"用阶段任务推进：选题、资料、建模、实现、展示。"},
    { 名称:"审美创造", 图标:"美", 色:"#a06aa4", 位置:[190,430], 简介:"摄影、剪辑、海报、写作、演讲与表达训练。", 方向:["摄影审美","视频剪辑","海报设计","写作训练","演讲表达","作品集"], 建议:"每周交付一个可展示作品，比泛泛学习更容易坚持。"},
    { 名称:"身体生活", 图标:"身", 色:"#7a9e5b", 位置:[520,520], 简介:"健身、跑步、作息、情绪管理与生活习惯。", 方向:["健身打卡","跑步计划","早睡早起","情绪整理","饮食记录","校园运动"], 建议:"用轻量目标启动，不追求完美，重在连续记录。"},
    { 名称:"思辨表达", 图标:"辩", 色:"#8c6f4e", 位置:[850,520], 简介:"阅读、辩论、公共表达、观点输出与深度讨论。", 方向:["深度阅读","辩论训练","观点写作","读书会","新闻讨论","表达复盘"], 建议:"先输入再输出，每次讨论沉淀一个可复用观点。"},
    { 名称:"公益实践", 图标:"行", 色:"#508aa6", 位置:[1180,410], 简介:"志愿服务、社会调研、校园活动与实践项目。", 方向:["志愿服务","社会调研","校园活动","实践项目","组织协作","经验复盘"], 建议:"把活动过程记录下来，形成团队复盘和成果展示。"},
    { 名称:"语言提升", 图标:"语", 色:"#ba6f60", 位置:[1250,95], 简介:"英语口语、听力、写作、小语种和语言考试。", 方向:["口语陪练","听力训练","写作修改","词汇打卡","小语种入门","考试表达"], 建议:"选择固定伙伴，每天十五分钟，比突击更有效。"}
  ],
  小组: [
    { 编号:1, 名称:"考研数学晨读共学组", 方向:"考研数学", 简介:"每天早上固定复盘公式、错题和一页总结，适合需要稳定节奏的人。", 人数:18, 上限:24, 周期:30, 今日:14, 活跃:92, 负责人:"周航", 标签:["考试学习","考研数学","晨间打卡"] },
    { 编号:2, 名称:"四级六级听力陪跑组", 方向:"四级六级", 简介:"每天一段听力、一组词汇、一条复述，互相提醒不摆烂。", 人数:31, 上限:40, 周期:21, 今日:26, 活跃:88, 负责人:"许宁", 标签:["考试学习","语言提升","听力训练"] },
    { 编号:3, 名称:"数学建模赛前训练营", 方向:"数学建模", 简介:"按选题、建模、求解、论文四段推进，适合准备竞赛组队。", 人数:22, 上限:30, 周期:14, 今日:19, 活跃:95, 负责人:"陈澈", 标签:["竞赛实践","数学建模","组队"] },
    { 编号:4, 名称:"网页作品共创小队", 方向:"网页开发", 简介:"从页面、交互、数据展示到答辩演示，做出能展示的校园项目。", 人数:12, 上限:18, 周期:21, 今日:9, 活跃:84, 负责人:"沈禾", 标签:["专业技能","网页开发","作品集"] },
    { 编号:5, 名称:"口语十五分钟互助社", 方向:"口语陪练", 简介:"每天一段表达练习，伙伴互评，重点改逻辑和自然度。", 人数:27, 上限:36, 周期:30, 今日:23, 活跃:90, 负责人:"林岚", 标签:["语言提升","口语陪练","表达"] },
    { 编号:6, 名称:"文献精读与组会表达", 方向:"文献精读", 简介:"每周一篇文献，输出摘要、方法、创新点和可讲述稿。", 人数:16, 上限:20, 周期:28, 今日:11, 活跃:86, 负责人:"魏然", 标签:["科研提升","文献精读","组会"] },
    { 编号:7, 名称:"校园跑步与作息改善", 方向:"跑步计划", 简介:"低门槛运动打卡，记录睡眠、跑步和情绪状态。", 人数:34, 上限:50, 周期:30, 今日:28, 活跃:82, 负责人:"唐也", 标签:["身体生活","跑步计划","习惯"] },
    { 编号:8, 名称:"摄影审美周末外拍", 方向:"摄影审美", 简介:"周末校园外拍，平日互评构图和色彩，沉淀作品集。", 人数:15, 上限:25, 周期:14, 今日:8, 活跃:78, 负责人:"孟秋", 标签:["审美创造","摄影审美","作品"] },
    { 编号:9, 名称:"读书会与观点写作", 方向:"深度阅读", 简介:"每周一个主题，先阅读再讨论，最后产出一段观点短文。", 人数:19, 上限:28, 周期:21, 今日:13, 活跃:80, 负责人:"顾言", 标签:["思辨表达","深度阅读","写作"] }
  ],
  资源: [
    { 编号:1, 标题:"考研数学高频错题整理表", 方向:"考研数学", 类型:"表格", 适合:"二轮复盘、晨读纠错", 简介:"按知识点、错误原因、订正方法三栏整理，适合晨读复盘。", 收藏:128, 上传:"周航", 小组:1, 更新:"今天", 链接:"https://docs.qq.com/" },
    { 编号:2, 标题:"听力精听四步记录模板", 方向:"四级六级", 类型:"模板", 适合:"每日短时训练", 简介:"盲听、对照、跟读、复述四步，适合每天十五分钟训练。", 收藏:96, 上传:"许宁", 小组:2, 更新:"昨天", 链接:"https://www.bilibili.com/" },
    { 编号:3, 标题:"数学建模论文结构清单", 方向:"数学建模", 类型:"清单", 适合:"赛前论文搭建", 简介:"从摘要到模型评价，按比赛提交标准整理。", 收藏:174, 上传:"陈澈", 小组:3, 更新:"本周", 链接:"https://docs.qq.com/" },
    { 编号:4, 标题:"网页项目答辩演示路线", 方向:"网页开发", 类型:"路线", 适合:"课程展示、项目答辩", 简介:"首页、兴趣、入组、打卡、统计的完整演示顺序。", 收藏:88, 上传:"沈禾", 小组:4, 更新:"三天前", 链接:"https://docs.qq.com/" },
    { 编号:5, 标题:"口语观点展开训练卡", 方向:"口语陪练", 类型:"训练卡", 适合:"口语表达、搭档互评", 简介:"从观点、原因、例子、回扣四步训练表达。", 收藏:73, 上传:"林岚", 小组:5, 更新:"本周", 链接:"https://docs.qq.com/" },
    { 编号:6, 标题:"文献精读一页纸模板", 方向:"文献精读", 类型:"模板", 适合:"科研入门、组会汇报", 简介:"研究问题、方法、数据、结论、可借鉴点一页整理。", 收藏:141, 上传:"魏然", 小组:6, 更新:"昨天", 链接:"https://docs.qq.com/" },
    { 编号:7, 标题:"跑步新手四周计划", 方向:"跑步计划", 类型:"计划", 适合:"零基础习惯养成", 简介:"从走跑结合到稳定慢跑，适合零基础同学。", 收藏:62, 上传:"唐也", 小组:7, 更新:"本月", 链接:"https://docs.qq.com/" },
    { 编号:8, 标题:"校园摄影构图练习清单", 方向:"摄影审美", 类型:"清单", 适合:"周末外拍、作品互评", 简介:"光线、层次、留白、人物比例四类练习。", 收藏:55, 上传:"孟秋", 小组:8, 更新:"本月", 链接:"https://docs.qq.com/" }
  ],
  打卡: [
    { 用户:"林知夏", 组:1, 主题:"完成极限与连续错题复盘", 时长:80, 状态:"完成", 心情:"顺利", 内容:"整理了三道反复错的题，并写了订正原因。", 时间:"今天 08:12" },
    { 用户:"陈澈", 组:3, 主题:"建模题目变量假设讨论", 时长:95, 状态:"完成", 心情:"很有收获", 内容:"把题目中的约束条件拆成了三类，晚上继续做求解。", 时间:"今天 10:35" },
    { 用户:"魏然", 组:6, 主题:"精读论文方法部分", 时长:70, 状态:"部分完成", 心情:"平稳", 内容:"先看懂了研究设计，实验结果准备明天整理。", 时间:"今天 13:20" },
    { 用户:"唐也", 组:7, 主题:"操场慢跑三公里", 时长:34, 状态:"完成", 心情:"顺利", 内容:"今天配速稳定，跑完拉伸十分钟。", 时间:"今天 18:06" }
  ],
  帖子: [
    { 编号:1, 标题:"建模论文摘要到底先写问题还是先写方法？", 小组:"数学建模赛前训练营", 作者:"陈澈", 内容:"我发现很多获奖论文摘要都不是简单介绍背景，而是直接交代模型与结果。大家觉得摘要最稳的结构是什么？", 点赞:32, 评论:["先写问题，再写方法和结果，最后写检验。", "摘要一定要有量化结果，不然像说明书。"] },
    { 编号:2, 标题:"晨读复盘公式时总记不牢，怎么办？", 小组:"考研数学晨读共学组", 作者:"林知夏", 内容:"我发现单纯背公式没有用，做题时还是想不起来。有没有更适合数学的记忆方式？", 点赞:26, 评论:["按题型记公式入口，比按章节背更有效。"] },
    { 编号:3, 标题:"文献精读怎么避免只翻译不思考？", 小组:"文献精读与组会表达", 作者:"魏然", 内容:"现在读论文容易变成逐句翻译，看完却说不清它解决了什么问题。", 点赞:41, 评论:["先用三问法：问题从哪来、方法是什么、还能往哪走。"] }
  ]
};

const 账户存储键 = "同频共学账户列表";
const 当前账号键 = "同频共学当前账号";
const 默认账号 = {
  账号:"demo",
  密码:"123456",
  姓名:"林知夏",
  学校:"南京大学",
  学院:"计算机学院",
  年级:"大二",
  简介:"希望用小组陪伴把学习坚持下来。",
  兴趣:["数学建模", "考研数学", "科研阅读"],
  已入组:[1,3,6],
  已收藏:[1,4,8],
  连续天数:12,
  累计时长:1840
};
let 表单已绑定 = false;
let 认证已绑定 = false;
let 数据 = 读取数据();

function 读取数据(){
  const 缓存 = localStorage.getItem("同频共学演示数据");
  if(!缓存){ return 规范化数据(structuredClone(初始数据)); }
  try { return 规范化数据(JSON.parse(缓存)); } catch { return 规范化数据(structuredClone(初始数据)); }
}
function 规范化数据(d){
  d.用户 ??= structuredClone(初始数据.用户);
  d.用户.兴趣 ??= [];
  d.用户.已入组 ??= [];
  d.用户.已收藏 ??= [];
  d.用户.连续天数 ??= 0;
  d.用户.累计时长 ??= 0;
  d.资源方向筛选 ??= "全部";
  d.资源排序 ??= "精选优先";
  d.资源只看收藏 ??= false;
  if(!Array.isArray(d.资源)) d.资源=[];
  d.资源.forEach((r,i)=>{
    r.类型 ||= 默认资源类型(r);
    r.适合 ||= 默认资源适合(r);
    r.更新 ||= ["今天","昨天","本周","本月"][i%4];
    r.链接 ||= "";
  });
  return d;
}
function 默认资源类型(r){
  const t=`${r.标题||""}${r.简介||""}`;
  if(t.includes("模板")) return "模板";
  if(t.includes("清单")) return "清单";
  if(t.includes("计划")) return "计划";
  if(t.includes("路线")) return "路线";
  if(t.includes("错题")) return "表格";
  return "资料";
}
function 默认资源适合(r){
  if((r.方向||"").includes("数学")) return "复盘整理、阶段检测";
  if((r.方向||"").includes("听力") || (r.方向||"").includes("口语")) return "每日短时训练";
  if((r.方向||"").includes("文献")) return "科研入门、组会准备";
  return "小组共学、个人复盘";
}
function 保存(){
  localStorage.setItem("同频共学演示数据", JSON.stringify(数据));
  同步当前账户();
}
function $(选择器){ return document.querySelector(选择器); }
function $$(选择器){ return [...document.querySelectorAll(选择器)]; }
function 提示(文字){ const t=$("#toast"); t.textContent=文字; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
function 中文数(n){ return String(n).replace(/0/g,"零").replace(/1/g,"一").replace(/2/g,"二").replace(/3/g,"三").replace(/4/g,"四").replace(/5/g,"五").replace(/6/g,"六").replace(/7/g,"七").replace(/8/g,"八").replace(/9/g,"九"); }

function 读取账户列表(){
  let list=[];
  try{ list=JSON.parse(localStorage.getItem(账户存储键) || "[]"); }catch{ list=[]; }
  if(!Array.isArray(list)) list=[];
  if(!list.some(a=>a.账号===默认账号.账号)) list.unshift(structuredClone(默认账号));
  localStorage.setItem(账户存储键, JSON.stringify(list));
  return list;
}
function 保存账户列表(list){ localStorage.setItem(账户存储键, JSON.stringify(list)); }
function 解析兴趣输入(v){
  return [...new Set(String(v||"").split(/[、,，；;\s]+/).map(x=>x.trim()).filter(Boolean))];
}
function 账户转用户(a){
  return {
    姓名:a.姓名 || a.账号 || "同学",
    学校:a.学校 || "",
    学院:a.学院 || "",
    年级:a.年级 || "",
    简介:a.简介 || "",
    兴趣:Array.isArray(a.兴趣)?[...a.兴趣]:[],
    已入组:Array.isArray(a.已入组)?[...a.已入组]:[],
    已收藏:Array.isArray(a.已收藏)?[...a.已收藏]:[],
    连续天数:Number(a.连续天数||0),
    累计时长:Number(a.累计时长||0)
  };
}
function 应用账户(a){
  数据.用户 = 账户转用户(a);
  更新用户栏();
}
function 同步当前账户(){
  const 账号=localStorage.getItem(当前账号键);
  if(!账号 || !数据?.用户) return;
  const list=读取账户列表();
  const i=list.findIndex(a=>a.账号===账号);
  if(i<0) return;
  list[i]={...list[i], ...账户转用户({...list[i], ...数据.用户})};
  保存账户列表(list);
}
function 当前账户(){
  const 账号=localStorage.getItem(当前账号键);
  if(!账号) return null;
  return 读取账户列表().find(a=>a.账号===账号) || null;
}
function 显示认证(tab="login"){
  document.body.classList.add("app-locked");
  const screen=$("#auth-screen");
  if(screen) screen.hidden=false;
  切换认证表单(tab);
}
function 关闭认证(){
  document.body.classList.remove("app-locked");
  const screen=$("#auth-screen");
  if(screen) screen.hidden=true;
}
function 切换认证表单(tab){
  const login=tab!=="register";
  $("#login-form").hidden=!login;
  $("#register-form").hidden=login;
  $("#show-login").classList.toggle("active",login);
  $("#show-register").classList.toggle("active",!login);
}
function 更新用户栏(){
  const name=数据?.用户?.姓名 || "同学";
  const meta=[数据?.用户?.学院, 数据?.用户?.年级].filter(Boolean).join(" · ") || 数据?.用户?.学校 || "校园共学成员";
  const avatar=name.slice(0,1) || "同";
  if($("#top-avatar")) $("#top-avatar").textContent=avatar;
  if($("#top-user-name")) $("#top-user-name").textContent=name;
  if($("#profile-avatar")) $("#profile-avatar").textContent=avatar;
  if($("#profile-name")) $("#profile-name").textContent=name;
  if($("#profile-meta")) $("#profile-meta").textContent=meta;
}
function 应用登录状态(){
  const a=当前账户();
  if(!a){ 显示认证("login"); return false; }
  应用账户(a);
  关闭认证();
  return true;
}
function 绑定认证(){
  if(认证已绑定) return;
  认证已绑定=true;
  读取账户列表();
  $("#show-login").onclick=()=>切换认证表单("login");
  $("#show-register").onclick=()=>切换认证表单("register");
  $("#demo-login").onclick=()=>{
    $("#login-account").value="demo";
    $("#login-password").value="123456";
    执行登录("demo","123456");
  };
  $("#login-form").addEventListener("submit",e=>{
    e.preventDefault();
    执行登录($("#login-account").value.trim(), $("#login-password").value);
  });
  $("#register-form").addEventListener("submit",e=>{
    e.preventDefault();
    const 账号=$("#reg-account").value.trim();
    const 密码=$("#reg-password").value;
    const 姓名=$("#reg-name").value.trim();
    if(!账号 || !密码 || !姓名) return 提示("请填写账号、密码和昵称");
    if(密码.length<6) return 提示("密码至少六位");
    const list=读取账户列表();
    if(list.some(a=>a.账号===账号)) return 提示("这个账号已经被注册");
    const account={
      账号, 密码, 姓名,
      学校:$("#reg-school").value.trim(),
      学院:$("#reg-college").value.trim(),
      年级:$("#reg-grade").value.trim(),
      简介:$("#reg-intro").value.trim(),
      兴趣:解析兴趣输入($("#reg-tags").value),
      已入组:[], 已收藏:[], 连续天数:0, 累计时长:0,
      创建时间:new Date().toLocaleString("zh-CN",{hour12:false})
    };
    list.push(account);
    保存账户列表(list);
    localStorage.setItem(当前账号键,账号);
    应用账户(account);
    保存();
    关闭认证();
    渲染应用();
    提示("注册成功，已进入平台");
  });
  $("#logout-btn").onclick=()=>{
    同步当前账户();
    localStorage.removeItem(当前账号键);
    显示认证("login");
    提示("已退出登录");
  };
}
function 执行登录(账号,密码){
  const a=读取账户列表().find(x=>x.账号===账号 && x.密码===密码);
  if(!a) return 提示("账号或密码不正确");
  localStorage.setItem(当前账号键,账号);
  应用账户(a);
  保存();
  关闭认证();
  渲染应用();
  提示(`欢迎回来，${数据.用户.姓名}`);
}

function 切页(id){
  数据.当前页面=id; 保存();
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.go===id));
  window.scrollTo({top:0,behavior:"smooth"});
  if(id==="map") setTimeout(()=>居中地图(false),150);
}

document.addEventListener("click", e=>{
  const go = e.target.closest("[data-go]");
  if(go){ 切页(go.dataset.go); }
});

function 初始化(){
  绑定认证();
  if(!应用登录状态()) return;
  渲染应用();
}
function 渲染应用(){
  更新用户栏();
  渲染首页(); 渲染地图(); 渲染筛选(); 渲染小组(); 渲染打卡(); 渲染资源(); 渲染帖子(); 渲染档案(); 渲染智能学伴();
  if(!表单已绑定){ 绑定表单(); 表单已绑定=true; }
  切页(数据.当前页面 || "home");
}

function 渲染首页(){
  const live = $("#home-live");
  live.innerHTML = 数据.打卡.slice(0,4).map((d,i)=>`<div class="live-item" style="animation-delay:${i*.08}s"><div class="live-dot" style="--c:${数据.兴趣地图[i]?.色||'#4f7c67'}">${d.用户[0]}</div><div><h4>${d.主题}</h4><p>${d.用户} · ${d.时长}分钟 · ${d.时间}</p></div></div>`).join("");
  const 总人数 = 数据.小组.reduce((s,g)=>s+g.人数,0);
  const 总资源 = 数据.资源.length;
  const 今日 = 数据.小组.reduce((s,g)=>s+g.今日,0);
  const 活跃 = Math.round(数据.小组.reduce((s,g)=>s+g.活跃,0)/数据.小组.length);
  $("#metrics").innerHTML = [
    [总人数,"正在共学的同学"],[数据.小组.length,"开放共学小组"],[总资源,"沉淀学习资源"],[活跃+"%","平均小组活跃度"]
  ].map(m=>`<article class="metric"><strong>${m[0]}</strong><span>${m[1]}</span></article>`).join("");
}

function 渲染地图(){
  const c = $("#map-canvas");
  c.innerHTML = 数据.兴趣地图.map((m,i)=>`<button class="interest-tile ${数据.当前兴趣===m.名称?'active':''}" data-interest="${m.名称}" style="--c:${m.色};left:${m.位置[0]}px;top:${m.位置[1]}px"><b>${m.名称}</b><span>${m.简介}</span><small>${m.图标}</small></button>`).join("");
  c.querySelectorAll(".interest-tile").forEach(btn=>btn.addEventListener("click",()=>打开兴趣(btn.dataset.interest)));
  if(数据.当前兴趣) 打开兴趣(数据.当前兴趣, false);
}
function 居中地图(smooth=true){
  const s=$("#map-stage"); if(!s) return;
  s.scrollTo({left:420, top:170, behavior:smooth?"smooth":"auto"});
}
function 打开兴趣(名称, shouldSave=true){
  const m = 数据.兴趣地图.find(x=>x.名称===名称); if(!m) return;
  数据.当前兴趣=名称; if(shouldSave) 保存();
  $$(".interest-tile").forEach(t=>t.classList.toggle("active",t.dataset.interest===名称));
  const 相关小组 = 数据.小组.filter(g=>g.标签.includes(m.名称) || m.方向.includes(g.方向)).slice(0,3);
  $("#map-drawer").innerHTML = `<div class="drawer-head"><div class="drawer-color" style="--c:${m.色}"></div><div><p class="eyebrow">已选兴趣</p><h3>${m.名称}</h3></div></div><p class="subtle">${m.简介}</p><div class="drawer-block"><h4>细分方向</h4><div class="tag-cloud">${m.方向.map(t=>`<button class="tag selectable ${数据.用户.兴趣.includes(t)?'selected':''}" data-save-tag="${t}">${t}</button>`).join("")}</div></div><div class="drawer-block"><h4>今日建议</h4><p>${m.建议}</p></div><div class="drawer-block"><h4>推荐小组</h4>${相关小组.map(g=>`<div class="rank-item"><span class="rank-no">${g.编号}</span><div><b>${g.名称}</b><p style="margin:4px 0 0;color:var(--muted)">${g.人数}/${g.上限}人 · 今日${g.今日}人打卡</p></div><button class="btn small" data-open-group="${g.编号}">查看</button></div>`).join("")}</div><button class="btn primary wide" data-go="groups" style="margin-top:16px">去小组广场</button>`;
  $("#map-drawer").querySelectorAll("[data-save-tag]").forEach(b=>b.addEventListener("click",()=>保存兴趣(b.dataset.saveTag)));
  $("#map-drawer").querySelectorAll("[data-open-group]").forEach(b=>b.addEventListener("click",()=>打开小组详情(Number(b.dataset.openGroup))));
}
function 保存兴趣(tag){
  const arr=数据.用户.兴趣;
  if(arr.includes(tag)){ 数据.用户.兴趣=arr.filter(x=>x!==tag); 提示("已移除兴趣方向"); }
  else { 数据.用户.兴趣.push(tag); 提示("已保存兴趣方向"); }
  保存(); 渲染地图(); 渲染档案(); 渲染智能学伴();
}

function 渲染筛选(){
  const cats=["全部",...数据.兴趣地图.map(x=>x.名称)];
  $("#group-filter").innerHTML=cats.map(c=>`<button class="chip ${数据.当前筛选===c?'active':''}" data-group-filter="${c}">${c}</button>`).join("");
  const rf=$("#resource-filter");
  if(rf){
    rf.innerHTML=cats.map(c=>`<button class="chip ${数据.资源筛选===c?'active':''}" data-resource-filter="${c}">${c}</button>`).join("");
    const 当前目录 = 数据.兴趣地图.find(x=>x.名称===数据.资源筛选);
    const dirs = 当前目录 ? 当前目录.方向 : [...new Set(数据.资源.map(r=>r.方向))].slice(0,10);
    const sub=["全部",...dirs];
    $("#resource-subfilter").innerHTML=sub.map(c=>`<button class="chip sub ${数据.资源方向筛选===c?'active':''}" data-resource-subfilter="${c}">${c}</button>`).join("");
  }
  $$("[data-group-filter]").forEach(b=>b.onclick=()=>{数据.当前筛选=b.dataset.groupFilter;保存();渲染筛选();渲染小组();});
  $$("[data-resource-filter]").forEach(b=>b.onclick=()=>{数据.资源筛选=b.dataset.resourceFilter;数据.资源方向筛选="全部";保存();渲染筛选();渲染资源();});
  $$("[data-resource-subfilter]").forEach(b=>b.onclick=()=>{数据.资源方向筛选=b.dataset.resourceSubfilter;保存();渲染筛选();渲染资源();});
}
function 小组匹配(g,q=""){
  const okCat = 数据.当前筛选==="全部" || g.标签.includes(数据.当前筛选);
  const text = `${g.名称}${g.方向}${g.简介}${g.标签.join("")}`;
  return okCat && text.includes(q.trim());
}
function 渲染小组(){
  const q=$("#group-search")?.value||"";
  const list=数据.小组.filter(g=>小组匹配(g,q));
  $("#group-list").innerHTML = list.length ? list.map(g=>小组卡片(g)).join("") : `<div class="empty-small">没有找到对应小组，可以创建一个新的共学方向。</div>`;
  $$("[data-join]").forEach(b=>b.onclick=()=>加入小组(Number(b.dataset.join)));
  $$("[data-detail]").forEach(b=>b.onclick=()=>打开小组详情(Number(b.dataset.detail)));
}
function 小组卡片(g){
  const joined=数据.用户.已入组.includes(g.编号);
  const w=Math.min(100,Math.round(g.人数/g.上限*100));
  return `<article class="group-card"><div class="card-top"><span class="badge">${g.方向}</span><span class="badge">${g.活跃}%活跃</span></div><h3>${g.名称}</h3><p>${g.简介}</p><div class="progress-line"><span style="--w:${w}%"></span></div><div class="meta-row"><span>${g.人数}/${g.上限}人</span><span>${g.周期}天周期</span><span>今日${g.今日}人打卡</span><span>负责人 ${g.负责人}</span></div><div class="group-actions"><button class="btn primary" data-join="${g.编号}">${joined?'已加入':'加入小组'}</button><button class="btn" data-detail="${g.编号}">查看详情</button></div></article>`;
}
function 加入小组(id){
  if(!数据.用户.已入组.includes(id)){数据.用户.已入组.push(id);提示("已加入小组，今日打卡页已同步");}
  else{提示("你已经在这个小组里");}
  保存(); 渲染小组(); 渲染打卡(); 渲染档案();
}
function 打开小组详情(id){
  const g=数据.小组.find(x=>x.编号===id); if(!g) return;
  const res=数据.资源.filter(r=>r.小组===id).slice(0,3);
  const wall=数据.打卡.filter(d=>d.组===id).slice(0,3);
  打开弹窗(`<p class="eyebrow">小组详情</p><h2>${g.名称}</h2><p class="subtle">${g.简介}</p><div class="meta-row"><span>${g.方向}</span><span>${g.人数}/${g.上限}人</span><span>${g.周期}天周期</span><span>今日${g.今日}人打卡</span></div><div class="progress-line"><span style="--w:${Math.min(100,Math.round(g.人数/g.上限*100))}%"></span></div><div class="modal-grid"><div class="drawer-block"><h4>小组资源</h4>${res.length?res.map(r=>`<p>《${r.标题}》 · 收藏${r.收藏}</p>`).join(""):'<p>暂无资源</p>'}</div><div class="drawer-block"><h4>打卡墙</h4>${wall.length?wall.map(w=>`<p>${w.用户}：${w.主题} · ${w.时长}分钟</p>`).join(""):'<p>今日暂无打卡</p>'}</div><div class="group-actions"><button class="btn primary" data-join-modal="${g.编号}">加入小组</button><button class="btn" data-go-modal="checkin">去打卡</button><button class="btn" data-go-modal="forum">去讨论</button></div></div>`);
  $("#modal-content").querySelector("[data-join-modal]").onclick=()=>{加入小组(id);关闭弹窗();};
  $$("[data-go-modal]").forEach(b=>b.onclick=()=>{关闭弹窗();切页(b.dataset.goModal);});
}

function 渲染打卡(){
  const joined=数据.小组.filter(g=>数据.用户.已入组.includes(g.编号));
  $("#checkin-group").innerHTML=joined.map(g=>`<option value="${g.编号}">${g.名称}</option>`).join("") || `<option value="1">考研数学晨读共学组</option>`;
  $("#streak-count").textContent=`${中文数(数据.用户.连续天数)}天`;
  $("#checkin-wall").innerHTML=数据.打卡.map(d=>`<article class="time-item"><div class="time-dot">${d.用户[0]}</div><div><h4>${d.主题}</h4><p>${d.用户} · ${组名(d.组)} · ${d.时长}分钟 · ${d.状态} · ${d.心情}</p><p>${d.内容}</p></div></article>`).join("");
}
function 组名(id){return 数据.小组.find(g=>g.编号===id)?.名称 || "共学小组";}

function 资源主分类(r){
  const g=数据.小组.find(x=>x.编号===r.小组);
  const hit=数据.兴趣地图.find(m=>g?.标签.includes(m.名称) || m.方向.includes(r.方向));
  return hit?.名称 || g?.标签?.[0] || "其他资源";
}
function 资源匹配(r,q=""){
  const g=数据.小组.find(x=>x.编号===r.小组);
  const cat=资源主分类(r);
  const okCat = 数据.资源筛选==="全部" || cat===数据.资源筛选 || g?.标签.includes(数据.资源筛选);
  const okDir = 数据.资源方向筛选==="全部" || r.方向===数据.资源方向筛选;
  const okCollect = !数据.资源只看收藏 || 数据.用户.已收藏.includes(r.编号);
  const text=`${r.标题}${r.方向}${r.类型||""}${r.适合||""}${r.简介}${r.上传}${g?.名称||""}${cat}`;
  return okCat && okDir && okCollect && text.includes(q.trim());
}
function 资源排序(list){
  const mode=数据.资源排序 || "精选优先";
  const arr=[...list];
  if(mode==="收藏最多") arr.sort((a,b)=>b.收藏-a.收藏);
  else if(mode==="最新发布") arr.sort((a,b)=>Number(b.编号)-Number(a.编号));
  else if(mode==="适合新手") arr.sort((a,b)=>新手权重(b)-新手权重(a) || b.收藏-a.收藏);
  else arr.sort((a,b)=>(数据.用户.已收藏.includes(b.编号)-数据.用户.已收藏.includes(a.编号)) || b.收藏-a.收藏);
  return arr;
}
function 新手权重(r){
  const t=`${r.类型||""}${r.标题}${r.简介}${r.适合||""}`;
  return ["模板","清单","计划","入门","新手","路线"].reduce((s,k)=>s+(t.includes(k)?1:0),0);
}
function 渲染资源指标(list=数据.资源){
  const metric=$("#resource-metrics"); if(!metric) return;
  const 小组数=new Set(数据.资源.map(r=>r.小组)).size;
  const 收藏数=数据.用户.已收藏.length;
  const 类型数=new Set(数据.资源.map(r=>r.类型||默认资源类型(r))).size;
  metric.innerHTML=[[数据.资源.length,"已收录资源"],[小组数,"关联小组"],[类型数,"资源类型"],[收藏数,"我的收藏"]].map(x=>`<div><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");
}
function 渲染精选资源(list){
  const box=$("#resource-featured"); if(!box) return;
  const top=资源排序(list.length?list:数据.资源).slice(0,3);
  if(!top.length){box.innerHTML="";return;}
  box.innerHTML=`<article class="featured-title"><p class="eyebrow">精选资源</p><h3>先看高价值资料，再进入完整目录。</h3><p>精选区按收藏量、所属小组活跃度与资源类型综合排序，适合演示时快速展示平台质量。</p></article>${top.map((r,i)=>`<article class="featured-resource ${i===0?'major':''}"><div class="featured-mark">${i===0?'本周精选':'推荐'}</div><span class="resource-type">${r.类型||默认资源类型(r)}</span><h3>${r.标题}</h3><p>${r.简介}</p><div class="meta-row"><span>${r.方向}</span><span>${组名(r.小组)}</span><span>收藏${r.收藏}</span></div><button class="btn primary" data-open-resource="${r.编号}">查看详情</button></article>`).join("")}`;
  box.querySelectorAll("[data-open-resource]").forEach(b=>b.onclick=()=>打开资源(Number(b.dataset.openResource)));
}
function 渲染资源(){
  渲染资源指标();
  const q=$("#resource-search")?.value||"";
  const list=资源排序(数据.资源.filter(r=>资源匹配(r,q)));
  渲染精选资源(list);
  const count=$("#resource-result-count");
  if(count) count.textContent=`当前显示 ${list.length} 份资源`;
  const only=$("#resource-only-collect");
  if(only) only.textContent=数据.资源只看收藏?"显示全部资源":"只看我的收藏";
  const sort=$("#resource-sort");
  if(sort) sort.value=数据.资源排序 || "精选优先";
  $("#resource-list").innerHTML=list.length ? list.map(r=>资源卡片(r)).join("") : `<div class="empty-small">没有找到对应资源。可以换一个方向，或者收录一份新的学习资料。</div>`;
  $$("[data-collect]").forEach(b=>b.onclick=()=>收藏资源(Number(b.dataset.collect)));
  $$("[data-open-resource]").forEach(b=>b.onclick=()=>打开资源(Number(b.dataset.openResource)));
}
function 资源卡片(r){
  const collected=数据.用户.已收藏.includes(r.编号);
  return `<article class="resource-card refined"><div class="resource-card-head"><div><span class="resource-type">${r.类型||默认资源类型(r)}</span><span class="badge soft">${资源主分类(r)}</span></div><span class="collect-count">收藏${r.收藏}</span></div><h3>${r.标题}</h3><p class="resource-value">${r.简介}</p><div class="resource-use">适合：${r.适合||默认资源适合(r)}</div><div class="meta-row"><span>${r.方向}</span><span>${组名(r.小组)}</span><span>收录人 ${r.上传}</span><span>${r.更新||"本周"}</span></div><div class="resource-actions"><button class="btn primary" data-open-resource="${r.编号}">查看详情</button><button class="btn" data-collect="${r.编号}">${collected?'已收藏':'收藏'}</button></div></article>`;
}
function 收藏资源(id){
  const r=数据.资源.find(x=>x.编号===id); if(!r) return;
  if(数据.用户.已收藏.includes(id)){数据.用户.已收藏=数据.用户.已收藏.filter(x=>x!==id); r.收藏=Math.max(0,r.收藏-1);提示("已取消收藏");}
  else{数据.用户.已收藏.push(id); r.收藏++;提示("已收藏到成长档案");}
  保存(); 渲染资源(); 渲染档案();
}
function 打开资源(id){
  const r=数据.资源.find(x=>x.编号===id); if(!r) return;
  const link = r.链接 ? `<a class="btn primary" href="${r.链接}" target="_blank" rel="noopener">打开资源链接</a>` : `<button class="btn primary" disabled title="演示资源暂无外部链接">暂无外链</button>`;
  打开弹窗(`<p class="eyebrow">资源详情</p><h2>${r.标题}</h2><div class="meta-row"><span>${r.类型||默认资源类型(r)}</span><span>${r.方向}</span><span>${资源主分类(r)}</span><span>收藏${r.收藏}</span></div><p class="subtle">${r.简介}</p><div class="drawer-block"><h4>适用对象</h4><p>${r.适合||默认资源适合(r)}</p></div><div class="drawer-block"><h4>资源链接</h4><p>${r.链接 ? '点击下方按钮访问原始资料。平台只收录说明与链接，不直接存储未经授权的原始文件。' : '这条演示资源暂未填写外部链接，正式使用时应提交可访问的公开链接或校内资料地址。'}</p></div><div class="drawer-block"><h4>推荐使用方式</h4><p>先收藏资源，再进入“${组名(r.小组)}”完成一次对应打卡；如果使用过程中发现问题，可以到交流庭院补充反馈。</p></div><div class="meta-row"><span>所属小组：${组名(r.小组)}</span><span>收录人 ${r.上传}</span><span>${r.更新||"本周"}更新</span></div><div class="resource-actions">${link}<button class="btn" data-go-modal="checkin">用它打卡</button><button class="btn" data-collect-modal="${r.编号}">${数据.用户.已收藏.includes(id)?'取消收藏':'收藏资源'}</button></div>`);
  const collectBtn = $("#modal-content").querySelector("[data-collect-modal]");
  const checkinBtn = $("#modal-content").querySelector("[data-go-modal]");
  if(collectBtn) collectBtn.onclick=()=>{收藏资源(id);关闭弹窗();};
  if(checkinBtn) checkinBtn.onclick=()=>{关闭弹窗();切页("checkin");};
}

function 渲染帖子(){
  $("#post-list").innerHTML=数据.帖子.map(p=>`<article class="post-card"><div class="card-top"><span class="badge">${p.小组}</span><span class="badge">${p.评论.length}条回复</span></div><h3>${p.标题}</h3><p>${p.内容}</p><div class="post-foot"><span class="subtle">${p.作者} 发布</span><div class="resource-actions"><button class="btn small" data-like="${p.编号}">赞同 ${p.点赞}</button><button class="btn small primary" data-reply="${p.编号}">回复</button></div></div>${p.评论.map(c=>`<div class="drawer-block"><p>${c}</p></div>`).join("")}</article>`).join("");
  $$("[data-like]").forEach(b=>b.onclick=()=>{const p=数据.帖子.find(x=>x.编号==b.dataset.like);p.点赞++;保存();渲染帖子();});
  $$("[data-reply]").forEach(b=>b.onclick=()=>回复帖子(Number(b.dataset.reply)));
}
function 回复帖子(id){
  const p=数据.帖子.find(x=>x.编号===id);
  打开弹窗(`<p class="eyebrow">回复讨论</p><h2>${p.标题}</h2><label>你的回复<textarea id="reply-text" placeholder="写下具体建议或经验。" style="min-height:120px"></textarea></label><button class="btn primary wide" id="send-reply">发布回复</button>`);
  $("#send-reply").onclick=()=>{const v=$("#reply-text").value.trim(); if(!v) return 提示("请先填写回复内容"); p.评论.unshift(v); 保存(); 渲染帖子(); 关闭弹窗(); 提示("回复已发布");};
}

function 渲染档案(){
  $("#profile-tags").innerHTML=数据.用户.兴趣.map(t=>`<span class="tag">${t}</span>`).join("");
  const joined=数据.用户.已入组.length, res=数据.用户.已收藏.length, days=数据.用户.连续天数, duration=数据.打卡.reduce((s,d)=>s+d.时长,0)+数据.用户.累计时长;
  $("#profile-stats").innerHTML=[["连续打卡",`${days}天`],["累计学习",`${duration}分钟`],["加入小组",`${joined}个`],["收藏资源",`${res}份`]].map(x=>`<div class="stat-row"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");
  const vals=[60,95,42,80,110,70,88];
  $("#bar-chart").innerHTML=vals.map((v,i)=>`<div class="bar" style="height:${v+30}px"><span>周${['一','二','三','四','五','六','日'][i]}</span></div>`).join("");
  const ranks=[...数据.小组].sort((a,b)=>b.活跃-a.活跃).slice(0,5);
  $("#rank-list").innerHTML=ranks.map((g,i)=>`<div class="rank-item"><span class="rank-no">${i+1}</span><div><b>${g.名称}</b><p style="margin:4px 0 0;color:var(--muted)">${g.方向} · 今日${g.今日}人打卡</p></div><strong>${g.活跃}%</strong></div>`).join("");
}

function 渲染智能学伴(){
  const dirs=[...new Set(数据.兴趣地图.flatMap(x=>x.方向))];
  $("#agent-focus").innerHTML=dirs.map(d=>`<option ${数据.用户.兴趣.includes(d)?'selected':''}>${d}</option>`).join("");
  生成方案(false);
}
function 生成方案(show=true){
  const minutes=Number($("#agent-minutes")?.value||90);
  const state=$("#agent-state")?.value||"想开始但有点乱";
  const focus=$("#agent-focus")?.value||数据.用户.兴趣[0]||"考研数学";
  const g=数据.小组.find(x=>x.方向===focus) || 数据.小组.find(x=>x.标签.some(t=>数据.用户.兴趣.includes(t))) || 数据.小组[0];
  const r=数据.资源.find(x=>x.方向===focus) || 数据.资源[0];
  const warm=Math.max(10,Math.round(minutes*.18));
  const deep=Math.max(20,Math.round(minutes*.52));
  const review=Math.max(10,minutes-warm-deep);
  $("#agent-output").innerHTML=`<article class="plan-card"><h3>今日共学方案</h3><p class="subtle">状态：${state}。重点方向：${focus}。总时长约${minutes}分钟。</p><ul class="plan-list"><li><b>${warm}分钟</b><span>整理昨天遗留问题，只保留一个最重要的任务，避免一开始就被细节拖住。</span></li><li><b>${deep}分钟</b><span>完成主任务：围绕“${focus}”做一段连续学习，中途不切换方向。</span></li><li><b>${review}分钟</b><span>写三句话复盘：今天做了什么、卡在哪里、明天从哪里继续。</span></li></ul></article><article class="plan-card"><h3>推荐加入</h3><p>${g.名称}</p><p class="subtle">理由：该小组与“${focus}”匹配，今日已有${g.今日}人打卡，适合获得陪伴感。</p><button class="btn primary" data-join="${g.编号}">加入这个小组</button></article><article class="plan-card"><h3>推荐资源</h3><p>${r.标题}</p><p class="subtle">${r.简介}</p><button class="btn" data-open-resource="${r.编号}">查看资源</button></article>`;
  $("#agent-output").querySelector("[data-join]").onclick=e=>加入小组(Number(e.target.dataset.join));
  $("#agent-output").querySelector("[data-open-resource]").onclick=e=>打开资源(Number(e.target.dataset.openResource));
  if(show) 提示("今日方案已生成");
}

function 绑定表单(){
  $("#center-map").onclick=()=>居中地图(true);
  $("#group-search").addEventListener("input",渲染小组);
  $("#resource-search").addEventListener("input",渲染资源);
  $("#resource-sort").addEventListener("change",e=>{数据.资源排序=e.target.value;保存();渲染资源();});
  $("#resource-only-collect").onclick=()=>{数据.资源只看收藏=!数据.资源只看收藏;保存();渲染资源();};
  $("#resource-guide").onclick=()=>打开资源规范();
  $("#make-plan").onclick=()=>生成方案(true);
  $("#reset-demo").onclick=()=>{const 当前用户=structuredClone(数据.用户); localStorage.removeItem("同频共学演示数据"); 数据=规范化数据(structuredClone(初始数据)); 数据.用户=当前用户; 保存(); 渲染应用(); 提示("已恢复演示数据，当前登录账号不变");};
  $("#checkin-form").addEventListener("submit",e=>{
    e.preventDefault();
    const item={用户:数据.用户.姓名,组:Number($("#checkin-group").value),主题:$("#checkin-title").value.trim(),时长:Number($("#checkin-duration").value),状态:$("#checkin-status").value,心情:$("#checkin-mood").value,内容:$("#checkin-content").value.trim(),时间:"刚刚"};
    if(!item.主题 || !item.内容 || !item.时长) return 提示("请完整填写打卡内容");
    数据.打卡.unshift(item); 数据.用户.连续天数 += 1; 数据.用户.累计时长 += item.时长;
    const g=数据.小组.find(x=>x.编号===item.组); if(g){g.今日++; g.活跃=Math.min(99,g.活跃+1);}
    保存(); 渲染首页(); 渲染打卡(); 渲染档案(); e.target.reset(); 提示("打卡成功，已同步到小组墙");
  });
  $("#open-create-group").onclick=()=>打开创建小组();
  $("#open-resource-box").onclick=()=>打开收录资源();
  $("#open-post-box").onclick=()=>打开发布帖子();
  $("#modal-close").onclick=关闭弹窗;
  $("#modal-layer").addEventListener("click",e=>{ if(e.target.id==="modal-layer") 关闭弹窗(); });
}
function 打开弹窗(html){$("#modal-content").innerHTML=html; $("#modal-layer").hidden=false;}
function 关闭弹窗(){$("#modal-layer").hidden=true; $("#modal-content").innerHTML="";}
function 打开创建小组(){
  打开弹窗(`<p class="eyebrow">创建小组</p><h2>把一个目标变成一间共学房间</h2><div class="modal-grid"><label>小组名称<input id="new-group-name" placeholder="例如：期末高数七天冲刺组"></label><label>学习方向<input id="new-group-dir" placeholder="例如：考研数学"></label><label>小组简介<textarea id="new-group-desc" placeholder="说明小组目标、节奏和适合人群"></textarea></label><label>人数上限<input id="new-group-max" type="number" value="20"></label><button class="btn primary wide" id="save-group">创建并展示</button></div>`);
  $("#save-group").onclick=()=>{const name=$("#new-group-name").value.trim(),dir=$("#new-group-dir").value.trim(),desc=$("#new-group-desc").value.trim(),max=Number($("#new-group-max").value||20); if(!name||!dir||!desc) return 提示("请填写完整小组信息"); 数据.小组.unshift({编号:Date.now(),名称:name,方向:dir,简介:desc,人数:1,上限:max,周期:14,今日:0,活跃:60,负责人:数据.用户.姓名,标签:["专业技能",dir]}); 保存(); 渲染小组(); 渲染筛选(); 关闭弹窗(); 提示("小组已创建");};
}
function 打开收录资源(){
  const dirs=[...new Set(数据.兴趣地图.flatMap(x=>x.方向))];
  const groups=数据.小组.filter(g=>数据.用户.已入组.includes(g.编号));
  const groupOptions=(groups.length?groups:数据.小组.slice(0,4)).map(g=>`<option value="${g.编号}">${g.名称}</option>`).join("");
  打开弹窗(`<p class="eyebrow">收录资源</p><h2>提交说明与链接，不直接堆文件</h2><p class="subtle modal-note">这里收录的是一条“学习资源记录”：标题、方向、适合对象、资源说明和可访问链接。正式推广时建议优先提交公开链接、校内资料地址或自己整理的文档，避免上传未经授权的原始文件。</p><div class="modal-grid"><label>资源标题<input id="new-res-title" placeholder="例如：期末复习思维导图"></label><label>所属方向<select id="new-res-dir">${dirs.map(d=>`<option>${d}</option>`).join("")}</select></label><label>资源类型<select id="new-res-type"><option>模板</option><option>清单</option><option>表格</option><option>计划</option><option>课程</option><option>工具</option><option>资料</option></select></label><label>关联小组<select id="new-res-group">${groupOptions}</select></label><label>适用对象<input id="new-res-fit" placeholder="例如：期末冲刺、零基础入门、赛前复盘"></label><label>资源链接<input id="new-res-link" placeholder="粘贴腾讯文档、网盘、B站、校内资源库等链接"></label><label class="full-row">资源简介<textarea id="new-res-desc" placeholder="说明资源解决什么问题、应该怎么使用"></textarea></label><button class="btn primary wide" id="save-res">收录到资源书院</button></div>`);
  $("#save-res").onclick=()=>{const title=$("#new-res-title").value.trim(),dir=$("#new-res-dir").value.trim(),type=$("#new-res-type").value,group=Number($("#new-res-group").value),fit=$("#new-res-fit").value.trim(),link=$("#new-res-link").value.trim(),desc=$("#new-res-desc").value.trim(); if(!title||!dir||!desc||!link) return 提示("请填写标题、方向、简介和资源链接"); 数据.资源.unshift({编号:Date.now(),标题:title,方向:dir,类型:type,适合:fit||默认资源适合({方向:dir}),简介:desc,链接:link,收藏:0,上传:数据.用户.姓名,小组:group||数据.用户.已入组[0]||1,更新:"刚刚"}); 保存(); 渲染筛选(); 渲染资源(); 关闭弹窗(); 提示("资源已收录");};
}
function 打开资源规范(){
  打开弹窗(`<p class="eyebrow">收录规范</p><h2>一份好资源，要能被别人直接用起来。</h2><div class="drawer-block"><h4>一、标题要具体</h4><p>不要只写“资料整理”，建议写成“考研数学极限错题整理表”这类可判断用途的标题。</p></div><div class="drawer-block"><h4>二、说明适用对象</h4><p>标明适合新手、冲刺、复盘、组会、竞赛还是长期打卡，方便同学快速筛选。</p></div><div class="drawer-block"><h4>三、回到小组场景</h4><p>资源不是孤立堆放，最好能对应一个小组目标，并能服务后续打卡和讨论。</p></div><div class="drawer-block"><h4>四、不收录侵权内容</h4><p>优先分享自己的整理、公开链接、学习模板和经验清单。第一版只收录资源说明与链接，不直接存储未经授权的原始文件。</p></div>`);
}
function 打开发布帖子(){
  打开弹窗(`<p class="eyebrow">发布讨论</p><h2>发起一个具体学习问题</h2><div class="modal-grid"><label>标题<input id="new-post-title" placeholder="问题越具体，回复越有用"></label><label>内容<textarea id="new-post-content" placeholder="写清楚背景、卡点和希望得到的建议"></textarea></label><button class="btn primary wide" id="save-post">发布到交流庭院</button></div>`);
  $("#save-post").onclick=()=>{const title=$("#new-post-title").value.trim(),content=$("#new-post-content").value.trim(); if(!title||!content) return 提示("请填写标题和内容"); 数据.帖子.unshift({编号:Date.now(),标题,小组:组名(数据.用户.已入组[0]||1),作者:数据.用户.姓名,内容,点赞:0,评论:[]}); 保存(); 渲染帖子(); 关闭弹窗(); 提示("讨论已发布");};
}

初始化();
