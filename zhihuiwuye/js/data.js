/* ============================================================
   Mock data — 智慧物业业主端
   纯假数据，部分会在运行时被用户操作修改（内存态）
   ============================================================ */

const DB = {
  user: {
    name: "陈思远",
    avatar: "陈",
    phone: "138****6620",
    verified: true,
    community: "翠湖名邸 · 12栋",
    house: "3单元 1802室",
    role: "业主",
    area: "126.5",
    members: [
      { name: "陈思远", relation: "本人", phone: "138****6620", tag: "户主" },
      { name: "林雅", relation: "配偶", phone: "139****1102", tag: "家庭成员" },
      { name: "陈乐", relation: "子女", phone: "—", tag: "未成年" },
    ],
  },

  community: {
    name: "翠湖名邸",
    weather: { temp: 27, desc: "多云", aqi: "优", aqiVal: 38 },
    parkingFree: 18,
    parkingTotal: 320,
  },

  /* ---------- 账单 / 缴费 ---------- */
  bills: [
    { id: "b1", type: "物业管理费", period: "2026年6月", amount: 379.50, due: "2026-06-25", status: "unpaid", icon: "home", color: "jade", detail: "126.5㎡ × 3.00元/㎡" },
    { id: "b2", type: "停车管理费", period: "2026年6月", amount: 300.00, due: "2026-06-25", status: "unpaid", icon: "car", color: "blue", detail: "地下车位 B2-118 月租" },
    { id: "b3", type: "公共能耗费", period: "2026年5月", amount: 46.80, due: "2026-06-10", status: "unpaid", icon: "bolt", color: "amber", detail: "电梯/照明分摊" },
    { id: "b4", type: "物业管理费", period: "2026年5月", amount: 379.50, due: "2026-05-25", status: "paid", paidAt: "2026-05-18 09:12", method: "微信支付", icon: "home", color: "jade", detail: "126.5㎡ × 3.00元/㎡" },
    { id: "b5", type: "水费", period: "2026年5月", amount: 88.20, due: "2026-05-25", status: "paid", paidAt: "2026-05-18 09:12", method: "微信支付", icon: "drop", color: "blue", detail: "用水 21.5 吨" },
    { id: "b6", type: "停车管理费", period: "2026年5月", amount: 300.00, due: "2026-05-25", status: "paid", paidAt: "2026-05-02 20:33", method: "自动扣费", icon: "car", color: "blue", detail: "地下车位 B2-118 月租" },
  ],
  autopay: { enabled: false, method: "招商银行(8866)" },

  /* ---------- 报修工单 ---------- */
  repairs: [
    {
      id: "R20260612", type: "水电维修", title: "厨房水槽下方水管渗水",
      desc: "下水管接口处持续滴水，柜底已有积水，麻烦尽快上门。",
      status: "processing", createdAt: "2026-06-12 08:40", appoint: "6月13日 上午",
      worker: { name: "李师傅", phone: "150****2208", rating: 4.9 },
      timeline: [
        { t: "已提交报修", s: "06-12 08:40", done: true },
        { t: "物业已派单 · 李师傅", s: "06-12 09:05", done: true },
        { t: "维修中", s: "预计 06-13 10:00 上门", done: false, active: true },
        { t: "待评价", s: "", done: false },
      ],
    },
    {
      id: "R20260520", type: "公共设施", title: "3单元楼道声控灯不亮",
      desc: "18楼楼道夜间声控灯失灵，已两天。",
      status: "done", createdAt: "2026-05-20 21:10", appoint: "5月21日 下午", rated: 5,
      worker: { name: "王师傅", phone: "151****7741", rating: 4.8 },
      timeline: [
        { t: "已提交报修", s: "05-20 21:10", done: true },
        { t: "物业已派单 · 王师傅", s: "05-20 21:30", done: true },
        { t: "维修中", s: "05-21 14:20", done: true },
        { t: "已完成 · 已评价", s: "05-21 15:05", done: true },
      ],
    },
  ],
  repairTypes: ["水电维修", "门窗锁具", "墙面地面", "家电报修", "公共设施", "管道疏通", "其他"],

  /* ---------- 投诉建议 ---------- */
  complaints: [
    { id: "C012", title: "夜间装修噪音扰民", status: "replied", at: "2026-06-08", reply: "已联系21楼业主，要求规范施工时间（8:00-12:00, 14:00-18:00），如再有违规请随时反馈。" },
  ],

  /* ---------- 通知公告 ---------- */
  notices: [
    { id: "n1", cat: "停水停电", title: "【计划停水通知】6月16日 09:00-12:00 高区管网检修", time: "2026-06-14 16:20", body: "因二次供水设备年度检修，6月16日（周二）9:00至12:00将临时停水，涉及11-15栋高区住户，请提前储水，给您带来不便敬请谅解。", needSign: true, signed: false, read: false, urgent: true },
    { id: "n2", cat: "活动通知", title: "翠湖名邸“邻里夏日市集”本周六开市", time: "2026-06-13 10:00", body: "6月21日（周六）16:00-21:00中心广场举办夏日市集，设跳蚤市场、亲子手作、夜市美食等，欢迎全体业主参与，摊位报名请见社区活动。", needSign: false, read: false, urgent: false },
    { id: "n3", cat: "安全提醒", title: "近期高发 | 警惕“冒充物业收费”诈骗", time: "2026-06-10 09:30", body: "近期有不法分子冒充物业人员上门或电话收取“维修基金”“设备升级费”。物业所有收费均通过本APP官方账单，请勿向个人转账，谨防受骗。", needSign: false, read: true, urgent: false },
    { id: "n4", cat: "公告", title: "电梯维保完成 · 6号楼2号梯恢复运行", time: "2026-06-06 14:00", body: "6号楼2号电梯已完成季度维保并通过验收，现已恢复正常运行，感谢理解与配合。", needSign: false, read: true, urgent: false },
  ],

  /* ---------- 访客 ---------- */
  visitors: [
    { id: "v1", name: "张明（朋友）", code: "8842", plate: "粤B·6F2K9", valid: "2026-06-15 全天", status: "active", createdAt: "2026-06-15 09:00" },
    { id: "v2", name: "顺丰快递", code: "1170", plate: "—", valid: "2026-06-14", status: "used", createdAt: "2026-06-14 11:20" },
    { id: "v3", name: "李工（装修）", code: "5503", plate: "粤B·8H1A0", valid: "2026-06-10", status: "expired", createdAt: "2026-06-10 08:00" },
  ],

  /* ---------- 包裹快递 ---------- */
  parcels: [
    { id: "p1", company: "顺丰速运", no: "SF1024889201", locker: "丰巢·东门 12-08", code: "6620", status: "pending", time: "2026-06-15 10:12", overtime: false },
    { id: "p2", company: "京东物流", no: "JD9920113", locker: "菜鸟驿站·中心广场", code: "取件号 8842", status: "pending", time: "2026-06-15 08:40", overtime: true },
    { id: "p3", company: "中通快递", no: "ZT77120093", locker: "丰巢·东门 09-15", code: "1102", status: "picked", time: "2026-06-13 17:30", overtime: false },
  ],

  /* ---------- 停车 ---------- */
  parking: {
    plates: [
      { plate: "粤B·6F2K9", type: "月租车", spot: "B2-118", expire: "2026-06-30", main: true },
      { plate: "粤B·D88K6", type: "临时登记", spot: "—", expire: "2026-06-15", main: false },
    ],
    monthly: { spot: "B2-118", expire: "2026-06-30", fee: 300 },
  },

  /* ---------- 设施预约 ---------- */
  facilities: [
    { id: "f1", name: "健身房", desc: "二期会所 B1 · 07:00-22:00", icon: "dumbbell", color: "jade", free: true, slots: ["07:00","08:00","18:00","19:00","20:00"] },
    { id: "f2", name: "多功能会议室", desc: "物业服务中心 2F · 可容纳20人", icon: "users", color: "blue", free: false, price: "80元/小时", slots: ["09:00","10:00","14:00","15:00","16:00"] },
    { id: "f3", name: "篮球场", desc: "中心运动场 · 06:00-21:00", icon: "ball", color: "amber", free: true, slots: ["17:00","18:00","19:00","20:00"] },
    { id: "f4", name: "棋牌室", desc: "一期会所 1F · 09:00-22:00", icon: "grid", color: "rose", free: false, price: "30元/小时", slots: ["10:00","14:00","19:00"] },
    { id: "f5", name: "游泳池", desc: "二期会所 · 夏季开放", icon: "wave", color: "blue", free: false, price: "20元/次", slots: ["10:00","15:00","16:00","19:00"] },
    { id: "f6", name: "瑜伽室", desc: "二期会所 3F · 预约制", icon: "lotus", color: "jade", free: true, slots: ["09:00","10:00","19:00","20:00"] },
  ],
  myBookings: [
    { id: "bk1", name: "健身房", date: "2026-06-15", time: "19:00-20:00", status: "确认" },
  ],

  /* ---------- 社区互动 / 邻里圈 ---------- */
  posts: [
    { id: "po1", user: "林姐 · 8栋", avatar: "林", cat: "二手转让", time: "1小时前", text: "宝宝长大了，九成新婴儿推车转让，可折叠，自提优惠～", likes: 12, comments: 5, tag: "rose" },
    { id: "po2", user: "老周 · 12栋", avatar: "周", cat: "邻里互助", time: "3小时前", text: "明早7点去机场，有没有顺路拼车的邻居？可平摊费用。", likes: 6, comments: 8, tag: "jade" },
    { id: "po3", user: "Anna · 5栋", avatar: "A", cat: "求助", time: "昨天", text: "请问咱们小区附近有靠谱的钢琴老师推荐吗？孩子想学。", likes: 9, comments: 14, tag: "amber" },
  ],
  votes: [
    { id: "vt1", title: "关于增设小区充电桩车位的表决", deadline: "2026-06-20", joined: 186, total: 420, options: [
      { label: "同意（增设30个充电车位）", pct: 72 },
      { label: "不同意", pct: 18 },
      { label: "弃权", pct: 10 },
    ], voted: false },
  ],
  activities: [
    { id: "ac1", title: "邻里夏日市集 · 摊位招募", date: "06-21 周六 16:00", place: "中心广场", joined: 38, quota: 50, fee: "免费", img: "amber" },
    { id: "ac2", title: "少儿游泳公益体验课", date: "06-22 周日 10:00", place: "二期泳池", joined: 24, quota: 24, fee: "免费", img: "blue" },
    { id: "ac3", title: "业主羽毛球友谊赛", date: "06-28 周六 09:00", place: "羽毛球馆", joined: 16, quota: 32, fee: "20元/人", img: "jade" },
  ],

  /* ---------- 智能家居 ---------- */
  smart: {
    doors: [
      { name: "12栋3单元 单元门", type: "门禁", online: true },
      { name: "地库 B2 人行门", type: "门禁", online: true },
      { name: "入户智能门锁", type: "门锁", online: true, battery: 86 },
    ],
    locks: [
      { name: "林雅", method: "指纹 + 密码", added: "2025-03-12" },
      { name: "保姆 王阿姨", method: "临时密码（每周更新）", added: "2026-05-01" },
    ],
    faces: [
      { name: "陈思远", type: "人脸", status: "已录入" },
      { name: "林雅", type: "人脸", status: "已录入" },
      { name: "粤B·6F2K9", type: "车牌", status: "已绑定" },
    ],
  },

  /* ---------- 房屋档案 ---------- */
  archive: {
    deco: [
      { item: "全屋装修竣工", date: "2021-08", note: "现代简约 · XX装饰" },
      { item: "中央空调安装", date: "2021-07", brand: "大金", warranty: "2027-07 到期" },
      { item: "新风系统", date: "2021-07", brand: "松下", warranty: "2026-07 到期" },
    ],
    devices: [
      { item: "燃气热水器", brand: "林内", buy: "2021-08", warranty: "质保至 2027-08" },
      { item: "嵌入式洗碗机", brand: "西门子", buy: "2021-09", warranty: "质保至 2026-09" },
      { item: "智能门锁", brand: "凯迪仕", buy: "2024-11", warranty: "质保至 2027-11" },
    ],
  },
};
