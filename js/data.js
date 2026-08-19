/* ============================
   健身计划数据 + 本地存储
   ============================ */

// ─── 五分化训练计划：背肩优先 · 减少上斜方代偿 ───
/*
 * ⚠️ 减少上斜方代偿提醒：
 * - 所有推/拉动作意念沉肩，不耸肩借力
 * - 面拉/Y-T-W-L 高次数 → 强化下斜方
 * - 每天拉伸上斜方（耳朵靠肩+转头）
 * - 暂不安排耸肩、直立划船、农夫行走等高斜方参与动作
 */

const WORKOUT_PLAN = {
  monday: {
    day: 1,
    title: '拉 · 背阔肌宽度 + 二头',
    subtitle: 'V型背 · 引体为主力 · 二头三动作猛攻',
    emoji: '🏋️',
    exercises: [
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '趴地面做，唤醒下斜方+前锯肌，改善斜方代偿' },
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '带阻力强化肩胛后缩下沉' },
      { name: '辅助引体向上（正握宽距）', sets: 4, repsMin: 6, repsMax: 10, rest: '90s', note: '背宽核心！先沉肩再拉，肘往肋骨夹，脖子放松' },
      { name: '宽握高位下拉', sets: 4, repsMin: 10, repsMax: 12, rest: '60s', note: '拉到锁骨停1秒，上半身后倾15度，不耸肩' },
      { name: '直臂下压（绳索）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '背阔肌孤立，找腋下夹紧感' },
      { name: '杠铃弯举（二头·大重量）', sets: 4, repsMin: 8, repsMax: 10, rest: '60s', note: '二头主力重量！肘夹紧，放慢3秒，8次力竭的重量' },
      { name: '哑铃上斜弯举（二头·拉伸）', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '凳调45度靠好，底端充分拉伸顶端用力挤，二头长头' },
      { name: '哑铃锤式弯举（二头·厚度）', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '对握哑铃，肱肌+肱桡肌，手臂粗壮关键' },
      { name: '收下巴 Chin Tuck', sets: 3, repsMin: 10, repsMax: 10, rest: '30s', note: '🎯 后脑勺后顶5秒' },
      { name: '上斜方拉伸', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩→换侧' }
    ]
  },
  tuesday: {
    day: 2,
    title: '肩 · 中束轰炸 + 三头',
    subtitle: '侧平举四件套 · 不做推举 · 三头双动作',
    emoji: '💪',
    exercises: [
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '唤醒下斜方' },
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活肩袖' },
      { name: '哑铃侧平举（坐姿·主力重量）', sets: 4, repsMin: 10, repsMax: 12, rest: '60s', note: '中束主力！拇指朝上微外旋，肘先抬不耸肩，选10次力竭的重量' },
      { name: '哑铃侧平举（递减组）', sets: 2, repsMin: 12, repsMax: 15, rest: '45s', note: '同重量做到力竭→立刻换轻一档再做到力竭=1组，彻底轰炸中束' },
      { name: '单臂绳索侧平举', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '持续张力，空手扶柱，身体不晃' },
      { name: '面拉 Face Pull（正式）', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '后束+肩袖，改善圆肩' },
      { name: '哑铃颈后臂屈伸（三头·主力）', sets: 4, repsMin: 8, repsMax: 10, rest: '60s', note: '三头长头！双手托哑铃过头往后弯，底端充分拉伸' },
      { name: '哑铃俯身臂屈伸（三头·补充）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '大臂贴身不动只前臂往后伸，顶峰停1秒' },
      { name: '收下巴 Chin Tuck', sets: 3, repsMin: 10, repsMax: 10, rest: '30s', note: '🎯 后脑勺后顶5秒' },
      { name: '上斜方拉伸', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩→换侧' }
    ]
  },
  wednesday: {
    day: 3,
    title: '拉 · 背厚度 + 手臂猛攻',
    subtitle: '中背+菱形肌 + 二三头各三动作',
    emoji: '🏋️',
    exercises: [
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '唤醒肩胛' },
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活肩袖' },
      { name: '坐姿绳索划船（对握）', sets: 4, repsMin: 10, repsMax: 12, rest: '60s', note: '中背厚度主力！拉到肚脐位置肩胛夹紧停1秒' },
      { name: '单臂哑铃划船', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '单侧背阔，拉到腰侧停1秒，不转身体' },
      { name: 'T杠划船（或胸靠划船机）', sets: 3, repsMin: 10, repsMax: 12, rest: '60s', note: '菱形肌+中背，胸贴垫肩胛收紧' },
      { name: '杠铃弯举（二头·大重量）', sets: 3, repsMin: 8, repsMax: 10, rest: '60s', note: '大重量8次力竭，肘夹紧' },
      { name: '哑铃交替弯举（二头·控制）', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '坐姿交替，上去掌心朝上下来掌心朝内，充分拉伸' },
      { name: '哑铃集中弯举（二头·顶峰）', sets: 2, repsMin: 10, repsMax: 12, rest: '45s', note: '手肘抵大腿内侧，顶端用力挤1秒，最强收缩感' },
      { name: '哑铃颈后臂屈伸（三头·主力）', sets: 3, repsMin: 8, repsMax: 10, rest: '60s', note: '三头长头' },
      { name: '哑铃仰卧臂屈伸（三头·拉伸）', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '躺凳上哑铃往额头方向弯，底端充分拉伸' },
      { name: '收下巴 Chin Tuck', sets: 3, repsMin: 10, repsMax: 10, rest: '30s', note: '🎯 后脑勺后顶5秒' },
      { name: '上斜方拉伸', sets: 2, repsMin: 20, repsMax: 30, rest: '-', note: '耳朵靠肩→换侧' }
    ]
  },
  thursday: {
    day: 4,
    title: '肩 · 后束+肩袖 + 手臂',
    subtitle: '肩膀分离度 · 后束轰炸 + 二三头双动作',
    emoji: '🎯',
    exercises: [
      { name: 'Y-T-W-L 伸展（加强）', sets: 3, repsMin: 10, repsMax: 12, rest: '30s', note: '重点T和L，中斜方+肩袖外旋' },
      { name: '面拉 Face Pull（主力·大重量）', sets: 4, repsMin: 12, repsMax: 15, rest: '60s', note: '后束+肩袖核心！比平时重一档，拉到额头外旋停1秒' },
      { name: '反向蝴蝶机（后束·主力）', sets: 4, repsMin: 12, repsMax: 15, rest: '45s', note: '后束轰炸！胸贴靠垫肩膀远离耳朵往后打开，感受后束收缩' },
      { name: '俯卧哑铃外展（后束·补充）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '趴45度凳上，手臂往两侧打开，轻哑铃严格' },
      { name: '哑铃侧平举（轻量高次数）', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '中束泵感，轻重量高次数' },
      { name: '哑铃锤式弯举（二头）', sets: 3, repsMin: 10, repsMax: 12, rest: '45s', note: '肱肌+前臂，对握，手臂粗壮' },
      { name: '哑铃俯身臂屈伸（三头）', sets: 3, repsMin: 12, repsMax: 15, rest: '45s', note: '三头，大臂贴身，顶峰停1秒' },
      { name: '收下巴 Chin Tuck', sets: 3, repsMin: 10, repsMax: 10, rest: '30s', note: '🎯 后脑勺后顶5秒' },
      { name: '颈部侧向+旋转拉伸', sets: 3, repsMin: 20, repsMax: 30, rest: '15s', note: '耳朵靠肩→下巴转腋下→换侧' }
    ]
  },
  friday: {
    day: 5,
    title: '综合 · 薄肌代谢 + 手臂收尾',
    subtitle: '超级组燃脂 + 二三头最后轰炸',
    emoji: '⚡',
    exercises: [
      { name: 'Y-T-W-L 伸展（热身）', sets: 2, repsMin: 8, repsMax: 10, rest: '30s', note: '唤醒肩胛' },
      { name: '面拉 Face Pull（热身）', sets: 2, repsMin: 15, repsMax: 15, rest: '30s', note: '激活肩袖' },
      { name: '超级组：辅助引体+侧平举', sets: 3, repsMin: 8, repsMax: 12, rest: '60s', note: '引体8次→立刻侧平举12次→休息，背+肩燃脂' },
      { name: '超级组：划船+哑铃弯举', sets: 3, repsMin: 12, repsMax: 15, rest: '60s', note: '划船12次→立刻弯举12次→休息' },
      { name: '超级组：反向蝴蝶机+哑铃臂屈伸', sets: 3, repsMin: 15, repsMax: 15, rest: '60s', note: '后束15次→立刻三头15次→休息' },
      { name: '哑铃锤式弯举（收尾泵感）', sets: 3, repsMin: 15, repsMax: 20, rest: '45s', note: '轻重量高次数最后泵感' },
      { name: '哑铃颈后臂屈伸（收尾）', sets: 2, repsMin: 15, repsMax: 20, rest: '45s', note: '轻重量高次数三头收尾' },
      { name: '收下巴 Chin Tuck', sets: 4, repsMin: 10, repsMax: 15, rest: '30s', note: '🎯 加量！后脑勺后顶5秒配合深呼气' },
      { name: '颈部全方位拉伸', sets: 3, repsMin: 20, repsMax: 40, rest: '10s', note: '侧向+旋转充分放松' }
    ]
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
    { icon: '📉', text: '瘦下巴靠整体减脂：目标每周下降0.2~0.4kg，连续2周不降再每天减少150kcal' },
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
