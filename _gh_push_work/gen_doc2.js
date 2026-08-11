const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, ShadingType } = require("docx");
const fs = require("fs");

const ACCENT = "00D4AA";
const GRAY = "6B6B80";

const noBorder = { style: "none", size: 0, color: "FFFFFF" };
const cellBorder = { style: "single", size: 1, color: "333344" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function tc(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      spacing: { before: 30, after: 30 },
      children: [new TextRun({ text, bold: opts.header || opts.bold, size: opts.header ? 20 : 18, color: opts.header ? "FFFFFF" : (opts.color || "FFFFFF") })]
    })],
    shading: opts.header ? { type: ShadingType.CLEAR, fill: ACCENT } : undefined,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    borders,
  });
}

function dayTable(title, subtitle, exercises) {
  const rows = [
    new TableRow({ children: [tc("动作", { header: true, width: 32 }), tc("组×次", { header: true, width: 14, align: AlignmentType.CENTER }), tc("休", { header: true, width: 10, align: AlignmentType.CENTER }), tc("时间", { header: true, width: 10, align: AlignmentType.CENTER }), tc("要领", { header: true, width: 34 })], tableHeader: true }),
    ...exercises.map(ex => new TableRow({ children: [tc(ex.name, { bold: true }), tc(ex.rep, { align: AlignmentType.CENTER, color: ACCENT }), tc(ex.rest, { align: AlignmentType.CENTER }), tc(ex.time, { align: AlignmentType.CENTER, color: ACCENT }), tc(ex.note, { color: GRAY })], cantSplit: true })),
    new TableRow({ children: [tc("合计", { bold: true, color: ACCENT }), tc("", {}), tc("", {}), tc(exercises[exercises.length-1].total, { bold: true, color: ACCENT, align: AlignmentType.CENTER }), tc("✅ 可在1小时内完成", { color: ACCENT })], cantSplit: true }),
  ];
  return [
    new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 60 }, children: [new TextRun({ text: title, bold: true, size: 26, color: ACCENT })] }),
    new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: subtitle, size: 20, color: GRAY, italics: true })] }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
  ];
}

const days = [
  {
    title: "周一 · 拉（背阔肌宽度）",
    subtitle: "背阔肌 + 后束 · 全程沉肩不耸肩",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", time: "3min", note: "激活下斜方+肩袖" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", time: "3min", note: "趴地面做Y→T→W→L" },
      { name: "宽握高位下拉", rep: "4×8~12", rest: "60s", time: "7min", note: "拉到锁骨位，肘朝下夹" },
      { name: "坐姿绳索划船（宽握把）", rep: "4×10~12", rest: "60s", time: "7min", note: "背阔肌中下部，肩胛后收" },
      { name: "哑铃单臂划船", rep: "3×10~12", rest: "60s", time: "5min", note: "每侧单做，空手扶凳" },
      { name: "面拉 Face Pull（正式）", rep: "3×15", rest: "45s", time: "5min", note: "后束+肩袖，改善圆肩富贵包" },
      { name: "山羊挺身", rep: "3×12", rest: "45s", time: "4min", note: "下背竖脊肌，腰不过度伸展" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", time: "2min", note: "耳朵靠肩→转头看腋下→换侧" },
    ].map(e => ({ ...e, total: "36min" })),
  },
  {
    title: "周二 · 推（胸+前中束）",
    subtitle: "胸大肌 + 三角肌前中束 + 三头",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", time: "3min", note: "推胸前必做" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", time: "3min", note: "强化下斜方" },
      { name: "蝴蝶机夹胸", rep: "4×10~15", rest: "60s", time: "7min", note: "胸部主力动作，肩胛后收，不耸肩" },
      { name: "扶高俯卧撑", rep: "3×8~15", rest: "60s", time: "5min", note: "胸推动作补位，降低肩部压力" },
      { name: "哑铃飞鸟（平板）", rep: "3×12~15", rest: "45s", time: "5min", note: "胸中缝，替代坐姿推胸" },
      { name: "哑铃侧平举", rep: "3×12~15", rest: "45s", time: "5min", note: "中束，沉肩做不借力" },
      { name: "绳索下压（三头）", rep: "3×12~15", rest: "45s", time: "5min", note: "三头收尾，肘夹紧" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", time: "2min", note: "每天必做" },
    ].map(e => ({ ...e, total: "35min" })),
  },
  {
    title: "周三 · 腿（居家版·护滑膜炎）",
    subtitle: "全坐姿/卧姿，零足压，无需器械",
    exercises: [
      { name: "坐姿椅子起立（代替腿举）", rep: "4×12~15", rest: "90s", time: "8min", note: "慢起3秒→慢坐3秒，抱水桶负重" },
      { name: "坐姿徒手伸腿（代替腿屈伸）", rep: "3×15", rest: "60s", time: "5min", note: "单腿伸直到水平停1秒慢放" },
      { name: "俯卧屈膝勾腿（代替腿弯举）", rep: "3×15", rest: "60s", time: "5min", note: "趴垫子小腿弯向臀部，顶峰收缩" },
      { name: "平板支撑", rep: "4×30~45s", rest: "30s", time: "5min", note: "臀不抬不塌腰" },
      { name: "仰卧抬腿", rep: "3×15", rest: "45s", time: "4min", note: "下腹发力，腰贴地，腿慢起慢落" },
    ].map(e => ({ ...e, total: "27min" })),
  },
  {
    title: "周四 · 肩+下斜方强化",
    subtitle: "弱化上斜方 · 沉肩训练为主",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", time: "3min", note: "激活下斜方+肩袖" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", time: "3min", note: "趴地面做" },
      { name: "哑铃推举（坐姿·轻重量）", rep: "3×12~15", rest: "60s", time: "5min", note: "不耸肩！肩胛下沉，宁可轻" },
      { name: "哑铃侧平举（坐姿）", rep: "4×12~15", rest: "45s", time: "6min", note: "中束，肘微弯领先小臂" },
      { name: "面拉（正式·高次数）", rep: "4×15~20", rest: "45s", time: "6min", note: "下斜方核心动作，改善圆肩富贵包" },
      { name: "反向飞鸟（坐姿·哑铃）", rep: "3×12~15", rest: "45s", time: "5min", note: "后束，俯身45度，沉肩发力" },
      { name: "杠铃弯举（二头）", rep: "3×10~12", rest: "60s", time: "5min", note: "肘夹紧不动" },
      { name: "绳索下压（三头）", rep: "3×12~15", rest: "45s", time: "5min", note: "三头收尾" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", time: "2min", note: "每天必做" },
    ].map(e => ({ ...e, total: "40min" })),
  },
  {
    title: "周五 · 球赛日（轻训+实战）",
    subtitle: "早上轻量激活，下午球赛 = 有氧+耐力",
    exercises: [
      { name: "面拉 Face Pull（热身）", rep: "2×15", rest: "30s", time: "3min", note: "肩袖预热防受伤" },
      { name: "Y-T-W-L 伸展（热身）", rep: "2×8~10", rest: "30s", time: "3min", note: "激活下斜方" },
      { name: "哑铃推举（坐姿）", rep: "3×8~10", rest: "60s", time: "5min", note: "肩部激活，不用力竭" },
      { name: "哑铃侧平举", rep: "3×10~12", rest: "45s", time: "4min", note: "中束激活" },
      { name: "农夫行走", rep: "2×30~40s", rest: "-", time: "3min", note: "提重物走，握力+核心" },
      { name: "上斜方拉伸（收尾）", rep: "2×20s", rest: "-", time: "2min", note: "每天必做" },
    ].map(e => ({ ...e, total: "20min" })),
  },
];

const routine = [
  { time: "6:30", act: "起床 · 温水" },
  { time: "6:40", act: "练前轻食（半根香蕉/面包+黑咖啡）" },
  { time: "6:50", act: "出门去健身房" },
  { time: "7:00", act: "热身（面拉+Y-T-W-L）" },
  { time: "7:00~7:50", act: "力量训练（每动作含组间休息+换项）" },
  { time: "7:50~8:15", act: "拉伸收尾（上斜方拉伸）" },
  { time: "8:15~8:25", act: "洗澡换衣" },
  { time: "8:30", act: "出门去公司" },
];

const children = [];

// Title
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 60 }, children: [new TextRun({ text: "健身助手 · 五分化训练方案", bold: true, size: 36, color: ACCENT })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "弱化斜方肌 · 改善富贵包 · 增强肩背 · 耐力燃脂 · 护足", size: 20, color: GRAY })] }));

// Training goals
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 60 }, children: [new TextRun({ text: "训练目标与约束", bold: true, size: 26, color: ACCENT })] }));
["弱化斜方肌（每天面拉+Y-T-W-L激活下斜方）","改善下巴前伸/富贵包（收下巴+面拉+后束）","增强肩背力量（背阔肌+三角肌+核心）","耐力+燃脂（高次数短间歇+周五球赛）","双脚滑膜炎规避（腿日全坐姿/卧姿，零足压）","无坐姿推胸器械（用哑铃飞鸟替代）","无椭圆机（去掉所有椭圆机有氧）"].forEach(g => children.push(new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: "✅ " + g, size: 20 })] })));

// Trap strategy
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 60 }, children: [new TextRun({ text: "斜方肌弱化策略（每天统一）", bold: true, size: 26, color: ACCENT })] }));
["热身：面拉 2×15 + Y-T-W-L伸展 2×8（激活下斜方）","原则：所有动作全程沉肩，不耸肩借力","收尾：上斜方拉伸 2×20秒（耳朵靠肩→转头看腋下→换侧）"].forEach(s => children.push(new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: s, size: 20 })] })));

// Routine
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 60 }, children: [new TextRun({ text: "每日作息（6:30起床，7点开练）", bold: true, size: 26, color: ACCENT })] }));
children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
  new TableRow({ children: [tc("时间", { header: true, width: 20 }), tc("内容", { header: true, width: 80 })], tableHeader: true }),
  ...routine.map(r => new TableRow({ children: [tc(r.time, { bold: true, color: ACCENT }), tc(r.act)], cantSplit: true })),
] }));

// Time explain
children.push(new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun({ text: "时间计算说明：每组动作耗时 = 完成组数 ×（完成时间 + 休息时间）。热身/收尾每组约30s~60s。所有训练日均可在一小时内完成。", size: 18, color: GRAY })] }));

// Each day
days.forEach(d => dayTable(d.title, d.subtitle, d.exercises).forEach(p => children.push(p)));

// Weekend
children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 60 }, children: [new TextRun({ text: "周末 · 休息", bold: true, size: 26, color: ACCENT })] }));
children.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "好好恢复，下周继续 💪", size: 20, color: GRAY, italics: true })] }));

const doc = new Document({
  styles: { default: { document: { run: { font: "Microsoft YaHei", size: 20 }, paragraph: { spacing: { line: 312 } } } } },
  sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("D:/project/fitness-app/健身训练方案.docx", buf);
  console.log("✅ 已更新:", buf.length, "bytes");
});
