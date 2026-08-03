/* ═══════════════════════════════════
   健身助手 App - 主应用逻辑 v2
   ═══════════════════════════════════ */

// ─── 全局状态 ───
const state = {
  currentTab: 'today',
  todayKey: getTodayKey(),
  dayOfWeek: getDayOfWeekCN(),
  workoutKey: getTodaysWorkoutKey(),
  timerSeconds: 60,
  timerRunning: false,
  timerInterval: null,
};

// ─── DOM 快捷引用 ───
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const content = () => $('.app-content');
const headerTitle = () => $('.app-header h1');

// ============================================
//  页面路由
// ============================================
function switchTab(tab) {
  state.currentTab = tab;
  $$('.tab-btn').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  renderPage();
}

function renderPage() {
  switch (state.currentTab) {
    case 'today':   renderToday(); break;
    case 'plan':    renderPlan(); break;
    case 'history': renderHistory(); break;
    case 'diet':    renderDiet(); break;
    case 'progress': renderProgress(); break;
    default: renderToday();
  }
}

// ============================================
//  TODAY - 今日训练
// ============================================
function renderToday() {
  headerTitle().textContent = '今日训练';
  const key = state.workoutKey;
  const todayLog = state.todayKey ? Storage.getWorkoutLog(state.todayKey) : null;

  // 周末休息
  if (!key || key === 'saturday' || key === 'sunday') {
    content().innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😴</div>
        <p>今天是休息日，好好恢复！</p>
        <p class="text-small text-muted mt-8">周末愉快，下周继续 💪</p>
        <div class="card mt-16" style="text-align:left">
          <div class="card-header"><span class="card-title">📋 下次训练预告</span></div>
          <div style="font-size:14px;color:var(--text2);line-height:1.7">${getNextWorkoutPreview()}</div>
        </div>
      </div>`;
    return;
  }

  const day = WORKOUT_PLAN[key];
  if (!day) {
    content().innerHTML = `<div class="empty-state"><p>暂无训练计划</p></div>`;
    return;
  }

  let html = `
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">${day.emoji || '🏋️'} ${day.title}</div>
          <div class="card-subtitle">${day.subtitle || ''}</div>
        </div>
        <span class="chip chip-accent">${DAY_NAMES_CN[key]}</span>
      </div>
    </div>`;

  // 已完成的提示
  const allExercisesDone = todayLog && todayLog.exercises &&
    day.exercises.every((_, i) => todayLog.exercises[i] && todayLog.exercises[i].completed);
  const cardioDone = todayLog && todayLog.cardioCompleted;

  if (allExercisesDone && cardioDone) {
    html += `
      <div class="card" style="text-align:center;border-color:var(--accent)">
        <div style="font-size:18px;color:var(--accent);font-weight:700">🎉 今日训练已完成！</div>
        ${todayLog && todayLog.rating ? `<div style="font-size:14px;color:var(--text2);margin-top:4px">评分：${'⭐'.repeat(todayLog.rating)}</div>` : ''}
      </div>`;
  }

  // 计时器
  html += `
    <div class="timer-bar" id="timerBar">
      <div class="timer-display" id="timerDisplay">${formatTimer(state.timerSeconds)}</div>
      <div class="timer-label">⏱ 组间休息</div>
      <button class="timer-btn" id="timerToggle">${state.timerRunning ? '⏸' : '▶'}</button>
    </div>`;

  // 动作列表
  day.exercises.forEach((ex, i) => {
    const completed = todayLog && todayLog.exercises && todayLog.exercises[i] && todayLog.exercises[i].completed;
    const setsData = (todayLog && todayLog.exercises && todayLog.exercises[i] && todayLog.exercises[i].sets) || [];
    const setsSummary = completed ? `${setsData.filter(s => s && s.completed).length}/${ex.sets}组` : '';

    html += `
      <div class="exercise-item ${completed ? 'completed' : ''}" data-exercise="${i}">
        <div class="ex-name">
          <span>${ex.name}</span>
          <span class="ex-status">${completed ? '✅' : '○'}</span>
        </div>
        <div class="ex-meta">
          <span>${ex.sets}组 × ${ex.repsMin}~${ex.repsMax}次</span>
          <span>休 ${ex.rest}</span>
          ${setsSummary ? `<span class="chip chip-accent">${setsSummary}</span>` : ''}
        </div>
        <div class="ex-note">💡 ${ex.note}</div>
      </div>`;
  });

  // 有氧
  if (day.cardio) {
    html += `
      <div class="exercise-item ${cardioDone ? 'completed' : ''}" data-cardio="1">
        <div class="ex-name">
          <span>🚴 有氧：${day.cardio.type || '有氧运动'}</span>
          <span class="ex-status">${cardioDone ? '✅' : '○'}</span>
        </div>
        <div class="ex-meta">
          <span>${day.cardio.duration || 20} 分钟</span>
          ${day.cardio.note ? `<span class="text-muted text-small">${day.cardio.note}</span>` : ''}
        </div>
      </div>`;
  }

  // 完成按钮 / 评分
  if (!allExercisesDone || !cardioDone) {
    html += `<button class="btn btn-primary btn-block mt-16" id="finishWorkout">🏁 完成训练</button>`;
  } else if (todayLog && !todayLog.rating) {
    html += `
      <div class="card text-center" id="ratingCard">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px">给今天的训练打个分吧！</div>
        <div class="rating-stars" id="ratingStars">
          ${[1,2,3,4,5].map(n => `<span data-rating="${n}">⭐</span>`).join('')}
        </div>
      </div>`;
  }

  html += `
    <div class="card" style="margin-top:16px">
      <div class="card-header"><span class="card-title">⏰ 每日作息</span></div>
      <div style="font-size:13px;color:var(--text2);line-height:1.8">
        <strong>6:00</strong> 起床 · 温水<br>
        <strong>6:10</strong> 练前轻食（半根香蕉/面包+黑咖啡）<br>
        <strong>6:30</strong> 🚶 出门去健身房<br>
        <strong>6:50</strong> 🏋️ 到健身房 · 热身<br>
        <strong>7:00~7:50</strong> 💪 力量训练<br>
        <strong>7:50~8:10</strong> 🚴 有氧 20min<br>
        <strong>8:10~8:25</strong> 🚿 洗澡换衣<br>
        <strong>8:27~8:30</strong> ✅ 到公司 · 打卡
      </div>
    </div>`;

  content().innerHTML = html;
  bindTodayEvents(day, todayLog);
}

function bindTodayEvents(day, todayLog) {
  // 点击动作打开记录
  content().querySelectorAll('.exercise-item').forEach(el => {
    el.addEventListener('click', () => {
      const exIdx = el.dataset.exercise;
      if (exIdx !== undefined) openLogSheet(parseInt(exIdx), day, todayLog);
      if (el.dataset.cardio) toggleCardio();
    });
  });

  // 计时器
  const toggle = document.getElementById('timerToggle');
  if (toggle) toggle.addEventListener('click', e => { e.stopPropagation(); toggleTimer(); });
  const bar = document.getElementById('timerBar');
  if (bar) bar.addEventListener('click', e => {
    if (e.target === bar || e.target.closest('.timer-display') || e.target.closest('.timer-label')) toggleTimer();
  });

  // 完成训练
  const finishBtn = document.getElementById('finishWorkout');
  if (finishBtn) finishBtn.addEventListener('click', completeWorkout);

  // 评分
  const stars = document.getElementById('ratingStars');
  if (stars) stars.querySelectorAll('span').forEach(el => {
    el.addEventListener('click', () => {
      const r = parseInt(el.dataset.rating);
      if (state.todayKey) {
        const log = Storage.getWorkoutLog(state.todayKey) || {};
        log.rating = r;
        Storage.saveWorkoutLog(state.todayKey, log);
        renderToday();
      }
    });
  });
}

// ─── 计时器 ───
function toggleTimer() {
  const display = document.getElementById('timerDisplay');
  const btn = document.getElementById('timerToggle');
  if (!display || !btn) return;

  if (state.timerRunning) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    btn.textContent = '▶';
    if (state.timerSeconds <= 0) state.timerSeconds = 60;
    display.textContent = formatTimer(state.timerSeconds);
  } else {
    if (state.timerSeconds <= 0) state.timerSeconds = 60;
    state.timerRunning = true;
    btn.textContent = '⏸';
    state.timerInterval = setInterval(() => {
      state.timerSeconds--;
      display.textContent = formatTimer(state.timerSeconds);
      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        state.timerRunning = false;
        btn.textContent = '▶';
        display.textContent = '00:00';
        if (navigator.vibrate) navigator.vibrate(200);
      }
    }, 1000);
  }
}

function formatTimer(s) {
  const m = Math.floor(Math.max(0, s) / 60);
  const sec = Math.max(0, s) % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ─── 训练记录弹窗 ───
function openLogSheet(exIdx, day, todayLog) {
  const ex = day.exercises[exIdx];
  const prevSets = (todayLog && todayLog.exercises && todayLog.exercises[exIdx] && todayLog.exercises[exIdx].sets) || [];

  let setsHtml = '';
  for (let s = 0; s < ex.sets; s++) {
    const prev = prevSets[s] || { reps: '', weight: '', completed: false };
    setsHtml += `
      <div class="set-row" data-set="${s}">
        <span class="set-num">${s + 1}</span>
        <button class="set-check ${prev.completed ? 'done' : ''}" data-set="${s}">${prev.completed ? '✓' : ''}</button>
        <div class="set-input-group">
          <input class="set-input" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="次" value="${prev.reps || ''}" data-field="reps" data-set="${s}">
          <span class="set-label">次</span>
          <input class="set-input" type="text" inputmode="decimal" placeholder="kg" value="${prev.weight || ''}" data-field="weight" data-set="${s}">
          <span class="set-label">kg</span>
        </div>
      </div>`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'log-sheet-overlay';
  overlay.innerHTML = `
    <div class="log-sheet">
      <div class="sheet-header">
        <h3>${ex.name}</h3>
        <button class="sheet-close" id="sheetClose">✕</button>
      </div>
      <div class="text-small text-muted mb-16">${ex.sets}组 × ${ex.repsMin}~${ex.repsMax}次 · 休${ex.rest}<br>💡 ${ex.note}</div>
      ${setsHtml}
      <div class="flex gap-8 mt-16">
        <button class="btn btn-outline flex-1" id="sheetCancel">取消</button>
        <button class="btn btn-primary flex-1" id="sheetSave">保存</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // 勾选事件
  overlay.querySelectorAll('.set-check').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.toggle('done');
      el.textContent = el.classList.contains('done') ? '✓' : '';
    });
  });

  overlay.querySelector('#sheetClose').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#sheetCancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#sheetSave').addEventListener('click', () => {
    saveExerciseLog(exIdx, day);
    overlay.remove();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function saveExerciseLog(exIdx, day) {
  const rows = document.querySelectorAll('.log-sheet .set-row');
  const sets = [];
  rows.forEach(row => {
    const s = parseInt(row.dataset.set);
    const completed = row.querySelector('.set-check').classList.contains('done');
    const reps = parseInt(row.querySelector('[data-field="reps"]').value) || 0;
    const weight = parseFloat(row.querySelector('[data-field="weight"]').value) || 0;
    sets[s] = { reps, weight, completed };
  });

  const todayKey = state.todayKey;
  if (!todayKey) return;

  let log = Storage.getWorkoutLog(todayKey) || {
    dayType: state.workoutKey,
    exercises: day.exercises.map(() => ({ completed: false, sets: [], note: '' })),
    cardioCompleted: false,
    rating: 0
  };

  log.exercises[exIdx] = {
    completed: sets.every(s => s && s.completed),
    sets: sets,
    note: ''
  };

  Storage.saveWorkoutLog(todayKey, log);
  renderToday();
}

function toggleCardio() {
  const todayKey = state.todayKey;
  if (!todayKey) return;
  const log = Storage.getWorkoutLog(todayKey) || {
    dayType: state.workoutKey,
    exercises: (WORKOUT_PLAN[state.workoutKey]?.exercises || []).map(() => ({ completed: false, sets: [], note: '' })),
    cardioCompleted: false,
    rating: 0
  };
  log.cardioCompleted = !log.cardioCompleted;
  Storage.saveWorkoutLog(todayKey, log);
  renderToday();
}

function completeWorkout() {
  const todayKey = state.todayKey;
  const day = state.workoutKey ? WORKOUT_PLAN[state.workoutKey] : null;
  if (!todayKey || !day) return;

  let log = Storage.getWorkoutLog(todayKey) || {
    dayType: state.workoutKey,
    exercises: day.exercises.map(() => ({ completed: false, sets: [], note: '' })),
    cardioCompleted: false,
    rating: 0
  };

  // 标记所有未完成的动作为完成（空组）
  if (log.exercises) {
    day.exercises.forEach((ex, i) => {
      if (!log.exercises[i] || !log.exercises[i].completed) {
        const existingSets = (log.exercises[i] && log.exercises[i].sets) || [];
        log.exercises[i] = {
          completed: true,
          sets: existingSets.length > 0 ? existingSets : Array.from({ length: ex.sets }, () => ({ reps: 0, weight: 0, completed: true })),
          note: ''
        };
      }
    });
  }

  log.cardioCompleted = true;
  Storage.saveWorkoutLog(todayKey, log);
  renderToday();
}

// ============================================
//  PLAN - 周计划总览
// ============================================
function renderPlan() {
  headerTitle().textContent = '训练计划';

  let html = `
    <div class="card">
      <div class="card-header"><span class="card-title">📅 五分化训练周计划</span></div>
      <div class="scroll-row">`;

  DAY_KEYS.forEach(key => {
    const day = WORKOUT_PLAN[key];
    const isToday = key === state.workoutKey;
    html += `
      <div class="chip-card ${isToday ? 'selected' : ''}" data-day="${key}">
        <div class="cc-emoji">${day.emoji || '🏋️'}</div>
        <div class="cc-day">${DAY_NAMES_CN[key]}</div>
        <div class="cc-title">${day.title}</div>
      </div>`;
  });

  html += `</div></div>`;

  // 每日详情
  DAY_KEYS.forEach(key => {
    const day = WORKOUT_PLAN[key];
    const isToday = key === state.workoutKey;
    html += `
      <div class="card" id="day-${key}">
        <div class="card-header">
          <div>
            <div class="card-title">${day.emoji || '🏋️'} ${day.title}</div>
            <div class="card-subtitle">${day.subtitle || ''}</div>
          </div>
          <span class="chip ${isToday ? 'chip-accent' : 'chip-blue'}">${DAY_NAMES_CN[key]}</span>
        </div>
        <div style="margin-top:8px">`;

    day.exercises.forEach(ex => {
      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:14px">
          <span>${ex.name}</span>
          <span class="text-small text-muted">${ex.sets}×${ex.repsMin}-${ex.repsMax}</span>
        </div>`;
    });

    if (day.cardio) {
      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:14px">
          <span>🚴 ${day.cardio.type || '有氧'}</span>
          <span class="text-small text-muted">${day.cardio.duration || 20}min</span>
        </div>`;
    }

    if (day.circuitNote) {
      html += `<div class="text-small text-muted mt-8">💡 ${day.circuitNote}</div>`;
    }

    html += `</div></div>`;
  });

  content().innerHTML = html;

  // 点击跳转到对应天
  content().querySelectorAll('.chip-card').forEach(el => {
    el.addEventListener('click', () => {
      const dayKey = el.dataset.day;
      document.getElementById('day-' + dayKey)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================
//  HISTORY - 训练历史
// ============================================
function renderHistory() {
  headerTitle().textContent = '训练记录';
  const logs = Storage.getWorkoutLogs();
  const dates = Object.keys(logs).sort().reverse();

  if (dates.length === 0) {
    content().innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <p>还没有训练记录</p>
        <p class="text-small text-muted mt-8">去「今日训练」开始记录吧！</p>
      </div>`;
    return;
  }

  // 统计
  const totalWorkouts = dates.length;
  const rated = dates.filter(d => logs[d].rating).length;
  const avgRating = rated > 0
    ? (dates.reduce((s, d) => s + (logs[d].rating || 0), 0) / rated).toFixed(1)
    : '-';
  const thisWeek = dates.filter(d => {
    const diff = (new Date() - new Date(d + 'T00:00:00')) / (1000 * 60 * 60 * 24);
    return diff < 7;
  }).length;

  let html = `
    <div class="card">
      <div class="card-header"><span class="card-title">📊 训练统计</span></div>
      <div style="display:flex;gap:16px;text-align:center">
        <div class="progress-stat flex-1"><div class="stat-value">${totalWorkouts}</div><div class="stat-label">总训练</div></div>
        <div class="progress-stat flex-1"><div class="stat-value">${avgRating}</div><div class="stat-label">均分</div></div>
        <div class="progress-stat flex-1"><div class="stat-value">${thisWeek}</div><div class="stat-label">本周</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">📋 历史记录</span></div>`;

  dates.forEach(dateKey => {
    const log = logs[dateKey];
    const dayInfo = WORKOUT_PLAN[log.dayType];
    const title = dayInfo ? dayInfo.title : '训练';
    const exCount = log.exercises ? log.exercises.filter(e => e && e.completed).length : 0;
    const totalEx = log.exercises ? log.exercises.length : (dayInfo ? dayInfo.exercises.length : 0);
    const rating = log.rating ? '⭐'.repeat(log.rating) : '';

    html += `
      <div class="history-item">
        <div class="history-date">${formatDateShort(dateKey)}</div>
        <div class="history-info">
          <div class="hi-title">${title}</div>
          <div class="hi-meta">${exCount}/${totalEx} 动作 · 有氧${log.cardioCompleted ? '✅' : '❌'} ${rating}</div>
        </div>
        <button class="history-del" data-date="${dateKey}">🗑</button>
      </div>`;
  });

  html += `</div>`;
  content().innerHTML = html;

  // 删除事件
  content().querySelectorAll('.history-del').forEach(el => {
    el.addEventListener('click', () => {
      const dateKey = el.dataset.date;
      if (confirm(`确定删除 ${dateKey} 的训练记录？`)) {
        Storage.deleteWorkoutLog(dateKey);
        renderHistory();
      }
    });
  });
}

// ============================================
//  DIET - 饮食指南 + 饮水
// ============================================
function renderDiet() {
  headerTitle().textContent = '饮食记录';
  const waterLog = state.todayKey ? (Storage.getWaterLogs()[state.todayKey] || { cups: 0 }) : { cups: 0 };
  const cups = waterLog.cups || 0;
  const todayKey = state.todayKey;
  const foodLogs = todayKey ? Storage.getFoodLogs()[todayKey] || [] : [];

  // 计算今日总热量
  const totalKcal = foodLogs.reduce((s, e) => s + (e.kcal || 0), 0);
  const kcalTarget = 2200;
  const kcalPercent = Math.min(totalKcal / kcalTarget * 100, 100);
  const isOver = totalKcal > kcalTarget;

  let html = `
    <div class="card">
      <div class="card-header"><span class="card-title">🎯 每日营养素目标</span></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div class="progress-stat flex-1"><div class="stat-value ${isOver ? 'text-orange' : 'text-accent'}">${totalKcal}</div><div class="stat-label">已摄入 kcal</div></div>
        <div class="progress-stat flex-1"><div class="stat-value">${kcalTarget}</div><div class="stat-label">目标 kcal</div></div>
        <div class="progress-stat flex-1"><div class="stat-value">≥140g</div><div class="stat-label">蛋白质</div></div>
      </div>
    </div>`;

  // ── 卡路里进度条 ──
  html += `
    <div class="card">
      <div class="flex justify-between items-center mb-8">
        <span class="text-small text-muted">热量进度</span>
        <span class="text-small ${isOver ? 'text-orange' : 'text-muted'}">${Math.round(kcalPercent)}%${isOver ? ' ⚠️ 超标' : ''}</span>
      </div>
      <div class="calorie-bar">
        <div class="${isOver ? 'cal-over' : 'cal-fill'}" style="width:${Math.min(kcalPercent, 100)}%"></div>
      </div>
    </div>`;

  // ── 拍照识别 ──
  html += `
    <input type="file" accept="image/*" id="cameraInput" style="display:none">
    <div class="card" id="cameraCard">
      <div class="card-header">
        <span class="card-title">📸 AI 拍照识别</span>
        <span class="chip chip-accent" id="cameraStatus">点此拍照</span>
      </div>
      <div id="cameraArea" style="text-align:center;padding:8px 0">
        <button class="btn btn-primary btn-block" id="btnTakePhoto">
          📸 拍一道菜
        </button>
        <div id="photoPreview" style="display:none;margin-top:8px"></div>
        <div id="recognitionResult" style="display:none;margin-top:8px"></div>
      </div>
    </div>`;

  // ── 食物快速添加 ──
  html += `<div class="card">
    <div class="card-header"><span class="card-title">🍽️ 快速添加食物</span></div>
    <div id="foodQuickAdd">`;

  FOOD_CATEGORIES.forEach(cat => {
    html += `
      <div class="food-category">
        <div class="cat-label">${cat.label}</div>
        <div class="food-chips">`;
    cat.foods.forEach(name => {
      const info = FOOD_DATABASE[name];
      if (info) {
        html += `<span class="food-chip" data-food="${name}" data-cat="${cat.id}">${name} <span class="fc-kcal">${info.kcal}kcal</span></span>`;
      }
    });
    html += `</div></div>`;
  });

  html += `</div></div>`;

  // ── 自定义添加 ──
  html += `
    <div class="card">
      <div class="card-header"><span class="card-title">✏️ 自定义食物</span></div>
      <div class="food-form">
        <input type="text" id="customFoodName" placeholder="食物名称" list="foodSuggestions">
        <datalist id="foodSuggestions">
          ${Object.keys(FOOD_DATABASE).map(n => `<option value="${n}">`).join('')}
        </datalist>
        <input type="number" id="customFoodKcal" placeholder="热量" min="0" style="width:56px">
        <span class="text-small text-muted">kcal/份</span>
        <input type="number" id="customFoodAmount" value="1" min="1" style="width:40px">
        <span class="text-small text-muted">份</span>
        <select id="customFoodMeal">
          <option value="breakfast">🌅 早餐</option>
          <option value="lunch">🌞 午餐</option>
          <option value="dinner">🌙 晚餐</option>
          <option value="snack">🍪 加餐</option>
        </select>
        <button class="btn btn-primary btn-sm" id="addCustomFood">添加</button>
      </div>
    </div>`;

  // ── 今日食物记录 ──
  html += `<div class="card">
    <div class="card-header">
      <span class="card-title">📝 今日食物记录</span>
      <span class="chip ${isOver ? 'chip-orange' : 'chip-accent'}">${totalKcal} / ${kcalTarget} kcal</span>
    </div>
    <div id="foodLogList">`;

  if (foodLogs.length === 0) {
    html += `<div class="text-center text-muted text-small" style="padding:16px 0">还没有记录，点上面的食物快速添加 🍽️</div>`;
  } else {
    foodLogs.forEach((entry, i) => {
      const mealEmoji = { breakfast: '🌅', lunch: '🌞', dinner: '🌙', snack: '🍪' }[entry.meal] || '🍽️';
      html += `
        <div class="food-log-item">
          <span class="fl-emoji">${mealEmoji}</span>
          <span class="fl-name">${entry.name} × ${entry.amount || 1}</span>
          <span class="fl-kcal">${entry.kcal} kcal</span>
          <button class="fl-del" data-index="${i}">✕</button>
        </div>`;
    });
  }

  html += `</div></div>`;

  // ── 三餐模板 ──
  html += `<div class="diet-section"><h3>🍽️ 三餐模板参考</h3>`;
  DIET_GUIDE.meals.forEach(meal => {
    html += `
      <div class="diet-meal">
        <div class="meal-name">${meal.name}</div>
        <div class="meal-items">${meal.items.join(' · ')}</div>
        <div class="meal-timing">⏰ ${meal.timing}</div>
      </div>`;
  });
  html += `</div>`;

  // ── 饮食纪律 ──
  html += `<div class="card">
    <div class="card-header"><span class="card-title">📋 饮食纪律</span></div>`;
  DIET_GUIDE.rules.forEach(rule => {
    html += `
      <div class="diet-rule">
        <span class="rule-icon">${rule.icon}</span>
        <span>${rule.text}</span>
      </div>`;
  });
  html += `</div>`;

  // ── 饮水 ──
  html += `
    <div class="card">
      <div class="card-header">
        <span class="card-title">💧 今日饮水</span>
        <span class="chip chip-accent">${cups}/8 杯</span>
      </div>
      <div class="water-tracker" id="waterTracker">`;

  for (let i = 0; i < 8; i++) {
    html += `<div class="water-cup ${i < cups ? 'filled' : ''}" data-cup="${i}">${i < cups ? '💧' : '🫗'}</div>`;
  }

  html += `</div>
      <div class="flex gap-8 mt-8">
        <button class="btn btn-ghost btn-sm" id="waterAdd">+1 杯</button>
        <button class="btn btn-outline btn-sm" id="waterReset">重置</button>
      </div>
    </div>`;

  content().innerHTML = html;

  // ── 绑定事件 ──

  // 食物快速添加
  content().querySelectorAll('.food-chip').forEach(el => {
    el.addEventListener('click', () => {
      if (!todayKey) return;
      const name = el.dataset.food;
      const cat = el.dataset.cat;
      const info = FOOD_DATABASE[name];
      if (!info) return;
      Storage.saveFoodEntry(todayKey, {
        name: name,
        kcal: info.kcal,
        amount: 1,
        meal: cat,
        unit: info.unit
      });
      // 微震动反馈
      if (navigator.vibrate) navigator.vibrate(10);
      renderDiet();
    });
  });

  // 自定义食物
  document.getElementById('addCustomFood')?.addEventListener('click', () => {
    if (!todayKey) return;
    const name = document.getElementById('customFoodName').value.trim();
    const kcal = parseInt(document.getElementById('customFoodKcal').value);
    const amount = parseInt(document.getElementById('customFoodAmount').value) || 1;
    const meal = document.getElementById('customFoodMeal').value;
    if (!name || !kcal || isNaN(kcal)) return;
    Storage.saveFoodEntry(todayKey, { name, kcal: kcal * amount, amount, meal, unit: '份' });
    document.getElementById('customFoodName').value = '';
    document.getElementById('customFoodKcal').value = '';
    renderDiet();
  });

  // 食物删除
  content().querySelectorAll('.fl-del').forEach(el => {
    el.addEventListener('click', () => {
      if (!todayKey) return;
      const idx = parseInt(el.dataset.index);
      Storage.deleteFoodEntry(todayKey, idx);
      renderDiet();
    });
  });

  // 饮水事件
  content().querySelectorAll('.water-cup').forEach(el => {
    el.addEventListener('click', () => {
      const cup = parseInt(el.dataset.cup);
      saveWater(cup < cups ? cup : cup + 1);
    });
  });
  document.getElementById('waterAdd')?.addEventListener('click', () => saveWater(Math.min(cups + 1, 8)));
  document.getElementById('waterReset')?.addEventListener('click', () => saveWater(0));

  // ── 拍照识别事件 ──
  const btnPhoto = document.getElementById('btnTakePhoto');
  const cameraInput = document.getElementById('cameraInput');
  const camStatus = document.getElementById('cameraStatus');
  const preview = document.getElementById('photoPreview');
  const resultDiv = document.getElementById('recognitionResult');

  if (btnPhoto && cameraInput) {
    btnPhoto.addEventListener('click', () => cameraInput.click());

    cameraInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      preview.style.display = 'block';
      resultDiv.style.display = 'none';

      // ── 压缩图片（800px宽，速度提升10倍） ──
      const img = await createImageBitmap(file);
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
      img.close();

      if (camStatus) camStatus.textContent = '🤖 识别中...';

      preview.innerHTML = `<img src="data:image/jpeg;base64,${compressedBase64}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:8px">`;
      preview.innerHTML += `<div class="recognition-loading"><div class="spin">🔍</div><div style="margin-top:4px">AI 识别中...</div></div>`;

      try {
        // 菜品识别 - 内嵌百度 Token（30天有效），直调菜品 API（CORS: * ✅）
        const dishResp = await fetch(
          'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=' + '24.29e5ef16ab7b8e9b1c9a0539954e02b9.2592000.1788350269.282335-124069681',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ image: compressedBase64, top_num: '3' }).toString(),
            signal: AbortSignal.timeout(15000)
          }
        );
        if (!dishResp.ok) throw new Error('百度状态码: ' + dishResp.status);
        const dishData = await dishResp.json();
        preview.querySelector('.recognition-loading')?.remove();
        if (dishData.error_msg) {
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = '<div class="text-small text-red" style="padding:12px;background:var(--bg2);border-radius:8px">\u274c ' + dishData.error_msg + '</div><button class="btn btn-ghost btn-sm mt-8" id="retryBtn">\ud83d\udd04 \u91cd\u65b0\u62cd\u7167</button>';
          if (camStatus) camStatus.textContent = '\u274c \u8bc6\u522b\u5931\u8d25';
          document.getElementById('retryBtn')?.addEventListener('click', () => { cameraInput.click(); });
          return;
        }
        if (dishData.result && dishData.result.length > 0) {
          const dishes = dishData.result.slice(0, 3).map(d => ({
            name: d.name,
            calorie: d.calorie ? parseFloat(d.calorie) : null,
            probability: Math.round((d.probability || 0) * 1000) / 10
          }));
          if (typeof showRecognitionResult === 'function') showRecognitionResult(dishes);
          if (camStatus) camStatus.textContent = '\u2705 \u5df2\u8bc6\u522b';
        } else {
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = '<div class="text-muted" style="padding:12px;background:var(--bg2);border-radius:8px;text-align:center"><div style="font-size:24px;margin-bottom:4px">\ud83e\udd37</div><div>\u6ca1\u8ba4\u51fa\u6765\uff0c\u8bd5\u8bd5\u6362\u4e2a\u89d2\u5ea6</div><button class="btn btn-ghost btn-sm mt-8" id="retryBtn">\ud83d\udd04 \u91cd\u65b0\u62cd\u7167</button></div>';
          if (camStatus) camStatus.textContent = '\u274c \u672a\u8bc6\u522b';
          document.getElementById('retryBtn')?.addEventListener('click', () => { cameraInput.click(); });
        }
      } catch (err) {
        preview.querySelector('.recognition-loading')?.remove();
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div class="text-small text-red" style="padding:12px;background:var(--bg2);border-radius:8px">\u26a0\ufe0f ' + err.message + '<button class="btn btn-ghost btn-sm mt-8 btn-block" id="retryBtn">\ud83d\udd04 \u91cd\u65b0\u62cd\u7167</button></div>';
        if (camStatus) camStatus.textContent = '\u26a0\ufe0f \u5931\u8d25';
        document.getElementById('retryBtn')?.addEventListener('click', () => { cameraInput.click(); });
      } catch (err) {
        preview.querySelector('.recognition-loading')?.remove();
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="text-small text-red" style="padding:12px;background:var(--bg2);border-radius:8px">
          ⚠️ 连接超时，检查服务器是否在运行
          <button class="btn btn-ghost btn-sm mt-8 btn-block" id="retryBtn">🔄 重新拍照</button>
        </div>`;
        if (camStatus) camStatus.textContent = '⚠️ 连接失败';
        document.getElementById('retryBtn')?.addEventListener('click', () => { cameraInput.click(); });
      }
      e.target.value = '';
    });
  }
}

// ─── AI 识别结果展示 ───
function showRecognitionResult(dishes) {
  const resultDiv = document.getElementById('recognitionResult');
  const preview = document.getElementById('photoPreview');
  resultDiv.style.display = 'block';
  if (!state.todayKey) return;

  let html = `<div style="background:var(--bg2);border-radius:var(--radius-sm);padding:12px">`;
  html += `<div style="font-size:14px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:8px">
    <span>🤖 识别结果</span>
    <span class="chip chip-accent">点选确认</span>
  </div>`;

  // 如果有热量数据从数据库补上了
  const hasCalFromDb = dishes.some(d => d.from_db);

  dishes.forEach((d, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
    const cal = d.calorie ? `${d.calorie} kcal` : '❓ 未知';
    const isSelected = i === 0 ? 'style="border:2px solid var(--accent);border-radius:8px"' : '';

    html += `
      <div class="food-log-item dish-option" data-index="${i}" ${isSelected}>
        <span style="font-size:18px;width:28px;text-align:center">${medal}</span>
        <span class="fl-name"><strong>${d.name}</strong> <span class="text-small text-muted">${d.probability}%</span></span>
        <span class="fl-kcal">${cal}</span>
      </div>`;
  });

  if (hasCalFromDb) {
    html += `<div class="text-small text-muted" style="margin-top:4px">💡 热量数据来自我们的食物库</div>`;
  }

  html += `
    <div class="flex gap-8 mt-8">
      <button class="btn btn-ghost flex-1 btn-sm" id="cancelRecognition">取消</button>
      <button class="btn btn-primary flex-1 btn-sm" id="confirmRecognized">✅ 记录选中项</button>
    </div>
  </div>`;

  resultDiv.innerHTML = html;

  // 选项切换
  let selectedIdx = 0;
  resultDiv.querySelectorAll('.dish-option').forEach(el => {
    el.addEventListener('click', () => {
      resultDiv.querySelectorAll('.dish-option').forEach(item => {
        item.style.border = 'none';
        item.style.borderRadius = '0';
      });
      el.style.border = '2px solid var(--accent)';
      el.style.borderRadius = '8px';
      selectedIdx = parseInt(el.dataset.index);
    });
  });

  // 确认
  document.getElementById('confirmRecognized')?.addEventListener('click', () => {
    const dish = dishes[selectedIdx];
    if (!dish) return;
    const kcal = dish.calorie || 0;
    if (!kcal) {
      alert('该菜品没有热量数据，请手动输入');
      return;
    }
    Storage.saveFoodEntry(state.todayKey, {
      name: dish.name,
      kcal: kcal,
      amount: 1,
      meal: 'lunch',
      unit: '份'
    });
    // 重置 UI
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('recognitionResult').style.display = 'none';
    document.getElementById('cameraStatus').textContent = '✅ 已记录';
    if (navigator.vibrate) navigator.vibrate(15);
    renderDiet();
  });

  // 取消 → 重置 UI，可以重新拍照
  document.getElementById('cancelRecognition')?.addEventListener('click', () => {
    resultDiv.style.display = 'none';
    document.getElementById('photoPreview').style.display = 'none';
    const st = document.getElementById('cameraStatus');
    if (st) st.textContent = '📸 点此拍照';
  });

  // 重试按钮（失败后重新拍照）
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      resultDiv.style.display = 'none';
      document.getElementById('photoPreview').style.display = 'none';
      const st = document.getElementById('cameraStatus');
      if (st) st.textContent = '📸 点此拍照';
      document.getElementById('cameraInput')?.click();
    });
  }
}

function saveWater(cups) {
  if (!state.todayKey) return;
  Storage.saveWaterLog(state.todayKey, cups);
  renderDiet();
}

// ============================================
//  PROGRESS - 身体数据追踪
// ============================================
function renderProgress() {
  headerTitle().textContent = '身体数据';
  const settings = Storage.getSettings();
  const bodyLogs = Storage.getBodyLogs();
  const dates = Object.keys(bodyLogs).sort();
  const latest = dates.length > 0 ? bodyLogs[dates[dates.length - 1]] : null;

  let html = `
    <div class="card">
      <div class="card-header"><span class="card-title">📏 当前数据</span></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div class="progress-stat flex-1"><div class="stat-value">${settings.bodyHeight}</div><div class="stat-label">身高 cm</div></div>
        <div class="progress-stat flex-1"><div class="stat-value ${latest ? 'text-accent' : ''}">${latest ? latest.weight : settings.bodyWeight}</div><div class="stat-label">最新体重 kg</div></div>
        <div class="progress-stat flex-1"><div class="stat-value">${latest ? (latest.weight - settings.bodyWeight > 0 ? '+' : '') + (latest.weight - settings.bodyWeight).toFixed(1) : '-'}</div><div class="stat-label">变化 kg</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">✏️ 记录身体数据</span></div>
      <div class="flex gap-8 items-center">
        <input type="number" step="0.1" id="weightInput" placeholder="体重" value="${latest ? latest.weight : ''}" style="background:var(--bg);border:1px solid var(--card-border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:14px;font-family:inherit;outline:none;width:100px;text-align:center">
        <span class="text-small text-muted">kg</span>
        <input type="number" step="0.1" id="waistInput" placeholder="腰围" value="${latest && latest.waist ? latest.waist : ''}" style="background:var(--bg);border:1px solid var(--card-border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:14px;font-family:inherit;outline:none;width:100px;text-align:center">
        <span class="text-small text-muted">cm</span>
        <button class="btn btn-primary btn-sm" id="saveBodyLog">保存</button>
      </div>
    </div>`;

  // 历史记录
  if (dates.length > 0) {
    html += `<div class="card">
      <div class="card-header"><span class="card-title">📈 历史记录</span></div>`;
    const recentDates = dates.slice().reverse();
    recentDates.forEach(d => {
      const entry = bodyLogs[d];
      const change = dates.indexOf(d) > 0
        ? ((entry.weight - bodyLogs[dates[dates.indexOf(d) - 1]].weight) > 0 ? '+' : '') + (entry.weight - bodyLogs[dates[dates.indexOf(d) - 1]].weight).toFixed(1)
        : '-';
      html += `
        <div class="history-item">
          <div class="history-date">${formatDateShort(d)}</div>
          <div class="history-info">
            <div class="hi-title">${entry.weight} kg</div>
            <div class="hi-meta">${entry.waist ? '腰围 ' + entry.waist + 'cm' : ''} ${change !== '-' ? '变化 ' + change + 'kg' : ''}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
  }

  // 提示
  html += `
    <div class="card">
      <div class="card-header"><span class="card-title">💡 进度提示</span></div>
      <div class="text-small text-muted" style="line-height:1.7">
        • 每周末早上空腹称重一次即可，不用天天称<br>
        • 体重波动 0.5~1kg 正常，看趋势不看单日<br>
        • 健康减脂速度：每周 0.3~0.5kg<br>
        • 配合腰围测量更能反映真实变化
      </div>
    </div>`;

  content().innerHTML = html;

  document.getElementById('saveBodyLog')?.addEventListener('click', () => {
    const w = parseFloat(document.getElementById('weightInput').value);
    const waist = parseFloat(document.getElementById('waistInput').value) || 0;
    if (!w || isNaN(w)) return;
    if (!state.todayKey) return;
    Storage.saveBodyLog(state.todayKey, { weight: w, waist: waist > 0 ? waist : null });
    renderProgress();
  });
}

// ============================================
//  辅助函数
// ============================================
function getNextWorkoutPreview() {
  const today = new Date().getDay();
  if (today === 0 || today === 6) {
    // 周末 -> 周一
    const day = WORKOUT_PLAN.monday;
    return `${day.emoji || '🏋️'} 周一 · ${day.title}<br>${day.subtitle || ''}`;
  }
  const key = DAY_KEYS[today - 1]; // 0=Mon
  const nextIdx = DAY_KEYS.indexOf(key) + 1;
  if (nextIdx < DAY_KEYS.length) {
    const day = WORKOUT_PLAN[DAY_KEYS[nextIdx]];
    return `${day.emoji || '🏋️'} ${DAY_NAMES_CN[DAY_KEYS[nextIdx]]} · ${day.title}<br>${day.subtitle || ''}`;
  }
  return '周五训练完，周末休息！';
}

// ============================================
//  初始化
// ============================================
function initApp() {
  // 注册 Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  // Tab 事件
  $$('.tab-btn').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.tab));
  });

  // 首页渲染
  renderPage();

  // 午夜刷新
  const now = new Date();
  const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
  setTimeout(() => {
    state.todayKey = getTodayKey();
    state.dayOfWeek = getDayOfWeekCN();
    state.workoutKey = getTodaysWorkoutKey();
    if (state.currentTab === 'today') renderToday();
  }, msToMidnight + 1000);
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => { initApp(); renderPage(); })
  : (() => { initApp(); renderPage(); })();