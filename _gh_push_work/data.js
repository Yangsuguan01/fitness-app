/* ============================
   健身计划数据 + 本地存储
   ============================ */

// ─── 五分化训练计划：宽肩优先 · 弱化上斜方 ───
/*
 * ⚠️ 斜方肌弱化提醒：
 * - 所有推/拉动作意念沉肩，不耸肩借力
 * - 面拉/Y-T-W-L 高次数 → 强化下斜方
 * - 每天拉伸上斜方（耳朵靠肩+转头）
 * - 暂不安排耸肩、直立划船、农夫行走等高斜方参与动作
 */

const WORKOUT_PLAN = {
  monday: {
    day: 1,
    title: '拉 · 背阔肌宽度',
    subtitle: '背阔肌 + 后束 · 全程沉肩不耸肩',
    emoji: '🏋️',
    exercises: [
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活下斜方+肩袖，正式组前必做' },
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '趴地面做Y→T→W→L四个动作，强化下斜方' },
      { name: '辅助引体向上（正握/中立握）', sets: 3, repsMin: 6, repsMax: 10, rest: '90s', note: '主攻背宽，先沉肩再拉，脖子放松不耸肩' },
      { name: '宽握高位下拉', sets: 3, repsMin: 8, repsMax: 12, rest: '60s', note: '补背阔发力，拉到锁骨位，肘朝下夹，肩胛下沉' },
      { name: '坐姿绳索划船（宽握把）', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '背阔肌中下部，肩胛后收，不用上斜方借力' },
      { name: '哑铃单臂划船', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '每侧单做，感受背阔肌收缩，空手扶凳保持稳定' },
      { name: '反向蝴蝶机（后束）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '后束发力，胸贴靠垫，肩膀远离耳朵' },
      { name: '山羊挺身', sets: 3, repsMin: 12, repsMax: 12, rest: '45s', note: '下背竖脊肌，腰不要过度伸展' },
      { name: '上斜方拉伸（收尾）', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩保持20秒→转头看腋下→换侧，每天必做' }
    ]
  },
  tuesday: {
    day: 2,
    title: '推 · 胸 + 前中束',
    subtitle: '胸大肌 + 三角肌前中束 + 三头',
    emoji: '💪',
    exercises: [
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活下斜方+肩袖，推胸前必做' },
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '趴地面做，强化下斜方平衡上斜方' },
      { name: '蝴蝶机夹胸', sets: 4, repsMin: 10, repsMax: 15, rest: '60s', note: '胸部主力动作，手肘微弯，肩胛后收不耸肩' },
      { name: '哑铃飞鸟（平板）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '胸部拉伸补充，轻重量慢放，不追大重量' },
      { name: '俯卧撑（可扶高）', sets: 3, repsMin: 8, repsMax: 15, rest: '60s', note: '作为胸推动作补位，手撑高可降低难度和肩压力' },
      { name: '哑铃侧平举', sets: 4, repsMin: 12, repsMax: 20, rest: '45s', note: '中束主力动作，轻重量沉肩，不借力耸肩' },
      { name: '绳索下压（三头）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '三头收尾，肘夹紧不动' },
      { name: '上斜方拉伸（收尾）', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩20秒→转头看腋下→换侧' }
    ]
  },
    wednesday: {
    day: 3,
    title: '腿 · 健身房（无腿举机）',
    subtitle: '🦵 全坐姿/卧姿器械 · 零足压 · 代替腿举机方案',
    emoji: '🦵',
    exercises: [
      { name: '坐姿腿屈伸（代替腿举·股四头）', sets: 4, repsMin: 12, repsMax: 15, rest: '60s', note: '股四头肌，坐姿无足压，控制慢放' },
      { name: '坐姿髋外展（代替腿举·臀大肌）', sets: 3, repsMin: 15, repsMax: 15, rest: '45s', note: '臀大肌+髋外展，坐姿器械，顶峰收缩' },
      { name: '俯卧腿弯举（股二头）', sets: 4, repsMin: 12, repsMax: 15, rest: '60s', note: '大腿后侧，趴姿脚部无压力' },
      { name: '坐姿髋内收（大腿内侧）', sets: 3, repsMin: 15, repsMax: 15, rest: '45s', note: '内收肌群，提高腿部整体力量' },
      { name: '坐姿提踵（小腿）', sets: 3, repsMin: 20, repsMax: 20, rest: '45s', note: '轻重量慢放，坐姿无足压' },
      { name: '平板支撑', sets: 4, repsMin: 30, repsMax: 45, rest: '30s', note: '核心，单位秒' },
      { name: '仰卧抬腿', sets: 3, repsMin: 15, repsMax: 15, rest: '45s', note: '下腹，腰部贴地' }
    ]
  }
,
  thursday: {
    day: 4,
    title: '肩 + 下斜方强化',
    subtitle: '中束/后束优先 · 低斜方参与',
    emoji: '💪',
    exercises: [
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活下斜方+肩袖' },
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '趴地面做，强化下斜方' },
      { name: '绳索前平举（轻重量）', sets: 2, repsMin: 12, repsMax: 15, rest: '45s', note: '前束辅助，轻重量控制，不耸肩上提' },
      { name: '哑铃侧平举（坐姿）', sets: 4, repsMin: 12, repsMax: 20, rest: '45s', note: '中束核心动作，肘微弯领先小臂' },
      { name: '单臂绳索侧平举', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '补足中束张力，身体保持稳定' },
      { name: '面拉 Face Pull（正式·高次数）', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '后束+肩袖，动作全程沉肩' },
      { name: '反向蝴蝶机（后束）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '后束主力，胸贴靠垫，沉肩向后打开' },
      { name: '杠铃弯举（二头）', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '二头，肘夹紧不动' },
      { name: '器械牧师凳弯举（二头）', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '二头增维度，底部别完全放松，顶峰收紧' },
      { name: '绳索下压（三头）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '三头收尾' },
      { name: '绳索过顶臂屈伸（三头长头）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '补三头长头，手肘朝前固定，不耸肩' },
      { name: '上斜方拉伸（收尾）', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩20秒→转头看腋下→换侧，每天必做' }
    ]
  },
  friday: {
    day: 5,
    title: '🏀 球赛日 · 上肢综合 + 实战',
    subtitle: '胸背手臂 + 肩中束 · 下午球赛照常',
    emoji: '🏀',
    exercises: [
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '肩袖预热，肩膀远离耳朵' },
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '激活下斜方，动作慢而稳' },
      { name: '蝴蝶机夹胸', sets: 3, repsMin: 10, repsMax: 15, rest: '60s', note: '胸部补量，控制夹胸，不耸肩' },
      { name: '坐姿划船器械', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '背部发力，胸口打开，肩膀不要上提' },
      { name: '哑铃侧平举（坐姿）', sets: 4, repsMin: 12, repsMax: 20, rest: '45s', note: '中束主力，轻重量沉肩，顶峰停1秒' },
      { name: '反向蝴蝶机（后束）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '后束补强，胸贴靠垫，不抬肩' },
      { name: '绳索弯举（二头）', sets: 3, repsMin: 10, repsMax: 15, rest: '45s', note: '手臂收尾，肘夹紧不晃' },
      { name: '绳索锤式弯举（肱肌）', sets: 2, repsMin: 12, repsMax: 15, rest: '45s', note: '增加手臂厚度，手腕中立，别甩' },
      { name: '绳索下压（三头）', sets: 3, repsMin: 10, repsMax: 15, rest: '45s', note: '三头收尾，肩膀保持下沉' },
      { name: '上斜方拉伸（收尾）', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩20秒→转头看腋下→换侧' }
    ],
    circuitNote: '周五照常完成上肢综合训练，下午球赛作为额外体能和燃脂。全程沉肩，不追大重量推举。'
  }
};


const DAY_NAMES_CN = { monday: '周一', tuesday: '周二', wednesday: '周三', thursday: '周四', friday: '周五' };
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
;
const DAY_KEYS_CYCLE = ['friday', 'monday', 'tuesday', 'wednesday', 'thursday']; // Friday links back to Monday

// ─── 饮食指南 ───
const DIET_GUIDE = {
  calories: { target: 2200, min: 2100, max: 2300, unit: 'kcal' },
  protein: { target: 140, unit: 'g' },
  carbs: { target: 235, unit: 'g' },
  fat: { target: 55, unit: 'g' },
  water: { target: 8, unit: '杯（250ml/杯）' },
  meals: [
    {
      name: '🥣 练前轻食（6:10）',
      items: ['半根香蕉 或 一片全麦面包', '黑咖啡（不加糖奶）'],
      timing: '训练前20分钟'
    },
    {
      name: '🥣 练后早餐（8:45~9:00）',
      items: ['2个水煮蛋', '一杯无糖豆浆/牛奶', '一小碗燕麦片 或 一片全麦面包'],
      timing: '到公司后'
    },
    {
      name: '🥢 午餐（12:00~12:30）',
      items: ['一拳头杂粮饭', '一掌心的瘦肉（鸡胸/牛肉/鱼/虾）', '两大捧蔬菜（西兰花/菠菜/青菜）'],
      timing: '正常少油，不要油炸'
    },
    {
      name: '🥗 晚餐（18:00~19:00）',
      items: ['半拳头杂粮饭', '一掌心的瘦肉/豆腐/鱼', '两大捧蔬菜'],
      timing: '晚饭后不再吃主食类'
    },
    {
      name: '🍎 加餐（可选，16:00~17:00）',
      items: ['一个苹果', '或 一根蛋白棒', '或 一杯酸奶+一小把坚果'],
      timing: '训练日下午饿的时候'
    }
  ],
  rules: [
    { icon: '✅', text: '鸡胸肉、鱼虾、瘦牛肉、鸡蛋、豆腐' },
    { icon: '✅', text: '全麦面包、燕麦、杂粮饭、红薯、玉米' },
    { icon: '✅', text: '所有蔬菜（尤其是绿叶菜）' },
    { icon: '✅', text: '喝水 2~3L/天，无糖饮品' },
    { icon: '❌', text: '含糖饮料（奶茶、可乐、果汁）' },
    { icon: '❌', text: '油炸食品、肥肉、动物皮' },
    { icon: '❌', text: '高糖零食（饼干、蛋糕、巧克力）' },
    { icon: '❌', text: '夜宵、酒' }
  ]
};

// ─── 食物热量数据库 ───
const FOOD_DATABASE = {
  // ═══ 主食 ═══
  '米饭':       { kcal: 116, unit: '碗(100g)' },
  '杂粮饭':     { kcal: 110, unit: '碗(100g)' },
  '红薯':       { kcal: 86,  unit: '个(中)' },
  '玉米':       { kcal: 112, unit: '根' },
  '馒头':       { kcal: 220, unit: '个' },
  '花卷':       { kcal: 200, unit: '个' },
  '包子(肉)':   { kcal: 230, unit: '个' },
  '包子(菜)':   { kcal: 180, unit: '个' },
  '小米粥':     { kcal: 100, unit: '碗' },
  '皮蛋瘦肉粥': { kcal: 200, unit: '碗' },
  '馄饨':       { kcal: 250, unit: '碗(10个)' },
  '葱油饼':     { kcal: 250, unit: '张' },
  '煎饼果子':   { kcal: 350, unit: '套' },
  '油条':       { kcal: 250, unit: '根' },
  '蛋炒饭':     { kcal: 350, unit: '份' },
  '水饺(10个)': { kcal: 350, unit: '份' },
  '蒸饺(10个)': { kcal: 300, unit: '份' },
  '小笼包(6个)':{ kcal: 280, unit: '笼' },
  '葱油拌面':   { kcal: 380, unit: '份' },
  '阳春面':     { kcal: 220, unit: '份' },
  '牛肉面':     { kcal: 450, unit: '份' },
  '炸酱面':     { kcal: 400, unit: '份' },
  '凉皮':       { kcal: 280, unit: '份' },

  // ═══ 蛋白质 ═══
  '鸡胸肉':     { kcal: 165, unit: '份(100g)' },
  '鸡蛋':       { kcal: 70,  unit: '个' },
  '牛肉(瘦)':   { kcal: 125, unit: '份(100g)' },
  '鱼肉':       { kcal: 120, unit: '份(100g)' },
  '虾仁':       { kcal: 90,  unit: '份(100g)' },
  '豆腐':       { kcal: 80,  unit: '块(100g)' },

  // ═══ 蔬菜 ═══
  '西兰花':     { kcal: 35,  unit: '份(100g)' },
  '青菜':       { kcal: 20,  unit: '份(100g)' },
  '蒜蓉西兰花': { kcal: 80,  unit: '份(150g)' },
  '清炒时蔬':   { kcal: 60,  unit: '份(150g)' },
  '酸辣土豆丝': { kcal: 160, unit: '份(150g)' },
  '地三鲜':     { kcal: 200, unit: '份(150g)' },
  '干煸四季豆': { kcal: 160, unit: '份(150g)' },

  // ═══ 家常菜 · 牛肉/猪肉 ═══
  '苦瓜炒牛肉': { kcal: 180, unit: '份(150g)' },  // ← 你问的！
  '青椒炒肉':   { kcal: 200, unit: '份(150g)' },
  '鱼香肉丝':   { kcal: 220, unit: '份(150g)' },
  '宫保鸡丁':   { kcal: 240, unit: '份(150g)' },
  '麻婆豆腐':   { kcal: 180, unit: '份(150g)' },
  '红烧肉':     { kcal: 350, unit: '份(150g)' },
  '糖醋里脊':   { kcal: 280, unit: '份(150g)' },
  '回锅肉':     { kcal: 320, unit: '份(150g)' },
  '红烧排骨':   { kcal: 300, unit: '份(150g)' },
  '可乐鸡翅':   { kcal: 250, unit: '份(4个)' },
  '蒜苔炒肉':   { kcal: 190, unit: '份(150g)' },
  '芹菜炒肉':   { kcal: 170, unit: '份(150g)' },
  '葱爆羊肉':   { kcal: 260, unit: '份(150g)' },
  '水煮肉片':   { kcal: 350, unit: '份(200g)' },

  // ═══ 家常菜 · 蛋/豆腐/海鲜 ═══
  '番茄炒蛋':   { kcal: 150, unit: '份(150g)' },
  '木耳炒蛋':   { kcal: 140, unit: '份(150g)' },
  '韭菜炒蛋':   { kcal: 160, unit: '份(150g)' },
  '清蒸鱼':     { kcal: 140, unit: '份(150g)' },
  '白灼虾':     { kcal: 120, unit: '份(150g)' },

  // ═══ 汤 ═══
  '紫菜蛋花汤': { kcal: 50,  unit: '碗' },
  '番茄蛋汤':   { kcal: 60,  unit: '碗' },
  '冬瓜排骨汤': { kcal: 150, unit: '碗' },
  '玉米排骨汤': { kcal: 180, unit: '碗' },
  '酸辣汤':     { kcal: 100, unit: '碗' },

  // ═══ 早餐饮品/轻食 ═══
  '水煮蛋':     { kcal: 70,  unit: '个' },
  '全麦面包':   { kcal: 120, unit: '片' },
  '燕麦片':     { kcal: 150, unit: '碗(30g)' },
  '无糖豆浆':   { kcal: 35,  unit: '杯(250ml)' },
  '牛奶':       { kcal: 120, unit: '杯(250ml)' },
  '香蕉':       { kcal: 90,  unit: '根' },
  '黑咖啡':     { kcal: 5,   unit: '杯' },

  // ═══ 加餐/零食 ═══
  '蛋挞':       { kcal: 196, unit: '个' },
  '苹果':       { kcal: 85,  unit: '个' },
  '蛋白棒':     { kcal: 200, unit: '根' },
  '酸奶(无糖)': { kcal: 70,  unit: '杯(100g)' },
  '坚果混合':   { kcal: 150, unit: '把(30g)' },
  '可乐':       { kcal: 140, unit: '罐(330ml)' },
};

// 按时段分类（供快速选择）
const FOOD_CATEGORIES = [
  { id: 'breakfast', label: '🌅 早餐·轻食',
    foods: ['水煮蛋','全麦面包','燕麦片','无糖豆浆','牛奶','香蕉','黑咖啡','小米粥','皮蛋瘦肉粥','馄饨','包子(肉)','包子(菜)','馒头','煎饼果子'] },
  { id: 'lunch',     label: '🌞 午餐·家常菜',
    foods: ['米饭','杂粮饭','苦瓜炒牛肉','番茄炒蛋','青椒炒肉','鱼香肉丝','宫保鸡丁','麻婆豆腐','红烧排骨','糖醋里脊','可乐鸡翅','酸辣土豆丝','地三鲜','蒜蓉西兰花','清炒时蔬','青菜','豆腐','紫菜蛋花汤'] },
  { id: 'dinner',    label: '🌙 晚餐·轻食',
    foods: ['杂粮饭','红薯','玉米','清蒸鱼','白灼虾','苦瓜炒牛肉','番茄炒蛋','蒜蓉西兰花','清炒时蔬','豆腐','冬瓜排骨汤','玉米排骨汤','青菜'] },
  { id: 'noodle',    label: '🍜 面食·主食',
    foods: ['牛肉面','炸酱面','凉皮','蛋炒饭','葱油拌面','阳春面','水饺(10个)','蒸饺(10个)','小笼包(6个)','葱油饼'] },
  { id: 'snack',     label: '🍪 加餐·零食',
    foods: ['蛋挞','苹果','蛋白棒','酸奶(无糖)','坚果混合','可乐','红薯','玉米','鸡蛋'] },
];

// ─── 本地存储 ───
const Storage = {
  _prefix: 'fitness_app_',

  get(key, def = null) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : def;
    } catch { return def; }
  },

  set(key, val) {
    localStorage.setItem(this._prefix + key, JSON.stringify(val));
  },

  // ── 训练日志 ──
  getWorkoutLogs() {
    return this.get('workout_logs', {});
  },

  saveWorkoutLog(dateKey, log) {
    const logs = this.getWorkoutLogs();
    const existing = logs[dateKey] || {};
    logs[dateKey] = { ...existing, ...log, updatedAt: new Date().toISOString() };
    this.set('workout_logs', logs);
  },

  getWorkoutLog(dateKey) {
    const logs = this.getWorkoutLogs();
    return logs[dateKey] || null;
  },

  deleteWorkoutLog(dateKey) {
    const logs = this.getWorkoutLogs();
    delete logs[dateKey];
    this.set('workout_logs', logs);
  },

  // ── 身体数据 ──
  getBodyLogs() {
    return this.get('body_logs', {});
  },

  saveBodyLog(dateKey, data) {
    const logs = this.getBodyLogs();
    logs[dateKey] = { ...data, updatedAt: new Date().toISOString() };
    this.set('body_logs', logs);
  },

  // ── 饮水记录 ──
  getWaterLogs() {
    return this.get('water_logs', {});
  },

  saveWaterLog(dateKey, cups) {
    const logs = this.getWaterLogs();
    logs[dateKey] = { cups, updatedAt: new Date().toISOString() };
    this.set('water_logs', logs);
  },

  // ── 食物记录 ──
  getFoodLogs() {
    return this.get('food_logs', {});
  },

  saveFoodEntry(dateKey, entry) {
    const logs = this.getFoodLogs();
    if (!logs[dateKey]) logs[dateKey] = [];
    logs[dateKey].push({ ...entry, timestamp: new Date().toISOString() });
    this.set('food_logs', logs);
  },

  deleteFoodEntry(dateKey, index) {
    const logs = this.getFoodLogs();
    if (logs[dateKey] && logs[dateKey][index]) {
      logs[dateKey].splice(index, 1);
      this.set('food_logs', logs);
    }
  },

  // ── 设置 ──
  getSettings() {
    return this.get('settings', { bodyWeight: 68, bodyHeight: 175, startDate: new Date().toISOString().slice(0,10) });
  },

  saveSettings(s) {
    this.set('settings', s);
  }
};

// ─── 工具函数 ───
function getTodayKey() { return new Date().toISOString().slice(0, 10); }

function getDayOfWeekCN() {
  const map = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[new Date().getDay()];
}

function getTodaysWorkoutKey() {
  const dow = getDayOfWeekCN();
  if (dow === 'sunday' || dow === 'saturday') return null;  // 周末休息
  return dow;
}

function getDateCN(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth()+1}月${d.getDate()}日 周${weekdays[d.getDay()]}`;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth()+1}/${d.getDate()}`;
}

// Export for app.js
if (typeof module !== 'undefined') module.exports = { WORKOUT_PLAN, DAY_KEYS, DAY_NAMES_CN, DIET_GUIDE, FOOD_DATABASE, FOOD_CATEGORIES, Storage, getTodayKey, getDayOfWeekCN, getTodaysWorkoutKey, getDateCN, formatDateShort };