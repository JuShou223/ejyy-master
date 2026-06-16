/* ============================================================
   扩展模块  ·  安全应急 / 邻里协作 / 家庭管理 / 出行便利 / 信息透明
   依赖 app.js 中的全局：ROUTES, ACTIONS, I, tile, yuan, subhead,
   chev, openSheet, closeSheet, toast, render, go, DB, view, TINT
   ============================================================ */

/* ---------- 追加假数据 ---------- */
Object.assign(DB, {
  emergency: {
    contacts: [
      { label: "物业值班室", phone: "0755-8888 0000", icon: "shield", color: "jade" },
      { label: "120 急救中心", phone: "120", icon: "drop", color: "rose" },
      { label: "110 报警", phone: "110", icon: "shield", color: "blue" },
      { label: "小区安保队长", phone: "150****6688", icon: "user", color: "amber" },
    ],
    location: "翠湖名邸 12栋3单元 1802室（GPS 已定位）",
  },
  elder: {
    bound: { name: "陈父（独居 · 8栋2单元）", relation: "父亲", lastActive: "今天 07:42 开门外出", status: "normal" },
    rule: "连续 12 小时无活动将通知所有家属",
    family: ["陈思远（本人）", "陈静（女儿）"],
  },
  throwReports: [
    { id: "T01", floor: "约 18-22 层", at: "2026-06-11 21:10", status: "处理中", desc: "高区有烟头抛下，落在儿童活动区" },
  ],

  groupBuys: [
    { id: "g1", title: "现摘阳山水蜜桃 5斤装", price: 39.9, market: 68, joined: 23, need: 30, ends: "今晚 22:00", img: "amber", organizer: "团长·林姐" },
    { id: "g2", title: "农夫山泉 12L×2 桶装水", price: 28, market: 40, joined: 47, need: 50, ends: "明天", img: "blue", organizer: "团长·物业" },
    { id: "g3", title: "现摘蔬菜直供礼盒 8样", price: 49, market: 79, joined: 30, need: 30, ends: "已成团", img: "jade", organizer: "团长·周姐" },
  ],
  skills: [
    { id: "s1", name: "王会计 · 6栋", skill: "个税申报 / 报税咨询", price: "免费互助", avatar: "王", tag: "jade", rating: "互助 12 次" },
    { id: "s2", name: "Tom · 11栋", skill: "电脑/网络上门排障", price: "邻里价 50元", avatar: "T", tag: "blue", rating: "好评 23" },
    { id: "s3", name: "李医生 · 3栋", skill: "健康咨询 / 用药指导", price: "免费互助", avatar: "李", tag: "rose", rating: "互助 8 次" },
    { id: "s4", name: "Mia · 9栋", skill: "钢琴陪练 / 乐理", price: "邻里价 80元/课", avatar: "M", tag: "amber", rating: "好评 15" },
  ],
  pets: {
    mine: { name: "豆豆", kind: "柯基 · 公 · 已绝育", cert: "免疫证已登记", avatar: "🐶" },
    walks: [
      { time: "07:00-08:00", place: "中心花园环道", who: "豆豆(柯基)、奶昔(比熊) 等 4 只" },
      { time: "19:30-20:30", place: "西门草坪", who: "已有 6 位邻居遛狗" },
    ],
    lost: [
      { name: "招财（橘猫）", at: "6栋附近走失", time: "2026-06-13", reward: "酬谢 500 元" },
    ],
  },
  carpools: [
    { id: "cp1", from: "翠湖名邸西门", to: "市民中心地铁站", time: "工作日 08:10", seat: 3, owner: "陈先生 · 帕萨特", fee: "AA油费" },
    { id: "cp2", from: "翠湖名邸", to: "宝安机场 T3", time: "06-16 06:30", seat: 2, owner: "林女士 · 理想L8", fee: "平摊高速费" },
  ],

  housekeeping: [
    { id: "h1", name: "深度保洁", price: "￥35/小时起", rating: 4.9, orders: "本小区 320 单", icon: "drop", color: "blue" },
    { id: "h2", name: "金牌月嫂", price: "￥9800/月起", rating: 4.95, orders: "本小区 18 单", icon: "user", color: "rose" },
    { id: "h3", name: "住家保姆", price: "￥6500/月起", rating: 4.8, orders: "本小区 26 单", icon: "users", color: "jade" },
    { id: "h4", name: "开荒保洁", price: "￥8/㎡", rating: 4.85, orders: "本小区 54 单", icon: "wrench", color: "amber" },
  ],
  meters: [
    { id: "m1", name: "水表", unit: "吨", last: 1284, color: "blue", icon: "drop" },
    { id: "m2", name: "电表", unit: "度", last: 7620, color: "amber", icon: "bolt" },
    { id: "m3", name: "燃气表", unit: "m³", last: 938, color: "rose", icon: "drop" },
  ],
  decoApplies: [
    { id: "d1", title: "1802室 室内软装翻新", status: "审批通过", period: "2026-06-20 至 2026-07-20", note: "施工时段限 8:30-12:00 / 14:00-18:00，周日及法定假日禁止" },
  ],
  certs: [
    { id: "ce1", name: "房产证年检", due: "2026-09-01", left: 78, color: "jade" },
    { id: "ce2", name: "燃气安全年检", due: "2026-07-10", left: 25, color: "rose" },
    { id: "ce3", name: "新风系统保修到期", due: "2026-07-01", left: 16, color: "amber" },
  ],

  pois: {
    超市: [{ n: "华润万家(翠湖店)", d: "步行 5 分钟", t: "营业中 08:00-22:00" }, { n: "盒马鲜生", d: "1.2km", t: "可 30 分钟达" }],
    医院: [{ n: "翠湖社区卫生服务中心", d: "步行 8 分钟", t: "门诊中" }, { n: "市人民医院", d: "3.4km", t: "三甲" }],
    学校: [{ n: "翠湖实验小学", d: "步行 6 分钟", t: "对口学区" }, { n: "第二幼儿园", d: "步行 4 分钟", t: "公立" }],
    地铁: [{ n: "市民中心站 (3号线)", d: "步行 10 分钟", t: "A 出口" }, { n: "翠湖站 (规划中)", d: "—", t: "2027 通车" }],
  },
  bikes: { mobike: 14, hellobike: 9, chargers: { total: 20, free: 6 } },
  expressPrices: [
    { brand: "顺丰速运", price: "￥13 起", time: "次日达", tag: "jade" },
    { brand: "菜鸟裹裹", price: "￥8 起", time: "2-3 天", tag: "amber" },
    { brand: "京东快递", price: "￥12 起", time: "次日达", tag: "rose" },
  ],

  finance: {
    month: "2026年5月",
    income: 86.4, expense: 71.2, // 万元
    incomeItems: [["物业费收入", 62.8, "jade"], ["停车场收入", 15.6, "blue"], ["公共区域经营(广告/场地)", 6.2, "amber"], ["其他", 1.8, "rose"]],
    expenseItems: [["人员工资", 31.5, "jade"], ["保洁绿化", 12.4, "blue"], ["设备维保", 14.8, "amber"], ["公共能耗", 9.3, "rose"], ["其他", 3.2, "gray"]],
    balance: "本月结余 15.2 万元，累计公共收益结余 142.6 万元（专项审计中）",
  },
  maintainRecords: [
    { item: "客梯 6-2# 季度维保", date: "2026-06-06", result: "合格", color: "jade" },
    { item: "二期泳池水质检测", date: "2026-06-10", result: "余氯/PH 达标", color: "blue" },
    { item: "二次供水水箱清洗", date: "2026-05-28", result: "合格 · 有检测报告", color: "jade" },
    { item: "消防系统年度检测", date: "2026-05-15", result: "合格", color: "amber" },
  ],
  planNotices: [
    { title: "翠湖片区 3 号线东延段环评公示", date: "2026-06-09", src: "市交通运输局", body: "拟于片区东侧新增轨道交通站点，公示期 30 日。" },
    { title: "周边新建九年一贯制学校选址批前公示", date: "2026-05-22", src: "市规划和自然资源局", body: "拟新建 36 班学校，预计 2028 年招生。" },
  ],
  priceDeals: {
    avg: "5.8万/㎡", trend: "+2.3%", trendUp: true,
    deals: [
      { house: "12栋 1801室", area: "126㎡", total: "738万", unit: "5.86万", date: "2026-05" },
      { house: "8栋 902室", area: "98㎡", total: "562万", unit: "5.73万", date: "2026-05" },
      { house: "5栋 1503室", area: "143㎡", total: "845万", unit: "5.91万", date: "2026-04" },
    ],
    chart: [5.42, 5.51, 5.6, 5.58, 5.69, 5.8],
  },
});

/* ---------- 通用 hub 页 ---------- */
function hubPage(title, hero, items) {
  return `<div class="page">${subhead(title)}
    <div class="pad" style="padding-top:14px">
      ${hero || ""}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:${hero ? "16px" : "0"}">
        ${items.map((it) => `
          <div class="card" ${it.go ? `data-go="${it.go}"` : `data-act="${it.act}"`} style="cursor:pointer;padding:16px;position:relative">
            ${it.badge ? `<span class="pill pill-rose" style="position:absolute;top:12px;right:12px">${it.badge}</span>` : ""}
            ${tile(it.icon, it.color, 46)}
            <div style="font-weight:700;margin-top:10px">${it.label}</div>
            <div class="tiny muted mt4" style="line-height:1.45;min-height:34px">${it.desc}</div>
          </div>`).join("")}
      </div>
      <div style="height:10px"></div>
    </div></div>`;
}

/* ============================================================
   1. 安全与应急
   ============================================================ */
ROUTES.safety = () => {
  const hero = `
    <div class="card" style="background:linear-gradient(135deg,#e2614d,#c43f2c);color:#fff;text-align:center;padding:22px;box-shadow:0 10px 30px rgba(196,63,44,.32)">
      <div class="tiny" style="opacity:.9">遇到紧急情况，点击下方按钮</div>
      <button data-act="sos" style="width:128px;height:128px;border-radius:50%;border:none;margin:16px auto 10px;display:grid;place-items:center;cursor:pointer;background:rgba(255,255,255,.16);box-shadow:0 0 0 10px rgba(255,255,255,.1);color:#fff;animation:pulseSos 2s infinite">
        <div style="font-size:34px;font-weight:900;letter-spacing:2px">SOS</div>
      </button>
      <div class="tiny" style="opacity:.9">一键呼叫 · 自动上报定位</div>
    </div>
    <style>@keyframes pulseSos{0%,100%{box-shadow:0 0 0 8px rgba(255,255,255,.1)}50%{box-shadow:0 0 0 18px rgba(255,255,255,.04)}}</style>`;
  return hubPage("安全与应急", hero, [
    { icon: "user", label: "独居老人关怀", desc: "家属绑定 · 异常未活动提醒", color: "amber", go: "safety-elder" },
    { icon: "camera", label: "高空抛物举报", desc: "拍照上传 · AI 辅助定位楼层", color: "rose", go: "safety-throw", badge: DB.throwReports.length ? "" : "" },
    { icon: "shield", label: "消防通道占用举报", desc: "拍照投诉 · 物业快速响应", color: "blue", go: "safety-fire" },
    { icon: "phone", label: "应急联系人", desc: "物业/120/110 一键拨打", color: "jade", act: "emList" },
  ]);
};
ACTIONS.sos = () => {
  openSheet("紧急呼叫", `
    <div style="text-align:center;padding:6px 0 10px">
      <div style="width:84px;height:84px;border-radius:50%;background:var(--rose-100);color:var(--rose-500);display:grid;place-items:center;margin:6px auto 14px;animation:pulseSos 1.4s infinite">${I("phone",{s:38})}</div>
      <div style="font-weight:800;font-size:18px">正在接通物业值班室…</div>
      <div class="tiny muted mt8">${I("map",{s:13})} ${DB.emergency.location}</div>
      <div class="card mt16" style="background:var(--rose-100);box-shadow:none;text-align:left"><div class="tiny" style="color:var(--rose-500);font-weight:600">已自动上报：您的姓名、房号、实时定位已发送至物业与已绑定家属。</div></div>
      <div class="flex gap12 mt20">
        <a href="tel:120" class="btn btn-line grow" style="text-decoration:none">呼叫 120</a>
        <a href="tel:110" class="btn btn-line grow" style="text-decoration:none">呼叫 110</a>
      </div>
      <button class="btn btn-primary btn-block mt12" data-close>我已知晓</button>
    </div>`);
};
ACTIONS.emList = () => {
  openSheet("应急联系人", DB.emergency.contacts.map((c) => `
    <a href="tel:${c.phone.replace(/[^0-9]/g,"")}" style="text-decoration:none;color:inherit" class="row">
      ${tile(c.icon, c.color)}<div class="body"><div class="t">${c.label}</div><div class="s">${c.phone}</div></div>
      <span class="btn btn-ghost btn-sm">${I("phone",{s:15})} 拨打</span></a>`).join(""));
};
ROUTES["safety-elder"] = () => {
  const e = DB.elder;
  return `<div class="page">${subhead("独居老人关怀")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:linear-gradient(135deg,#10c47e,#06a96b);color:#fff">
        <div class="between"><span style="opacity:.9;font-size:13px">守护对象</span><span class="pill" style="background:rgba(255,255,255,.2);color:#fff">● 状态正常</span></div>
        <div style="font-weight:800;font-size:18px;margin-top:8px">${e.bound.name}</div>
        <div class="tiny mt8" style="opacity:.9">${I("clock",{s:13})} 最近活动：${e.bound.lastActive}</div>
      </div>
      <div class="card mt12"><div class="section-title mb12" style="font-size:15px">关怀规则</div>
        <div class="row"><div class="ico" style="background:var(--amber-100);color:var(--amber-600)">${I("bell",{s:20})}</div><div class="body"><div class="t" style="font-size:14px">异常未活动提醒</div><div class="s">${e.rule}</div></div><div class="switch" style="width:46px;height:27px;border-radius:999px;background:var(--jade-600);position:relative"><span style="position:absolute;top:3px;left:22px;width:21px;height:21px;border-radius:50%;background:#fff"></span></div></div>
        <div class="row"><div class="ico" style="background:var(--blue-100);color:var(--blue-500)">${I("door",{s:20})}</div><div class="body"><div class="t" style="font-size:14px">门磁 / 活动传感联动</div><div class="s">门禁、入户门开合自动记录</div></div><span class="pill pill-jade">已联动</span></div>
      </div>
      <div class="card mt12"><div class="section-title mb12" style="font-size:15px">接收提醒的家属</div>
        ${e.family.map((f)=>`<div class="row"><div class="ico" style="background:var(--jade-100);color:var(--jade-700);font-weight:700">${f[0]}</div><div class="body"><div class="t" style="font-size:14px">${f}</div></div><span class="tiny muted">已绑定</span></div>`).join("")}
        <button class="btn btn-ghost btn-sm btn-block mt12" data-act="bindFamily">${I("plus",{s:15})} 添加家属</button>
      </div>
    </div></div>`;
};
ACTIONS.bindFamily = () => toast("（演示）发送绑定邀请给家属");
ROUTES["safety-throw"] = () => reportForm("高空抛物举报", "throw", true);
ROUTES["safety-fire"] = () => reportForm("消防通道占用举报", "fire", false);
function reportForm(title, kind, ai) {
  return `<div class="page">${subhead(title)}
    <div class="pad" style="padding-top:16px">
      <div class="field"><label>现场照片 <span class="muted tiny">（必填）</span></label>
        <div class="uploader">
          <div class="up-box up-thumb" style="background-image:url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=60')"></div>
          <div class="up-box up-add" data-act="addPhoto">${I("camera",{s:22})}</div>
        </div>
      </div>
      ${ai ? `<div class="card" style="background:var(--blue-100);box-shadow:none;display:flex;gap:10px;align-items:center;margin-bottom:16px">${I("face",{s:22})}<div><div class="tiny" style="font-weight:700;color:var(--blue-500)">AI 辅助定位</div><div class="tiny" style="color:var(--blue-500)">已根据照片视角与轨迹，初步判断抛物来源：<b>18-22 层</b>，请协助补充。</div></div></div>` : ""}
      <div class="field"><label>${kind === "throw" ? "疑似楼栋 / 楼层" : "占用位置"}</label><input placeholder="${kind === "throw" ? "如 12栋 高区（18层以上）" : "如 3单元 负一层楼梯口"}" ${ai ? 'value="12栋 约18-22层"' : ""}></div>
      <div class="field"><label>情况说明</label><textarea placeholder="请描述发生时间、危害情况…"></textarea></div>
      <label class="center gap8 tiny muted mb16"><input type="checkbox" checked style="accent-color:var(--jade-700)">${I("map",{s:13})} 自动附带当前定位，便于物业核实</label>
    </div>
    <div class="footer-bar"><button class="btn btn-primary btn-block" data-act="submitReport">提交举报</button></div>
  </div>`;
}
ACTIONS.submitReport = () => { toast("举报已提交，物业将尽快核实处理 ✓"); setTimeout(() => go("safety"), 500); };

/* ============================================================
   2. 邻里协作
   ============================================================ */
ROUTES.collab = () => hubPage("邻里协作", "", [
  { icon: "box", label: "拼团团购", desc: "小区内生鲜/日用品拼单更便宜", color: "amber", go: "collab-group", badge: "热" },
  { icon: "users", label: "技能互助", desc: "会计报税·程序员修电脑·邻里帮忙", color: "blue", go: "collab-skill" },
  { icon: "heart", label: "宠物社区", desc: "宠物登记·遛狗约伴·走失寻宠", color: "rose", go: "collab-pet" },
  { icon: "car", label: "拼车上下班", desc: "同小区顺风车匹配，绿色出行", color: "jade", go: "collab-carpool" },
]);
ROUTES["collab-group"] = () => {
  return `<div class="page">${subhead("拼团团购")}
    <div class="pad" style="padding-top:14px">
      ${DB.groupBuys.map((g) => {
        const pct = Math.min(100, Math.round(g.joined / g.need * 100)), done = g.joined >= g.need;
        return `<div class="card mb12">
          <div class="center gap12" style="align-items:flex-start">
            <div style="width:60px;height:60px;border-radius:14px;flex:0 0 auto;background:${TINT[g.img].bg};color:${TINT[g.img].fg};display:grid;place-items:center">${I("box",{s:28})}</div>
            <div class="grow"><div style="font-weight:700">${g.title}</div>
              <div class="center gap8 mt4"><span class="money" style="color:var(--rose-500);font-size:18px">￥${g.price}</span><span class="tiny muted" style="text-decoration:line-through">￥${g.market}</span><span class="pill pill-amber">拼团价</span></div>
              <div class="tiny muted mt4">${g.organizer} · 截止 ${g.ends}</div>
            </div>
          </div>
          <div style="height:8px;background:#f0ede4;border-radius:4px;margin-top:12px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${done?"var(--jade-500)":"var(--amber-500)"};border-radius:4px"></div></div>
          <div class="between mt8"><span class="tiny ${done?"":"muted"}" style="${done?"color:var(--jade-600);font-weight:600":""}">${done?"✓ 已成团":`已拼 ${g.joined}/${g.need} 份`}</span>
          <button class="btn ${done?"btn-line":"btn-amber"} btn-sm" ${done?"":`data-act="joinGroup" data-id="${g.id}"`}>${done?"已成团":"我要拼"}</button></div>
        </div>`;
      }).join("")}
    </div></div>`;
};
ACTIONS.joinGroup = (el) => { const g = DB.groupBuys.find((x)=>x.id===el.dataset.id); if(g){g.joined++; toast("拼团成功，已为您锁定名额 ✓"); render();} };
ROUTES["collab-skill"] = () => {
  return `<div class="page">${subhead("技能互助", `<span class="act" data-act="offerSkill">+ 发布</span>`)}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:var(--jade-50);box-shadow:none;margin-bottom:12px"><div class="tiny" style="color:var(--jade-700)">远亲不如近邻 · 用你的一技之长帮助邻居，也收获大家的帮助。</div></div>
      ${DB.skills.map((s) => `
        <div class="card mb12 between">
          <div class="center gap12"><div style="width:46px;height:46px;border-radius:50%;background:${TINT[s.tag].bg};color:${TINT[s.tag].fg};display:grid;place-items:center;font-weight:700">${s.avatar}</div>
          <div><div style="font-weight:700">${s.name}</div><div class="tiny" style="color:var(--ink-700);margin-top:2px">${s.skill}</div><div class="tiny muted mt4">${s.rating} · <span style="color:var(--jade-700);font-weight:600">${s.price}</span></div></div></div>
          <button class="btn btn-ghost btn-sm" data-act="contactSkill">联系</button>
        </div>`).join("")}
    </div></div>`;
};
ACTIONS.offerSkill = () => toast("（演示）发布我的技能互助");
ACTIONS.contactSkill = () => toast("（演示）发起站内私信");
ROUTES["collab-pet"] = () => {
  const p = DB.pets;
  return `<div class="page">${subhead("宠物社区")}
    <div class="pad" style="padding-top:14px">
      <div class="card center gap12"><div style="width:54px;height:54px;border-radius:50%;background:var(--amber-100);display:grid;place-items:center;font-size:30px">${p.mine.avatar}</div>
      <div class="grow"><div style="font-weight:700">${p.mine.name} <span class="pill pill-jade" style="margin-left:4px">${p.mine.cert}</span></div><div class="tiny muted mt4">${p.mine.kind}</div></div><button class="btn btn-line btn-sm" data-act="editPet">管理</button></div>

      <div class="section-title mt20 mb12">遛狗约伴 · 时间协调</div>
      ${p.walks.map((w)=>`<div class="card mb12"><div class="between"><div style="font-weight:700">${I("clock",{s:15})} ${w.time}</div><button class="btn btn-ghost btn-sm" data-act="joinWalk">加入</button></div><div class="tiny muted mt4">${I("map",{s:12})} ${w.place} · ${w.who}</div></div>`).join("")}

      <div class="section-title mt20 mb12 between">走失寻宠<button class="btn btn-amber btn-sm" data-act="postLost">${I("plus",{s:14})} 发布</button></div>
      ${p.lost.map((l)=>`<div class="card mb12" style="border-left:3px solid var(--rose-500)"><div class="between"><div style="font-weight:700">🔍 寻找 ${l.name}</div><span class="pill pill-rose">${l.reward}</span></div><div class="tiny muted mt4">${l.at} · ${l.time} · 看到请联系主人</div></div>`).join("")}
    </div></div>`;
};
ACTIONS.editPet = () => toast("（演示）编辑宠物档案");
ACTIONS.joinWalk = () => toast("已加入遛狗时段，到点会提醒你 ✓");
ACTIONS.postLost = () => toast("（演示）发布寻宠启事");
ROUTES["collab-carpool"] = () => {
  return `<div class="page">${subhead("拼车上下班", `<span class="act" data-act="postCarpool">+ 发布</span>`)}
    <div class="pad" style="padding-top:14px">
      ${DB.carpools.map((c)=>`
        <div class="card mb12">
          <div class="center gap8 mb8"><span class="pill pill-jade">${I("clock",{s:12})} ${c.time}</span><span class="pill pill-gray">空 ${c.seat} 座</span></div>
          <div class="center gap8" style="font-weight:700"><span>${c.from}</span><span style="color:var(--jade-500)">${I("chevR",{s:16})}</span><span>${c.to}</span></div>
          <div class="between mt8" style="border-top:1px solid var(--line);padding-top:10px"><span class="tiny muted">${c.owner} · ${c.fee}</span><button class="btn btn-ghost btn-sm" data-act="bookCarpool">申请同行</button></div>
        </div>`).join("")}
    </div></div>`;
};
ACTIONS.postCarpool = () => toast("（演示）发布拼车需求");
ACTIONS.bookCarpool = () => toast("已发送同行申请，等待车主确认 ✓");

/* ============================================================
   3. 家庭管理
   ============================================================ */
ROUTES.family = () => hubPage("家庭管理", "", [
  { icon: "drop", label: "家政预约", desc: "保洁·月嫂·保姆，小区口碑沉淀", color: "blue", go: "family-house" },
  { icon: "camera", label: "水电气抄表", desc: "拍表 OCR 自动识别，免人工抄表", color: "amber", go: "family-meter" },
  { icon: "edit", label: "装修管理", desc: "申请审批·施工时段·噪音规范", color: "jade", go: "family-deco" },
  { icon: "bell", label: "证件到期提醒", desc: "房产证·燃气年检·保修到期", color: "rose", go: "family-cert", badge: DB.certs.filter(c=>c.left<30).length + "" },
]);
ROUTES["family-house"] = () => {
  return `<div class="page">${subhead("家政预约")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:var(--blue-100);box-shadow:none;margin-bottom:12px;display:flex;gap:10px;align-items:center">${I("star",{s:20})}<span class="tiny" style="color:var(--blue-500)">所有评价均来自<b>本小区业主</b>真实下单，口碑可信。</span></div>
      ${DB.housekeeping.map((h)=>`
        <div class="card mb12 between">
          <div class="center gap12">${tile(h.icon,h.color)}<div><div style="font-weight:700">${h.name}</div><div class="tiny mt4" style="color:var(--amber-500)">${I("star",{s:12,fill:"currentColor"})} ${h.rating} · <span class="muted">${h.orders}</span></div><div class="tiny" style="color:var(--jade-700);font-weight:600;margin-top:2px">${h.price}</div></div></div>
          <button class="btn btn-primary btn-sm" data-act="bookHouse">预约</button>
        </div>`).join("")}
    </div></div>`;
};
ACTIONS.bookHouse = () => toast("已提交预约，家政顾问将与您电话确认 ✓");
ROUTES["family-meter"] = () => {
  return `<div class="page">${subhead("水电气抄表上报")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:var(--amber-100);box-shadow:none;display:flex;gap:10px;align-items:center;margin-bottom:14px">${I("camera",{s:22})}<span class="tiny" style="color:var(--amber-600)">对准表盘拍照，自动 OCR 识别读数，省去人工抄表与排队。</span></div>
      ${DB.meters.map((m)=>`
        <div class="card mb12">
          <div class="between"><div class="center gap12">${tile(m.icon,m.color)}<div><div style="font-weight:700">${m.name}</div><div class="tiny muted">上期读数 ${m.last} ${m.unit}</div></div></div>
          <button class="btn btn-ghost btn-sm" data-act="ocrMeter" data-id="${m.id}">${I("camera",{s:15})} 拍表</button></div>
          <div class="between mt12" style="gap:10px"><input id="meter-${m.id}" placeholder="本期读数(${m.unit})" inputmode="numeric" style="flex:1;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:15px;font-family:var(--font)"><span class="tiny muted" id="meterhint-${m.id}"></span></div>
        </div>`).join("")}
      <button class="btn btn-primary btn-block mt8" data-act="submitMeter">提交本月读数</button>
    </div></div>`;
};
ACTIONS.ocrMeter = (el) => {
  const m = DB.meters.find((x)=>x.id===el.dataset.id);
  const reading = m.last + Math.floor(Math.random()*30 + 5);
  toast("识别中…");
  setTimeout(() => {
    const inp = view.querySelector("#meter-"+m.id);
    if (inp) inp.value = reading;
    const hint = view.querySelector("#meterhint-"+m.id);
    if (hint) { hint.textContent = "AI 已识别 ✓"; hint.style.color = "var(--jade-600)"; }
    toast("识别成功：" + reading + " " + m.unit);
  }, 800);
};
ACTIONS.submitMeter = () => toast("本月读数已上报物业 ✓");
ROUTES["family-deco"] = () => {
  return `<div class="page">${subhead("装修管理", `<span class="act" data-act="applyDeco">+ 申请</span>`)}
    <div class="pad" style="padding-top:14px">
      <div class="section-title mb12">我的装修申请</div>
      ${DB.decoApplies.map((d)=>`
        <div class="card mb12">
          <div class="between mb8"><div style="font-weight:700">${d.title}</div><span class="pill pill-jade">${d.status}</span></div>
          <div class="tiny muted">${I("calendar",{s:12})} 许可期：${d.period}</div>
          <div class="card mt12" style="background:var(--amber-100);box-shadow:none;padding:12px"><div class="tiny" style="color:var(--amber-600);font-weight:600">施工规范</div><div class="tiny" style="color:var(--amber-600);margin-top:4px">${d.note}</div></div>
        </div>`).join("")}
      <div class="card"><div class="section-title mb12" style="font-size:15px">相关</div>
        <div class="row" data-go="repair-new" style="cursor:pointer"><div class="ico" style="background:var(--rose-100);color:var(--rose-500)">${I("bell",{s:20})}</div><div class="body"><div class="t" style="font-size:14px">装修噪音投诉</div><div class="s">非许可时段施工可在此投诉</div></div>${chev}</div>
        <div class="row"><div class="ico" style="background:var(--blue-100);color:var(--blue-500)">${I("file",{s:20})}</div><div class="body"><div class="t" style="font-size:14px">装修押金 / 出入证</div><div class="s">押金 ￥2000 · 已缴纳</div></div>${chev}</div>
      </div>
    </div></div>`;
};
ACTIONS.applyDeco = () => toast("（演示）填写装修申请，物业 1-2 日内审批");
ROUTES["family-cert"] = () => {
  return `<div class="page">${subhead("证件到期提醒")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="padding:4px 16px">
        ${DB.certs.sort((a,b)=>a.left-b.left).map((c)=>`
          <div class="row">${tile("file", c.left<20?"rose":c.color, 40)}
            <div class="body"><div class="t" style="font-size:15px">${c.name}</div><div class="s">到期日 ${c.due}</div></div>
            <span class="pill ${c.left<20?"pill-rose":c.left<40?"pill-amber":"pill-jade"}">${c.left} 天后</span>
          </div>`).join("")}
      </div>
      <button class="btn btn-ghost btn-block mt12" data-act="addCert">${I("plus",{s:16})} 添加自定义提醒</button>
      <div class="tiny muted" style="text-align:center;margin-top:12px">到期前 30/7/1 天将推送提醒</div>
    </div></div>`;
};
ACTIONS.addCert = () => toast("（演示）添加证件 / 保修到期提醒");

/* ============================================================
   4. 出行便利
   ============================================================ */
ROUTES.travel = () => hubPage("出行便利", "", [
  { icon: "map", label: "周边生活地图", desc: "超市·医院·学校·地铁 社区定制版", color: "jade", go: "travel-map" },
  { icon: "car", label: "单车·充电桩", desc: "小区内共享设施实时状态", color: "amber", go: "travel-bike" },
  { icon: "phone", label: "网约车叫车", desc: "门口上车点已标记，免手动定位", color: "blue", act: "callTaxi" },
  { icon: "box", label: "快递代收代寄", desc: "统一寄件 · 多家比价", color: "rose", go: "travel-express" },
]);
ROUTES["travel-map"] = () => {
  const cats = DB.pois;
  return `<div class="page">${subhead("周边生活地图")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="height:140px;background:linear-gradient(135deg,#d6e6fb,#aecaf0);position:relative;overflow:hidden;display:grid;place-items:center;color:var(--jade-900)">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px);background-size:24px 24px"></div>
        <div style="position:relative;text-align:center">${I("map",{s:34})}<div class="tiny" style="font-weight:700;margin-top:4px">翠湖名邸 · 周边 1.5km</div></div>
      </div>
      ${Object.entries(cats).map(([cat, list]) => `
        <div class="section-title mt16 mb8" style="font-size:15px">${cat}</div>
        <div class="card" style="padding:4px 16px">
          ${list.map((p)=>`<div class="row">${tile({超市:"box",医院:"drop",学校:"file",地铁:"map"}[cat]||"map", {超市:"amber",医院:"rose",学校:"blue",地铁:"jade"}[cat],38)}<div class="body"><div class="t" style="font-size:14px">${p.n}</div><div class="s">${p.t}</div></div><span class="tiny muted">${p.d}</span></div>`).join("")}
        </div>`).join("")}
    </div></div>`;
};
ROUTES["travel-bike"] = () => {
  const b = DB.bikes;
  return `<div class="page">${subhead("单车 · 充电桩")}
    <div class="pad" style="padding-top:14px">
      <div class="section-title mb12">共享单车 · 实时</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="card" style="text-align:center"><div class="money" style="font-size:30px;color:var(--amber-500)">${b.mobike}</div><div class="tiny muted mt4">美团单车 · 西门</div></div>
        <div class="card" style="text-align:center"><div class="money" style="font-size:30px;color:var(--blue-500)">${b.hellobike}</div><div class="tiny muted mt4">哈啰单车 · 东门</div></div>
      </div>
      <div class="section-title mt20 mb12">电动车充电桩</div>
      <div class="card between"><div class="center gap12">${tile("bolt","jade")}<div><div style="font-weight:700">车棚充电站</div><div class="tiny muted">共 ${b.chargers.total} 个插位</div></div></div>
        <div style="text-align:right"><div class="money" style="font-size:22px;color:var(--jade-600)">${b.chargers.free}</div><div class="tiny muted">空闲</div></div></div>
      <button class="btn btn-ghost btn-block mt12" data-act="scanCharge">${I("qr",{s:16})} 扫码充电</button>
    </div></div>`;
};
ACTIONS.scanCharge = () => toast("（演示）打开扫一扫充电");
ACTIONS.callTaxi = () => openSheet("网约车叫车", `
  <div class="card" style="box-shadow:none;background:#fff"><div class="row"><div class="ico" style="background:var(--jade-100);color:var(--jade-700)">${I("map",{s:20})}</div><div class="body"><div class="t" style="font-size:14px">上车点</div><div class="s">翠湖名邸西门 · 访客落客区（已标记）</div></div></div></div>
  <div class="flex gap12 mt12">
    <button class="btn btn-line grow" data-act="taxiGo">滴滴出行</button>
    <button class="btn btn-line grow" data-act="taxiGo">高德打车</button>
  </div>
  <div class="tiny muted" style="text-align:center;margin-top:12px">已自动填入上车点，省去手动定位</div>`);
ACTIONS.taxiGo = () => { closeSheet(); toast("（演示）跳转叫车，上车点已带入"); };
ROUTES["travel-express"] = () => {
  return `<div class="page">${subhead("快递代收代寄")}
    <div class="pad" style="padding-top:14px">
      <div class="card" data-go="parcels" style="cursor:pointer;background:linear-gradient(135deg,#e2614d,#c43f2c);color:#fff;display:flex;gap:14px;align-items:center">
        <div style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.2);display:grid;place-items:center">${I("box",{s:24})}</div>
        <div class="grow"><div style="font-weight:700">我的待取快递</div><div class="tiny" style="opacity:.9">${DB.parcels.filter(p=>p.status==="pending").length} 件待取 · 含 1 件即将超时</div></div>${I("chevR")}
      </div>
      <div class="section-title mt20 mb12">一键寄件 · 多家比价</div>
      ${DB.expressPrices.map((e)=>`
        <div class="card mb12 between"><div class="center gap12"><div style="width:42px;height:42px;border-radius:10px;background:${TINT[e.tag].bg};color:${TINT[e.tag].fg};display:grid;place-items:center;font-weight:700">${e.brand[0]}</div><div><div style="font-weight:700">${e.brand}</div><div class="tiny muted">${e.time}</div></div></div>
        <div class="center gap8"><span class="money" style="color:var(--rose-500)">${e.price}</span><button class="btn btn-ghost btn-sm" data-act="sendExpress">寄件</button></div></div>`).join("")}
      <div class="tiny muted" style="text-align:center">快递员将上门取件，或由物业前台代收代寄</div>
    </div></div>`;
};
ACTIONS.sendExpress = () => toast("（演示）填写寄件信息，快递员上门取件");

/* ============================================================
   5. 信息透明
   ============================================================ */
ROUTES.transparency = () => hubPage("信息透明", "", [
  { icon: "receipt", label: "物业收支公示", desc: "每一笔费用去向可查", color: "jade", go: "trans-finance" },
  { icon: "wrench", label: "设施维保记录", desc: "电梯保养·泳池水质检测", color: "blue", go: "trans-maintain" },
  { icon: "file", label: "周边规划公示", desc: "政府规划信息推送", color: "amber", go: "trans-plan" },
  { icon: "arrowUp", label: "房价参考", desc: "同小区近期成交价(贝壳数据)", color: "rose", go: "trans-price" },
]);
ROUTES["trans-finance"] = () => {
  const f = DB.finance;
  const bar = (items, total) => items.map(([name, v, c]) => `
    <div class="mb12"><div class="between tiny mb4"><span style="font-weight:600">${name}</span><span class="muted">${v} 万 · ${Math.round(v/total*100)}%</span></div>
    <div style="height:10px;background:#f0ede4;border-radius:5px;overflow:hidden"><div style="height:100%;width:${Math.round(v/total*100)}%;background:${TINT[c]?TINT[c].fg:"#bbb"};border-radius:5px"></div></div></div>`).join("");
  return `<div class="page">${subhead("物业收支公示")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:linear-gradient(135deg,#3a93ff,#0e63e6);color:#fff">
        <div class="tiny" style="opacity:.85">${f.month} 收支概览（单位：万元）</div>
        <div class="flex mt12" style="gap:18px">
          <div><div class="tiny" style="opacity:.8">总收入</div><div class="money" style="font-size:24px">${f.income}</div></div>
          <div><div class="tiny" style="opacity:.8">总支出</div><div class="money" style="font-size:24px">${f.expense}</div></div>
          <div><div class="tiny" style="opacity:.8">结余</div><div class="money" style="font-size:24px;color:#ffe1a8">${(f.income-f.expense).toFixed(1)}</div></div>
        </div>
      </div>
      <div class="card mt12"><div class="section-title mb16" style="font-size:15px">收入构成</div>${bar(f.incomeItems, f.income)}</div>
      <div class="card mt12"><div class="section-title mb16" style="font-size:15px">支出构成</div>${bar(f.expenseItems, f.expense)}</div>
      <div class="card mt12" style="background:var(--jade-50);box-shadow:none"><div class="tiny" style="color:var(--jade-700)">${f.balance}</div></div>
      <button class="btn btn-ghost btn-block mt12" data-act="invoice">${I("file",{s:16})} 下载完整收支明细 (PDF)</button>
    </div></div>`;
};
ROUTES["trans-maintain"] = () => {
  return `<div class="page">${subhead("设施维保记录")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="padding:4px 16px">
        ${DB.maintainRecords.map((r)=>`<div class="row">${tile("wrench", r.color, 40)}<div class="body"><div class="t" style="font-size:14px">${r.item}</div><div class="s">${r.date}</div></div><span class="pill pill-jade">${r.result}</span></div>`).join("")}
      </div>
      <div class="tiny muted" style="text-align:center;margin-top:12px">检测报告原件可在物业服务中心查阅</div>
    </div></div>`;
};
ROUTES["trans-plan"] = () => {
  return `<div class="page">${subhead("周边规划公示")}
    <div class="pad" style="padding-top:14px">
      ${DB.planNotices.map((p)=>`
        <div class="card mb12"><div class="between mb8"><span class="pill pill-amber">规划公示</span><span class="tiny muted">${p.date}</span></div>
        <div style="font-weight:700;line-height:1.4">${p.title}</div>
        <div class="tiny muted mt8">${p.body}</div>
        <div class="tiny muted mt8">来源：${p.src}</div></div>`).join("")}
    </div></div>`;
};
ROUTES["trans-price"] = () => {
  const p = DB.priceDeals, max = Math.max(...p.chart), min = Math.min(...p.chart);
  const pts = p.chart.map((v, i) => `${(i/(p.chart.length-1)*300).toFixed(0)},${(70-(v-min)/(max-min)*56).toFixed(0)}`).join(" ");
  return `<div class="page">${subhead("房价参考")}
    <div class="pad" style="padding-top:14px">
      <div class="card">
        <div class="between"><div><div class="tiny muted">本小区参考均价</div><div class="money" style="font-size:28px;margin-top:2px">${p.avg}</div></div>
        <div style="text-align:right"><span class="pill ${p.trendUp?"pill-jade":"pill-rose"}">${p.trendUp?"↑":"↓"} ${p.trend}</span><div class="tiny muted mt4">近 30 天环比</div></div></div>
        <svg viewBox="0 0 300 80" width="100%" height="80" style="margin-top:12px" preserveAspectRatio="none">
          <polyline points="${pts}" fill="none" stroke="var(--jade-600)" stroke-width="2.5"/>
          <polyline points="0,80 ${pts} 300,80" fill="var(--jade-100)" opacity=".5" stroke="none"/>
        </svg>
        <div class="tiny muted" style="text-align:center">近 6 个月均价走势（万/㎡）· 数据来源：贝壳</div>
      </div>
      <div class="section-title mt20 mb12">近期成交</div>
      <div class="card" style="padding:4px 16px">
        ${p.deals.map((d)=>`<div class="row"><div class="body"><div class="t" style="font-size:14px">${d.house} · ${d.area}</div><div class="s">成交于 ${d.date}</div></div><div style="text-align:right"><div class="money">${d.total}</div><div class="tiny muted">${d.unit}/㎡</div></div></div>`).join("")}
      </div>
      <div class="tiny muted" style="text-align:center;margin-top:12px">数据仅供参考，不构成交易建议</div>
    </div></div>`;
};

/* ---------- 路由注册完成后重新渲染（支持深链 & 首屏） ---------- */
render();
