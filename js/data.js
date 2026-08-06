/* ============================
   健身计划数据 + 本地存储
   ============================ */

// ─── 五分化训练计划 ───
/*
 * ⚠️ 斜方肌弱化提醒：
 * - 所有推/拉动作意念沉肩，不耸肩借力
 * - 面拉/Y-T-W-L 高次数 → 强化下斜方
 * - 每天拉伸上斜方（耳朵靠肩+转头）
 * - 避免耸肩动作（耸肩、直立划船）
 */

const WORKOUT_PLAN = {
  monday: {
    day: 1,
    title: '拉 · 背阔肌宽度',
    subtitle: '背阔肌 + 后束',
    emoji: '🏋️',
    exercises: [
      { name: '宽握高位下拉', sets: 4, repsMin: 8, repsMax: 12, rest: '60s', note: '主攻背宽，拉到锁骨位，肘朝下夹' },
      { name: '坐姿绳索划船（宽握把）', sets: 4, repsMin: 10, repsMax: 12, rest: '60s', note: '背阔肌中下部，肩胛后收' },
      { name: '哑铃单臂划船', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '每侧单做，感受背阔肌收缩' },
      { name: '面拉 Face Pull', sets: 3, repsMin: 15, repsMax: 15, rest: '45s', note: '后束+肩袖健康' },
      { name: '山羊挺身', sets: 3, repsMin: 12, repsMax: 12, rest: '45s', note: '下背竖脊肌' }
    ],
    cardio: { type: '椭圆机', duration: 20, note: '中等强度' }
  },
  tuesday: {
    day: 2,
    title: '推 · 胸 + 肩前中束',
    subtitle: '胸大肌 + 三角肌前中束 + 三头',
    emoji: '💪',
    exercises: [
      { name: '哑铃/杠铃平板卧推', sets: 4, repsMin: 8, repsMax: 12, rest: '60s', note: '胸大肌主体' },
      { name: '上斜哑铃卧推', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '上胸' },
      { name: '坐姿推胸器械', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '收尾泵感' },
      { name: '哑铃侧平举', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '三角肌中束，肩宽显腰窄' },
      { name: '绳索下压（三头）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '三头收尾' }
    ],
    cardio: { type: '椭圆机', duration: 20, note: '中等强度' }
  },
  wednesday: {
    day: 3,
    title: '腿 + 核心（低冲击）',
    subtitle: '下肢固定器械 + 腹部',
    emoji: '🦵',
    exercises: [
      { name: '坐姿腿举（倒蹬）', sets: 4, repsMin: 10, repsMax: 12, rest: '90s', note: '脚放低，减少脚背压力' },
      { name: '坐姿腿屈伸', sets: 3, repsMin: 12, repsMax: 15, rest: '60s', note: '股四头肌' },
      { name: '俯卧腿弯举', sets: 3, repsMin: 12, repsMax: 15, rest: '60s', note: '股二头肌' },
      { name: '平板支撑', sets: 4, repsMin: 30, repsMax: 45, rest: '30s', note: '单位：秒' },
      { name: '悬垂举腿（或仰卧抬腿）', sets: 3, repsMin: 15, repsMax: 15, rest: '45s', note: '下腹' }
    ],
    cardio: { type: '划船机', duration: 20, note: '零脚背压力，中低阻力，腿+背协同发力' }
  },
  thursday: {
    day: 4,
    title: '肩 + 手臂',
    subtitle: '三角肌 + 二头 + 三头',
    emoji: '💪',
    exercises: [
      { name: '哑铃推举（坐姿）', sets: 4, repsMin: 8, repsMax: 12, rest: '60s', note: '三角肌前中束' },
      { name: '哑铃侧平举', sets: 4, repsMin: 12, repsMax: 15, rest: '45s', note: '中束，肩宽关键' },
      { name: '哑铃前平举（交替）', sets: 3, repsMin: 12, repsMax: 12, rest: '45s', note: '前束，每侧交替' },
      { name: '杠铃弯举（二头）', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '二头' },
      { name: '窄距卧推或绳索下压', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '三头' }
    ],
    cardio: { type: '椭圆机', duration: 20, note: '中等强度' }
  },
  friday: {
    day: 5,
    title: '🏀 球赛日 · 轻训 + 实战',
    subtitle: '早上轻量上肢，下午球赛 = 有氧+耐力',
    emoji: '🏀',
    exercises: [
      { name: '哑铃推举（坐姿）', sets: 3, repsMin: 8, repsMax: 10, rest: '60s', note: '肩部激活，不用力竭' },
      { name: '哑铃侧平举', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '中束激活' },
      { name: '面拉 Face Pull', sets: 2, repsMin: 12, repsMax: 15, rest: '45s', note: '肩袖预热' },
      { name: '农夫行走', sets: 2, repsMin: 30, repsMax: 40, rest: '-', note: '单位秒，握力+核心' }
    ],
    cardio: null,
    circuitNote: '早上40min轻训即可，保留体力打下午球赛。🏀 球赛就是最好的体能训练！'
  }
};

const DAY_KEYS = ['monday', 'tuesday', 'wednesday',   thursday: {
    day: 4,
    title: '肩 + 下斜方强化（弱化上斜方）',
    subtitle: '🎯 减少推举重量，增加面拉+Y-T-W-L，放松上斜方',
    emoji: '🏋️',
    exercises: [
      { name: '哑铃推举（坐姿·轻重量）', sets: 3, repsMin: 12, repsMax: 15, note: '⛔ 不要耸肩，肩胛下沉固定', rest: '60s' },
      { name: '面拉 Face Pull（高次数）', sets: 4, repsMin: 15, repsMax: 20, note: '🎯 下斜方+肩袖，改善圆肩，关键动作', rest: '45s' },
      { name: '哑铃侧平举（坐姿）', sets: 4, repsMin: 12, repsMax: 15, note: '中束，肩宽关键，不要借力耸肩', rest: '45s' },
      { name: 'Y-T-W-L 伸展', sets: 3, repsMin: 10, repsMax: 12, note: '🎯 趴在上斜凳/地面做，强化下斜方，平衡上斜方', rest: '45s' },
      { name: '杠铃弯举（二头）', sets: 3, repsMin: 10, repsMax: 12, note: '二头', rest: '60s' },
      { name: '窄距卧推或绳索下压', sets: 3, repsMin: 10, repsMax: 12, note: '三头', rest: '60s' }
    ],
    trapNotes: '⚠️ 斜方肿大对策：①所有推拉动作意念沉肩 ②面拉用高次数激活下斜方 ③每天做上斜方拉伸（耳朵靠肩+转头） ④不要耸肩借力'
  }
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