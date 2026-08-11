const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType, PageBreak } = require("docx");
const fs = require("fs");

// 颜色
const ACCENT = "00D4AA";
const DARK = "0F0F1A";
const GRAY = "6B6B80";

// 通用边框
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "333344" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

// 表格单元格
function tc(text, opts = {}) {
  const isHeader = opts.header;
  return new TableCell({
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      spacing: { before: 40, after: 40 },
      children: [new TextRun({
        text: text,
        bold: isHeader || opts.bold,
        size: isHeader ? 22 : 20,
        color: isHeader ? "FFFFFF" : (opts.color || "FFFFFF"),
      })]
    })],
    shading: isHeader ? { type: ShadingType.CLEAR, fill: ACCENT } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    borders,
  });
}

// 训练日表格
function dayTable(title, subtitle, exercises) {
  const headerRow = new TableRow({
    children: [
      tc("动作", { header: true, width: 32 }),
      tc("组×次", { header: true, width: 16, align: AlignmentType.CENTER }),
      tc("休", { header: true, width: 8, align: AlignmentType.CENTER }),
      tc("要领", { header: true, width: 44 }),
    ],
    tableHeader: true,
  });

  const rows = exercises.map(ex => new TableRow({
    children: [
      tc(ex.name, { bold: true }),
      tc(ex.rep, { align: AlignmentType.CENTER, color: ACCENT }),
      tc(ex.rest, { align: AlignmentType.CENTER }),
      tc(ex.note, { color: GRAY }),
    ],
    cantSplit: true,
  }));

  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 80 },
      children: [new TextRun({ text: title, bold: true, size: 28, color: ACCENT })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: subtitle, size: 22, color: GRAY, italics: true })],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...rows],
    }),
  ];
}

// 数据
const trapNote = "斜方弱化策略：热身面拉+Y-T-W-L激活下斜方 → 正式组全程沉肩不耸肩 → 收尾上斜方拉伸20秒";

const days = [
  {
    title: "周一 · 拉（背阔肌宽度）",
    subtitle: "背阔肌 + 后束 · 全程沉肩不耸肩",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", note: "激活下斜方+肩袖，正式组前必做" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", note: "趴地面做Y→T→W→L四个动作" },
      { name: "宽握高位下拉", rep: "4×8~12", rest: "60s", note: "拉到锁骨位，肘朝下夹，肩胛下沉" },
      { name: "坐姿绳索划船（宽握把）", rep: "4×10~12", rest: "60s", note: "背阔肌中下部，肩胛后收" },
      { name: "哑铃单臂划船", rep: "3×10~12", rest: "60s", note: "每侧单做，空手扶凳" },
      { name: "面拉 Face Pull（正式）", rep: "3×15", rest: "45s", note: "后束+肩袖，改善圆肩富贵包" },
      { name: "山羊挺身", rep: "3×12", rest: "45s", note: "下背竖脊肌，腰不过度伸展" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", note: "耳朵靠肩→转头看腋下→换侧" },
    ]
  },
  {
    title: "周二 · 推（胸+前中束）",
    subtitle: "胸大肌 + 三角肌前中束 + 三头",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", note: "推胸前必做" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", note: "强化下斜方" },
      { name: "蝴蝶机夹胸", rep: "4×10~15", rest: "60s", note: "胸部主力动作，肩胛后收，不耸肩" },
      { name: "扶高俯卧撑", rep: "3×8~15", rest: "60s", note: "胸推动作补位，降低肩部压力" },
      { name: "哑铃飞鸟（平板）", rep: "3×12~15", rest: "45s", note: "胸中缝，替代坐姿推胸器械" },
      { name: "哑铃侧平举", rep: "3×12~15", rest: "45s", note: "中束，沉肩做不借力" },
      { name: "绳索下压（三头）", rep: "3×12~15", rest: "45s", note: "三头收尾，肘夹紧" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", note: "每天必做" },
    ]
  },
  {
    title: "周三 · 腿（居家版·护滑膜炎）",
    subtitle: "全坐姿/卧姿，零足压，无需器械",
    exercises: [
      { name: "坐姿椅子起立（代替腿举）", rep: "4×12~15", rest: "90s", note: "慢起3秒→慢坐3秒，抱水桶/背包负重" },
      { name: "坐姿徒手伸腿（代替腿屈伸）", rep: "3×15", rest: "60s", note: "单腿伸直到水平停1秒慢放，交替" },
      { name: "俯卧屈膝勾腿（代替腿弯举）", rep: "3×15", rest: "60s", note: "趴垫子小腿弯向臀部，顶峰收缩1秒" },
      { name: "平板支撑", rep: "4×30~45s", rest: "30s", note: "臀不抬不塌腰" },
      { name: "仰卧抬腿", rep: "3×15", rest: "45s", note: "下腹发力，腰贴地，腿慢起慢落" },
    ]
  },
  {
    title: "周四 · 肩+下斜方强化",
    subtitle: "弱化上斜方 · 沉肩训练为主",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", note: "激活下斜方+肩袖" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", note: "趴地面做" },
      { name: "哑铃推举（坐姿·轻重量）", rep: "3×12~15", rest: "60s", note: "⛔ 不耸肩！肩胛下沉，宁可轻" },
      { name: "哑铃侧平举（坐姿）", rep: "4×12~15", rest: "45s", note: "中束，肘微弯领先小臂" },
      { name: "面拉（正式·高次数）", rep: "4×15~20", rest: "45s", note: "下斜方核心动作，改善圆肩富贵包" },
      { name: "反向飞鸟（坐姿·哑铃）", rep: "3×12~15", rest: "45s", note: "后束，俯身45度，沉肩发力" },
      { name: "杠铃弯举（二头）", rep: "3×10~12", rest: "60s", note: "肘夹紧不动" },
      { name: "绳索下压（三头）", rep: "3×12~15", rest: "45s", note: "三头收尾" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", note: "每天必做" },
    ]
  },
  {
    title: "周五 · 球赛日（轻训+实战）",
    subtitle: "早上轻量激活，下午球赛 = 有氧+耐力",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", note: "肩袖预热防受伤" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", note: "激活下斜方" },
      { name: "哑铃推举（坐姿）", rep: "3×8~10", rest: "60s", note: "肩部激活，不用力竭" },
      { name: "哑铃侧平举", rep: "3×10~12", rest: "45s", note: "中束激活" },
      { name: "农夫行走", rep: "2×30~40s", rest: "-", note: "提重物走，握力+核心" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", note: "每天必做" },
    ]
  },
];

// 作息表
const routine = [
  { time: "6:30", activity: "起床 · 温水" },
  { time: "6:40", activity: "练前轻食（半根香蕉/面包+黑咖啡）" },
  { time: "6:50", activity: "🚶 出门去健身房" },
  { time: "7:00", activity: "🏋️ 热身（面拉+Y-T-W-L）" },
  { time: "7:00~7:50", activity: "💪 力量训练" },
  { time: "7:50~8:15", activity: "🧘 拉伸收尾（上斜方拉伸）" },
  { time: "8:15~8:25", activity: "🚿 洗澡换衣" },
  { time: "8:30", activity: "✅ 出门去公司" },
];

// 构建文档
const children = [];

// 标题
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 400, after: 100 },
  children: [new TextRun({ text: "🏋️ 健身助手 · 五分化训练方案", bold: true, size: 40, color: ACCENT })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "弱化斜方肌 · 改善富贵包 · 增强肩背 · 耐力燃脂 · 护足（滑膜炎）", size: 22, color: GRAY })],
}));

// 训练目标
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 300, after: 100 },
  children: [new TextRun({ text: "📋 训练目标与约束", bold: true, size: 30, color: ACCENT })],
}));
const goals = [
  "✅ 弱化斜方肌（每天面拉+Y-T-W-L激活下斜方）",
  "✅ 改善下巴前伸/富贵包（收下巴+面拉+后束）",
  "✅ 增强肩背力量（背阔肌+三角肌+核心）",
  "✅ 耐力+燃脂（高次数短间歇+周五球赛）",
  "✅ 双脚滑膜炎规避（腿日全坐姿/卧姿，零足压）",
  "✅ 无坐姿推胸器械（用哑铃飞鸟替代）",
  "✅ 无椭圆机（去掉所有椭圆机有氧）",
];
goals.forEach(g => children.push(new Paragraph({
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text: g, size: 22 })],
})));

// 斜方弱化策略
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 300, after: 100 },
  children: [new TextRun({ text: "🎯 斜方肌弱化策略（每天统一）", bold: true, size: 30, color: ACCENT })],
}));
children.push(new Paragraph({
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text: "热身：面拉 2×15 + Y-T-W-L伸展 2×8（激活下斜方）", size: 22 })],
}));
children.push(new Paragraph({
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text: "原则：所有动作全程沉肩，不耸肩借力", size: 22 })],
}));
children.push(new Paragraph({
  spacing: { before: 40, after: 40 },
  children: [new TextRun({ text: "收尾：上斜方拉伸 2×20秒（耳朵靠肩→转头看腋下→换侧）", size: 22 })],
}));

// 每日作息
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 300, after: 100 },
  children: [new TextRun({ text: "⏰ 每日作息（6:30起床，7点开练）", bold: true, size: 30, color: ACCENT })],
}));
const routineRows = [
  new TableRow({
    children: [tc("时间", { header: true, width: 25 }), tc("内容", { header: true, width: 75 })],
    tableHeader: true,
  }),
  ...routine.map(r => new TableRow({
    children: [tc(r.time, { bold: true, color: ACCENT }), tc(r.activity)],
    cantSplit: true,
  })),
];
children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: routineRows }));

// 每天
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 100 },
  children: [new TextRun({ text: "💪 每日训练计划", bold: true, size: 30, color: ACCENT })],
}));

days.forEach(day => {
  dayTable(day.title, day.subtitle, day.exercises).forEach(p => children.push(p));
});

// 周末
children.push(new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 80 },
  children: [new TextRun({ text: "周末 · 休息", bold: true, size: 28, color: ACCENT })],
}));
children.push(new Paragraph({
  spacing: { after: 100 },
  children: [new TextRun({ text: "好好恢复，下周继续 💪", size: 22, color: GRAY, italics: true })],
}));

// 文档
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Microsoft YaHei", size: 22 },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 720, bottom: 720, left: 720, right: 720 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const outPath = "D:/project/fitness-app/健身训练方案.docx";
  fs.writeFileSync(outPath, buf);
  console.log("✅ 已生成:", outPath, "(", buf.length, "bytes)");
});
