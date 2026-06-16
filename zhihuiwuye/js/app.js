/* ============================================================
   App shell · 路由 + 视图 + 交互  (vanilla JS, hash router)
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const view = $("#view");
const TABS = ["home", "services", "messages", "profile"];

/* ---------- color helpers ---------- */
const TINT = {
  jade:   { bg: "var(--jade-100)",   fg: "var(--jade-700)" },
  amber:  { bg: "var(--amber-100)",  fg: "var(--amber-600)" },
  blue:   { bg: "var(--blue-100)",   fg: "#0a8aa6" },
  rose:   { bg: "var(--rose-100)",   fg: "var(--rose-500)" },
  green:  { bg: "var(--green-100)",  fg: "var(--green-600)" },
  purple: { bg: "var(--purple-100)", fg: "var(--purple-600)" },
};
const tile = (icon, color = "jade", size = 40) => {
  const c = TINT[color] || TINT.jade;
  return `<div class="ico" style="width:${size}px;height:${size}px;background:${c.bg};color:${c.fg}">${I(icon, { s: size * 0.55 })}</div>`;
};
const yuan = (n) => "¥" + Number(n).toFixed(2);

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 1900);
}

/* ---------- bottom sheet ---------- */
function openSheet(title, bodyHtml) {
  const s = $("#sheet");
  s.innerHTML = `<div class="sheet-grip"></div>
    <div class="sheet-head"><h3>${title}</h3><button class="x" data-close>${I("plus", { sw: 2 }).replace("0 24 24", "0 24 24")}</button></div>
    <div class="sheet-body">${bodyHtml}</div>`;
  // rotate plus into an x
  s.querySelector(".x svg").style.transform = "rotate(45deg)";
  $("#scrim").classList.add("show");
  requestAnimationFrame(() => s.classList.add("show"));
}
function closeSheet() {
  $("#sheet").classList.remove("show");
  $("#scrim").classList.remove("show");
}
$("#scrim").addEventListener("click", closeSheet);

/* ---------- router ---------- */
function go(route) { location.hash = "#/" + route; }
function back() { history.length > 1 ? history.back() : go("home"); }

function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "") || "home";
  const [name, ...rest] = h.split("/");
  return { name: name || "home", arg: rest.join("/") };
}

const ROUTES = {};
function render() {
  const { name, arg } = parseRoute();
  const fn = ROUTES[name] || ROUTES.home;
  const isTab = TABS.includes(name);

  $("#tabbar").classList.toggle("hidden", !isTab);
  $("#statusbar").classList.toggle("on-dark", name === "home");

  view.scrollTop = 0;
  view.innerHTML = fn(arg);
  if (isTab) renderTabbar(name);
  if (typeof fn.after === "function") fn.after(arg);
  closeSheet();
}
window.addEventListener("hashchange", render);

/* ---------- tab bar ---------- */
function renderTabbar(active) {
  const items = [
    { k: "home", label: "首页", icon: "home" },
    { k: "services", label: "服务", icon: "grid" },
    { k: "messages", label: "消息", icon: "bell" },
    { k: "profile", label: "我的", icon: "user" },
  ];
  const unread = DB.notices.filter((n) => !n.read).length;
  $("#tabbar").innerHTML = items.map((it) => `
    <button class="tab ${it.k === active ? "active" : ""}" data-go="${it.k}">
      <div style="position:relative">${I(it.icon, { s: 24, fill: it.k === active ? "currentColor" : "" })}
      ${it.k === "messages" && unread ? `<span style="position:absolute;top:-3px;right:-7px;background:var(--rose-500);color:#fff;font-size:10px;min-width:15px;height:15px;border-radius:8px;display:grid;place-items:center;padding:0 3px">${unread}</span>` : ""}</div>
      <span>${it.label}</span>
    </button>`).join("");
}

/* ============================================================
   delegated events
   ============================================================ */
document.addEventListener("click", (e) => {
  const goEl = e.target.closest("[data-go]");
  if (goEl) { go(goEl.dataset.go); return; }
  const backEl = e.target.closest("[data-back]");
  if (backEl) { back(); return; }
  const closeEl = e.target.closest("[data-close]");
  if (closeEl) { closeSheet(); return; }
  const actEl = e.target.closest("[data-act]");
  if (actEl) { (ACTIONS[actEl.dataset.act] || (() => {}))(actEl); }
});

const ACTIONS = {};

/* ============================================================
   shared bits
   ============================================================ */
const subhead = (title, action = "") =>
  `<div class="subhead"><button class="back" data-back>${I("chevL", { sw: 2 })}</button><h1>${title}</h1>${action || '<span style="width:38px"></span>'}</div>`;

const chev = `<span class="chev">${I("chevR", { s: 18 })}</span>`;

/* ============================================================
   HOME  首页
   ============================================================ */
ROUTES.home = () => {
  const u = DB.user, c = DB.community;
  const unpaid = DB.bills.filter((b) => b.status === "unpaid");
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const quick = [
    { icon: "creditcard", label: "物业缴费", color: "jade", go: "bills" },
    { icon: "wrench", label: "在线报修", color: "amber", go: "repairs" },
    { icon: "visitor", label: "访客邀请", color: "green", go: "visitors" },
    { icon: "car", label: "停车服务", color: "blue", go: "parking" },
    { icon: "box", label: "我的快递", color: "rose", go: "parcels" },
    { icon: "calendar", label: "设施预约", color: "purple", go: "facilities" },
    { icon: "chat", label: "邻里圈", color: "amber", go: "community" },
    { icon: "more", label: "全部服务", color: "jade", go: "services" },
  ];
  const unread = DB.notices.filter((n) => !n.read).length;
  const headIcon = (name, badge) => `<button class="hd-ico" data-act="${name === "search" ? "openSearch" : name === "scan" ? "scan" : "goMsg"}" aria-label="${name}">
      ${I(name === "search" ? "search" : name === "scan" ? "qr" : "bell", { s: 21 })}
      ${badge ? `<span class="hd-badge">${badge}</span>` : ""}
    </button>`;

  const banners = DB.activities.slice(0, 3);
  const bgrad = { amber: ["#ffa732", "#f0820a"], blue: ["#1ec3e0", "#0a8fb5"], jade: ["#3a93ff", "#0e63e6"], green: ["#13c884", "#06a96b"], rose: ["#ff7075", "#fa4b51"], purple: ["#9376ff", "#7a5cff"] };
  const proc = DB.repairs.find((r) => r.status === "processing");
  const g = DB.groupBuys[0];
  const post = DB.posts[0];
  const urgent = DB.notices.find((n) => n.urgent) || DB.notices[0];
  const skill = DB.skills[0];

  /* ---- 双列瀑布流卡片 ---- */
  const feed = [];
  feed.push(`<div class="fcard" data-go="community">
    <div class="center gap8" style="margin-bottom:8px"><span class="favat" style="background:var(--rose-100);color:var(--rose-500)">${post.avatar}</span><span style="font-weight:600;font-size:13px">${post.user}</span></div>
    <span class="pill pill-rose">${post.cat}</span>
    <div style="font-size:14px;line-height:1.5;color:var(--ink-700);margin-top:8px">${post.text}</div>
    <div class="center gap12 tiny muted" style="margin-top:10px">${I("heart",{s:14})} ${post.likes} <span class="center gap6">${I("comment",{s:14})} ${post.comments}</span></div>
  </div>`);
  feed.push(`<div class="fcard" data-go="collab-group" style="padding:0;overflow:hidden">
    <div style="height:94px;background:linear-gradient(135deg,#ffb74d,#ff9416);display:grid;place-items:center;color:#fff;position:relative">${I("box",{s:34})}<span class="pill" style="position:absolute;top:8px;left:8px;background:rgba(255,255,255,.92);color:var(--amber-600)">拼团</span></div>
    <div style="padding:11px 12px 13px">
      <div style="font-weight:600;font-size:14px;line-height:1.4">${g.title}</div>
      <div class="center gap6" style="margin-top:6px"><span class="money" style="color:var(--rose-500);font-size:17px">￥${g.price}</span><span class="tiny muted" style="text-decoration:line-through">￥${g.market}</span></div>
      <div style="height:6px;background:#f0ede4;border-radius:3px;margin-top:8px;overflow:hidden"><div style="height:100%;width:${Math.round(g.joined/g.need*100)}%;background:var(--amber-500);border-radius:3px"></div></div>
      <div class="tiny muted" style="margin-top:5px">已拼 ${g.joined}/${g.need} 份 · 截止${g.ends}</div>
    </div>
  </div>`);
  if (proc) feed.push(`<div class="fcard" data-go="repair/${proc.id}" style="border-top:3px solid var(--amber-500)">
    <div class="between" style="margin-bottom:8px"><span class="pill pill-amber">报修处理中</span></div>
    <div style="font-weight:600;font-size:14px;line-height:1.4">${proc.title}</div>
    <div class="tiny muted" style="margin-top:8px">${proc.worker.name} · 预计${proc.appoint}上门</div>
    <div class="center gap6 tiny" style="color:var(--jade-700);font-weight:600;margin-top:6px">查看进度 ${I("chevR",{s:13})}</div>
  </div>`);
  feed.push(`<div class="fcard" data-go="notice/${urgent.id}" style="background:linear-gradient(135deg,#fff,#fff6f5)">
    <div class="between" style="margin-bottom:8px"><span class="pill pill-rose">${urgent.cat}</span>${urgent.needSign && !urgent.signed ? '<span class="pill pill-amber">待签收</span>' : ""}</div>
    <div style="font-weight:600;font-size:14px;line-height:1.45">${urgent.title}</div>
    <div class="tiny muted" style="margin-top:8px">${urgent.time}</div>
  </div>`);
  feed.push(`<div class="fcard" data-go="collab-skill">
    <div class="center gap8" style="margin-bottom:8px"><span class="favat" style="background:var(--blue-100);color:#0a8aa6">${skill.avatar}</span><span style="font-weight:600;font-size:13px">${skill.name}</span></div>
    <span class="pill pill-blue">技能互助</span>
    <div style="font-size:14px;color:var(--ink-700);margin-top:8px">${skill.skill}</div>
    <div class="tiny" style="color:var(--jade-700);font-weight:600;margin-top:8px">${skill.price}</div>
  </div>`);
  feed.push(`<div class="fcard" data-go="facilities" style="background:linear-gradient(140deg,#eef4ff,#fff)">
    <div class="center gap8">${tile("dumbbell","purple",40)}<div><div style="font-weight:600;font-size:14px">设施预约</div><div class="tiny muted" style="margin-top:2px">健身房·球场·泳池</div></div></div>
    <div class="tiny" style="color:var(--jade-700);font-weight:600;margin-top:10px">今晚还有空位 ${I("chevR",{s:13})}</div>
  </div>`);

  return `<div class="page home">
    <div class="home-hd" style="background:linear-gradient(160deg,#2e90ff 0%,#1677ff 52%,#0a5fe0 100%)">
      <div style="position:absolute;right:-50px;top:-40px;width:190px;height:190px;border-radius:50%;background:rgba(255,255,255,.07)"></div>
      <div style="position:absolute;right:40px;top:70px;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.05)"></div>
      <div class="between" style="position:relative">
        <div>
          <div style="font-size:18px;font-weight:800;letter-spacing:-.3px">${c.name} · ${u.house.replace(/^.*?单元\s*/, "")}</div>
          <div style="font-size:12px;opacity:.88;margin-top:3px">${I("sun",{s:13})} ${c.weather.temp}° ${c.weather.desc} · 空气${c.weather.aqi} · ${u.community.split(" · ")[1] || ""}</div>
        </div>
        <div class="center" style="gap:4px">${headIcon("search")}${headIcon("scan")}${headIcon("bell", unread || "")}</div>
      </div>

      <!-- 紧凑待缴条 -->
      <div class="paybar" data-go="bills">
        <div class="grow">
          <div class="center gap6"><span class="tiny" style="color:var(--ink-500)">本月待缴 · ${unpaid.length}笔</span><span class="pill pill-amber" style="transform:scale(.9)">6-25到期</span></div>
          <div class="center" style="gap:8px;margin-top:3px"><span class="money" style="font-size:26px;color:var(--ink-900)">${yuan(unpaidTotal)}</span></div>
          <div class="tiny muted" style="margin-top:2px">${unpaid.map((b) => b.type.replace("管理费","").replace("公共","") + " ¥" + b.amount).join(" · ")}</div>
        </div>
        <button class="btn btn-amber btn-sm" data-go="bills">去缴费</button>
      </div>
    </div>

    <div class="pad" style="margin-top:14px">
      <!-- 多彩九宫格 -->
      <div class="card">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px 6px">
          ${quick.map((q) => `
            <button data-go="${q.go}" style="background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px">
              ${tile(q.icon, q.color, 46)}
              <span style="font-size:12px;color:var(--ink-700);font-weight:500">${q.label}</span>
            </button>`).join("")}
        </div>
      </div>

      <!-- 活动 banner 轮播 -->
      <div class="banner-row nowrap-x mt12">
        ${banners.map((a) => `
          <div class="banner" data-go="community" style="background:linear-gradient(120deg,${(bgrad[a.img]||bgrad.jade)[0]},${(bgrad[a.img]||bgrad.jade)[1]})">
            <div style="position:absolute;right:-14px;bottom:-18px;opacity:.18">${I("party",{s:88})}</div>
            <div class="pill" style="background:rgba(255,255,255,.9);color:${(bgrad[a.img]||bgrad.jade)[1]};align-self:flex-start">${a.fee}</div>
            <div style="font-weight:800;font-size:16px;line-height:1.35;margin-top:auto">${a.title}</div>
            <div style="font-size:12px;opacity:.92;margin-top:4px">${a.date} · ${a.place} · ${a.joined}人已报名</div>
          </div>`).join("")}
      </div>

      <!-- 发现·社区生活 双列瀑布流 -->
      <div class="section-title mt20 mb12">发现 · 社区生活</div>
      <div class="feed">
        ${feed.map((f) => `<div class="feed-item">${f}</div>`).join("")}
      </div>
      <div style="text-align:center;margin-top:6px"><button class="btn btn-line btn-sm" data-go="community">查看更多社区动态</button></div>
    </div>
  </div>`;
};

ACTIONS.goMsg = () => go("messages");
ACTIONS.scan = () => toast("（演示）打开扫一扫 · 通行/充电/缴费");
ACTIONS.openSearch = () => {
  const hot = [["物业费","bills"],["在线报修","repairs"],["停水通知","messages"],["访客邀请","visitors"],["充电桩","travel-bike"],["邻里圈","community"],["设施预约","facilities"]];
  openSheet("搜索服务", `
    <div class="field" style="margin-bottom:14px"><div style="position:relative">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-400)">${I("search",{s:18})}</span>
      <input autofocus placeholder="搜物业费 / 报修 / 公告 / 服务…" style="padding-left:38px">
    </div></div>
    <div class="tiny muted" style="font-weight:600;margin-bottom:10px">大家都在搜</div>
    <div class="chip-group">${hot.map(([t,r]) => `<span class="chip" data-go="${r}">${t}</span>`).join("")}</div>`);
};

/* ============================================================
   SERVICES  服务总览
   ============================================================ */
ROUTES.services = () => {
  const groups = [
    { title: "日常生活", items: [
      { icon: "visitor", label: "访客管理", color: "green", go: "visitors", desc: "邀请·通行码" },
      { icon: "box", label: "包裹快递", color: "rose", go: "parcels", desc: "取件码·提醒" },
      { icon: "car", label: "停车管理", color: "blue", go: "parking", desc: "月租·车位" },
      { icon: "calendar", label: "设施预约", color: "purple", go: "facilities", desc: "健身·球场" },
    ]},
    { title: "缴费 · 报修", items: [
      { icon: "creditcard", label: "物业缴费", color: "jade", go: "bills", desc: "账单·发票" },
      { icon: "wrench", label: "在线报修", color: "amber", go: "repairs", desc: "工单跟踪" },
      { icon: "chat", label: "投诉建议", color: "blue", go: "complaints", desc: "反馈通道" },
      { icon: "receipt", label: "电子发票", color: "rose", go: "bills", desc: "下载·开票" },
    ]},
    { title: "社区互动", items: [
      { icon: "comment", label: "邻里圈", color: "green", go: "community", desc: "互助·转让" },
      { icon: "vote", label: "业委会", color: "jade", go: "community", desc: "公示·投票" },
      { icon: "party", label: "社区活动", color: "amber", go: "community", desc: "报名" },
      { icon: "bell", label: "通知公告", color: "purple", go: "messages", desc: "签收" },
    ]},
    { title: "智能家居 · 高端", items: [
      { icon: "door", label: "远程开门", color: "jade", go: "smart", desc: "门禁·对讲" },
      { icon: "lock", label: "智能门锁", color: "amber", go: "smart", desc: "授权管理" },
      { icon: "face", label: "人脸车牌", color: "blue", go: "smart", desc: "录入" },
      { icon: "video", label: "可视对讲", color: "purple", go: "smart", desc: "楼栋" },
    ]},
    { title: "安全与应急", items: [
      { icon: "phone", label: "紧急求助", color: "rose", go: "safety", desc: "SOS·定位" },
      { icon: "user", label: "老人关怀", color: "amber", go: "safety-elder", desc: "异常提醒" },
      { icon: "camera", label: "高空抛物", color: "blue", go: "safety-throw", desc: "AI定位" },
      { icon: "shield", label: "消防通道", color: "green", go: "safety-fire", desc: "占用举报" },
    ]},
    { title: "邻里协作", items: [
      { icon: "box", label: "拼团团购", color: "amber", go: "collab-group", desc: "拼单更省" },
      { icon: "users", label: "技能互助", color: "jade", go: "collab-skill", desc: "邻里帮忙" },
      { icon: "heart", label: "宠物社区", color: "rose", go: "collab-pet", desc: "约伴·寻宠" },
      { icon: "car", label: "拼车出行", color: "green", go: "collab-carpool", desc: "顺风车" },
    ]},
    { title: "家庭管理", items: [
      { icon: "drop", label: "家政预约", color: "blue", go: "family-house", desc: "保洁·月嫂" },
      { icon: "camera", label: "拍表抄表", color: "amber", go: "family-meter", desc: "OCR识别" },
      { icon: "edit", label: "装修管理", color: "green", go: "family-deco", desc: "申请审批" },
      { icon: "bell", label: "证件提醒", color: "rose", go: "family-cert", desc: "到期预警" },
    ]},
    { title: "出行便利", items: [
      { icon: "map", label: "生活地图", color: "green", go: "travel-map", desc: "周边配套" },
      { icon: "car", label: "单车充电", color: "amber", go: "travel-bike", desc: "实时状态" },
      { icon: "phone", label: "网约车", color: "blue", go: "travel", desc: "上车点" },
      { icon: "box", label: "代收代寄", color: "purple", go: "travel-express", desc: "多家比价" },
    ]},
    { title: "信息透明", items: [
      { icon: "receipt", label: "收支公示", color: "jade", go: "trans-finance", desc: "费用可查" },
      { icon: "wrench", label: "维保记录", color: "blue", go: "trans-maintain", desc: "电梯·泳池" },
      { icon: "file", label: "规划公示", color: "amber", go: "trans-plan", desc: "政府推送" },
      { icon: "arrowUp", label: "房价参考", color: "rose", go: "trans-price", desc: "成交价" },
    ]},
  ];
  return `<div class="page">
    <div style="padding:14px 18px 4px"><h1 style="font-size:24px;font-weight:800">全部服务</h1></div>
    <div class="pad">
      ${groups.map((g) => `
        <div class="section-title mt20 mb12">${g.title}</div>
        <div class="card">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px 6px">
            ${g.items.map((it) => `
              <button data-go="${it.go}" style="background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px">
                ${tile(it.icon, it.color, 46)}
                <span style="font-size:12px;color:var(--ink-700);font-weight:600">${it.label}</span>
                <span style="font-size:10px;color:var(--ink-400);margin-top:-4px">${it.desc}</span>
              </button>`).join("")}
          </div>
        </div>`).join("")}
      <div style="height:8px"></div>
    </div>
  </div>`;
};

/* ============================================================
   BILLS  缴费
   ============================================================ */
ROUTES.bills = () => {
  const unpaid = DB.bills.filter((b) => b.status === "unpaid");
  const paid = DB.bills.filter((b) => b.status === "paid");
  const total = unpaid.reduce((s, b) => s + b.amount, 0);
  const billCard = (b) => `
    <label class="row" style="cursor:pointer">
      <input type="checkbox" class="bill-ck" data-id="${b.id}" data-amt="${b.amount}" checked style="width:20px;height:20px;accent-color:var(--jade-700)">
      ${tile(b.icon, b.color)}
      <div class="body"><div class="t">${b.type}</div><div class="s">${b.period} · ${b.detail}</div></div>
      <div style="text-align:right"><div class="money">${yuan(b.amount)}</div><div class="tiny" style="color:var(--rose-500)">${b.due} 到期</div></div>
    </label>`;

  return `<div class="page">
    ${subhead("物业缴费", `<span class="act" data-go="bills-history">缴费记录</span>`)}
    <div class="pad" style="padding-top:14px">
      ${unpaid.length ? `
        <div class="section-title mb12">待缴账单</div>
        <div class="card" style="padding:4px 16px">${unpaid.map(billCard).join("")}</div>
        <div class="card mt12 between">
          <div>
            <div class="tiny muted">应缴合计</div>
            <div class="money" id="paySum" style="font-size:22px;color:var(--rose-500)">${yuan(total)}</div>
          </div>
          <button class="btn btn-primary" data-act="payNow">立即缴费</button>
        </div>` : `<div class="card" style="text-align:center;padding:40px">${I("check", { s: 40 })}<div class="mt8" style="font-weight:600">本月账单已结清</div><div class="tiny muted mt4">感谢您的支持</div></div>`}

      <div class="card mt16 between" data-act="toggleAuto" style="cursor:pointer">
        <div class="center" style="gap:12px">${tile("settings", "blue")}<div><div style="font-weight:600">自动扣费授权</div><div class="tiny muted">${DB.autopay.enabled ? "已开启 · " + DB.autopay.method : "开启后到期自动代扣，免逾期"}</div></div></div>
        <div class="switch ${DB.autopay.enabled ? "on" : ""}" style="width:46px;height:27px;border-radius:999px;background:${DB.autopay.enabled ? "var(--jade-600)" : "#d8d4c8"};position:relative;transition:.2s">
          <span style="position:absolute;top:3px;left:${DB.autopay.enabled ? "22px" : "3px"};width:21px;height:21px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)"></span>
        </div>
      </div>

      <div class="between mt20 mb12"><div class="section-title">近期缴费</div><span class="more" data-go="bills-history">全部 ${I("chevR", { s: 14 })}</span></div>
      <div class="card" style="padding:4px 16px">
        ${paid.slice(0, 3).map((b) => `
          <div class="row" data-go="receipt/${b.id}" style="cursor:pointer">
            ${tile(b.icon, b.color)}
            <div class="body"><div class="t">${b.type}</div><div class="s">${b.paidAt} · ${b.method}</div></div>
            <div style="text-align:right"><div class="money">${yuan(b.amount)}</div><div class="tiny" style="color:var(--jade-600)">已缴 ›</div></div>
          </div>`).join("")}
      </div>
    </div>
  </div>`;
};
ROUTES.bills.after = () => bindBillSum();
function bindBillSum() {
  view.querySelectorAll(".bill-ck").forEach((ck) => ck.addEventListener("change", recalcSum));
}
function recalcSum() {
  const sum = [...view.querySelectorAll(".bill-ck")].filter((c) => c.checked).reduce((s, c) => s + Number(c.dataset.amt), 0);
  const el = $("#paySum"); if (el) el.textContent = yuan(sum);
}
ACTIONS.payNow = () => {
  const picked = [...view.querySelectorAll(".bill-ck")].filter((c) => c.checked);
  if (!picked.length) return toast("请选择要缴纳的账单");
  const sum = picked.reduce((s, c) => s + Number(c.dataset.amt), 0);
  openSheet("确认支付", `
    <div class="money" style="font-size:34px;text-align:center;margin:8px 0 18px">${yuan(sum)}</div>
    <div class="card" style="box-shadow:none;background:#fff;padding:4px 14px">
      ${["微信支付","支付宝","招商银行(8866)"].map((m,i)=>`
        <label class="row"><input type="radio" name="pm" ${i===0?"checked":""} style="width:18px;height:18px;accent-color:var(--jade-700)"><div class="body"><div class="t" style="font-size:14px">${m}</div></div></label>`).join("")}
    </div>
    <button class="btn btn-primary btn-block mt20" data-act="payDone" data-ids="${picked.map(c=>c.dataset.id).join(",")}">确认支付 ${yuan(sum)}</button>`);
};
ACTIONS.payDone = (el) => {
  el.dataset.ids.split(",").forEach((id) => {
    const b = DB.bills.find((x) => x.id === id);
    if (b) { b.status = "paid"; b.paidAt = "2026-06-15 09:41"; b.method = "微信支付"; }
  });
  closeSheet();
  setTimeout(() => { toast("缴费成功 ✓"); render(); }, 250);
};
ACTIONS.toggleAuto = () => {
  DB.autopay.enabled = !DB.autopay.enabled;
  toast(DB.autopay.enabled ? "已开启自动扣费" : "已关闭自动扣费");
  render();
};

ROUTES["bills-history"] = () => {
  return `<div class="page">${subhead("缴费记录")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="padding:4px 16px">
        ${DB.bills.filter((b)=>b.status==="paid").map((b) => `
          <div class="row" data-go="receipt/${b.id}" style="cursor:pointer">
            ${tile(b.icon, b.color)}
            <div class="body"><div class="t">${b.type} · ${b.period}</div><div class="s">${b.paidAt} · ${b.method}</div></div>
            <div style="text-align:right"><div class="money">${yuan(b.amount)}</div><div class="tiny muted">查看发票 ›</div></div>
          </div>`).join("")}
      </div>
    </div></div>`;
};

ROUTES.receipt = (id) => {
  const b = DB.bills.find((x) => x.id === id) || DB.bills[0];
  return `<div class="page">${subhead("电子凭证")}
    <div class="pad" style="padding-top:18px">
      <div class="card" style="text-align:center;padding:28px 18px">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--jade-100);color:var(--jade-700);display:grid;place-items:center;margin:0 auto">${I("check", { s: 30, sw: 2.4 })}</div>
        <div class="money" style="font-size:30px;margin-top:14px">${yuan(b.amount)}</div>
        <div class="tiny muted mt4">支付成功</div>
        <div style="border-top:1px dashed var(--line);margin:18px 0;position:relative"></div>
        ${[["缴费项目",b.type],["费用周期",b.period],["费用明细",b.detail],["缴费时间",b.paidAt||"—"],["支付方式",b.method||"—"],["订单号","ZH"+(b.id||"").toUpperCase()+"260615"]].map(([k,v])=>`<div class="between" style="padding:7px 0"><span class="muted tiny">${k}</span><span style="font-size:13px;font-weight:600">${v}</span></div>`).join("")}
      </div>
      <button class="btn btn-ghost btn-block mt16" data-act="invoice">${I("receipt", { s: 18 })} 下载电子发票 (PDF)</button>
    </div></div>`;
};
ACTIONS.invoice = () => toast("发票已生成，将发送至预留邮箱");

/* ============================================================
   REPAIRS  报修
   ============================================================ */
const statusPill = (st) => ({
  pending: '<span class="pill pill-gray">待派单</span>',
  processing: '<span class="pill pill-amber">处理中</span>',
  done: '<span class="pill pill-jade">已完成</span>',
}[st] || "");

ROUTES.repairs = () => {
  return `<div class="page">
    ${subhead("报修服务", `<span class="act" data-go="repair-new">+ 报修</span>`)}
    <div class="pad" style="padding-top:14px">
      <div class="card btn-amber" data-go="repair-new" style="cursor:pointer;color:#fff;display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--amber-500),var(--amber-600))">
        <div style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.22);display:grid;place-items:center">${I("wrench", { s: 24 })}</div>
        <div class="grow"><div style="font-weight:700;font-size:16px">我要报修</div><div style="font-size:12px;opacity:.9">在线提单 · 师傅上门 · 进度可查</div></div>
        ${I("chevR")}
      </div>

      <div class="section-title mt20 mb12">我的工单</div>
      ${DB.repairs.map((r) => `
        <div class="card mt12" data-go="repair/${r.id}" style="cursor:pointer">
          <div class="between mb8">
            <div class="center gap8">${statusPill(r.status)}<span class="tiny muted">${r.type}</span></div>
            <span class="tiny muted">${r.id}</span>
          </div>
          <div style="font-weight:600">${r.title}</div>
          <div class="tiny muted mt4" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.desc}</div>
          <div class="between mt12" style="border-top:1px solid var(--line);padding-top:10px">
            <span class="tiny muted">提交于 ${r.createdAt}</span>
            <span class="tiny" style="color:var(--jade-700);font-weight:600">${r.status === "done" ? (r.rated ? "查看评价" : "去评价") : "查看进度"} ›</span>
          </div>
        </div>`).join("")}
    </div></div>`;
};

ROUTES["repair-new"] = () => {
  return `<div class="page">${subhead("在线报修")}
    <div class="pad" style="padding-top:16px">
      <div class="field">
        <label>报修类型</label>
        <div class="chip-group" id="rType">${DB.repairTypes.map((t, i) => `<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="rType">${t}</span>`).join("")}</div>
      </div>
      <div class="field"><label>问题描述</label><textarea id="rDesc" placeholder="请描述故障位置和具体情况，例如：主卧卫生间花洒漏水…"></textarea></div>
      <div class="field"><label>上传照片 <span class="muted tiny">（选填，最多4张）</span></label>
        <div class="uploader">
          <div class="up-box up-thumb" style="background-image:url('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=60')"></div>
          <div class="up-box up-add" data-act="addPhoto">${I("camera", { s: 22 })}</div>
        </div>
      </div>
      <div class="field">
        <label>期望上门时间</label>
        <div class="chip-group" id="rTime">${["今天 上午","今天 下午","明天 上午","明天 下午","尽快"].map((t,i)=>`<span class="chip ${i===2?"on":""}" data-act="pickChip" data-group="rTime">${t}</span>`).join("")}</div>
      </div>
      <div class="card" style="background:var(--jade-50);box-shadow:none;display:flex;gap:10px;align-items:flex-start">
        ${I("shield", { s: 20 })}<span class="tiny" style="color:var(--jade-700)">报修信息将同步至物业服务中心，受理后由专人派单，预计 30 分钟内响应。</span>
      </div>
    </div>
    <div class="footer-bar"><button class="btn btn-primary btn-block" data-act="submitRepair">提交报修</button></div>
  </div>`;
};
ACTIONS.pickChip = (el) => {
  const group = view.querySelector("#" + el.dataset.group);
  group.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
  el.classList.add("on");
};
ACTIONS.addPhoto = () => toast("（演示）调用相机 / 相册");
ACTIONS.submitRepair = () => {
  const type = view.querySelector("#rType .on")?.textContent || "其他";
  const desc = view.querySelector("#rDesc").value.trim();
  const time = view.querySelector("#rTime .on")?.textContent || "尽快";
  if (!desc) return toast("请填写问题描述");
  const id = "R2026" + Math.floor(1000 + Math.random() * 8999);
  DB.repairs.unshift({
    id, type, title: desc.slice(0, 16) + (desc.length > 16 ? "…" : ""), desc,
    status: "processing", createdAt: "2026-06-15 09:41", appoint: time,
    worker: { name: "待分配", phone: "—", rating: 0 },
    timeline: [
      { t: "已提交报修", s: "06-15 09:41", done: true },
      { t: "物业受理中", s: "预计30分钟内派单", done: false, active: true },
      { t: "维修中", s: "", done: false },
      { t: "待评价", s: "", done: false },
    ],
  });
  toast("报修已提交 ✓");
  setTimeout(() => go("repair/" + id), 400);
};

ROUTES.repair = (id) => {
  const r = DB.repairs.find((x) => x.id === id);
  if (!r) return ROUTES.repairs();
  return `<div class="page">${subhead("工单详情")}
    <div class="pad" style="padding-top:14px">
      <div class="card">
        <div class="between mb12">${statusPill(r.status)}<span class="tiny muted">${r.id}</span></div>
        <div style="font-weight:700;font-size:17px">${r.title}</div>
        <div class="muted tiny mt4">${r.type} · 期望 ${r.appoint}</div>
        <div class="mt12" style="background:var(--paper);border-radius:12px;padding:12px;font-size:14px;color:var(--ink-700)">${r.desc}</div>
      </div>

      ${r.worker.name !== "待分配" ? `
      <div class="card mt12 between">
        <div class="center gap12">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--jade-100);color:var(--jade-700);display:grid;place-items:center;font-weight:700">${r.worker.name[0]}</div>
          <div><div style="font-weight:600">${r.worker.name} <span class="pill pill-jade" style="margin-left:4px">${I("star",{s:11,fill:"currentColor"})} ${r.worker.rating}</span></div><div class="tiny muted">维修工程师 · ${r.worker.phone}</div></div>
        </div>
        <a href="tel:" class="btn btn-ghost btn-sm" style="text-decoration:none">${I("phone", { s: 16 })} 联系</a>
      </div>` : ""}

      <div class="card mt12">
        <div class="section-title mb16" style="font-size:15px">进度跟踪</div>
        <div class="timeline">
          ${r.timeline.map((s) => `
            <div class="tl-item ${s.done ? "done" : ""} ${s.active ? "active" : ""}">
              <div class="node"></div>
              <div class="tl-t">${s.t}</div>${s.s ? `<div class="tl-s">${s.s}</div>` : ""}
            </div>`).join("")}
        </div>
      </div>

      ${r.status === "done" ? (r.rated ? `
        <div class="card mt12"><div class="section-title mb8" style="font-size:15px">我的评价</div>
        <div style="color:var(--amber-500)">${"★".repeat(r.rated)}${"☆".repeat(5-r.rated)}</div>
        <div class="tiny muted mt4">服务态度好，维修及时，已解决。</div></div>` : `
        <div class="footer-bar"><button class="btn btn-primary btn-block" data-act="rateOpen" data-id="${r.id}">${I("star",{s:18})} 服务评价</button></div>`) : ""}
    </div></div>`;
};
ACTIONS.rateOpen = (el) => {
  openSheet("服务评价", `
    <div style="text-align:center;font-size:38px;letter-spacing:6px;color:var(--amber-500);margin:6px 0" id="stars">
      ${[1,2,3,4,5].map((n)=>`<span data-act="setStar" data-n="${n}" style="cursor:pointer">★</span>`).join("")}
    </div>
    <div class="tiny muted" style="text-align:center;margin-bottom:14px" id="starTxt">非常满意</div>
    <div class="chip-group mb16">${["响应快","态度好","技术专业","收费透明","环境整洁"].map((t)=>`<span class="chip" data-act="toggleTag">${t}</span>`).join("")}</div>
    <textarea class="field" style="width:100%;border:1px solid var(--line);border-radius:12px;padding:12px;font-family:var(--font)" placeholder="说说您的服务体验…"></textarea>
    <button class="btn btn-primary btn-block mt16" data-act="rateDone" data-id="${el.dataset.id}">提交评价</button>`);
  $("#sheet").dataset.star = 5;
};
ACTIONS.setStar = (el) => {
  const n = +el.dataset.n;
  $("#sheet").dataset.star = n;
  $("#stars").querySelectorAll("span").forEach((s, i) => s.style.opacity = i < n ? 1 : .25);
  $("#starTxt").textContent = ["", "很不满意", "不满意", "一般", "满意", "非常满意"][n];
};
ACTIONS.toggleTag = (el) => el.classList.toggle("on");
ACTIONS.rateDone = (el) => {
  const r = DB.repairs.find((x) => x.id === el.dataset.id);
  if (r) { r.rated = +$("#sheet").dataset.star || 5; r.timeline[r.timeline.length-1].t = "已完成 · 已评价"; }
  closeSheet();
  setTimeout(() => { toast("感谢您的评价 ✓"); render(); }, 250);
};

/* ---------- 投诉建议 ---------- */
ROUTES.complaints = () => {
  return `<div class="page">${subhead("投诉建议")}
    <div class="pad" style="padding-top:14px">
      <div class="seg mb16" id="cSeg">
        <button class="on" data-act="cSeg" data-v="new">我要反馈</button>
        <button data-act="cSeg" data-v="list">处理记录</button>
      </div>
      <div id="cNew">
        <div class="field"><label>反馈类型</label>
          <div class="chip-group" id="cType">${["投诉","建议","表扬","咨询"].map((t,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="cType">${t}</span>`).join("")}</div>
        </div>
        <div class="field"><label>主题</label><input id="cTitle" placeholder="一句话概括，例如：地下车库照明偏暗"></div>
        <div class="field"><label>详细说明</label><textarea id="cDesc" placeholder="请描述具体情况、发生时间和地点…"></textarea></div>
        <label class="center gap8 tiny muted mb16"><input type="checkbox" checked style="accent-color:var(--jade-700)">匿名提交（物业仅可见您的房号）</label>
        <button class="btn btn-primary btn-block" data-act="submitComplaint">提交反馈</button>
      </div>
      <div id="cList" style="display:none">
        ${DB.complaints.map((c)=>`
          <div class="card mb12"><div class="between mb8"><span style="font-weight:600">${c.title}</span><span class="pill pill-jade">已回复</span></div>
          <div class="tiny muted">提交于 ${c.at}</div>
          <div class="mt12" style="background:var(--jade-50);border-radius:12px;padding:12px"><div class="tiny" style="font-weight:700;color:var(--jade-700);margin-bottom:4px">物业回复</div><div class="tiny" style="color:var(--ink-700)">${c.reply}</div></div></div>`).join("")}
      </div>
    </div></div>`;
};
ACTIONS.cSeg = (el) => {
  view.querySelectorAll("#cSeg button").forEach((b) => b.classList.remove("on"));
  el.classList.add("on");
  const isNew = el.dataset.v === "new";
  view.querySelector("#cNew").style.display = isNew ? "" : "none";
  view.querySelector("#cList").style.display = isNew ? "none" : "";
};
ACTIONS.submitComplaint = () => {
  const title = view.querySelector("#cTitle").value.trim();
  if (!title) return toast("请填写主题");
  DB.complaints.unshift({ id: "C" + Math.floor(Math.random()*900), title, status: "pending", at: "2026-06-15", reply: "" });
  toast("反馈已提交，物业将在1个工作日内处理");
  view.querySelector("#cTitle").value = "";
  view.querySelector("#cDesc").value = "";
};

/* ============================================================
   MESSAGES / 通知
   ============================================================ */
ROUTES.messages = () => {
  const cats = ["全部", "停水停电", "活动通知", "安全提醒", "公告"];
  return `<div class="page">
    <div style="padding:14px 18px 4px" class="between"><h1 style="font-size:24px;font-weight:800">消息通知</h1>
      <button class="btn btn-line btn-sm" data-act="readAll">全部已读</button></div>
    <div class="pad nowrap-x" style="display:flex;gap:8px;padding-top:12px;padding-bottom:4px">
      ${cats.map((c, i) => `<span class="chip ${i===0?"on":""}" data-act="filterNotice" data-cat="${c}" style="flex:0 0 auto">${c}</span>`).join("")}
    </div>
    <div class="pad" id="noticeList" style="padding-top:8px">${noticeList("全部")}</div>
  </div>`;
};
function noticeList(cat) {
  const list = DB.notices.filter((n) => cat === "全部" || n.cat === cat);
  if (!list.length) return `<div class="empty">${I("bell", { s: 48 })}<div>暂无相关通知</div></div>`;
  return list.map((n) => `
    <div class="card mb12" data-go="notice/${n.id}" style="cursor:pointer;${n.urgent?"border-left:3px solid var(--rose-500)":""}">
      <div class="between mb8">
        <span class="pill pill-${n.urgent?"rose":n.cat==="活动通知"?"amber":"jade"}">${n.cat}</span>
        <div class="center gap6">${n.needSign && !n.signed ? '<span class="pill pill-amber">待签收</span>' : ""}${!n.read ? '<span class="dot-new"></span>' : ""}</div>
      </div>
      <div style="font-weight:700;font-size:15px;line-height:1.4">${n.title}</div>
      <div class="tiny muted mt8" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${n.body}</div>
      <div class="tiny muted mt8">${n.time}</div>
    </div>`).join("");
}
ACTIONS.filterNotice = (el) => {
  view.querySelectorAll(".chip[data-cat]").forEach((c) => c.classList.remove("on"));
  el.classList.add("on");
  view.querySelector("#noticeList").innerHTML = noticeList(el.dataset.cat);
};
ACTIONS.readAll = () => { DB.notices.forEach((n) => n.read = true); toast("已全部标为已读"); render(); };

ROUTES.notice = (id) => {
  const n = DB.notices.find((x) => x.id === id);
  if (!n) return ROUTES.messages();
  n.read = true;
  return `<div class="page">${subhead(n.cat)}
    <div class="pad" style="padding-top:18px">
      ${n.urgent ? `<div class="card" style="background:var(--rose-100);box-shadow:none;color:var(--rose-500);display:flex;gap:8px;align-items:center;margin-bottom:14px">${I("bell",{s:18})}<span class="tiny" style="font-weight:600">重要通知，请及时查看并签收</span></div>` : ""}
      <h1 style="font-size:21px;font-weight:800;line-height:1.4">${n.title}</h1>
      <div class="center gap8 mt8 mb16"><span class="pill pill-gray">翠湖名邸物业</span><span class="tiny muted">${n.time}</span></div>
      <div style="font-size:15px;line-height:1.9;color:var(--ink-700)">${n.body}</div>
      <div class="card mt24" style="background:var(--jade-50);box-shadow:none;text-align:center">
        <div class="tiny muted">翠湖名邸物业服务中心</div>
        <div class="tiny muted mt4">服务热线 0755-8888 0000</div>
      </div>
    </div>
    ${n.needSign ? `<div class="footer-bar">${n.signed ? `<button class="btn btn-ghost btn-block" disabled>${I("check",{s:18})} 您已于 ${n.signTime||"今天"} 签收</button>` : `<button class="btn btn-primary btn-block" data-act="signNotice" data-id="${n.id}">我已知晓并签收</button>`}</div>` : ""}
  </div>`;
};
ACTIONS.signNotice = (el) => {
  const n = DB.notices.find((x) => x.id === el.dataset.id);
  if (n) { n.signed = true; n.signTime = "2026-06-15 09:41"; }
  toast("签收成功，感谢配合 ✓");
  setTimeout(render, 250);
};

/* ============================================================
   VISITORS  访客
   ============================================================ */
const vStatus = { active: '<span class="pill pill-jade">有效</span>', used: '<span class="pill pill-gray">已使用</span>', expired: '<span class="pill pill-gray">已过期</span>' };
ROUTES.visitors = () => {
  return `<div class="page">${subhead("访客管理", `<span class="act" data-go="visitor-new">+ 邀请</span>`)}
    <div class="pad" style="padding-top:14px">
      <div class="card" data-go="visitor-new" style="cursor:pointer;background:linear-gradient(135deg,#3a93ff,#0e63e6);color:#fff;display:flex;align-items:center;gap:14px">
        <div style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.2);display:grid;place-items:center">${I("visitor",{s:24})}</div>
        <div class="grow"><div style="font-weight:700;font-size:16px">邀请访客</div><div class="tiny" style="opacity:.9">生成通行码 / 车牌登记，到访更便捷</div></div>${I("chevR")}
      </div>
      <div class="section-title mt20 mb12">访客记录</div>
      ${DB.visitors.map((v) => `
        <div class="card mb12">
          <div class="between mb8"><div style="font-weight:700">${v.name}</div>${vStatus[v.status]}</div>
          <div class="between"><div class="tiny muted">通行码</div><div style="font-weight:800;letter-spacing:3px;color:var(--jade-700)">${v.code}</div></div>
          ${v.plate !== "—" ? `<div class="between mt4"><div class="tiny muted">车牌</div><div class="tiny" style="font-weight:600">${v.plate}</div></div>` : ""}
          <div class="between mt4"><div class="tiny muted">有效期</div><div class="tiny">${v.valid}</div></div>
          ${v.status === "active" ? `<button class="btn btn-ghost btn-sm btn-block mt12" data-act="showQR" data-id="${v.id}">${I("qr",{s:16})} 出示通行二维码</button>` : ""}
        </div>`).join("")}
    </div></div>`;
};
ACTIONS.showQR = (el) => {
  const v = DB.visitors.find((x) => x.id === el.dataset.id);
  openSheet("访客通行码", `
    <div style="text-align:center;padding:8px 0 12px">
      <div style="font-weight:700;font-size:16px">${v.name}</div>
      <div class="tiny muted mt4">${v.valid} 有效</div>
      <div style="width:200px;height:200px;margin:18px auto;background:#fff;border-radius:16px;box-shadow:var(--shadow);display:grid;place-items:center">
        ${qrSvg(v.code)}
      </div>
      <div class="tiny muted">数字通行码</div>
      <div style="font-weight:800;font-size:30px;letter-spacing:8px;color:var(--jade-700)">${v.code}</div>
      <div class="tiny muted mt8">向门岗 / 闸机出示即可通行</div>
    </div>`);
};
function qrSvg(seed) {
  // pseudo-QR from seed for demo
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = 13, cells = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const corner = (x < 4 && y < 4) || (x >= n - 4 && y < 4) || (x < 4 && y >= n - 4);
    if (corner) { if (x === 0 || y === 0 || x === 3 || y === 3 || (x === 1 && y === 1) || (x === 2 && y === 2) || (x === 1 && y === 2) || (x === 2 && y === 1) || x===n-1||x===n-4||y===n-1) cells.push([x, y]); }
    else if (h % 100 < 48) cells.push([x, y]);
  }
  const s = 168 / n, pad = 16;
  return `<svg width="184" height="184" viewBox="0 0 184 184">${cells.map(([x,y])=>`<rect x="${pad+x*s}" y="${pad+y*s}" width="${s+.5}" height="${s+.5}" rx="1" fill="#0e3a82"/>`).join("")}</svg>`;
}

ROUTES["visitor-new"] = () => {
  return `<div class="page">${subhead("邀请访客")}
    <div class="pad" style="padding-top:16px">
      <div class="field"><label>访客姓名</label><input id="vName" placeholder="请输入访客称呼"></div>
      <div class="field"><label>来访事由</label>
        <div class="chip-group" id="vReason">${["亲友拜访","上门服务","商务洽谈","快递外卖","装修施工"].map((t,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="vReason">${t}</span>`).join("")}</div>
      </div>
      <div class="field"><label>车牌号 <span class="muted tiny">（选填，自动放行）</span></label><input id="vPlate" placeholder="如 粤B·12345" style="text-transform:uppercase"></div>
      <div class="field"><label>有效期</label>
        <div class="chip-group" id="vValid">${["当天有效","3天内有效","本周有效","仅一次"].map((t,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="vValid">${t}</span>`).join("")}</div>
      </div>
      <div class="card" style="background:var(--jade-50);box-shadow:none;display:flex;gap:10px;align-items:flex-start">${I("shield",{s:20})}<span class="tiny" style="color:var(--jade-700)">生成后可将通行码 / 二维码分享给访客，凭码经门岗或闸机通行。</span></div>
    </div>
    <div class="footer-bar"><button class="btn btn-primary btn-block" data-act="genVisitor">生成通行码</button></div>
  </div>`;
};
ACTIONS.genVisitor = () => {
  const name = view.querySelector("#vName").value.trim();
  if (!name) return toast("请输入访客姓名");
  const reason = view.querySelector("#vReason .on").textContent;
  const plate = view.querySelector("#vPlate").value.trim().toUpperCase() || "—";
  const valid = view.querySelector("#vValid .on").textContent;
  const code = String(Math.floor(1000 + Math.random() * 8999));
  DB.visitors.unshift({ id: "v" + Date.now(), name: `${name}（${reason}）`, code, plate, valid: "2026-06-15 · " + valid, status: "active", createdAt: "2026-06-15 09:41" });
  toast("通行码生成成功 ✓");
  setTimeout(() => { go("visitors"); setTimeout(() => ACTIONS.showQR({ dataset: { id: DB.visitors[0].id } }), 350); }, 300);
};

/* ============================================================
   PARCELS  快递
   ============================================================ */
ROUTES.parcels = () => {
  const pending = DB.parcels.filter((p) => p.status === "pending");
  return `<div class="page">${subhead("包裹快递")}
    <div class="pad" style="padding-top:14px">
      ${pending.some((p)=>p.overtime) ? `<div class="card" style="background:var(--rose-100);box-shadow:none;color:var(--rose-500);display:flex;gap:10px;align-items:center;margin-bottom:12px">${I("clock",{s:20})}<span class="tiny" style="font-weight:600">您有 ${pending.filter(p=>p.overtime).length} 件包裹即将超时，请尽快取件以免产生费用</span></div>` : ""}
      <div class="section-title mb12">待取件 (${pending.length})</div>
      ${pending.map((p) => `
        <div class="card mb12" style="${p.overtime?"border-left:3px solid var(--rose-500)":""}">
          <div class="between mb8"><div class="center gap8">${tile("box","rose",36)}<div><div style="font-weight:700">${p.company}</div><div class="tiny muted">${p.no}</div></div></div>${p.overtime?'<span class="pill pill-rose">即将超时</span>':'<span class="pill pill-jade">待取件</span>'}</div>
          <div class="between" style="background:var(--paper);border-radius:12px;padding:12px;margin-top:4px">
            <div><div class="tiny muted">${I("map",{s:12})} ${p.locker}</div><div class="mt4" style="font-weight:800;color:var(--rose-500);font-size:20px;letter-spacing:2px">${p.code}</div></div>
            <button class="btn btn-amber btn-sm" data-act="parcelCode" data-id="${p.id}">取件码</button>
          </div>
          <div class="tiny muted mt8">${p.time} 入柜</div>
        </div>`).join("")}
      <div class="section-title mt20 mb12">已取件</div>
      ${DB.parcels.filter((p)=>p.status==="picked").map((p)=>`
        <div class="card mb12 between"><div class="center gap8">${tile("box","jade",36)}<div><div style="font-weight:600">${p.company}</div><div class="tiny muted">${p.time}</div></div></div><span class="pill pill-gray">已取</span></div>`).join("")}
    </div></div>`;
};
ACTIONS.parcelCode = (el) => {
  const p = DB.parcels.find((x) => x.id === el.dataset.id);
  openSheet("快递取件", `
    <div style="text-align:center;padding:6px 0 14px">
      <div class="tiny muted">${p.company} · ${p.locker}</div>
      <div style="width:180px;height:180px;margin:16px auto;background:#fff;border-radius:16px;box-shadow:var(--shadow);display:grid;place-items:center">${qrSvg(p.no)}</div>
      <div class="tiny muted">取件码</div>
      <div style="font-weight:800;font-size:30px;letter-spacing:6px;color:var(--jade-700)">${p.code.replace(/[^0-9]/g,"")||p.code}</div>
      <button class="btn btn-primary mt20" data-act="parcelPicked" data-id="${p.id}">确认已取件</button>
    </div>`);
};
ACTIONS.parcelPicked = (el) => {
  const p = DB.parcels.find((x) => x.id === el.dataset.id);
  if (p) { p.status = "picked"; p.overtime = false; }
  closeSheet();
  setTimeout(() => { toast("已确认取件 ✓"); render(); }, 250);
};

/* ============================================================
   PARKING  停车
   ============================================================ */
ROUTES.parking = () => {
  const c = DB.community, pk = DB.parking;
  return `<div class="page">${subhead("停车管理")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="background:linear-gradient(135deg,#16b6d6,#0a8fb5);color:#fff">
        <div class="between"><span style="opacity:.85;font-size:13px">实时空余车位</span><span class="pill" style="background:rgba(255,255,255,.2);color:#fff">${I("car",{s:13})} 地下车库</span></div>
        <div class="center" style="gap:6px;margin-top:6px"><span class="money" style="font-size:38px">${c.parkingFree}</span><span style="opacity:.8">/ ${c.parkingTotal} 个</span></div>
        <div style="height:6px;background:rgba(255,255,255,.25);border-radius:3px;margin-top:8px;overflow:hidden"><div style="height:100%;width:${(c.parkingFree/c.parkingTotal*100).toFixed(0)}%;background:#fff;border-radius:3px"></div></div>
      </div>

      <div class="card mt12">
        <div class="between mb12"><div class="section-title" style="font-size:15px">月租车位</div><span class="pill pill-jade">使用中</span></div>
        <div class="between"><div><div class="tiny muted">车位号</div><div style="font-weight:800;font-size:20px;margin-top:2px">${pk.monthly.spot}</div></div>
        <div style="text-align:right"><div class="tiny muted">有效期至</div><div style="font-weight:700;color:var(--rose-500);margin-top:2px">${pk.monthly.expire}</div></div></div>
        <button class="btn btn-amber btn-block mt16" data-act="payParking">续费月租 ${yuan(pk.monthly.fee)}/月</button>
      </div>

      <div class="card mt12">
        <div class="between mb12"><div class="section-title" style="font-size:15px">绑定车牌</div><button class="btn btn-ghost btn-sm" data-act="addPlate">${I("plus",{s:16})} 登记临时车牌</button></div>
        ${pk.plates.map((p) => `
          <div class="row"><div class="ico" style="background:var(--jade-100);color:var(--jade-700);font-weight:800;font-size:13px;width:auto;padding:0 10px;border-radius:8px">${p.plate}</div>
          <div class="body"><div class="t" style="font-size:14px">${p.type} ${p.main?'<span class="pill pill-jade" style="margin-left:4px">默认</span>':""}</div><div class="s">${p.spot!=="—"?"车位 "+p.spot+" · ":""}至 ${p.expire}</div></div></div>`).join("")}
      </div>

      <div class="card mt12">
        <div class="section-title mb12" style="font-size:15px">访客 / 临时停车</div>
        <div class="tiny muted">临停标准：前 30 分钟免费，超出 ¥5/小时，当日封顶 ¥30。可在「访客管理」登记车牌实现自动放行。</div>
        <button class="btn btn-line btn-block mt12" data-go="visitor-new">为访客登记车牌</button>
      </div>
    </div></div>`;
};
ACTIONS.payParking = () => {
  openSheet("月租续费", `
    <div class="card" style="box-shadow:none;background:#fff">
      <div class="between"><span class="muted">车位号</span><span style="font-weight:700">${DB.parking.monthly.spot}</span></div>
      <div class="between mt8"><span class="muted">续费时长</span><span style="font-weight:700">1 个月</span></div>
      <div class="between mt8"><span class="muted">到期日顺延至</span><span style="font-weight:700;color:var(--jade-700)">2026-07-30</span></div>
    </div>
    <div class="money" style="font-size:30px;text-align:center;margin:18px 0">${yuan(DB.parking.monthly.fee)}</div>
    <button class="btn btn-primary btn-block" data-act="parkingPaid">确认支付</button>`);
};
ACTIONS.parkingPaid = () => { DB.parking.monthly.expire = "2026-07-30"; closeSheet(); setTimeout(()=>{toast("续费成功，有效期已顺延 ✓");render();},250); };
ACTIONS.addPlate = () => {
  openSheet("登记临时车牌", `
    <div class="field"><label>车牌号码</label><input id="npPlate" placeholder="如 粤B·D88K6" style="text-transform:uppercase"></div>
    <div class="field"><label>有效期</label><div class="chip-group" id="npValid">${["当天","3天","7天"].map((t,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="npValid">${t}</span>`).join("")}</div></div>
    <button class="btn btn-primary btn-block mt8" data-act="savePlate">确认登记</button>`);
};
ACTIONS.savePlate = () => {
  const plate = $("#sheet").querySelector("#npPlate").value.trim().toUpperCase();
  if (!plate) return toast("请输入车牌号");
  DB.parking.plates.push({ plate, type: "临时登记", spot: "—", expire: "2026-06-" + (15 + ({"当天":0,"3天":3,"7天":7}[$("#sheet").querySelector("#npValid .on").textContent]||0)), main: false });
  closeSheet();
  setTimeout(() => { toast("车牌登记成功 ✓"); render(); }, 250);
};

/* ============================================================
   FACILITIES  设施预约
   ============================================================ */
ROUTES.facilities = () => {
  return `<div class="page">${subhead("设施预约")}
    <div class="pad" style="padding-top:14px">
      ${DB.myBookings.length ? `<div class="section-title mb12">我的预约</div>
      ${DB.myBookings.map((b)=>`<div class="card mb12 between" style="border-left:3px solid var(--jade-600)"><div><div style="font-weight:700">${b.name}</div><div class="tiny muted mt4">${b.date} · ${b.time}</div></div><span class="pill pill-jade">已${b.status}</span></div>`).join("")}` : ""}
      <div class="section-title mt8 mb12">公共设施</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${DB.facilities.map((f) => `
          <div class="card" data-go="facility/${f.id}" style="cursor:pointer;padding:14px">
            ${tile(f.icon, f.color, 44)}
            <div style="font-weight:700;margin-top:10px">${f.name}</div>
            <div class="tiny muted mt4" style="height:32px;line-height:1.4">${f.desc}</div>
            <div class="between mt8"><span class="pill ${f.free?"pill-jade":"pill-amber"}">${f.free?"免费":f.price}</span>${I("chevR",{s:16})}</div>
          </div>`).join("")}
      </div>
    </div></div>`;
};
ROUTES.facility = (id) => {
  const f = DB.facilities.find((x) => x.id === id);
  if (!f) return ROUTES.facilities();
  const days = [["今天","06-15"],["明天","06-16"],["周三","06-17"],["周四","06-18"],["周五","06-19"]];
  return `<div class="page">${subhead(f.name)}
    <div class="pad" style="padding-top:14px">
      <div class="card center gap12">${tile(f.icon,f.color,52)}<div><div style="font-weight:700;font-size:17px">${f.name}</div><div class="tiny muted mt4">${f.desc}</div><div class="mt4"><span class="pill ${f.free?"pill-jade":"pill-amber"}">${f.free?"免费开放":f.price}</span></div></div></div>
      <div class="card mt12">
        <div class="section-title mb12" style="font-size:15px">选择日期</div>
        <div class="nowrap-x" style="display:flex;gap:8px" id="fDays">
          ${days.map((d,i)=>`<button class="chip ${i===0?"on":""}" data-act="pickChip" data-group="fDays" style="flex:0 0 auto;text-align:center;line-height:1.3">${d[0]}<br><span style="font-size:10px;opacity:.7">${d[1]}</span></button>`).join("")}
        </div>
        <div class="section-title mt16 mb12" style="font-size:15px">选择时段</div>
        <div class="chip-group" id="fSlots">${f.slots.map((s,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="fSlots">${s}-${(parseInt(s)+1)}:00</span>`).join("")}</div>
      </div>
      <div class="card mt12" style="background:var(--jade-50);box-shadow:none"><div class="tiny" style="color:var(--jade-700)">预约须知：请按时到场，迟到15分钟视为自动取消；如需取消请提前2小时操作。</div></div>
    </div>
    <div class="footer-bar"><button class="btn btn-primary btn-block" data-act="bookFacility" data-name="${f.name}">确认预约</button></div>
  </div>`;
};
ACTIONS.bookFacility = (el) => {
  const day = view.querySelector("#fDays .on")?.textContent.trim().slice(0,2) || "今天";
  const slot = view.querySelector("#fSlots .on")?.textContent || "";
  DB.myBookings.unshift({ id: "bk" + Date.now(), name: el.dataset.name, date: "2026-06-15(" + day + ")", time: slot, status: "确认" });
  toast("预约成功 ✓");
  setTimeout(() => go("facilities"), 400);
};

/* ============================================================
   COMMUNITY  邻里圈 / 业委会 / 活动
   ============================================================ */
function postRow(p) {
  return `<div class="center gap12" style="align-items:flex-start">
    <div style="width:38px;height:38px;border-radius:50%;background:var(--jade-100);color:var(--jade-700);display:grid;place-items:center;font-weight:700;flex:0 0 auto">${p.avatar}</div>
    <div class="grow"><div class="between"><span style="font-weight:600;font-size:14px">${p.user}</span><span class="pill pill-${p.tag}">${p.cat}</span></div>
    <div class="tiny mt4" style="color:var(--ink-700);line-height:1.5">${p.text}</div>
    <div class="center gap12 mt8 tiny muted"><span>${p.time}</span><span class="center gap6" data-act="likePost" data-id="${p.id}" style="cursor:pointer">${I("heart",{s:14})} ${p.likes}</span><span class="center gap6">${I("comment",{s:14})} ${p.comments}</span></div></div>
  </div>`;
}
ROUTES.community = () => {
  return `<div class="page">
    <div style="padding:14px 18px 4px" class="between"><h1 style="font-size:24px;font-weight:800">社区</h1><button class="btn btn-amber btn-sm" data-act="newPost">${I("edit",{s:15})} 发帖</button></div>
    <div class="pad mt8">
      <div class="seg mb16" id="comSeg">
        <button class="on" data-act="comSeg" data-v="circle">邻里圈</button>
        <button data-act="comSeg" data-v="vote">业委会</button>
        <button data-act="comSeg" data-v="act">活动</button>
      </div>

      <div id="comCircle">
        ${DB.posts.map((p) => `<div class="card mb12">${postRow(p)}</div>`).join("")}
      </div>

      <div id="comVote" style="display:none">
        ${DB.votes.map((v) => `
          <div class="card mb12">
            <div class="between mb8"><span class="pill pill-blue">${I("vote",{s:13})} 业主表决</span><span class="tiny muted">截止 ${v.deadline}</span></div>
            <div style="font-weight:700;font-size:16px;line-height:1.4">${v.title}</div>
            <div class="tiny muted mt4">已有 ${v.joined}/${v.total} 户参与</div>
            <div class="mt16">${v.options.map((o)=>`
              <div class="mb12" ${!v.voted?`data-act="castVote" data-id="${v.id}"`:""} style="cursor:${v.voted?"default":"pointer"}">
                <div class="between tiny mb4"><span style="font-weight:600">${o.label}</span><span class="muted">${v.voted?o.pct+"%":""}</span></div>
                <div style="height:${v.voted?"22px":"36px"};background:#f0ede4;border-radius:8px;overflow:hidden;position:relative;display:flex;align-items:center">
                  ${v.voted?`<div style="height:100%;width:${o.pct}%;background:var(--jade-500);border-radius:8px;transition:width .6s"></div>`:`<span class="tiny" style="position:absolute;left:12px;color:var(--jade-700);font-weight:600">点击投票</span>`}
                </div>
              </div>`).join("")}</div>
            ${v.voted?'<div class="tiny" style="color:var(--jade-600);text-align:center">✓ 您已完成投票</div>':""}
          </div>`).join("")}
        <div class="card"><div class="section-title mb12" style="font-size:15px">业委会公示</div>
          <div class="row"><div class="body"><div class="t" style="font-size:14px">2026年一季度公共收益使用明细</div><div class="s">2026-05-30 公示</div></div>${chev}</div>
          <div class="row"><div class="body"><div class="t" style="font-size:14px">电梯加装维保供应商遴选结果</div><div class="s">2026-05-12 公示</div></div>${chev}</div>
        </div>
      </div>

      <div id="comAct" style="display:none">
        ${DB.activities.map((a) => `
          <div class="card mb12">
            <div class="center gap12" style="align-items:flex-start">
              <div style="width:54px;height:54px;border-radius:14px;flex:0 0 auto;background:${TINT[a.img].bg};color:${TINT[a.img].fg};display:grid;place-items:center">${I("party",{s:26})}</div>
              <div class="grow"><div style="font-weight:700">${a.title}</div>
              <div class="tiny muted mt4">${I("clock",{s:12})} ${a.date} · ${a.place}</div>
              <div class="between mt8"><span class="pill ${a.fee==="免费"?"pill-jade":"pill-amber"}">${a.fee}</span>
              <span class="tiny ${a.joined>=a.quota?"muted":""}">${a.joined>=a.quota?"已满":`${a.joined}/${a.quota} 已报名`}</span></div></div>
            </div>
            <button class="btn ${a.joined>=a.quota?"btn-line":"btn-ghost"} btn-sm btn-block mt12" ${a.joined>=a.quota?"disabled":`data-act="joinAct" data-id="${a.id}"`}>${a.joined>=a.quota?"名额已满":"立即报名"}</button>
          </div>`).join("")}
      </div>
    </div></div>`;
};
ACTIONS.comSeg = (el) => {
  view.querySelectorAll("#comSeg button").forEach((b) => b.classList.remove("on"));
  el.classList.add("on");
  ["circle", "vote", "act"].forEach((v) => view.querySelector("#com" + v[0].toUpperCase() + v.slice(1)).style.display = el.dataset.v === v ? "" : "none");
};
ACTIONS.likePost = (el) => { const p = DB.posts.find((x)=>x.id===el.dataset.id); if(p){p.likes++; el.innerHTML = `${I("heart",{s:14,fill:"currentColor"})} ${p.likes}`; el.style.color="var(--rose-500)";} };
ACTIONS.castVote = (el) => { const v = DB.votes.find((x)=>x.id===el.dataset.id); if(v){v.voted=true; v.joined++; toast("投票成功，感谢参与 ✓"); render();} };
ACTIONS.joinAct = (el) => { const a = DB.activities.find((x)=>x.id===el.dataset.id); if(a){a.joined++; toast("报名成功 ✓"); render();} };
ACTIONS.newPost = () => {
  openSheet("发布邻里圈", `
    <div class="field"><label>类型</label><div class="chip-group" id="poType">${["二手转让","邻里互助","求助","闲聊","拼车"].map((t,i)=>`<span class="chip ${i===0?"on":""}" data-act="pickChip" data-group="poType">${t}</span>`).join("")}</div></div>
    <div class="field"><label>内容</label><textarea id="poText" placeholder="分享给邻居们…"></textarea></div>
    <button class="btn btn-primary btn-block" data-act="postDone">发布</button>`);
};
ACTIONS.postDone = () => {
  const text = $("#sheet").querySelector("#poText").value.trim();
  if (!text) return toast("说点什么吧～");
  const cat = $("#sheet").querySelector("#poType .on").textContent;
  DB.posts.unshift({ id: "po"+Date.now(), user: DB.user.name + " · 12栋", avatar: DB.user.avatar, cat, time: "刚刚", text, likes: 0, comments: 0, tag: "jade" });
  closeSheet();
  setTimeout(() => { toast("发布成功 ✓"); render(); }, 250);
};

/* ============================================================
   SMART HOME  智能家居
   ============================================================ */
ROUTES.smart = () => {
  const s = DB.smart;
  return `<div class="page">${subhead("智能家居")}
    <div class="pad" style="padding-top:14px">
      <div class="section-title mb12">门禁 / 对讲</div>
      ${s.doors.map((d) => `
        <div class="card mb12 between">
          <div class="center gap12">${tile(d.type==="门锁"?"lock":"door", d.online?"jade":"rose")}<div><div style="font-weight:600">${d.name}</div><div class="tiny muted">${d.online?`<span style="color:var(--jade-600)">● 在线</span>`:"● 离线"}${d.battery?` · 电量 ${d.battery}%`:""}</div></div></div>
          <div class="center gap8">
            ${d.type!=="门锁"?`<button class="btn btn-line btn-sm" data-act="videoCall">${I("video",{s:16})}</button>`:""}
            <button class="btn btn-primary btn-sm" data-act="openDoor" data-name="${d.name}">${I("lock",{s:15})} 开门</button>
          </div>
        </div>`).join("")}

      <div class="section-title mt20 mb12 between">智能门锁授权<button class="btn btn-ghost btn-sm" data-act="addLock">${I("plus",{s:15})} 添加</button></div>
      <div class="card" style="padding:4px 16px">
        ${s.locks.map((l) => `<div class="row">${tile("user","blue",36)}<div class="body"><div class="t" style="font-size:14px">${l.name}</div><div class="s">${l.method} · ${l.added} 添加</div></div><button class="btn btn-line btn-sm" data-act="revoke">解除</button></div>`).join("")}
      </div>

      <div class="section-title mt20 mb12">人脸 / 车牌录入</div>
      <div class="card" style="padding:4px 16px">
        ${s.faces.map((f) => `<div class="row">${tile(f.type==="车牌"?"car":"face","jade",36)}<div class="body"><div class="t" style="font-size:14px">${f.name}</div><div class="s">${f.type}识别</div></div><span class="pill pill-jade">${f.status}</span></div>`).join("")}
        <div class="row" data-act="addFace" style="cursor:pointer;justify-content:center;color:var(--jade-700);font-weight:600;font-size:14px">${I("plus",{s:16})} 录入新的人脸 / 车牌</div>
      </div>
    </div></div>`;
};
ACTIONS.openDoor = (el) => {
  toast("正在开门…");
  setTimeout(() => toast(`${el.dataset.name} 已开启 ✓`), 700);
};
ACTIONS.videoCall = () => toast("（演示）发起可视对讲…");
ACTIONS.revoke = () => toast("（演示）已解除授权");
ACTIONS.addLock = () => toast("（演示）生成临时密码 / 添加成员");
ACTIONS.addFace = () => toast("（演示）调用摄像头采集");

/* ============================================================
   PROFILE  我的
   ============================================================ */
ROUTES.profile = () => {
  const u = DB.user;
  const cells = [
    [ [["file","房屋档案","jade","archive"],["users","家庭成员","blue","members"]] ],
    [ [["receipt","我的账单","amber","bills"],["wrench","我的报修","rose","repairs"],["calendar","我的预约","jade","facilities"],["heart","我的收藏","blue","profile"]] ],
    [ [["shield","实名认证","jade","profile"],["settings","隐私设置","blue","settings"],["chat","客服热线","amber","profile"],["file","关于我们","rose","profile"]] ],
  ];
  return `<div class="page" style="background:var(--paper)">
    <div style="background:linear-gradient(155deg,#2e90ff,#0a5fe0);padding:24px 18px 64px;color:#fff">
      <div class="center gap12">
        <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:24px;font-weight:700">${u.avatar}</div>
        <div class="grow"><div style="font-size:20px;font-weight:800">${u.name} ${u.verified?`<span class="pill" style="background:rgba(255,255,255,.2);color:#fff;font-size:11px;margin-left:4px">${I("shield",{s:12})} 已认证</span>`:""}</div>
        <div class="tiny" style="opacity:.85;margin-top:4px">${u.community} · ${u.house}</div></div>
        ${I("settings",{s:22})}
      </div>
    </div>
    <div class="pad" style="margin-top:-44px">
      <div class="card between">
        <div style="text-align:center;flex:1"><div class="money" style="font-size:18px">${u.area}㎡</div><div class="tiny muted mt4">建筑面积</div></div>
        <div style="width:1px;height:30px;background:var(--line)"></div>
        <div style="text-align:center;flex:1"><div class="money" style="font-size:18px">${u.role}</div><div class="tiny muted mt4">身份</div></div>
        <div style="width:1px;height:30px;background:var(--line)"></div>
        <div style="text-align:center;flex:1"><div class="money" style="font-size:18px">${u.members.length}</div><div class="tiny muted mt4">家庭成员</div></div>
      </div>

      ${cells.map((grp) => grp.map((row) => `
        <div class="card mt12">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px 0">
            ${row.map(([ic,label,color,route]) => `
              <button data-go="${route}" style="background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:7px">
                ${tile(ic,color,42)}<span style="font-size:12px;color:var(--ink-700)">${label}</span>
              </button>`).join("")}
          </div>
        </div>`).join("")).join("")}

      <button class="btn btn-line btn-block mt20" data-act="logout" style="color:var(--ink-500)">退出登录</button>
      <div class="tiny muted" style="text-align:center;margin-top:16px">智慧物业 业主端 v1.0.0 · Demo</div>
    </div>
  </div>`;
};
ACTIONS.logout = () => toast("（演示）退出登录");

ROUTES.members = () => {
  return `<div class="page">${subhead("家庭成员", `<span class="act" data-act="addMember">+ 添加</span>`)}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="padding:4px 16px">
        ${DB.user.members.map((m) => `
          <div class="row">
            <div style="width:42px;height:42px;border-radius:50%;background:var(--jade-100);color:var(--jade-700);display:grid;place-items:center;font-weight:700;flex:0 0 auto">${m.name[0]}</div>
            <div class="body"><div class="t">${m.name} <span class="pill pill-${m.tag==="户主"?"jade":"gray"}" style="margin-left:4px">${m.tag}</span></div><div class="s">${m.relation} · ${m.phone}</div></div>
            ${m.tag!=="户主"?`<button class="btn btn-line btn-sm" data-act="rmMember">移除</button>`:chev}
          </div>`).join("")}
      </div>
      <div class="card mt12" style="background:var(--jade-50);box-shadow:none"><div class="tiny" style="color:var(--jade-700)">添加家庭成员后，TA 可使用门禁、访客邀请等共享权限，户主可随时管理。</div></div>
    </div></div>`;
};
ACTIONS.addMember = () => toast("（演示）邀请家庭成员加入");
ACTIONS.rmMember = () => toast("（演示）已移除成员");

ROUTES.archive = () => {
  const a = DB.archive;
  return `<div class="page">${subhead("房屋档案")}
    <div class="pad" style="padding-top:14px">
      <div class="card between">
        <div><div class="tiny muted">${DB.user.community}</div><div style="font-weight:800;font-size:18px;margin-top:2px">${DB.user.house}</div><div class="tiny muted mt4">${DB.user.area}㎡ · 精装交付 2021</div></div>
        ${tile("home","jade",52)}
      </div>
      <div class="section-title mt20 mb12">装修记录</div>
      <div class="card" style="padding:4px 16px">
        ${a.deco.map((d) => `<div class="row">${tile("edit","amber",36)}<div class="body"><div class="t" style="font-size:14px">${d.item}</div><div class="s">${d.date}${d.brand?" · "+d.brand:""}${d.note?" · "+d.note:""}</div></div>${d.warranty?`<span class="pill pill-blue">${d.warranty}</span>`:""}</div>`).join("")}
      </div>
      <div class="section-title mt20 mb12">设备 / 保修</div>
      <div class="card" style="padding:4px 16px">
        ${a.devices.map((d) => `<div class="row">${tile("settings","blue",36)}<div class="body"><div class="t" style="font-size:14px">${d.item} · ${d.brand}</div><div class="s">购于 ${d.buy}</div></div><span class="pill pill-jade">${d.warranty}</span></div>`).join("")}
      </div>
      <div class="tiny muted" style="text-align:center;margin-top:16px">设备保修临近到期将提前提醒您</div>
    </div></div>`;
};

ROUTES.settings = () => {
  const rows = [
    ["实名认证", "已认证", "jade"], ["人脸录入", "已录入", "jade"],
    ["手机号", DB.user.phone, ""], ["允许邻居查看我的昵称", "开", ""],
    ["接收社区公告推送", "开", ""], ["账单到期提醒", "开", ""],
  ];
  return `<div class="page">${subhead("隐私与设置")}
    <div class="pad" style="padding-top:14px">
      <div class="card" style="padding:4px 16px">
        ${rows.map(([k,v,c]) => `<div class="row"><div class="body"><div class="t" style="font-size:14px;font-weight:500">${k}</div></div>${c?`<span class="pill pill-${c}">${v}</span>`:`<span class="tiny muted">${v} ${I("chevR",{s:14})}</span>`}</div>`).join("")}
      </div>
      <div class="card mt12" style="padding:4px 16px">
        <div class="row" data-act="logout"><div class="body"><div class="t" style="font-size:14px">清除缓存</div></div><span class="tiny muted">2.4MB</span></div>
        <div class="row"><div class="body"><div class="t" style="font-size:14px">隐私政策</div></div>${chev}</div>
      </div>
    </div></div>`;
};

/* ---------- clock ---------- */
function tick() {
  const d = new Date();
  $("#clock").textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}
tick(); setInterval(tick, 30000);

/* ---------- boot ---------- */
/* 首屏渲染交由 modules.js 末尾的 render() 统一触发，
   以确保扩展模块的数据（DB.activities 等）已挂载。 */
if (!location.hash) location.hash = "#/home";
if (typeof DB.groupBuys !== "undefined") render();
