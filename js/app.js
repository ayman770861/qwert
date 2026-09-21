/* المزارع شايف — 2.5D بالعرض، توسّع تدريجي، أنيميشن */
(() => {
  const SAVE_KEY = "al-muzare-shayef-v1";
  const MW = 36, MH = 30, TW = 70, TH = 35, DEPTH = 10;
  const PLOTX = 12, PLOTY = 10;
  const Y0 = { x0: 4, x1: 18, y0: 4, y1: 16 };
  const TRUCK = { x: 9.4, y: 12.3 };
  const DROP = { x: 5.4, y: 14.2 };

  const CROPS = {
    wheat: { id: "wheat", name: "قمح", emoji: "🌾", seed: 3, sell: 7, xp: 3, grow: 9000, lv: 1, color: "#e8c547" },
    carrot: { id: "carrot", name: "جزر", emoji: "🥕", seed: 5, sell: 12, xp: 4, grow: 12000, lv: 1, color: "#e67e22" },
    lettuce: { id: "lettuce", name: "خس", emoji: "🥬", seed: 7, sell: 16, xp: 5, grow: 14000, lv: 2, color: "#7cb342" },
    tomato: { id: "tomato", name: "طماطم", emoji: "🍅", seed: 9, sell: 22, xp: 6, grow: 17000, lv: 2, color: "#e53935" },
    corn: { id: "corn", name: "ذرة", emoji: "🌽", seed: 14, sell: 34, xp: 8, grow: 23000, lv: 3, color: "#fdd835" },
    strawberry: { id: "strawberry", name: "فراولة", emoji: "🍓", seed: 20, sell: 50, xp: 12, grow: 28000, lv: 4, color: "#ec407a" },
    sunflower: { id: "sunflower", name: "عباد الشمس", emoji: "🌻", seed: 26, sell: 68, xp: 15, grow: 33000, lv: 5, color: "#ffb300" },
    grapes: { id: "grapes", name: "عنب", emoji: "🍇", seed: 36, sell: 95, xp: 20, grow: 40000, lv: 6, color: "#8e24aa" },
    pomegranate: { id: "pomegranate", name: "رمان", emoji: "🍒", seed: 48, sell: 130, xp: 26, grow: 48000, lv: 7, color: "#c62828" },
    coffee: { id: "coffee", name: "بن يمني", emoji: "☕", seed: 70, sell: 195, xp: 40, grow: 58000, lv: 8, color: "#6d4c41" },
    watermelon: { id: "watermelon", name: "بطيخ", emoji: "🍉", seed: 90, sell: 255, xp: 45, grow: 70000, lv: 9, color: "#43a047" },
    dates: { id: "dates", name: "تمر", emoji: "🌴", seed: 120, sell: 345, xp: 55, grow: 85000, lv: 10, color: "#8d6e63" },
    roses: { id: "roses", name: "ورد بلدي", emoji: "🌹", seed: 100, sell: 290, xp: 50, grow: 50000, lv: 12, color: "#d81b60" },
  };
  const ANIMALS = {
    chicken: { id: "chicken", name: "دجاجة", emoji: "🐔", product: "🥚", productName: "بيض", cost: 180, lv: 4, interval: 35000, sell: 14, xp: 4, max: 2, need: "coop" },
    cow: { id: "cow", name: "بقرة", emoji: "🐄", product: "🥛", productName: "حليب", cost: 550, lv: 7, interval: 60000, sell: 38, xp: 8, max: 1, need: "cowpen" },
    goat: { id: "goat", name: "ماعز", emoji: "🐐", product: "🧀", productName: "جبن", cost: 1100, lv: 10, interval: 80000, sell: 65, xp: 12, max: 1, need: "goatpen" },
  };
  const SITES = [
    { id: "well", name: "البئر", x: 10, y: 8, w: 1, h: 1, lv: 2, cost: 90 },
    { id: "shop", name: "كشك السوق", x: 20, y: 6, w: 2, h: 2, lv: 3, cost: 200 },
    { id: "coop", name: "بيت البيض", x: 6, y: 18, w: 3, h: 2, lv: 4, cost: 220 },
    { id: "barn", name: "المخبز", x: 21, y: 12, w: 3, h: 2, lv: 5, cost: 340 },
    { id: "cowpen", name: "مصنع الحليب", x: 12, y: 19, w: 3, h: 2, lv: 7, cost: 520 },
    { id: "goatpen", name: "مصنع الجبن", x: 17, y: 19, w: 2, h: 2, lv: 9, cost: 460 },
  ];
  const PLOT_POS = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) PLOT_POS.push({ x: PLOTX + c, y: PLOTY + r });

  const STORY = [
    { id: "p1", title: "البذرة الأولى", desc: "ازرع في الحقل الصغير جنب البيت", check: (s) => s.stats.planted >= 1, reward: { coins: 12, xp: 6 } },
    { id: "h1", title: "أول حصاد", desc: "احصد 3 محاصيل", check: (s) => s.stats.harvested >= 3, reward: { coins: 18, seeds: { wheat: 2 } } },
    { id: "s1", title: "صندوق البيت", desc: "ادخل البيت وبِع محصولاً من الصندوق", check: (s) => s.stats.sold >= 1, reward: { coins: 20, gems: 1 } },
    { id: "cut", title: "شقّ الغابة", desc: "اقطع شجرة أو أزل صخرة على حدود الأرض", check: (s) => Object.keys(s.cleared || {}).length >= 1, reward: { coins: 30, xp: 12 } },
    { id: "l2", title: "مزارع ناشئ", desc: "اوصل للمستوى 2 وابنِ البئر", check: (s) => s.built.well, reward: { coins: 35, xp: 10 } },
    { id: "shop", title: "فتح السوق", desc: "ابنِ كشك السوق", check: (s) => s.built.shop, reward: { coins: 40, gems: 1 } },
    { id: "h12", title: "حصاد وفير", desc: "احصد 12 محصولاً", check: (s) => s.stats.harvested >= 12, reward: { coins: 40, gems: 1 } },
    { id: "coop", title: "بيت البيض", desc: "ابنِ بيت البيض واشترِ دجاجة", check: (s) => s.animals.chicken.owned >= 1, reward: { coins: 50, xp: 20 } },
    { id: "l5", title: "المخبز", desc: "ابنِ المخبز", check: (s) => s.built.barn, reward: { coins: 70, gems: 2 } },
    { id: "cof", title: "كنز اليمن", desc: "ازرع البن اليمني", check: (s) => (s.stats.plantedIds.coffee || 0) >= 1, reward: { coins: 120, gems: 3 } },
    { id: "del", title: "أول توصيلة", desc: "حمّل محصولاً في السيارة وسلّمه عند نقطة التوصيل", check: (s) => (s.stats.delivered || 0) >= 1, reward: { coins: 50, gems: 1 } },
    { id: "big", title: "أرض واسعة", desc: "افتح 20 خانة من الغابة", check: (s) => Object.keys(s.cleared || {}).length >= 20, reward: { coins: 120, gems: 2 } },
    { id: "pro", title: "المزارع المحترف", desc: "اوصل للمستوى 10", check: (s) => s.level >= 10, reward: { coins: 200, gems: 5 } },
  ];
  const ACHIEVEMENTS = [
    { id: "first", title: "أول سنبلة", desc: "احصد محصولاً واحداً", check: (s) => s.stats.harvested >= 1, reward: { coins: 10 } },
    { id: "h25", title: "يد خضراء", desc: "احصد 25 محصولاً", check: (s) => s.stats.harvested >= 25, reward: { coins: 60, gems: 1 } },
    { id: "cut10", title: "حطّاب", desc: "افتح 10 خانات من الغابة", check: (s) => Object.keys(s.cleared || {}).length >= 10, reward: { coins: 80, gems: 2 } },
    { id: "lv5", title: "نجم الحقل", desc: "اوصل للمستوى 5", check: (s) => s.level >= 5, reward: { coins: 50, gems: 2 } },
    { id: "lv10", title: "أسطورة شايف", desc: "اوصل للمستوى 10", check: (s) => s.level >= 10, reward: { coins: 180, gems: 4 } },
    { id: "coffee", title: "قهوة الجبال", desc: "ازرع البن اليمني", check: (s) => (s.stats.plantedIds.coffee || 0) >= 1, reward: { coins: 100, gems: 3 } },
    { id: "rich", title: "خزينة المزرعة", desc: "اجمع 1000 عملة", check: (s) => s.coins >= 1000, reward: { gems: 3 } },
    { id: "builder", title: "البنّاء", desc: "ابنِ 4 مبانٍ", check: (s) => Object.values(s.built || {}).filter(Boolean).length >= 4, reward: { coins: 150, gems: 3 } },
    { id: "zoo", title: "صاحب الماشية", desc: "امتلك أي حيوان", check: (s) => (s.animals.chicken.owned + s.animals.cow.owned + s.animals.goat.owned) >= 1, reward: { coins: 40 } },
    { id: "driver", title: "سائق المزرعة", desc: "سلّم 3 طلبات بالسيارة", check: (s) => (s.stats.delivered || 0) >= 3, reward: { coins: 80, gems: 1 } },
  ];
  const DAILY_POOL = [
    { id: "h6", title: "حصاد نشيط", desc: "احصد 6 محاصيل", key: "harvested", add: 6, reward: { coins: 28 } },
    { id: "p5", title: "ازرع أكثر", desc: "ازرع 5 بذور", key: "planted", add: 5, reward: { coins: 22 } },
    { id: "c90", title: "تاجر اليوم", desc: "اربح 90 عملة من البيع", key: "earned", add: 90, reward: { coins: 18, gems: 1 } },
    { id: "w3", title: "الري", desc: "اسقِ 3 مزروعات", key: "watered", add: 3, reward: { coins: 20 } },
    { id: "s4", title: "بيع سريع", desc: "بِع 4 محاصيل", key: "sold", add: 4, reward: { coins: 24 } },
    { id: "d1", title: "توصيلة اليوم", desc: "سلّم طلباً بالسيارة", key: "delivered", add: 1, reward: { coins: 30 } },
  ];

  const $ = (s, r = document) => r.querySelector(s);
  let state, map;
  let selectedSeed = "wheat";
  let activeTab = "farm", shopSeg = "seeds", questSeg = "story";
  let audioCtx, running = false, mode = "world";
  let ctx, viewW = 800, viewH = 450;
  const cam = { x: 0, y: 0 };
  const player = { x: 9.2, y: 11.2, flip: 1, moving: false, state: "idle", anim: 0, busy: 0, after: null, riding: false };
  const worldPos = { x: 9.2, y: 11.2 };
  const truckPos = { x: TRUCK.x, y: TRUCK.y };
  const joy = { x: 0, y: 0, on: false, pid: null };
  const keys = {};
  let walkTo = null, fauna = [], bits = [], clouds = [], focus = null, lastT = 0;
  const imgShayef = new Image(); imgShayef.src = "img/shayef.png";

  function defaultState() {
    const plots = Array.from({ length: 25 }, () => ({ unlocked: false, crop: null }));
    [0, 1, 5, 6].forEach((i) => (plots[i].unlocked = true));
    return {
      v: 3, coins: 55, gems: 5, xp: 0, level: 1,
      seeds: { wheat: 5, carrot: 2 }, items: {}, plots,
      animals: { chicken: { owned: 0, readyAt: 0 }, cow: { owned: 0, readyAt: 0 }, goat: { owned: 0, readyAt: 0 } },
      upgrades: { scarecrow: false, well: false, barn: false },
      built: { well: false, shop: false, coop: false, barn: false, cowpen: false, goatpen: false },
      cleared: {},
      story: 0, dailyDate: "", daily: [],
      stats: { planted: 0, harvested: 0, sold: 0, earned: 0, watered: 0, chopped: 0, delivered: 0, plantedIds: {}, harvestedIds: {} },
      order: null,
      achievements: {}, tutorial: 0, lastLogin: "", streak: 0, sound: true,
      ui: { musicOn: true, musicVol: 0.4, sfxVol: 0.7, joySide: "left", ctrlScale: 1, custom: false, pos: {} },
      startedAt: Date.now(), px: 9.2, py: 11.2,
    };
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultState();
      const s = JSON.parse(raw);
      const d = defaultState();
      const plots = Array.isArray(s.plots) && s.plots.length === 25 ? s.plots : d.plots;
      if (s.v < 3) { [0, 1, 5, 6].forEach((i) => (plots[i].unlocked = true)); }
      return {
        ...d, ...s, v: 3,
        seeds: { ...d.seeds, ...(s.seeds || {}) }, items: s.items || {},
        plots, animals: { ...d.animals, ...(s.animals || {}) },
        upgrades: { ...d.upgrades, ...(s.upgrades || {}) },
        built: { ...d.built, ...(s.built || {}) },
        cleared: s.cleared || {},
        stats: { ...d.stats, ...(s.stats || {}), plantedIds: { ...(s.stats && s.stats.plantedIds) }, harvestedIds: { ...(s.stats && s.stats.harvestedIds) } },
        order: s.order || null,
        ui: { ...d.ui, ...(s.ui || {}), pos: { ...(d.ui.pos || {}), ...((s.ui && s.ui.pos) || {}) } },
        achievements: s.achievements || {},
      };
    } catch { return defaultState(); }
  }
  let saveTimer;
  function save() {
    if (mode === "world") { state.px = player.x; state.py = player.y; }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch {} }, 180);
  }

  function inYard(x, y) { return x >= Y0.x0 && x < Y0.x1 && y >= Y0.y0 && y < Y0.y1; }
  function isOpen(x, y) { return inYard(x, y) || !!state.cleared[Math.floor(x) + "," + Math.floor(y)]; }
  function unlockedCount() { return state.plots.filter((p) => p.unlocked).length; }
  function animalTotal() { return state.animals.chicken.owned + state.animals.cow.owned + state.animals.goat.owned; }
  function xpNeeded(lv) { return Math.round(22 * Math.pow(lv, 1.42)); }
  function sellPrice(crop) { return state.built.barn || state.upgrades.barn ? Math.round(crop.sell * 1.15) : crop.sell; }
  function todayStr() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
  function hash(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); }
  function formatTime(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return s < 60 ? s + "ث" : Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function rumble(ms = 12) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }
  function uiOpen() {
    return !$("#modal").classList.contains("hidden") || !$("#sheet").classList.contains("hidden") || !$("#panel").classList.contains("hidden")
      || !$("#settings").classList.contains("hidden") || $("#game").classList.contains("layout-edit");
  }
  function uiCfg() { if (!state.ui) state.ui = defaultState().ui; return state.ui; }
  function siteAt(x, y) { return SITES.find((s) => x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h); }
  function plotIndexAt(x, y) { return PLOT_POS.findIndex((p) => p.x === Math.floor(x) && p.y === Math.floor(y)); }
  function distHouse(x, y) { return Math.hypot(x - 7.5, y - 7.5); }
  function clearCost(x, y) { return Math.round(14 + distHouse(x, y) * 5); }
  function clearLv(x, y) { return Math.max(1, Math.ceil((distHouse(x, y) - 4) / 3)); }

  function ctxA() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume(); return audioCtx;
  }
  function beep(freq, dur, type = "sine", vol = 0.05) {
    if (!state.sound) return;
    try {
      const a = ctxA(), o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol * (uiCfg().sfxVol ?? 0.7);
      o.connect(g); g.connect(a.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur); o.stop(a.currentTime + dur);
    } catch {}
  }
  function sfx(name) {
    if (name === "click") beep(520, 0.05, "triangle", 0.03);
    if (name === "plant") { beep(340, 0.07, "square", 0.04); setTimeout(() => beep(420, 0.08, "square", 0.03), 60); }
    if (name === "harvest") [523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.12, "sine", 0.05), i * 70));
    if (name === "coin") beep(880, 0.1, "sine", 0.05);
    if (name === "level") [392, 523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.14, "triangle", 0.05), i * 80));
    if (name === "error") beep(180, 0.16, "sawtooth", 0.04);
    if (name === "water") beep(700, 0.08, "sine", 0.04);
    if (name === "chop") { beep(200, 0.08, "square", 0.05); setTimeout(() => beep(140, 0.1, "sawtooth", 0.04), 80); }
  }
  let musicGain = null, musicTimer = null, musicStep = 0, started = false;
  const MUSIC_SEQ = [196, 247, 294, 247, 220, 196, 165, 196, 247, 330, 294, 247];
  function unlockAudio() { try { ctxA(); ensureMusic(); } catch {} }
  function stopMusic() {
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
    if (musicGain) { try { musicGain.gain.value = 0; } catch {} }
  }
  function ensureMusic() {
    const u = uiCfg();
    if (!u.musicOn) { stopMusic(); return; }
    const a = ctxA();
    if (!musicGain) {
      musicGain = a.createGain();
      musicGain.connect(a.destination);
    }
    musicGain.gain.value = (u.musicVol || 0) * 0.09;
    if (musicTimer) return;
    const tick = () => {
      if (!uiCfg().musicOn || !musicGain) { musicTimer = null; return; }
      try {
        const o = a.createOscillator(), g = a.createGain();
        o.type = musicStep % 4 === 0 ? "triangle" : "sine";
        o.frequency.value = MUSIC_SEQ[musicStep % MUSIC_SEQ.length];
        g.gain.value = 0.0001;
        o.connect(g); g.connect(musicGain);
        const t0 = a.currentTime;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);
        o.start(t0); o.stop(t0 + 0.5);
      } catch {}
      musicStep++;
      musicTimer = setTimeout(tick, 520);
    };
    tick();
  }
  function applyUI() {
    const u = uiCfg(), g = $("#game");
    if (!g) return;
    g.style.setProperty("--ctrl-scale", String(u.ctrlScale || 1));
    document.documentElement.dataset.joy = u.joySide === "right" ? "right" : "left";
    g.dataset.custom = u.custom ? "1" : "0";
    [["joy", "#joy"], ["act", "#btn-act"], ["tray", "#seed-tray"]].forEach(([k, sel]) => {
      const el = $(sel); if (!el) return;
      const pos = u.pos && u.pos[k];
      if (u.custom && pos) {
        el.style.setProperty("--hud-x", (pos.x * 100) + "%");
        el.style.setProperty("--hud-y", (pos.y * 100) + "%");
      } else {
        el.style.removeProperty("--hud-x");
        el.style.removeProperty("--hud-y");
      }
    });
    syncSettingsForm();
  }
  function syncSettingsForm() {
    const u = uiCfg();
    const vm = $("#vol-music"), vs = $("#vol-sfx"), sc = $("#ctrl-scale");
    if (!vm) return;
    vm.value = Math.round((u.musicVol || 0) * 100);
    vs.value = Math.round((u.sfxVol || 0) * 100);
    sc.value = Math.round((u.ctrlScale || 1) * 100);
    $("#ctrl-scale-lab").textContent = sc.value + "%";
    $("#tog-music").textContent = u.musicOn ? "تشغيل" : "كتم";
    $("#tog-sfx").textContent = state.sound ? "تشغيل" : "كتم";
    document.querySelectorAll("#joy-side [data-side]").forEach((b) => b.classList.toggle("on", b.dataset.side === (u.joySide || "left")));
    const tm = $("#btn-to-menu"); if (tm) tm.classList.toggle("hidden", !started);
  }
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    $("#toasts").appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  function say(text, ms = 2800) {
    const b = $("#speech"); b.textContent = text; b.classList.remove("hidden");
    clearTimeout(say._t); say._t = setTimeout(() => b.classList.add("hidden"), ms);
  }
  function flyEmoji(emoji) {
    const p = toScreen(player.x, player.y), dest = $("#chip-coins").getBoundingClientRect(), app = $("#stage").getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      const el = document.createElement("div"); el.className = "fly"; el.textContent = emoji;
      el.style.left = p.x + "px"; el.style.top = p.y - 40 + "px";
      el.style.setProperty("--dx", dest.left - app.left + dest.width / 2 - p.x + "px");
      el.style.setProperty("--dy", dest.top - app.top - (p.y - 40) + "px");
      $("#fx").appendChild(el); setTimeout(() => el.remove(), 720);
    }
  }
  function confetti() {
    ["#f5c518", "#3daa28", "#e24a4a", "#5b8cff", "#fff"].forEach((col, i) => {
      const c = document.createElement("i"); c.className = "confetti";
      c.style.left = 12 + i * 16 + "%"; c.style.top = "18%"; c.style.background = col;
      $("#fx").appendChild(c); setTimeout(() => c.remove(), 1000);
    });
  }
  function openModal(html) { $("#modal-card").innerHTML = html; $("#modal").classList.remove("hidden"); }
  function closeModal() { $("#modal").classList.add("hidden"); }
  function openSheet(html) { $("#sheet-body").innerHTML = html; $("#sheet").classList.remove("hidden"); }
  function closeSheet() { $("#sheet").classList.add("hidden"); }

  function addCoins(n) { state.coins += n; if (n > 0) state.stats.earned += n; hud(); save(); }
  function spend(n) { if (state.coins < n) { sfx("error"); toast("العملات لا تكفي"); return false; } state.coins -= n; hud(); save(); return true; }
  function spendGems(n) { if (state.gems < n) { sfx("error"); toast("الجواهر لا تكفي"); return false; } state.gems -= n; hud(); save(); return true; }
  function addSeeds(id, n) { state.seeds[id] = (state.seeds[id] || 0) + n; }
  function addItem(id, n) { state.items[id] = (state.items[id] || 0) + n; }
  function addXp(n) {
    if (state.upgrades.scarecrow) n = Math.round(n * 1.1);
    state.xp += n;
    let last = null;
    while (state.xp >= xpNeeded(state.level)) {
      state.xp -= xpNeeded(state.level); state.level += 1;
      const bonus = 12 * state.level; state.coins += bonus;
      const gem = state.level % 2 === 0 ? 1 : 0; state.gems += gem;
      last = { level: state.level, bonus, gem, crops: Object.values(CROPS).filter((c) => c.lv === state.level) };
    }
    hud(); save(); if (last) showLevel(last);
  }
  function showLevel(info) {
    sfx("level"); confetti();
    const cropLine = info.crops.length ? "محاصيل جديدة: " + info.crops.map((c) => c.name).join("، ") : "الأرض تتوسع معك — اقطع الشجر على الحدود.";
    openModal(`<img src="img/shayef.png" alt=""><h2>مستوى ${info.level}!</h2><p>مكافأة ${info.bonus}🪙${info.gem ? " و " + info.gem + "💎" : ""}</p><p>${cropLine}</p><div class="actions"><button class="btn" data-close="modal">يلا نكمل</button></div>`);
    say("تقدّمنا! نقدر نفتح أرض أبعد.");
  }

  function growStage(crop, now) {
    const r = (now - crop.plantedAt) / Math.max(1, crop.readyAt - crop.plantedAt);
    return r >= 1 ? 3 : r >= 0.55 ? 2 : r >= 0.2 ? 1 : 0;
  }
  function isReady(plot, now = Date.now()) { return plot.crop && now >= plot.crop.readyAt; }

  function playAnim(name, dur, fn) {
    player.state = name; player.anim = 0; player.busy = dur; player.after = fn;
  }
  function plant(i, cropId) {
    const p = state.plots[i]; if (!p.unlocked || p.crop) return false;
    const crop = CROPS[cropId]; if (!crop) return false;
    if (state.level < crop.lv) { toast("يتفتح عند المستوى " + crop.lv); return false; }
    if ((state.seeds[cropId] || 0) < 1) { toast("ما عندك بذور " + crop.name); return false; }
    playAnim("hoe", 0.62, () => {
      state.seeds[cropId]--; const now = Date.now();
      p.crop = { id: cropId, plantedAt: now, readyAt: now + crop.grow, watered: false, fertilized: false };
      state.stats.planted++; state.stats.plantedIds[cropId] = (state.stats.plantedIds[cropId] || 0) + 1;
      selectedSeed = cropId; sfx("plant"); rumble(8); burst(player.x, player.y, "#6d4c41");
      save(); renderTray(); hud(); if (state.tutorial === 2 || state.tutorial === 3) setTutorial(4); checkProgress();
    });
    return true;
  }
  function harvestOne(i) {
    const p = state.plots[i]; if (!isReady(p)) return 0;
    playAnim("harvest", 0.55, () => {
      const crop = CROPS[p.crop.id]; const qty = Math.random() < 0.08 ? 2 : 1;
      if (p.crop.fertilized) addCoins(Math.round(sellPrice(crop) * 0.4));
      addItem(crop.id, qty); addXp(crop.xp);
      state.stats.harvested++; state.stats.harvestedIds[crop.id] = (state.stats.harvestedIds[crop.id] || 0) + 1;
      flyEmoji(crop.emoji); burst(player.x, player.y, crop.color); p.crop = null;
      sfx("harvest"); rumble(15); save(); if (state.tutorial === 4 || state.tutorial === 5) setTutorial(6); checkProgress();
    });
    return 1;
  }
  function water(i) {
    const p = state.plots[i]; if (!p.crop || p.crop.watered || isReady(p)) return;
    playAnim("water", 0.55, () => {
      const now = Date.now();
      p.crop.readyAt = now + (p.crop.readyAt - now) * (state.built.well || state.upgrades.well ? 0.5 : 0.62);
      p.crop.watered = true; state.stats.watered++;
      sfx("water"); burst(player.x, player.y, "#4fc3f7"); toast("سُقيت 💧"); save(); checkProgress();
    });
  }
  function fertilize(i) {
    const p = state.plots[i]; if (!p.crop || p.crop.fertilized || isReady(p)) return;
    if (!spend(8)) return; p.crop.fertilized = true; toast("سماد جاهز"); save(); closeSheet();
  }
  function instant(i) {
    const p = state.plots[i]; if (!p.crop || isReady(p)) return;
    if (!spendGems(2)) return; p.crop.readyAt = Date.now(); save(); closeSheet(); toast("نضج فوراً!");
  }
  function tillPlot(i) {
    if (state.plots[i].unlocked) return;
    if (!isOpen(PLOT_POS[i].x, PLOT_POS[i].y)) return toast("افتح الأرض أولاً");
    playAnim("hoe", 0.7, () => {
      state.plots[i].unlocked = true; sfx("plant"); toast("حرثنا أرض جديدة"); rebuildMap(); save(); checkProgress();
    });
  }
  function chopAt(x, y) {
    const tx = Math.floor(x), ty = Math.floor(y);
    if (isOpen(tx, ty)) return;
    if (state.level < clearLv(tx, ty)) return toast("يلزم مستوى " + clearLv(tx, ty));
    const cost = clearCost(tx, ty);
    if (!spend(cost)) return;
    playAnim("chop", 0.7, () => {
      state.cleared[tx + "," + ty] = true; state.stats.chopped = (state.stats.chopped || 0) + 1;
      addXp(4); sfx("chop"); burst(tx + 0.5, ty + 0.5, "#8d6e63");
      toast("فتحنا الأرض"); rebuildMap(); spawnFauna(); save(); checkProgress();
      if (state.tutorial === 7) setTutorial(-1);
    });
  }
  function buildSite(id) {
    const s = SITES.find((x) => x.id === id); if (!s || state.built[id]) return;
    if (state.level < s.lv) return toast("يلزم مستوى " + s.lv);
    if (!spend(s.cost)) return;
    playAnim("hoe", 0.8, () => {
      state.built[id] = true; sfx("coin"); toast("اكتمل: " + s.name);
      if (id === "well") state.upgrades.well = true;
      if (id === "barn") state.upgrades.barn = true;
      rebuildMap(); spawnFauna(); save(); checkProgress(); renderPanel();
    });
  }

  function ensureAnimalTimers() {
    const now = Date.now();
    Object.values(ANIMALS).forEach((a) => { const st = state.animals[a.id]; if (st.owned > 0 && !st.readyAt) st.readyAt = now + a.interval; });
  }
  function collectAnimal(id) {
    const a = ANIMALS[id], st = state.animals[id];
    if (!st.owned || Date.now() < st.readyAt) return;
    addCoins(a.sell * st.owned); addXp(a.xp * st.owned);
    st.readyAt = Date.now() + a.interval; sfx("coin"); toast(`+${a.sell * st.owned} من ${a.productName}`); checkProgress();
  }
  function buyAnimal(id) {
    const a = ANIMALS[id], st = state.animals[id];
    if (state.level < a.lv) return toast("يتفتح عند المستوى " + a.lv);
    if (!state.built[a.need]) return toast("ابنِ " + SITES.find((s) => s.id === a.need).name + " أولاً");
    if (st.owned >= a.max) return toast("وصلت للحد");
    if (!spend(a.cost)) return;
    st.owned++; if (!st.readyAt) st.readyAt = Date.now() + a.interval;
    spawnFauna(); sfx("coin"); toast("أهلاً بـ" + a.name); renderPanel(); checkProgress();
  }
  function buySeed(id, qty = 1) {
    const c = CROPS[id]; if (state.level < c.lv) return toast("يتفتح عند المستوى " + c.lv);
    if (!spend(c.seed * qty)) return; addSeeds(id, qty); selectedSeed = id;
    sfx("coin"); toast(`+${qty} بذور ${c.name}`); renderTray(); renderPanel(); save();
  }
  function sellItem(id, qty) {
    const have = state.items[id] || 0; qty = Math.min(qty, have); if (!qty) return;
    const gain = sellPrice(CROPS[id]) * qty; state.items[id] = have - qty;
    if (!state.items[id]) delete state.items[id];
    addCoins(gain); state.stats.sold += qty; sfx("coin"); toast(`بعت ${qty} مقابل ${gain}🪙`);
    if (state.tutorial === 6) setTutorial(7);
    renderPanel(); checkProgress();
  }
  function sellAll() {
    let gain = 0, n = 0;
    Object.keys(state.items).forEach((id) => { gain += sellPrice(CROPS[id]) * state.items[id]; n += state.items[id]; });
    if (!n) return toast("الصندوق فارغ");
    state.items = {}; addCoins(gain); state.stats.sold += n; sfx("coin"); toast(`بيع الكل: ${gain}🪙`);
    if (state.tutorial === 6) setTutorial(7); renderPanel(); checkProgress();
  }
  function buyUpgrade(key) {
    const mapU = { scarecrow: { cost: 220, name: "الفزاعة" } };
    const u = mapU[key]; if (!u) return;
    if (state.upgrades[key]) return toast("تم");
    if (!spend(u.cost)) return; state.upgrades[key] = true; toast("تم: " + u.name); renderPanel();
  }

  function refreshDaily() {
    const t = todayStr(); if (state.dailyDate === t && state.daily.length) return;
    const h = hash(t + "shayef"), pool = [...DAILY_POOL], pick = [];
    for (let i = 0; i < 3; i++) {
      const q = pool.splice((h + i * 7) % pool.length, 1)[0];
      pick.push({ id: q.id, title: q.title, desc: q.desc, key: q.key, start: state.stats[q.key] || 0, target: q.add, reward: q.reward, claimed: false });
    }
    state.dailyDate = t; state.daily = pick; save();
  }
  function dailyProgress(q) { return Math.min(q.target, Math.max(0, (state.stats[q.key] || 0) - q.start)); }
  function claimStory() { const q = STORY[state.story]; if (!q || !q.check(state)) return; grant(q.reward); state.story++; sfx("level"); toast("أحسنت! " + q.title); renderPanel(); save(); }
  function claimDaily(id) { const q = state.daily.find((x) => x.id === id); if (!q || q.claimed || dailyProgress(q) < q.target) return; q.claimed = true; grant(q.reward); sfx("coin"); toast("مكافأة اليوم"); renderPanel(); save(); }
  function grant(r) {
    if (r.coins) addCoins(r.coins); if (r.gems) { state.gems += r.gems; hud(); }
    if (r.xp) addXp(r.xp); if (r.seeds) Object.entries(r.seeds).forEach(([k, v]) => addSeeds(k, v));
    save(); hud(); renderTray();
  }
  function checkProgress() {
    ACHIEVEMENTS.forEach((a) => { if (!state.achievements[a.id] && a.check(state)) { state.achievements[a.id] = true; grant(a.reward); toast("إنجاز: " + a.title); } });
    if (activeTab === "quests") renderPanel(); save();
  }
  function checkDailyLogin() {
    const t = todayStr(); if (state.lastLogin === t) return null;
    const y = new Date(); y.setDate(y.getDate() - 1);
    const ys = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
    state.streak = state.lastLogin === ys ? state.streak + 1 : 1; state.lastLogin = t;
    const coins = 8 + state.streak * 4, gems = state.streak % 3 === 0 ? 2 : state.streak === 1 ? 1 : 0;
    grant({ coins, gems }); save(); return { coins, gems, streak: state.streak };
  }

  function setTutorial(step) {
    state.tutorial = step; save();
    $("#joy").classList.toggle("pulse", step === 2);
    if (step === -1) { say("مزرعتك تكبر معك. اقطع الشجر وابنِ."); return; }
    if (step === 1) {
      openModal(`<img src="img/shayef.png" alt=""><h2>أهلاً، أنا شايف</h2><p>هذي بس ساحتنا الصغيرة. الغابة والصخور حوالينا — كل ما نكبر نقطع ونفتح أرض لمبانٍ جديدة. حرّكني بالجويستك.</p><div class="actions"><button class="btn" id="tut-go">يلا</button></div>`);
      $("#tut-go").onclick = () => { closeModal(); setTutorial(2); say("امشِ نحو الحقل البني جنب البيت."); };
    }
    if (step === 3) say("قف على الأرض واضغط الزر: ازرع.");
    if (step === 4) say("انتظر ينمو، أو اسقه.");
    if (step === 6) {
      say("ادخل البيت من الباب، والصندوق لبيع المحصول.");
      openModal(`<h2>البيت</h2><p>ادخل بيت شايف. الصندوق = بيع المحصول. اللوحة = المهام. الخزانة = بذور.</p><div class="actions"><button class="btn" data-close="modal">حاضر</button></div>`);
    }
    if (step === 7) say("امشِ لحدود العشب واقطع شجرة عشان نوسع.");
  }

  /* ===== Map ===== */
  function rebuildMap() {
    map = [];
    for (let y = 0; y < MH; y++) {
      map[y] = [];
      for (let x = 0; x < MW; x++) {
        if (x === 0 || (x === 1 && y % 3 !== 1)) { map[y][x] = { t: "water" }; continue; }
        const open = isOpen(x, y);
        if (!open) {
          const h = hash(x + ":" + y + "w");
          const grove = hash(Math.floor(x / 4) + "g" + Math.floor(y / 3));
          let kind;
          if (grove % 7 === 0 && (h % 3)) kind = "wild";
          else if (h % 13 === 0) kind = "rock";
          else if (h % 6 === 0) kind = "bush";
          else if (h % 5 === 0) kind = "wild";
          else kind = "forest";
          map[y][x] = { t: kind, h };
          continue;
        }
        const gh = hash(x + "," + y);
        map[y][x] = { t: "grass", flower: gh % 9 === 0, clover: gh % 7 === 0, pebble: gh % 17 === 0 };
      }
    }
    for (let x = 7; x <= 13; x++) if (map[9] && map[9][x] && map[9][x].t === "grass") map[9][x] = { t: "path" };
    for (let y = 9; y <= 13; y++) if (map[y] && map[y][8] && (map[y][8].t === "grass" || map[y][8].t === "path")) map[y][8] = { t: "path" };
    for (let x = 5; x <= 10; x++) if (map[13] && map[13][x] && (map[13][x].t === "grass" || map[13][x].t === "path")) map[13][x] = { t: "path" };
    if (map[11] && map[11][8]) map[11][8] = { t: "path" };
    if (map[12] && map[12][9]) map[12][9] = { t: "path" };
    if (map[14] && map[14][5]) map[14][5] = { t: "path" };
    for (let x = 8; x <= 11; x++) if (map[12] && map[12][x] && (map[12][x].t === "grass" || map[12][x].t === "path")) map[12][x] = { t: "path" };
    for (let x = 5; x <= 9; x++) if (map[14] && map[14][x] && (map[14][x].t === "grass" || map[14][x].t === "path")) map[14][x] = { t: "path" };
    for (let y = 6; y <= 8; y++) for (let x = 6; x <= 8; x++) if (isOpen(x, y)) map[y][x] = { t: "house" };
    PLOT_POS.forEach((p, i) => {
      if (!isOpen(p.x, p.y)) return;
      if (state.plots[i].unlocked) map[p.y][p.x] = { t: "plot", plot: i };
      else map[p.y][p.x] = { t: "dirt", plot: i };
    });
    SITES.forEach((s) => {
      for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) {
        if (!isOpen(x, y) || !map[y] || !map[y][x]) continue;
        map[y][x] = { t: state.built[s.id] ? "built" : "site", site: s.id };
      }
    });
  }

  function tile(x, y) {
    const tx = Math.floor(x), ty = Math.floor(y);
    if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return null;
    return map[ty][tx];
  }
  function walkableWorld(x, y) {
    const t = tile(x, y); if (!t) return false;
    return t.t === "grass" || t.t === "path" || t.t === "plot" || t.t === "dirt" || t.t === "site";
  }
  function canPlace(x, y) {
    const r = 0.26;
    if (mode === "house") return x > 0.7 && y > 0.8 && x < 9.2 && y < 6.4;
    return walkableWorld(x - r, y) && walkableWorld(x + r, y) && walkableWorld(x, y - r) && walkableWorld(x, y + r);
  }
  function iso(x, y) { return { sx: (x - y) * (TW / 2), sy: (x + y) * (TH / 2) }; }
  function toScreen(x, y) {
    const p = iso(x, y);
    return { x: p.sx - cam.x + viewW / 2, y: p.sy - cam.y + viewH * 0.52 };
  }
  function screenToWorld(px, py) {
    const sx = px - viewW / 2 + cam.x, sy = py - viewH * 0.52 + cam.y;
    return { x: (sx / (TW / 2) + sy / (TH / 2)) / 2, y: (sy / (TH / 2) - sx / (TW / 2)) / 2 };
  }

  function getFocus() {
    if (mode === "house") {
      const items = [
        { type: "door", x: 4.8, y: 6.1, r: 1 },
        { type: "bed", x: 1.7, y: 1.6, r: 1.15 },
        { type: "board", x: 7.4, y: 1.4, r: 1 },
        { type: "chest", x: 8.1, y: 4.6, r: 1 },
        { type: "cupboard", x: 1.6, y: 4.4, r: 1.05 },
        { type: "table", x: 5.2, y: 3.3, r: 0.9 },
        { type: "sofa", x: 3.4, y: 3.5, r: 0.9 },
      ];
      let best = null, bd = 1.2;
      items.forEach((it) => { const d = Math.hypot(player.x - it.x, player.y - it.y); if (d < it.r && d < bd) { bd = d; best = it; } });
      return best;
    }
    const t = tile(player.x, player.y);
    if (t && (t.t === "plot" || t.t === "dirt") && t.plot != null) return { type: t.t, i: t.plot, x: Math.floor(player.x) + 0.5, y: Math.floor(player.y) + 0.5 };
    if (t && t.t === "house") return { type: "door", x: player.x, y: player.y };
    if (t && t.t === "site") return { type: "site", id: t.site };
    if (t && t.t === "built") return { type: "built", id: t.site };
    let best = null, bestD = 1.2;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const tx = Math.floor(player.x) + dx, ty = Math.floor(player.y) + dy;
      const tt = tile(tx + 0.5, ty + 0.5); if (!tt) continue;
      const d = Math.hypot(player.x - (tx + 0.5), player.y - (ty + 0.5));
      if (d >= bestD) continue;
      if (tt.t === "forest" || tt.t === "rock" || tt.t === "bush" || tt.t === "wild") { if (isOpen(player.x, player.y) && !isOpen(tx, ty)) { bestD = d; best = { type: tt.t, x: tx, y: ty }; } }
      if (tt.t === "plot" || tt.t === "dirt") { bestD = d; best = { type: tt.t, i: tt.plot, x: tx + 0.5, y: ty + 0.5 }; }
      if (tt.t === "house") { bestD = d; best = { type: "door" }; }
      if (tt.t === "site") { bestD = d; best = { type: "site", id: tt.site }; }
      if (tt.t === "built") { bestD = d; best = { type: "built", id: tt.site }; }
    }
    fauna.forEach((f) => {
      if (f.kind === "butterfly") return;
      const d = Math.hypot(player.x - f.x, player.y - f.y);
      if (d < 0.95 && d < bestD) { bestD = d; best = { type: "animal", id: f.id, x: f.x, y: f.y }; }
    });
    if (mode === "world") {
      const tx = player.riding ? player.x : truckPos.x, ty = player.riding ? player.y : truckPos.y;
      const dt = Math.hypot(player.x - tx, player.y - ty);
      if (!player.riding && dt < 1.4 && dt < bestD + 0.35) best = { type: "truck" };
      const dd = Math.hypot(player.x - DROP.x, player.y - DROP.y);
      if (dd < 1.25 && (player.riding || state.order)) best = { type: "drop" };
    }
    return best;
  }

  function cargoValue() {
    let n = 0, v = 0;
    Object.keys(state.items || {}).forEach((id) => {
      const q = state.items[id] || 0; if (!q || !CROPS[id]) return;
      n += q; v += sellPrice(CROPS[id]) * q;
    });
    return { n, v };
  }
  function mountTruck(on) {
    if (on) {
      player.x = truckPos.x; player.y = truckPos.y; player.riding = true;
      say(state.order ? "السيارة محملة. روح لنقطة التوصيل غرب الساحة." : "اركبنا. حمّل محصولاً من الصندوق ثم سلّم.");
    } else {
      player.riding = false; truckPos.x = player.x; truckPos.y = player.y;
      say("نزلنا من السيارة.");
    }
  }
  function loadTruck() {
    const { n, v } = cargoValue();
    if (!n) { toast("ما عندك محصول. احصد أولاً."); return; }
    state.order = { n, v, items: { ...state.items } };
    state.items = {};
    player.riding = true;
    player.x = truckPos.x; player.y = truckPos.y;
    sfx("coin"); rumble(12);
    say("حمّلنا " + n + " صندوق. وصلّه عند اللافتة.");
    save();
  }
  function deliverOrder() {
    if (!state.order) { toast("السيارة فاضية"); return; }
    const pay = state.order.v + Math.round(state.order.v * 0.35) + 8;
    addCoins(pay); addXp(8);
    state.stats.sold += state.order.n;
    state.stats.delivered = (state.stats.delivered || 0) + 1;
    flyEmoji("🚚"); sfx("level"); rumble(18);
    toast("توصيل +" + pay + "🪙");
    state.order = null; player.riding = false;
    truckPos.x = DROP.x + 0.8; truckPos.y = DROP.y;
    save(); checkProgress();
  }
  function actionOf(f) {
    if (player.riding) {
      if (f && f.type === "drop" && state.order) return { ico: "📦", lab: "سلّم", ready: true, run: deliverOrder };
      return { ico: "🚪", lab: "انزل", ready: true, run: () => mountTruck(false) };
    }
    if (!f) return { ico: "🚶", lab: "امشِ", ready: false, run: null };
    if (f.type === "plot") {
      const p = state.plots[f.i];
      if (!p.crop) return { ico: "🌱", lab: "ازرع", ready: true, run: () => tryPlant(f.i) };
      if (isReady(p)) return { ico: "✨", lab: "احصد", ready: true, run: () => harvestOne(f.i) };
      if (!p.crop.watered) return { ico: "💧", lab: "اسقِ", ready: true, run: () => water(f.i) };
      return { ico: "⏳", lab: formatTime(p.crop.readyAt - Date.now()), ready: false, run: () => openGrowSheet(f.i) };
    }
    if (f.type === "dirt") return { ico: "🪓", lab: "احرث", ready: true, run: () => tillPlot(f.i) };
    if (f.type === "forest") return { ico: "🪓", lab: "اقطع", ready: true, run: () => chopAt(f.x, f.y) };
    if (f.type === "rock") return { ico: "🪨", lab: "أزل", ready: true, run: () => chopAt(f.x, f.y) };
    if (f.type === "bush") return { ico: "🌿", lab: "شذب", ready: true, run: () => chopAt(f.x, f.y) };
    if (f.type === "wild") return { ico: "🌾", lab: "افتح", ready: true, run: () => chopAt(f.x, f.y) };
    if (f.type === "site") {
      const s = SITES.find((x) => x.id === f.id);
      return { ico: "🏗️", lab: "ابنِ", ready: state.level >= s.lv, run: () => {
        openSheet(`<h2 style="margin:0 0 8px">${s.name}</h2><p>مستوى ${s.lv} · ${s.cost}🪙</p><div class="actions"><button class="btn" data-build="${s.id}">ابنِ الآن</button><button class="btn btn-ghost" data-close="sheet">لاحقاً</button></div>`);
      } };
    }
    if (f.type === "built") {
      if (f.id === "shop") return { ico: "🛒", lab: "السوق", ready: true, run: () => setTab("shop") };
      if (f.id === "barn") return { ico: "🏚️", lab: "الحظيرة", ready: true, run: () => setTab("barn") };
      if (f.id === "well") return { ico: "🪣", lab: "البئر", ready: true, run: () => { sfx("water"); say("ماء عذب للمزرعة."); } };
      if (f.id === "coop" || f.id === "cowpen" || f.id === "goatpen") return { ico: "🐾", lab: "الزريبة", ready: true, run: () => { shopSeg = "animals"; setTab("shop"); } };
    }
    if (f.type === "door") return { ico: "🚪", lab: mode === "house" ? "اخرج" : "ادخل", ready: true, run: toggleHouse };
    if (f.type === "bed") return { ico: "🛏️", lab: "ارتاح", ready: true, run: () => { save(); say("شايف ارتاح، والمزرعة انحفظت."); sfx("coin"); } };
    if (f.type === "board") return { ico: "📜", lab: "المهام", ready: true, run: () => setTab("quests") };
    if (f.type === "chest") return { ico: "📦", lab: "الصندوق", ready: true, run: () => setTab("barn") };
    if (f.type === "cupboard") return { ico: "🌱", lab: "بذور", ready: true, run: () => { shopSeg = "seeds"; setTab("shop"); } };
    if (f.type === "table") return { ico: "🍵", lab: "شاي", ready: true, run: () => say("شايف يشرب شاي بالنعناع.") };
    if (f.type === "sofa") return { ico: "🛋️", lab: "اقعد", ready: true, run: () => say("جلسة مريحة بعد الحراثة.") };
    if (f.type === "truck") {
      const { n } = cargoValue();
      if (n && !state.order) return { ico: "📦", lab: "حمّل", ready: true, run: loadTruck };
      return { ico: "🚚", lab: "اركب", ready: true, run: () => mountTruck(true) };
    }
    if (f.type === "drop") {
      if (state.order) return { ico: "📦", lab: "سلّم", ready: true, run: deliverOrder };
      return { ico: "🪧", lab: "توصيل", ready: false, run: () => toast("حمّل الطلب في السيارة أولاً") };
    }
    if (f.type === "animal") {
      const a = ANIMALS[f.id], st = state.animals[f.id];
      if (st.owned && Date.now() >= st.readyAt) return { ico: a.product, lab: "اجمع", ready: true, run: () => collectAnimal(f.id) };
      return { ico: a.emoji, lab: a.name, ready: false, run: () => toast("لسه ما جاهز") };
    }
    return { ico: "✋", lab: "تفاعل", ready: false, run: null };
  }
  function tryPlant(i) {
    const sid = selectedSeed;
    if (sid && (state.seeds[sid] || 0) > 0 && state.level >= CROPS[sid].lv) plant(i, sid);
    else openSeedSheet(i);
  }
  function openSeedSheet(i) {
    const list = Object.values(CROPS).filter((c) => state.level >= c.lv);
    openSheet(`<h2 style="margin:0 0 8px">ماذا نزرع؟</h2><div class="seed-grid">${list.map((c) => {
      const n = state.seeds[c.id] || 0;
      return `<button class="seed-pick ${n ? "" : "off"}" data-plant="${c.id}" data-plot="${i}"><div class="e">${c.emoji}</div><div class="n">${c.name}</div><div class="c">${n ? "×" + n : "لا بذور"}</div></button>`;
    }).join("")}</div>`);
  }
  function openGrowSheet(i) {
    const p = state.plots[i], c = CROPS[p.crop.id];
    openSheet(`<h2>${c.emoji} ${c.name}</h2><p>باقي ${formatTime(p.crop.readyAt - Date.now())}</p><div class="actions">
      <button class="btn btn-gold" data-fert="${i}" ${p.crop.fertilized ? "disabled" : ""}>سمّد (8🪙)</button>
      <button class="btn" data-instant="${i}">أنضِج (2💎)</button>
      <button class="btn btn-ghost" data-close="sheet">إغلاق</button></div>`);
  }
  function doAction() { const a = actionOf(focus); if (player.busy > 0) return; if (a.run) { sfx("click"); a.run(); } else sfx("error"); }
  function toggleHouse() {
    if (player.riding) mountTruck(false);
    if (mode === "world") {
      worldPos.x = player.x; worldPos.y = player.y;
      mode = "house"; player.x = 4.8; player.y = 5.4; player.state = "idle"; player.riding = false;
      say("بيت شايف. الصندوق للبيع، الخزانة للبذور، الطاولة للشاي.");
    } else {
      mode = "world"; player.x = worldPos.x; player.y = worldPos.y + 0.4;
    }
  }

  function spawnFauna() {
    fauna = fauna.filter((f) => f.kind === "butterfly");
    if (!fauna.length) for (let i = 0; i < 8; i++) fauna.push({ kind: "butterfly", x: 6 + Math.random() * 10, y: 7 + Math.random() * 7, z: 14 + Math.random() * 18, t: Math.random() * 10 });
    const pen = (id, kind, ox, oy, w, h) => {
      const n = state.animals[id].owned; if (!n || !state.built[ANIMALS[id].need]) return;
      for (let i = 0; i < n; i++) fauna.push({ kind, id, x: ox + Math.random() * w, y: oy + Math.random() * h, ox, oy, w, h, tx: ox, ty: oy, flip: 1, t: Math.random() * 8 });
    };
    pen("chicken", "chicken", 6.3, 18.3, 2.4, 1.4);
    pen("cow", "cow", 12.3, 19.3, 2.4, 1.3);
    pen("goat", "goat", 17.3, 19.3, 1.5, 1.3);
  }
  function burst(x, y, color) { for (let i = 0; i < 10; i++) bits.push({ x, y, vx: (Math.random() - 0.5) * 2.4, vy: -Math.random() * 2.4 - 0.3, life: 0.65, color }); }

  function joyWorld() {
    let jx = joy.x, jy = joy.y;
    if (keys.ArrowLeft || keys.a || keys.A) jx -= 1;
    if (keys.ArrowRight || keys.d || keys.D) jx += 1;
    if (keys.ArrowUp || keys.w || keys.W) jy -= 1;
    if (keys.ArrowDown || keys.s || keys.S) jy += 1;
    const mag = Math.hypot(jx, jy); if (mag > 1) { jx /= mag; jy /= mag; }
    if (mag < 0.08) return { x: 0, y: 0, jx: 0, mag: 0 };
    const dwx = (jx / (TW / 2) + jy / (TH / 2)) / 2, dwy = (jy / (TH / 2) - jx / (TW / 2)) / 2;
    const len = Math.hypot(dwx, dwy) || 1;
    return { x: (dwx / len) * mag, y: (dwy / len) * mag, jx, mag };
  }

  function update(dt, time) {
    player.anim += dt;
    if (player.busy > 0) {
      player.busy -= dt; player.moving = false;
      if (player.busy <= 0) { const fn = player.after; player.after = null; player.state = "idle"; player.busy = 0; if (fn) fn(); }
    } else {
      const j = joyWorld();
      let mx = 0, my = 0;
      if (j.mag > 0.08) {
        walkTo = null; mx = j.x; my = j.y;
        if (j.jx < -0.12) player.flip = 1; if (j.jx > 0.12) player.flip = -1;
      } else if (walkTo) {
        const dx = walkTo.x - player.x, dy = walkTo.y - player.y, d = Math.hypot(dx, dy);
        if (d < 0.14) { const act = walkTo.act; walkTo = null; if (act) doAction(); }
        else { mx = dx / d; my = dy / d; }
      }
      player.moving = Math.hypot(mx, my) > 0.05;
      player.state = player.moving ? "walk" : "idle";
      if (player.moving) {
        const spd = player.riding ? 5.4 : 3.15, nx = player.x + mx * spd * dt, ny = player.y + my * spd * dt;
        if (canPlace(nx, player.y)) player.x = nx;
        if (canPlace(player.x, ny)) player.y = ny;
        if (player.riding) { truckPos.x = player.x; truckPos.y = player.y; }
        if (Math.random() < (player.riding ? 0.45 : 0.3)) bits.push({ x: player.x, y: player.y, vx: 0, vy: 0, life: 0.3, color: player.riding ? "rgba(80,80,80,.35)" : "rgba(90,60,30,.3)", dust: 1 });
      }
    }
    if (state.tutorial === 2 && mode === "world") {
      const d = Math.hypot(player.x - (PLOTX + 0.5), player.y - (PLOTY + 0.5));
      if (d < 1.9) setTutorial(3);
    }
    fauna.forEach((f) => {
      f.t += dt;
      if (f.kind === "butterfly") {
        f.x += Math.sin(f.t * 1.2 + f.z) * dt * 0.65; f.y += Math.cos(f.t * 1.05) * dt * 0.5;
        f.z = 14 + Math.sin(f.t * 2) * 10;
      } else {
        if (!f.tx || Math.hypot(f.x - f.tx, f.y - f.ty) < 0.1) {
          f.tx = f.ox + Math.random() * f.w; f.ty = f.oy + Math.random() * f.h;
        }
        const dx = f.tx - f.x, dy = f.ty - f.y, d = Math.hypot(dx, dy) || 1;
        f.x += (dx / d) * 0.55 * dt; f.y += (dy / d) * 0.55 * dt;
        if (dx !== 0) f.flip = dx < 0 ? 1 : -1;
      }
    });
    bits.forEach((b) => { b.life -= dt; b.x += b.vx * dt; b.y += b.vy * dt; if (!b.dust) b.vy += 4 * dt; });
    bits = bits.filter((b) => b.life > 0);
    clouds.forEach((c) => { c.x -= c.sp * dt; if (c.x < -90) c.x = viewW + 90; });
    const ip = iso(player.x, player.y);
    cam.x += (ip.sx - cam.x) * Math.min(1, dt * 7);
    cam.y += (ip.sy - cam.y) * Math.min(1, dt * 7);
    focus = getFocus();
    const a = actionOf(focus);
    $("#act-ico").textContent = a.ico; $("#act-lab").textContent = a.lab;
    $("#btn-act").classList.toggle("ready", !!a.ready);
    $("#btn-act").classList.toggle("off", !a.run);
  }

  /* ===== Draw ===== */
  function drawBlock(c, sx, sy, top, left, right, d = DEPTH) {
    const hw = TW / 2, hh = TH / 2;
    c.beginPath(); c.moveTo(sx - hw, sy); c.lineTo(sx, sy + hh); c.lineTo(sx, sy + hh + d); c.lineTo(sx - hw, sy + d); c.closePath(); c.fillStyle = left; c.fill();
    c.beginPath(); c.moveTo(sx + hw, sy); c.lineTo(sx, sy + hh); c.lineTo(sx, sy + hh + d); c.lineTo(sx + hw, sy + d); c.closePath(); c.fillStyle = right; c.fill();
    c.beginPath(); c.moveTo(sx, sy - hh); c.lineTo(sx + hw, sy); c.lineTo(sx, sy + hh); c.lineTo(sx - hw, sy); c.closePath(); c.fillStyle = top; c.fill();
  }
  function drawTufts(c, p, x, y, t) {
    const h = hash(x + "g" + y), n = 4 + (h % 6);
    const near = Math.hypot(player.x - (x + 0.5), player.y - (y + 0.5));
    const bend = near < 0.85 ? (player.x - x) * 5 : 0;
    c.lineWidth = 1.7; c.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const ox = ((h >> (i * 3)) % 13) - 6, oy = ((h >> (i * 2 + 1)) % 7) - 3;
      const sway = Math.sin((t || 0) * 2.1 + x * 0.55 + i) * 1.8 + bend;
      const hh = 6 + (h >> i) % 5;
      c.strokeStyle = i % 4 === 0 ? "#8bc34a" : i % 4 === 1 ? "#66bb6a" : i % 4 === 2 ? "#43a047" : "#2e7d32";
      c.beginPath();
      c.moveTo(p.x + ox, p.y + oy + 4);
      c.quadraticCurveTo(p.x + ox + sway * 0.4, p.y + oy - hh * 0.45, p.x + ox + sway, p.y + oy - hh);
      c.stroke();
    }
  }
  function grassPalette(x, y) {
    const h = hash(x + "p" + y) % 5;
    if (h === 0) return ["#b6ee63", "#7ed321", "#4caf50"];
    if (h === 1) return ["#8fe86a", "#57c039", "#2e9b28"];
    if (h === 2) return ["#d4f07a", "#9ccc65", "#7cb342"];
    if (h === 3) return ["#6fe08a", "#43c06a", "#2e8b4a"];
    return ["#9ae65c", "#62c43a", "#388e3c"];
  }
  function drawBuildingBox(c, x, y, bw, bd, h, wall, wallD, roof) {
    const p0 = toScreen(x, y), pR = toScreen(x + bw, y), pF = toScreen(x + bw, y + bd), pL = toScreen(x, y + bd);
    c.lineJoin = "round"; c.lineCap = "round"; c.lineWidth = 2.2; c.strokeStyle = "#3d2314";
    c.beginPath(); c.moveTo(pL.x, pL.y); c.lineTo(pF.x, pF.y); c.lineTo(pF.x, pF.y - h); c.lineTo(pL.x, pL.y - h); c.closePath(); c.fillStyle = wallD; c.fill(); c.stroke();
    c.beginPath(); c.moveTo(pR.x, pR.y); c.lineTo(pF.x, pF.y); c.lineTo(pF.x, pF.y - h); c.lineTo(pR.x, pR.y - h); c.closePath(); c.fillStyle = wall; c.fill(); c.stroke();
    const ridge = { x: (p0.x + pF.x) / 2, y: Math.min(p0.y, pF.y) - h - 22 };
    c.beginPath(); c.moveTo(pL.x, pL.y - h); c.lineTo(ridge.x, ridge.y); c.lineTo(pF.x, pF.y - h); c.closePath(); c.fillStyle = roof; c.fill(); c.stroke();
    c.beginPath(); c.moveTo(pR.x, pR.y - h); c.lineTo(ridge.x, ridge.y); c.lineTo(pF.x, pF.y - h); c.closePath(); c.fillStyle = shade(roof, -18); c.fill(); c.stroke();
    return { p0, pR, pF, pL, ridge };
  }
  function shade(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + a)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + a)), b = Math.max(0, Math.min(255, (n & 255) + a));
    return `rgb(${r},${g},${b})`;
  }
  function ink(c) { c.lineJoin = "round"; c.lineCap = "round"; c.lineWidth = 2.1; c.strokeStyle = "#3d2314"; }
  function label(c, text, x, y, col = "#fffde7") {
    c.font = "bold 11px Tahoma, sans-serif"; c.textAlign = "center";
    c.lineWidth = 4; c.strokeStyle = "#2a1508"; c.strokeText(text, x, y);
    c.fillStyle = col; c.fillText(text, x, y);
  }
  function win(c, x, y, w = 14, h = 12, glass = "#81d4fa") {
    ink(c); c.fillStyle = "#5d4037"; c.fillRect(x - w / 2 - 1, y - h / 2 - 1, w + 2, h + 2);
    c.fillStyle = glass; c.fillRect(x - w / 2, y - h / 2, w, h); c.strokeRect(x - w / 2, y - h / 2, w, h);
    c.beginPath(); c.moveTo(x, y - h / 2); c.lineTo(x, y + h / 2); c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.stroke();
  }
  function milkCarton(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s); ink(c);
    c.fillStyle = "#fffef6";
    c.beginPath(); c.moveTo(-11, 10); c.lineTo(-11, -12); c.lineTo(0, -22); c.lineTo(11, -12); c.lineTo(11, 10); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#42a5f5"; c.fillRect(-9, -5, 18, 11); c.strokeRect(-9, -5, 18, 11);
    c.fillStyle = "#0d47a1"; c.font = "bold 8px Tahoma"; c.textAlign = "center"; c.fillText("حليب", 0, 3);
    c.restore();
  }
  function cheeseWheel(c, x, y, s = 1) {
    c.save(); c.translate(x, y); ink(c);
    c.fillStyle = "#ffd54f"; c.beginPath(); c.ellipse(0, 0, 16 * s, 10 * s, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#fff59d";
    [[-6, -2], [5, 1], [0, 3], [-2, 1]].forEach(([hx, hy]) => { c.beginPath(); c.arc(hx * s, hy * s, 2.3 * s, 0, 7); c.fill(); });
    c.restore();
  }
  function croissant(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.rotate(-0.45); ink(c);
    c.fillStyle = "#ffb74d"; c.beginPath(); c.ellipse(0, 0, 20 * s, 8 * s, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#ffe0b2"; c.beginPath(); c.ellipse(0, -1, 12 * s, 3.2 * s, 0, 0, 7); c.fill();
    c.restore();
  }
  function loaf(c, x, y) {
    ink(c); c.fillStyle = "#e0a13a";
    c.beginPath(); c.ellipse(x, y, 13, 7, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#ffe082"; c.beginPath(); c.ellipse(x, y - 3, 8, 3, 0, 0, 7); c.fill();
  }
  function bottle(c, x, y) {
    ink(c); c.fillStyle = "#e3f2fd"; c.fillRect(x - 4, y - 16, 8, 16); c.strokeRect(x - 4, y - 16, 8, 16);
    c.fillStyle = "#90caf9"; c.fillRect(x - 2, y - 22, 4, 6); c.strokeRect(x - 2, y - 22, 4, 6);
    c.fillStyle = "rgba(255,255,255,.65)"; c.fillRect(x - 3, y - 14, 2, 9);
  }
  function giantEgg(c, x, y, s = 1) {
    ink(c); c.fillStyle = "#fffde7";
    c.beginPath(); c.ellipse(x, y, 9 * s, 12 * s, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "rgba(255,255,255,.75)"; c.beginPath(); c.ellipse(x - 3 * s, y - 4 * s, 3 * s, 4 * s, -0.4, 0, 7); c.fill();
  }

  function draw(time) {
    const c = ctx, t = time / 1000;
    c.clearRect(0, 0, viewW, viewH);
    if (mode === "house") { drawHouseInside(c, t); return; }
    const g = c.createLinearGradient(0, 0, 0, viewH);
    g.addColorStop(0, "#5ec8f0"); g.addColorStop(0.34, "#d8f5c4"); g.addColorStop(1, "#8edc5c");
    c.fillStyle = g; c.fillRect(0, 0, viewW, viewH);
    c.fillStyle = "#ffe082"; c.beginPath(); c.arc(viewW * 0.12, 64, 26, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.arc(viewW * 0.12 - 6, 58, 8, 0, 7); c.fill();
    clouds.forEach((cl) => {
      c.fillStyle = "rgba(255,255,255,.82)";
      c.beginPath(); c.ellipse(cl.x, cl.y, 32 * cl.s, 13 * cl.s, 0, 0, 7); c.fill();
      c.beginPath(); c.ellipse(cl.x + 16 * cl.s, cl.y - 5, 20 * cl.s, 11 * cl.s, 0, 0, 7); c.fill();
    });

    const drawn = {};
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const cell = map[y][x], p = toScreen(x + 0.5, y + 0.5);
      if (p.x < -TW || p.x > viewW + TW || p.y < -90 || p.y > viewH + 90) continue;
      if (cell.t === "water") {
        const w = 0.5 + 0.5 * Math.sin(t * 2 + x * 0.6 + y);
        drawBlock(c, p.x, p.y, w > 0.5 ? "#4fc3f7" : "#29b6f6", "#039be5", "#0277bd", 8);
        continue;
      }
      if (cell.t === "forest" || cell.t === "rock" || cell.t === "bush" || cell.t === "wild") {
        const pal = grassPalette(x + 3, y + 1);
        drawBlock(c, p.x, p.y, shade(pal[0], -18), shade(pal[1], -12), shade(pal[2], -8));
        drawTufts(c, p, x, y, t);
      } else if (cell.t === "path") {
        drawBlock(c, p.x, p.y, "#f3d5a0", "#d7a86a", "#c48a3a");
        const ph = hash(x + "s" + y);
        if (ph % 3 === 0) { c.fillStyle = "#c4a574"; c.beginPath(); c.ellipse(p.x + (ph % 7) - 3, p.y + 2, 3.2, 1.6, 0.2, 0, 7); c.fill(); }
      } else if (cell.t === "plot") {
        const pl = state.plots[cell.plot];
        drawBlock(c, p.x, p.y, isReady(pl) ? "#e8b06a" : "#c47a38", "#8d4e1a", "#6d3a10");
      } else if (cell.t === "dirt") drawBlock(c, p.x, p.y, "#e0c08a", "#b08958", "#8d6e40");
      else if (cell.t === "site") drawBlock(c, p.x, p.y, "#ffe082", "#ffca28", "#f9a825");
      else {
        const pal = grassPalette(x, y);
        drawBlock(c, p.x, p.y, pal[0], pal[1], pal[2]);
        drawTufts(c, p, x, y, t);
        if (cell.clover) {
          c.fillStyle = "#2e7d32";
          for (let k = 0; k < 3; k++) {
            const a = k * 2.1;
            c.beginPath(); c.ellipse(p.x + Math.cos(a) * 3, p.y - 2 + Math.sin(a) * 2, 2.4, 1.5, a, 0, 7); c.fill();
          }
        }
        if (cell.pebble) { c.fillStyle = "#cfd8dc"; c.beginPath(); c.ellipse(p.x - 6, p.y + 3, 3.5, 1.8, -0.3, 0, 7); c.fill(); }
        if (cell.flower) {
          const cols = ["#ec407a", "#fff176", "#7e57c2", "#ff8a65", "#42a5f5"];
          c.fillStyle = cols[(x * 3 + y) % cols.length];
          c.beginPath(); c.arc(p.x + 5, p.y - 5, 2.4, 0, 7); c.fill();
          c.fillStyle = "#fff59d"; c.beginPath(); c.arc(p.x + 5, p.y - 5, 1, 0, 7); c.fill();
        }
      }
      if (focus && ((focus.type === "plot" || focus.type === "dirt") && cell.plot === focus.i || ((focus.type === "forest" || focus.type === "rock" || focus.type === "bush" || focus.type === "wild") && focus.x === x && focus.y === y))) {
        c.strokeStyle = "#ffe566"; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(p.x, p.y - TH / 2); c.lineTo(p.x + TW / 2, p.y); c.lineTo(p.x, p.y + TH / 2); c.lineTo(p.x - TW / 2, p.y); c.closePath(); c.stroke();
      }
    }

    const sprites = [];
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const cell = map[y][x], z = x + y;
      if (cell.t === "forest") sprites.push({ z, draw: () => drawTree(c, x, y, t, cell.h) });
      if (cell.t === "rock") sprites.push({ z, draw: () => drawRock(c, x, y, cell.h) });
      if (cell.t === "bush") sprites.push({ z, draw: () => drawBush(c, x, y, t, cell.h) });
      if (cell.t === "wild") sprites.push({ z, draw: () => drawWild(c, x, y, t, cell.h) });
      if (cell.t === "house" && !drawn.house) { drawn.house = true; sprites.push({ z: 6 + 8, draw: () => drawHouseExt(c, t) }); }
      if (cell.t === "plot" && state.plots[cell.plot].crop) sprites.push({ z: z + 0.2, draw: () => drawCrop(c, x + 0.5, y + 0.5, state.plots[cell.plot], t) });
      if (cell.t === "dirt") sprites.push({ z: z + 0.1, draw: () => { const p = toScreen(x + 0.5, y + 0.5); c.font = "11px sans-serif"; c.textAlign = "center"; c.fillText("حرث", p.x, p.y - 6); } });
      if (cell.t === "site" && !drawn[cell.site]) { drawn[cell.site] = true; sprites.push({ z: z + 0.2, draw: () => drawSite(c, SITES.find((s) => s.id === cell.site)) }); }
      if (cell.t === "built" && !drawn["b" + cell.site]) { drawn["b" + cell.site] = true; sprites.push({ z: z + 0.4, draw: () => drawBuilt(c, SITES.find((s) => s.id === cell.site), t) }); }
    }
    if (state.upgrades.scarecrow) sprites.push({ z: 11 + 9.5, draw: () => {
      const p = toScreen(11.2, 9.4); c.fillStyle = "#6d4c41"; c.fillRect(p.x - 2, p.y - 34, 4, 34);
      c.fillStyle = "#ef6c00"; c.beginPath(); c.arc(p.x, p.y - 36, 7, 0, 7); c.fill();
      c.fillStyle = "#8d6e63"; c.fillRect(p.x - 14, p.y - 28, 28, 5);
    }});
    sprites.push({ z: DROP.x + DROP.y, draw: () => drawDrop(c) });
    const tzx = player.riding ? player.x : truckPos.x, tzy = player.riding ? player.y : truckPos.y;
    sprites.push({ z: tzx + tzy + 0.35, draw: () => drawTruck(c, tzx, tzy, t) });
    fauna.forEach((f) => sprites.push({ z: f.x + f.y + (f.z || 0) / 90, draw: () => drawFauna(c, f, t) }));
    if (!player.riding) sprites.push({ z: player.x + player.y + 0.4, draw: () => drawShayef(c, t) });
    bits.forEach((b) => sprites.push({ z: b.x + b.y + 1, draw: () => {
      const p = toScreen(b.x, b.y); c.globalAlpha = Math.max(0, b.life);
      c.fillStyle = b.color; c.beginPath(); c.arc(p.x, p.y - (b.dust ? 0 : 16), b.dust ? 2.5 : 3.2, 0, 7); c.fill(); c.globalAlpha = 1;
    }}));
    sprites.sort((a, b) => a.z - b.z); sprites.forEach((s) => s.draw());
  }

  function tileJitter(x, y, h) {
    return { jx: (((h % 17) - 8) * 0.07), jy: ((((h >> 4) % 13) - 6) * 0.06) };
  }
  function drawTree(c, tx, ty, t, h) {
    const { jx, jy } = tileJitter(tx, ty, h);
    const x = tx + 0.5 + jx, y = ty + 0.5 + jy;
    const p = toScreen(x, y), sway = Math.sin(t * 1.05 + x * 0.9 + h) * 2.6, kind = h % 6, sc = 0.72 + (h % 9) * 0.05;
    c.fillStyle = "rgba(40,80,20,.2)"; c.beginPath(); c.ellipse(p.x, p.y + 7, 14 * sc + 4, 5.5 * sc, 0, 0, 7); c.fill();
    ink(c); c.fillStyle = kind === 2 ? "#6d4c41" : "#8d6e4c";
    c.beginPath(); c.moveTo(p.x - 5 * sc, p.y + 3); c.lineTo(p.x - 2 * sc, p.y - 30 * sc); c.lineTo(p.x + 3 * sc, p.y - 30 * sc); c.lineTo(p.x + 6 * sc, p.y + 3); c.closePath(); c.fill(); c.stroke();
    if (kind === 0 || kind === 4) {
      ["#1b5e20", "#2e7d32", "#66bb6a"].forEach((col, i) => {
        const top = p.y - (82 - i * 16) * sc, w = (11 + i * 8) * sc;
        c.fillStyle = col;
        c.beginPath(); c.moveTo(p.x + sway * (1 - i * 0.2), top); c.lineTo(p.x + w + sway, top + 24 * sc); c.lineTo(p.x - w + sway, top + 24 * sc); c.closePath(); c.fill(); c.stroke();
      });
    } else if (kind === 5) {
      c.fillStyle = "#558b2f";
      c.beginPath(); c.moveTo(p.x + sway, p.y - 70 * sc); c.lineTo(p.x + 20 * sc + sway, p.y - 18); c.lineTo(p.x - 20 * sc + sway, p.y - 18); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#7cb342";
      c.beginPath(); c.moveTo(p.x + sway * 0.6, p.y - 86 * sc); c.lineTo(p.x + 13 * sc + sway, p.y - 42 * sc); c.lineTo(p.x - 13 * sc + sway, p.y - 42 * sc); c.closePath(); c.fill(); c.stroke();
    } else {
      const leaf = kind === 1 ? "#7cb342" : kind === 3 ? "#43a047" : "#2e7d32";
      c.fillStyle = leaf;
      c.beginPath(); c.ellipse(p.x + sway * 0.3, p.y - 42 * sc, 20 * sc, 17 * sc, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = kind === 1 ? "#c5e1a5" : "#81c784";
      c.beginPath(); c.ellipse(p.x - 9 * sc + sway, p.y - 54 * sc, 13 * sc, 11 * sc, -0.2, 0, 7); c.fill();
      c.beginPath(); c.ellipse(p.x + 11 * sc + sway, p.y - 56 * sc, 12 * sc, 10 * sc, 0.2, 0, 7); c.fill();
      if (h % 8 === 0) {
        c.fillStyle = h % 16 === 0 ? "#ef5350" : "#ffd54f";
        for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(p.x - 10 + i * 7 + sway, p.y - 46 * sc - (i % 2) * 7, 2.3, 0, 7); c.fill(); }
      }
    }
  }
  function drawRock(c, tx, ty, h) {
    const { jx, jy } = tileJitter(tx, ty, h || 3);
    const p = toScreen(tx + 0.5 + jx, ty + 0.5 + jy);
    const n = 1 + ((h || 0) % 3);
    c.fillStyle = "rgba(40,70,20,.16)"; c.beginPath(); c.ellipse(p.x, p.y + 5, 16, 6, 0, 0, 7); c.fill();
    ink(c);
    for (let i = 0; i < n; i++) {
      const ox = (i - 1) * 8, oy = (i % 2) * 3, sc = 0.7 + ((h >> i) % 5) * 0.08;
      c.fillStyle = i === 1 ? "#90a4ae" : "#b0bec5";
      c.beginPath(); c.ellipse(p.x + ox, p.y - 6 * sc + oy, 12 * sc, 9 * sc, -0.15 + i * 0.1, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(p.x + ox - 4, p.y - 10 * sc + oy, 4 * sc, 2.2 * sc, -0.4, 0, 7); c.fill();
      if ((h + i) % 5 === 0) { c.fillStyle = "#7cb342"; c.beginPath(); c.ellipse(p.x + ox + 5, p.y - 2, 4, 2, 0.2, 0, 7); c.fill(); }
    }
  }
  function drawBush(c, tx, ty, t, h) {
    const { jx, jy } = tileJitter(tx, ty, h);
    const p = toScreen(tx + 0.5 + jx, ty + 0.5 + jy);
    const sway = Math.sin(t * 1.4 + tx) * 1.4;
    c.fillStyle = "rgba(40,80,20,.14)"; c.beginPath(); c.ellipse(p.x, p.y + 5, 14, 5, 0, 0, 7); c.fill();
    ink(c);
    c.fillStyle = "#558b2f";
    c.beginPath(); c.ellipse(p.x + sway * 0.2, p.y - 8, 14, 10, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#8bc34a";
    c.beginPath(); c.ellipse(p.x - 7 + sway, p.y - 12, 8, 7, -0.2, 0, 7); c.fill();
    c.beginPath(); c.ellipse(p.x + 8 + sway, p.y - 11, 7, 6, 0.2, 0, 7); c.fill();
    if (h % 4 === 0) { c.fillStyle = "#ec407a"; c.beginPath(); c.arc(p.x + 4, p.y - 14, 2.2, 0, 7); c.fill(); }
    if (h % 5 === 0) { c.fillStyle = "#fff176"; c.beginPath(); c.arc(p.x - 5, p.y - 10, 2, 0, 7); c.fill(); }
  }
  function drawWild(c, tx, ty, t, h) {
    const p = toScreen(tx + 0.5, ty + 0.5);
    const sway = Math.sin(t * 2 + tx * 0.6) * 2;
    c.lineCap = "round"; c.lineWidth = 1.8;
    for (let i = 0; i < 7; i++) {
      const ox = -12 + i * 4 + ((h >> i) % 3);
      c.strokeStyle = i % 2 ? "#7cb342" : "#9ccc65";
      c.beginPath(); c.moveTo(p.x + ox, p.y + 3);
      c.quadraticCurveTo(p.x + ox + sway * 0.4, p.y - 8, p.x + ox + sway, p.y - 14 - (h % 5));
      c.stroke();
    }
    if (h % 4 === 1) {
      c.fillStyle = ["#ff8a65", "#fff176", "#ce93d8"][h % 3];
      c.beginPath(); c.arc(p.x + (h % 9) - 4, p.y - 12, 2.3, 0, 7); c.fill();
    }
  }
  function drawHouseExt(c, t) {
    const door = toScreen(7.5, 8.95);
    const base = toScreen(7.5, 8.5);
    const p0 = toScreen(6.05, 6.1), pR = toScreen(8.95, 6.1), pF = toScreen(8.95, 8.88), pL = toScreen(6.05, 8.88);
    const wallH = 64;
    c.fillStyle = "rgba(30,70,15,.22)"; c.beginPath(); c.ellipse(base.x, base.y + 16, 78, 22, 0, 0, 7); c.fill();
    ink(c);

    const garden = toScreen(6.15, 8.55);
    c.fillStyle = "#66bb6a";
    c.beginPath(); c.ellipse(garden.x - 8, garden.y + 4, 16, 7, 0, 0, 7); c.fill();
    ["#ec407a", "#fff176", "#7e57c2", "#ff8a65", "#42a5f5"].forEach((col, i) => {
      c.fillStyle = col;
      c.beginPath(); c.arc(garden.x - 18 + i * 8, garden.y - 2 - (i % 2) * 3, 3.2, 0, 7); c.fill();
      c.fillStyle = "#fff59d"; c.beginPath(); c.arc(garden.x - 18 + i * 8, garden.y - 2 - (i % 2) * 3, 1.1, 0, 7); c.fill();
    });

    c.fillStyle = "#8d6e63";
    c.beginPath(); c.moveTo(pL.x, pL.y + 8); c.lineTo(pF.x, pF.y + 8); c.lineTo(pF.x, pF.y - 6); c.lineTo(pL.x, pL.y - 6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#a1887f";
    c.beginPath(); c.moveTo(pR.x, pR.y + 8); c.lineTo(pF.x, pF.y + 8); c.lineTo(pF.x, pF.y - 6); c.lineTo(pR.x, pR.y - 6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#bcaaa4";
    for (let i = 0; i < 5; i++) {
      c.fillRect(pL.x + 8 + i * 10, pL.y - 2, 7, 5);
    }

    c.fillStyle = "#ffe4c4";
    c.beginPath(); c.moveTo(pL.x, pL.y - 6); c.lineTo(pF.x, pF.y - 6); c.lineTo(pF.x, pF.y - 6 - wallH); c.lineTo(pL.x, pL.y - 6 - wallH); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#ffd7a8";
    c.beginPath(); c.moveTo(pR.x, pR.y - 6); c.lineTo(pF.x, pF.y - 6); c.lineTo(pF.x, pF.y - 6 - wallH); c.lineTo(pR.x, pR.y - 6 - wallH); c.closePath(); c.fill(); c.stroke();

    c.strokeStyle = "#8d6e4c"; c.lineWidth = 3;
    c.beginPath();
    c.moveTo(pL.x + 10, pL.y - 10); c.lineTo(pL.x + 18, pL.y - 10 - wallH + 8);
    c.moveTo(pF.x - 14, pF.y - 10); c.lineTo(pF.x - 8, pF.y - 10 - wallH + 8);
    c.moveTo(pL.x + 6, pL.y - 28); c.lineTo(pF.x - 6, pF.y - 28);
    c.stroke();
    ink(c);

    const ivy = toScreen(6.25, 7.6);
    c.strokeStyle = "#2e7d32"; c.lineWidth = 2;
    c.beginPath(); c.moveTo(ivy.x, ivy.y - 8); c.quadraticCurveTo(ivy.x - 8, ivy.y - 30, ivy.x + 4, ivy.y - 52); c.stroke();
    c.fillStyle = "#66bb6a";
    for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(ivy.x - 4 + (i % 3) * 5, ivy.y - 10 - i * 6, 4, 2.4, 0.4, 0, 7); c.fill(); }

    const ridge = { x: (p0.x + pF.x) / 2, y: Math.min(p0.y, pF.y) - wallH - 42 };
    c.fillStyle = "#ef5350";
    c.beginPath(); c.moveTo(pL.x - 10, pL.y - 6 - wallH + 8); c.lineTo(ridge.x, ridge.y); c.lineTo(pF.x + 8, pF.y - 6 - wallH + 8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#c62828";
    c.beginPath(); c.moveTo(pR.x + 10, pR.y - 6 - wallH + 8); c.lineTo(ridge.x, ridge.y); c.lineTo(pF.x + 8, pF.y - 6 - wallH + 8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#fff8e1";
    const eaveY = (pL.y + pF.y) / 2 - 6 - wallH + 10;
    for (let i = 0; i < 8; i++) {
      const gx = pL.x - 4 + i * ((pF.x - pL.x + 12) / 8);
      c.beginPath(); c.arc(gx, eaveY + 6, 4.2, 0, Math.PI); c.fill();
    }
    c.fillStyle = "#fffde7";
    c.beginPath(); c.moveTo(ridge.x - 8, ridge.y + 6); c.lineTo(ridge.x, ridge.y - 6); c.lineTo(ridge.x + 8, ridge.y + 6); c.closePath(); c.fill(); c.stroke();

    const chim = toScreen(8.55, 6.25);
    c.fillStyle = "#e57373"; c.fillRect(chim.x - 8, chim.y - 118, 16, 28); c.strokeRect(chim.x - 8, chim.y - 118, 16, 28);
    c.fillStyle = "#c62828"; c.fillRect(chim.x - 11, chim.y - 124, 22, 8); c.strokeRect(chim.x - 11, chim.y - 124, 22, 8);
    c.fillStyle = "#ef9a9a"; c.fillRect(chim.x - 5, chim.y - 110, 5, 4); c.fillRect(chim.x + 2, chim.y - 102, 5, 4);
    c.fillStyle = "rgba(255,255,255,.55)";
    c.beginPath(); c.ellipse(chim.x + 2, chim.y - 136 - Math.sin(t * 1.4) * 6, 10, 7, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(chim.x + 8, chim.y - 148 - Math.sin(t * 1.1) * 4, 7, 5, 0, 0, 7); c.fill();
    c.fillStyle = "#5d4037";
    c.beginPath(); c.ellipse(chim.x + 10, chim.y - 126, 4, 2.2, 0.3, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(chim.x + 12, chim.y - 130, 2.2, 0, 7); c.fill();
    c.fillStyle = "#ff8a65"; c.beginPath(); c.moveTo(chim.x + 14, chim.y - 129); c.lineTo(chim.x + 19, chim.y - 128); c.lineTo(chim.x + 14, chim.y - 126); c.fill();

    c.fillStyle = "#ffcc80";
    c.beginPath(); c.ellipse(ridge.x - 18, ridge.y + 22, 11, 9, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#81d4fa"; c.beginPath(); c.ellipse(ridge.x - 18, ridge.y + 22, 7, 6, 0, 0, 7); c.fill();
    c.strokeRect(ridge.x - 25, ridge.y + 13, 14, 18);

    const cat = { x: ridge.x + 16, y: ridge.y + 18 };
    c.fillStyle = "#6d4c41";
    c.beginPath(); c.ellipse(cat.x, cat.y, 9, 5, -0.3, 0, 7); c.fill();
    c.beginPath(); c.arc(cat.x + 8, cat.y - 2, 3.5, 0, 7); c.fill();
    c.beginPath(); c.moveTo(cat.x + 6, cat.y - 5); c.lineTo(cat.x + 7, cat.y - 9); c.lineTo(cat.x + 9, cat.y - 4); c.fill();
    c.beginPath(); c.moveTo(cat.x + 9, cat.y - 4); c.lineTo(cat.x + 12, cat.y - 8); c.lineTo(cat.x + 11, cat.y - 2); c.fill();
    c.strokeStyle = "#5d4037"; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(cat.x - 8, cat.y + 2); c.quadraticCurveTo(cat.x - 16, cat.y - 6 + Math.sin(t * 2) * 3, cat.x - 10, cat.y - 8); c.stroke();

    const wl = toScreen(6.55, 7.2), wr = toScreen(8.45, 7.15);
    function shutterWin(wx, wy) {
      ink(c);
      c.fillStyle = "#43a047"; c.fillRect(wx - 16, wy - 58, 7, 18); c.fillRect(wx + 9, wy - 58, 7, 18);
      c.fillStyle = "#5d4037"; c.fillRect(wx - 9, wy - 59, 18, 20);
      c.fillStyle = "#81d4fa"; c.fillRect(wx - 7, wy - 57, 14, 16); c.strokeRect(wx - 7, wy - 57, 14, 16);
      c.beginPath(); c.moveTo(wx, wy - 57); c.lineTo(wx, wy - 41); c.moveTo(wx - 7, wy - 49); c.lineTo(wx + 7, wy - 49); c.stroke();
      c.fillStyle = "#8d6e63"; c.fillRect(wx - 11, wy - 40, 22, 7); c.strokeRect(wx - 11, wy - 40, 22, 7);
      c.fillStyle = "#ec407a"; c.beginPath(); c.arc(wx - 5, wy - 44, 3, 0, 7); c.fill();
      c.fillStyle = "#fff176"; c.beginPath(); c.arc(wx + 4, wy - 45, 3, 0, 7); c.fill();
      c.fillStyle = "#7e57c2"; c.beginPath(); c.arc(wx + 9, wy - 43, 2.4, 0, 7); c.fill();
    }
    shutterWin(wl.x, wl.y); shutterWin(wr.x, wr.y);

    c.fillStyle = "#6d4c41";
    c.beginPath(); c.moveTo(door.x - 18, door.y + 4); c.lineTo(door.x + 18, door.y + 4); c.lineTo(door.x + 12, door.y - 6); c.lineTo(door.x - 12, door.y - 6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#a1887f"; c.fillRect(door.x - 10, door.y - 4, 8, 3); c.fillRect(door.x + 2, door.y - 4, 8, 3);

    ink(c);
    c.fillStyle = "#6d4c41";
    c.beginPath(); c.moveTo(door.x - 14, door.y - 8); c.lineTo(door.x - 14, door.y - 42); c.quadraticCurveTo(door.x, door.y - 58, door.x + 14, door.y - 42); c.lineTo(door.x + 14, door.y - 8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#8d6e63";
    c.beginPath(); c.moveTo(door.x - 11, door.y - 10); c.lineTo(door.x - 11, door.y - 40); c.quadraticCurveTo(door.x, door.y - 52, door.x + 11, door.y - 40); c.lineTo(door.x + 11, door.y - 10); c.closePath(); c.fill();
    c.fillStyle = "#fff59d"; c.beginPath(); c.arc(door.x, door.y - 36, 5, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#ffd54f"; c.beginPath(); c.arc(door.x + 7, door.y - 22, 2.6, 0, 7); c.fill();
    c.strokeStyle = "#c62828"; c.lineWidth = 2.2;
    c.beginPath(); c.arc(door.x, door.y - 34, 12, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    c.fillStyle = "#ec407a";
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * 1.15 + i * 0.18;
      c.beginPath(); c.arc(door.x + Math.cos(a) * 12, door.y - 34 + Math.sin(a) * 12, 2.2, 0, 7); c.fill();
    }

    const lantern = toScreen(8.15, 8.7);
    c.strokeStyle = "#5d4037"; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(lantern.x, lantern.y - 40); c.lineTo(lantern.x, lantern.y - 28); c.stroke();
    c.fillStyle = "#ffe082"; c.fillRect(lantern.x - 5, lantern.y - 28, 10, 10); c.strokeRect(lantern.x - 5, lantern.y - 28, 10, 10);
    c.fillStyle = "rgba(255, 224, 130, .28)"; c.beginPath(); c.arc(lantern.x, lantern.y - 23, 12 + Math.sin(t * 3) * 1.5, 0, 7); c.fill();

    const mail = toScreen(8.7, 8.55);
    c.fillStyle = "#1565c0"; c.fillRect(mail.x - 8, mail.y - 18, 16, 10); c.strokeRect(mail.x - 8, mail.y - 18, 16, 10);
    c.fillStyle = "#0d47a1"; c.fillRect(mail.x + 6, mail.y - 16, 8, 4);
    c.fillStyle = "#8d6e63"; c.fillRect(mail.x - 2, mail.y - 8, 4, 10);

    const mush = toScreen(6.4, 8.7);
    c.fillStyle = "#efebe9"; c.fillRect(mush.x - 2, mush.y - 8, 4, 8);
    c.fillStyle = "#e53935"; c.beginPath(); c.ellipse(mush.x, mush.y - 10, 8, 5, 0, Math.PI, 0); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(mush.x - 3, mush.y - 11, 1.4, 0, 7); c.fill(); c.beginPath(); c.arc(mush.x + 2, mush.y - 10, 1.1, 0, 7); c.fill();

    const can = toScreen(8.9, 8.35);
    c.fillStyle = "#42a5f5"; c.fillRect(can.x - 7, can.y - 12, 12, 9); c.fillRect(can.x + 5, can.y - 10, 7, 3);
    c.strokeRect(can.x - 7, can.y - 12, 12, 9);

    ink(c); c.strokeStyle = "#efebe9"; c.lineWidth = 2.4;
    const fx = toScreen(6.2, 8.9), fy = toScreen(8.8, 8.9);
    c.beginPath(); c.moveTo(fx.x, fx.y); c.lineTo(fy.x, fy.y); c.stroke();
    c.strokeStyle = "#fff8e1"; c.lineWidth = 2;
    for (let i = 0; i <= 6; i++) {
      const px = fx.x + (fy.x - fx.x) * (i / 6), py = fx.y + (fy.y - fx.y) * (i / 6);
      c.beginPath(); c.moveTo(px, py); c.lineTo(px, py - 11); c.stroke();
    }

    label(c, "بيت شايف", door.x, door.y - 78);
  }
  function drawSite(c, s) {
    const p = toScreen(s.x + s.w / 2, s.y + s.h / 2);
    ink(c); c.setLineDash([6, 5]); c.strokeStyle = "#ffd54f"; c.lineWidth = 2.4;
    c.strokeRect(p.x - 22, p.y - 24, 44, 30); c.setLineDash([]);
    c.fillStyle = "rgba(255, 236, 179, .35)"; c.fillRect(p.x - 22, p.y - 24, 44, 30);
    label(c, "ابنِ", p.x, p.y - 28);
    label(c, s.name, p.x, p.y + 18, "#fffde7");
  }
  function drawFence(c, s, col) {
    const a = toScreen(s.x, s.y), b = toScreen(s.x + s.w, s.y), d = toScreen(s.x + s.w, s.y + s.h), e = toScreen(s.x, s.y + s.h);
    c.strokeStyle = col; c.lineWidth = 3; c.lineJoin = "round";
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.lineTo(d.x, d.y); c.lineTo(e.x, e.y); c.closePath(); c.stroke();
    [[a, b], [b, d], [d, e], [e, a]].forEach((pair) => {
      for (let i = 0; i <= 3; i++) {
        const x = pair[0].x + (pair[1].x - pair[0].x) * (i / 3);
        const y = pair[0].y + (pair[1].y - pair[0].y) * (i / 3);
        c.fillStyle = col; c.fillRect(x - 2, y - 12, 4, 14);
      }
    });
  }
  function drawBuilt(c, s, t) {
    const mid = toScreen(s.x + s.w / 2, s.y + s.h / 2);
    if (s.id === "well") {
      const p = toScreen(s.x + 0.5, s.y + 0.5);
      c.fillStyle = "rgba(40,90,20,.16)"; c.beginPath(); c.ellipse(p.x, p.y + 6, 18, 8, 0, 0, 7); c.fill();
      ink(c); c.fillStyle = "#b0bec5"; c.beginPath(); c.ellipse(p.x, p.y, 17, 10, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "#78909c"; c.beginPath(); c.ellipse(p.x, p.y - 7, 14, 8, 0, 0, 7); c.fill();
      c.fillStyle = "#4fc3f7"; c.beginPath(); c.ellipse(p.x, p.y - 7, 9, 5, 0, 0, 7); c.fill();
      c.fillStyle = "#ffcc80"; c.fillRect(p.x - 18, p.y - 30, 6, 22); c.fillRect(p.x + 12, p.y - 30, 6, 22);
      c.fillStyle = "#66bb6a"; c.beginPath(); c.moveTo(p.x - 24, p.y - 28); c.lineTo(p.x, p.y - 44); c.lineTo(p.x + 24, p.y - 28); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#8d6e63"; c.fillRect(p.x - 6, p.y - 12, 10, 7);
      c.fillStyle = "#ec407a"; c.beginPath(); c.arc(p.x - 14, p.y + 2, 3, 0, 7); c.fill();
      c.fillStyle = "#fff176"; c.beginPath(); c.arc(p.x + 14, p.y + 1, 3, 0, 7); c.fill();
      label(c, "البئر", p.x, p.y - 50);
      return;
    }
    if (s.id === "shop") {
      drawBuildingBox(c, s.x, s.y, s.w, s.h, 34, "#fff59d", "#ffd54f", "#ff7043");
      const p = toScreen(s.x + 1, s.y + 1.75);
      ink(c);
      c.fillStyle = "#e53935"; c.beginPath(); c.moveTo(p.x - 32, p.y - 30); c.lineTo(p.x + 32, p.y - 30); c.lineTo(p.x + 24, p.y - 16); c.lineTo(p.x - 24, p.y - 16); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#fff"; for (let i = 0; i < 6; i++) c.fillRect(p.x - 28 + i * 10, p.y - 30, 5, 14);
      c.fillStyle = "#8d6e63"; c.fillRect(p.x - 12, p.y - 14, 24, 16); c.strokeRect(p.x - 12, p.y - 14, 24, 16);
      const fruits = ["#e53935", "#7cb342", "#ffd54f", "#ab47bc"];
      fruits.forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(p.x - 18 + i * 12, p.y - 36, 4, 0, 7); c.fill(); });
      const crate = toScreen(s.x + 0.35, s.y + 1.85);
      c.fillStyle = "#a1887f"; c.fillRect(crate.x - 9, crate.y - 8, 18, 10); c.strokeRect(crate.x - 9, crate.y - 8, 18, 10);
      c.fillStyle = "#ef5350"; c.beginPath(); c.arc(crate.x - 3, crate.y - 10, 3, 0, 7); c.fill();
      c.fillStyle = "#ffd54f"; c.beginPath(); c.arc(crate.x + 4, crate.y - 11, 3, 0, 7); c.fill();
      label(c, "السوق", p.x, p.y - 54);
      return;
    }
    if (s.id === "barn") {
      drawBuildingBox(c, s.x, s.y, s.w, s.h, 48, "#ffe0b2", "#ffcc80", "#ef9a9a");
      const p = toScreen(s.x + 1.5, s.y + 1.75);
      croissant(c, p.x, p.y - 78, 1.15);
      loaf(c, p.x - 22, p.y - 18);
      loaf(c, p.x + 24, p.y - 16);
      ink(c); c.fillStyle = "#8d6e63";
      c.beginPath(); c.moveTo(p.x - 14, p.y); c.lineTo(p.x - 14, p.y - 26); c.quadraticCurveTo(p.x, p.y - 38, p.x + 14, p.y - 26); c.lineTo(p.x + 14, p.y); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#ffd54f"; c.beginPath(); c.arc(p.x + 8, p.y - 14, 2.2, 0, 7); c.fill();
      win(c, p.x - 28, p.y - 44, 12, 10, "#fff8e1");
      win(c, p.x + 28, p.y - 44, 12, 10, "#fff8e1");
      c.fillStyle = "rgba(255,255,255,.5)";
      c.beginPath(); c.ellipse(p.x + 36, p.y - 70 - Math.sin(t * 2) * 3, 7, 5, 0, 0, 7); c.fill();
      label(c, "المخبز", p.x, p.y - 92);
      return;
    }
    if (s.id === "coop") {
      drawBuildingBox(c, s.x, s.y, 1.6, 0.85, 28, "#fffde7", "#fff9c4", "#ef5350");
      drawFence(c, s, "#8d6e63");
      const p = toScreen(s.x + 0.8, s.y + 0.6);
      giantEgg(c, p.x + 6, p.y - 52, 1.15);
      giantEgg(c, p.x - 10, p.y - 46, 0.8);
      ink(c); c.fillStyle = "#efebe9";
      c.beginPath(); c.ellipse(p.x, p.y - 8, 12, 8, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "#ffd54f"; c.beginPath(); c.moveTo(p.x + 14, p.y - 34); c.lineTo(p.x + 22, p.y - 42); c.lineTo(p.x + 18, p.y - 30); c.closePath(); c.fill();
      label(c, "بيت البيض", mid.x, mid.y - 40);
      return;
    }
    if (s.id === "cowpen") {
      drawBuildingBox(c, s.x, s.y, 1.7, 0.9, 34, "#e3f2fd", "#90caf9", "#42a5f5");
      drawFence(c, s, "#6d4c41");
      const p = toScreen(s.x + 0.85, s.y + 0.55);
      milkCarton(c, p.x + 8, p.y - 58, 1.25);
      bottle(c, p.x - 16, p.y - 8);
      bottle(c, p.x - 6, p.y - 8);
      bottle(c, p.x + 4, p.y - 8);
      ink(c); c.fillStyle = "#fff";
      c.beginPath(); c.ellipse(p.x + 22, p.y - 22, 8, 6, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "#3e2723"; c.beginPath(); c.ellipse(p.x + 20, p.y - 22, 2.5, 2, 0, 0, 7); c.fill();
      label(c, "مصنع الحليب", mid.x, mid.y - 48);
      return;
    }
    if (s.id === "goatpen") {
      drawBuildingBox(c, s.x, s.y, 1.5, 0.85, 32, "#fff59d", "#ffd54f", "#f9a825");
      drawFence(c, s, "#6d4c41");
      const p = toScreen(s.x + 0.75, s.y + 0.55);
      cheeseWheel(c, p.x + 4, p.y - 56, 1.15);
      ink(c); c.fillStyle = "#ffe082";
      c.beginPath(); c.moveTo(p.x - 18, p.y - 8); c.lineTo(p.x - 4, p.y - 22); c.lineTo(p.x + 2, p.y - 8); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = "#fff59d";
      [[p.x - 8, p.y - 36], [p.x + 10, p.y - 30], [p.x - 2, p.y - 28]].forEach(([hx, hy]) => {
        c.beginPath(); c.arc(hx, hy, 3.2, 0, 7); c.fill(); c.stroke();
      });
      label(c, "مصنع الجبن", mid.x, mid.y - 46);
      return;
    }
  }
  function drawDrop(c) {
    const p = toScreen(DROP.x, DROP.y);
    c.fillStyle = "rgba(0,0,0,.18)"; c.beginPath(); c.ellipse(p.x, p.y + 6, 16, 7, 0, 0, 7); c.fill();
    c.fillStyle = "#8d6e63"; c.fillRect(p.x - 4, p.y - 28, 7, 30);
    c.fillStyle = "#efebe9"; c.fillRect(p.x - 22, p.y - 52, 44, 26);
    c.strokeStyle = "#5d4037"; c.lineWidth = 2; c.strokeRect(p.x - 22, p.y - 52, 44, 26);
    c.fillStyle = "#c62828"; c.font = "bold 11px Tahoma"; c.textAlign = "center";
    c.fillText("توصيل", p.x, p.y - 36);
    c.fillStyle = "#a1887f"; c.fillRect(p.x + 16, p.y - 8, 14, 10);
    if (state.order) { c.font = "14px sans-serif"; c.fillText("📦", p.x + 23, p.y - 10); }
  }
  function drawTruck(c, x, y, t) {
    const p = toScreen(x, y);
    const bob = player.riding && player.moving ? Math.sin(t * 18) * 1.2 : 0;
    c.fillStyle = "rgba(0,0,0,.25)"; c.beginPath(); c.ellipse(p.x, p.y + 8, 26, 9, 0, 0, 7); c.fill();
    c.save(); c.translate(p.x, p.y + 2 - bob); c.scale(player.flip, 1);
    c.fillStyle = "#1565c0";
    c.beginPath(); c.moveTo(-30, -6); c.lineTo(-30, -22); c.lineTo(-8, -22); c.lineTo(-4, -34); c.lineTo(18, -34); c.lineTo(22, -22); c.lineTo(28, -22); c.lineTo(28, -6); c.closePath(); c.fill();
    c.fillStyle = "#0d47a1"; c.fillRect(-28, -20, 18, 14);
    if (state.order) {
      c.fillStyle = "#8d6e63"; c.fillRect(-26, -28, 14, 10);
      c.fillStyle = "#a1887f"; c.fillRect(-24, -32, 10, 6);
      c.font = "11px sans-serif"; c.fillText("📦", -22, -22);
    } else {
      c.fillStyle = "#90caf9"; c.fillRect(-26, -18, 14, 8);
    }
    c.fillStyle = "#bbdefb"; c.fillRect(2, -32, 14, 10);
    c.strokeStyle = "#0d47a1"; c.strokeRect(2, -32, 14, 10);
    c.fillStyle = "#fbc02d"; c.fillRect(22, -16, 5, 4); c.fillRect(-30, -16, 4, 4);
    c.fillStyle = "#212121";
    c.beginPath(); c.arc(-16, -2, 6, 0, 7); c.fill();
    c.beginPath(); c.arc(16, -2, 6, 0, 7); c.fill();
    c.fillStyle = "#9e9e9e"; c.beginPath(); c.arc(-16, -2, 2.5, 0, 7); c.fill(); c.beginPath(); c.arc(16, -2, 2.5, 0, 7); c.fill();
    if (player.riding) {
      c.fillStyle = "#e0b089"; c.beginPath(); c.arc(8, -38, 6, 0, 7); c.fill();
      c.fillStyle = "#d7b56d"; c.beginPath(); c.ellipse(8, -44, 8, 3, 0, 0, 7); c.fill();
    }
    c.restore();
    c.font = "10px Tahoma"; c.fillStyle = "#fff8e4"; c.textAlign = "center";
    c.fillText(state.order ? "طلب جاهز" : "سيارة شايف", p.x, p.y - 48);
  }
  function drawCrop(c, x, y, plot, t) {
    const crop = CROPS[plot.crop.id], st = growStage(plot.crop, Date.now()), p = toScreen(x, y);
    const ready = st >= 3, bob = ready ? Math.sin(t * 6) * 3 : 0, h = 8 + st * 9;
    ink(c); c.strokeStyle = "#43a047"; c.lineWidth = 2.4; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, p.y - h - bob); c.stroke();
    if (st === 0) { c.fillStyle = "#8d6e63"; c.beginPath(); c.arc(p.x, p.y - 3, 3.4, 0, 7); c.fill(); }
    else if (st === 1) {
      c.fillStyle = "#81c784"; c.beginPath(); c.ellipse(p.x - 6, p.y - 12, 7, 3.5, -0.5, 0, 7); c.fill();
      c.beginPath(); c.ellipse(p.x + 6, p.y - 12, 7, 3.5, 0.5, 0, 7); c.fill();
    } else {
      c.fillStyle = crop.color; c.beginPath(); c.ellipse(p.x, p.y - h - 7 - bob, 8 + st, 9 + st, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(p.x - 3, p.y - h - 10 - bob, 3, 2, 0, 0, 7); c.fill();
      if (ready) { c.fillStyle = "#fff59d"; c.font = "bold 9px Tahoma"; c.textAlign = "center"; c.fillText("جاهز", p.x, p.y - h - 20 - bob); }
    }
  }

  function drawShayef(c, t) {
    const p = toScreen(player.x, player.y);
    const walk = player.state === "walk";
    const ph = player.anim * (walk ? 11 : 2);
    const bob = walk ? Math.abs(Math.sin(ph)) * 3.6 : Math.sin(t * 2.1) * 1.1;
    const leg = walk ? Math.sin(ph) : 0;
    const lean = walk ? Math.sin(ph) * 0.06 : 0;
    let arm = walk ? Math.sin(ph) * 0.9 : 0.12;
    let bend = 0, tool = null, toolAng = 0;
    if (player.state === "hoe" || player.state === "chop") {
      const k = 1 - Math.max(0, player.busy) / 0.7;
      toolAng = -1.15 + Math.sin(k * Math.PI) * 2.15; arm = toolAng; tool = player.state; bend = 7;
    }
    if (player.state === "water") { tool = "can"; arm = 0.55; }
    if (player.state === "harvest") { bend = 15 + Math.sin(player.anim * 10) * 4; arm = 0.85; }
    const blink = (Math.sin(t * 2.7) > 0.97);
    c.fillStyle = "rgba(20,30,10,.28)"; c.beginPath(); c.ellipse(p.x, p.y + 8, 16, 6, 0, 0, 7); c.fill();
    c.save(); c.translate(p.x, p.y + 6 - bob); c.scale(player.flip, 1); c.rotate(lean);

    c.fillStyle = "#4e342e";
    c.beginPath(); c.ellipse(-7, 3 + leg * 5.5, 5.4, 3.3, 0.1, 0, 7); c.fill();
    c.beginPath(); c.ellipse(7, 3 - leg * 5.5, 5.4, 3.3, -0.1, 0, 7); c.fill();
    c.fillStyle = "#3e2723";
    c.fillRect(-9.5, -14, 6.5, 16 + leg * 5.5);
    c.fillRect(3, -14, 6.5, 16 - leg * 5.5);
    c.fillStyle = "#6d4c41";
    c.fillRect(-9.5, -2 + leg * 5.5, 6.5, 4);
    c.fillRect(3, -2 - leg * 5.5, 6.5, 4);

    c.fillStyle = "#f7f1e4";
    c.beginPath();
    c.moveTo(-14, -18 - bend);
    c.lineTo(-12, -50);
    c.lineTo(12, -50);
    c.lineTo(14, -18 - bend);
    c.quadraticCurveTo(0, -10, -14, -18 - bend);
    c.closePath(); c.fill();
    c.strokeStyle = "#d7cbb8"; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = "#c9a227"; c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(-11, -20); c.lineTo(11, -20); c.stroke();

    c.fillStyle = "#2e7d32";
    c.beginPath(); c.moveTo(-10, -49); c.lineTo(-9, -22); c.lineTo(9, -22); c.lineTo(10, -49); c.lineTo(4, -36); c.lineTo(0, -28); c.lineTo(-4, -36); c.closePath(); c.fill();
    c.fillStyle = "#c9a227";
    c.beginPath(); c.arc(-4, -40, 1.5, 0, 7); c.fill();
    c.beginPath(); c.arc(-4, -32, 1.5, 0, 7); c.fill();
    c.fillStyle = "#1b5e20"; c.fillRect(-7, -24, 14, 4);
    c.fillStyle = "#6d4c41"; c.fillRect(-8, -21, 16, 3);

    c.strokeStyle = "#f7f1e4"; c.lineWidth = 7; c.lineCap = "round";
    c.beginPath(); c.moveTo(-9, -46); c.lineTo(-15, -30 + arm * 11); c.stroke();
    c.beginPath(); c.moveTo(9, -46); c.lineTo(16, -31 - arm * 12); c.stroke();
    c.fillStyle = "#d4a574";
    c.beginPath(); c.arc(-15, -28 + arm * 11, 4.4, 0, 7); c.fill();
    c.beginPath(); c.arc(16.5, -29 - arm * 12, 4.4, 0, 7); c.fill();

    if (tool === "hoe" || tool === "chop") {
      c.save(); c.translate(16.5, -29 - arm * 12); c.rotate(toolAng);
      c.strokeStyle = "#6d4c41"; c.lineWidth = 3.2; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 24); c.stroke();
      c.fillStyle = tool === "chop" ? "#90a4ae" : "#8d6e63";
      c.beginPath(); c.moveTo(-9, 22); c.lineTo(11, 19); c.lineTo(9, 28); c.lineTo(-7, 26); c.closePath(); c.fill();
      c.restore();
    }
    if (tool === "can") {
      c.fillStyle = "#42a5f5"; c.fillRect(14, -28, 13, 11); c.fillRect(25, -24, 7, 4);
      c.strokeStyle = "#1565c0"; c.strokeRect(14, -28, 13, 11);
      bits.push({ x: player.x + 0.22 * player.flip, y: player.y, vx: 0.45 * player.flip, vy: 0.55, life: 0.4, color: "#4fc3f7" });
    }

    c.fillStyle = "#c48a5a";
    c.beginPath(); c.ellipse(0, -52, 6, 4, 0, 0, 7); c.fill();

    c.fillStyle = "#d4a574";
    c.beginPath(); c.ellipse(0, -62, 14.5, 15.2, 0, 0, 7); c.fill();
    c.fillStyle = "#c48a5a";
    c.beginPath(); c.ellipse(-13.5, -61, 3.4, 4.2, 0.2, 0, 7); c.fill();
    c.beginPath(); c.ellipse(13.5, -61, 3.4, 4.2, -0.2, 0, 7); c.fill();

    c.fillStyle = "#4e342e";
    c.beginPath(); c.ellipse(0, -70, 13, 6, 0, 0, Math.PI, true); c.fill();
    c.beginPath(); c.ellipse(-11, -64, 4, 5, 0.4, 0, 7); c.fill();
    c.beginPath(); c.ellipse(11, -64, 4, 5, -0.4, 0, 7); c.fill();

    if (blink) {
      c.strokeStyle = "#3e2723"; c.lineWidth = 1.6; c.lineCap = "round";
      c.beginPath(); c.moveTo(-7.5, -64); c.lineTo(-2.5, -64); c.stroke();
      c.beginPath(); c.moveTo(2.5, -64); c.lineTo(7.5, -64); c.stroke();
    } else {
      c.fillStyle = "#fff";
      c.beginPath(); c.ellipse(-5, -64, 4.1, 4.6, 0, 0, 7); c.fill();
      c.beginPath(); c.ellipse(5, -64, 4.1, 4.6, 0, 0, 7); c.fill();
      c.fillStyle = "#5d4037";
      c.beginPath(); c.arc(-4.6, -63.6, 2.3, 0, 7); c.fill();
      c.beginPath(); c.arc(5.4, -63.6, 2.3, 0, 7); c.fill();
      c.fillStyle = "#1a120c";
      c.beginPath(); c.arc(-4.4, -63.4, 1.15, 0, 7); c.fill();
      c.beginPath(); c.arc(5.6, -63.4, 1.15, 0, 7); c.fill();
      c.fillStyle = "#fff";
      c.beginPath(); c.arc(-3.5, -64.6, 0.85, 0, 7); c.fill();
      c.beginPath(); c.arc(6.5, -64.6, 0.85, 0, 7); c.fill();
    }
    c.fillStyle = "#3e2723";
    c.beginPath(); c.ellipse(-5.2, -69.2, 3.2, 1.1, 0.15, 0, 7); c.fill();
    c.beginPath(); c.ellipse(5.2, -69.2, 3.2, 1.1, -0.15, 0, 7); c.fill();

    c.fillStyle = "#c48a5a";
    c.beginPath(); c.ellipse(0, -59.2, 2.4, 1.8, 0, 0, 7); c.fill();
    c.strokeStyle = "#a06a48"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -59); c.lineTo(0, -56.5); c.stroke();

    c.fillStyle = "#e57373"; c.globalAlpha = 0.42;
    c.beginPath(); c.ellipse(-9.5, -59, 3.4, 2, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(9.5, -59, 3.4, 2, 0, 0, 7); c.fill();
    c.globalAlpha = 1;
    c.strokeStyle = "#a06a48"; c.lineWidth = 1.7; c.lineCap = "round";
    c.beginPath(); c.arc(0, -56.5, 5.2, 0.2, Math.PI - 0.2); c.stroke();

    c.fillStyle = "#e8c56b";
    c.beginPath(); c.ellipse(0, -73, 19, 5.2, 0, 0, 7); c.fill();
    c.strokeStyle = "#b89a4a"; c.lineWidth = 1.3; c.stroke();
    c.fillStyle = "#d7b56d";
    c.beginPath(); c.ellipse(0, -80, 11.5, 7.5, 0, 0, 7); c.fill();
    c.stroke();
    c.fillStyle = "#c62828";
    c.fillRect(-11, -75, 22, 3);
    c.fillStyle = "#fdd835";
    c.beginPath(); c.moveTo(14, -80); c.lineTo(22, -86); c.lineTo(18, -78); c.closePath(); c.fill();
    c.fillStyle = "#c9a227";
    c.beginPath(); c.arc(0, -73, 2, 0, 7); c.fill();

    c.restore();
  }

  function drawFauna(c, f, t) {
    const p = toScreen(f.x, f.y);
    if (f.kind === "butterfly") {
      const flap = 4 + Math.abs(Math.sin(t * 10 + f.t)) * 5;
      c.fillStyle = ["#ec407a", "#7e57c2", "#42a5f5"][Math.abs(Math.floor(f.z)) % 3];
      c.save(); c.translate(p.x, p.y - f.z);
      c.beginPath(); c.ellipse(-flap, 0, flap, 4, -0.4, 0, 7); c.fill();
      c.beginPath(); c.ellipse(flap, 0, flap, 4, 0.4, 0, 7); c.fill(); c.restore(); return;
    }
    const bob = Math.sin(f.t * 7) * 2;
    c.fillStyle = "rgba(0,0,0,.2)"; c.beginPath(); c.ellipse(p.x, p.y + 4, f.kind === "cow" ? 15 : 10, 5, 0, 0, 7); c.fill();
    c.save(); c.translate(p.x, p.y - bob); c.scale(f.flip || 1, 1);
    if (f.kind === "chicken") {
      c.fillStyle = "#fff"; c.strokeStyle = "#2a1508"; c.lineWidth = 1.3;
      c.beginPath(); c.ellipse(0, -8, 9, 8, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.arc(8, -16, 5, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "#e53935"; c.beginPath(); c.arc(8, -21, 2.3, 0, 7); c.fill();
      c.fillStyle = "#fbc02d"; c.beginPath(); c.moveTo(13, -16); c.lineTo(18, -14); c.lineTo(13, -13); c.fill();
      const st = state.animals.chicken; if (st.owned && Date.now() >= st.readyAt) { c.font = "13px sans-serif"; c.fillText("🥚", 2, -28); }
    } else if (f.kind === "cow") {
      c.fillStyle = "#efebe9"; c.strokeStyle = "#2a1508"; c.lineWidth = 1.3;
      c.beginPath(); c.ellipse(0, -12, 16, 11, 0, 0, 7); c.fill(); c.stroke();
      c.fillStyle = "#3e2723"; c.beginPath(); c.ellipse(-6, -14, 4, 5, 0, 0, 7); c.fill();
      c.fillStyle = "#efebe9"; c.beginPath(); c.arc(14, -20, 7, 0, 7); c.fill(); c.stroke();
      const st = state.animals.cow; if (st.owned && Date.now() >= st.readyAt) { c.font = "13px sans-serif"; c.fillText("🥛", 0, -32); }
    } else {
      c.fillStyle = "#eceff1"; c.strokeStyle = "#2a1508"; c.lineWidth = 1.3;
      c.beginPath(); c.ellipse(0, -10, 11, 8, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.arc(10, -16, 5, 0, 7); c.fill(); c.stroke();
      const st = state.animals.goat; if (st.owned && Date.now() >= st.readyAt) { c.font = "13px sans-serif"; c.fillText("🧀", 0, -28); }
    }
    c.restore();
  }

  function drawHouseInside(c, t) {
    const sky = c.createLinearGradient(0, 0, 0, viewH);
    sky.addColorStop(0, "#7ec8e3"); sky.addColorStop(0.4, "#d7ccc8"); sky.addColorStop(1, "#6d4c41");
    c.fillStyle = sky; c.fillRect(0, 0, viewW, viewH);
    // back wall
    c.fillStyle = "#e8d5b5"; c.fillRect(0, 0, viewW, viewH * 0.42);
    c.fillStyle = "#d7c4a0"; c.fillRect(0, viewH * 0.38, viewW, 10);
    // window with curtains
    const win = toScreen(5, 1.1);
    c.fillStyle = "#81d4fa"; c.fillRect(win.x - 28, win.y - 86, 56, 32);
    c.strokeStyle = "#5d4037"; c.lineWidth = 3; c.strokeRect(win.x - 28, win.y - 86, 56, 32);
    c.beginPath(); c.moveTo(win.x, win.y - 86); c.lineTo(win.x, win.y - 54); c.moveTo(win.x - 28, win.y - 70); c.lineTo(win.x + 28, win.y - 70); c.stroke();
    c.fillStyle = "#c62828"; c.globalAlpha = 0.85; c.fillRect(win.x - 30, win.y - 88, 10, 36); c.fillRect(win.x + 20, win.y - 88, 10, 36); c.globalAlpha = 1;
    // portrait
    if (imgShayef.complete && imgShayef.naturalWidth) {
      const por = toScreen(3.0, 1.2);
      c.fillStyle = "#5d4037"; c.fillRect(por.x - 16, por.y - 92, 28, 38);
      c.drawImage(imgShayef, por.x - 14, por.y - 90, 24, 34);
    }
    for (let y = 0; y < 7; y++) for (let x = 0; x < 10; x++) {
      const p = toScreen(x + 0.5, y + 0.5);
      const odd = (x + y) % 2 === 0;
      drawBlock(c, p.x, p.y, odd ? "#d2b48c" : "#c4a574", "#8d6e4c", "#6d4c31", 8);
    }
    // rug
    const rug = toScreen(5.0, 3.6);
    c.fillStyle = "#b71c1c"; c.beginPath(); c.ellipse(rug.x, rug.y, 48, 18, 0, 0, 7); c.fill();
    c.fillStyle = "#fbc02d"; c.beginPath(); c.ellipse(rug.x, rug.y, 28, 10, 0, 0, 7); c.fill();
    // bed
    const bed = toScreen(1.7, 1.6);
    c.fillStyle = "#4e342e"; c.fillRect(bed.x - 32, bed.y - 40, 64, 38);
    c.fillStyle = "#1565c0"; c.fillRect(bed.x - 28, bed.y - 34, 56, 24);
    c.fillStyle = "#e3f2fd"; c.fillRect(bed.x - 26, bed.y - 44, 18, 12);
    c.fillStyle = "#fff"; c.fillRect(bed.x - 8, bed.y - 42, 16, 10);
    c.fillStyle = "#c62828"; c.fillRect(bed.x + 10, bed.y - 22, 18, 10);
    // nightstand + lamp
    const ns = toScreen(2.8, 1.5);
    c.fillStyle = "#6d4c41"; c.fillRect(ns.x - 8, ns.y - 18, 16, 16);
    c.fillStyle = "#ffe082"; c.beginPath(); c.moveTo(ns.x - 6, ns.y - 22); c.lineTo(ns.x, ns.y - 32); c.lineTo(ns.x + 6, ns.y - 22); c.fill();
    // quest board
    const board = toScreen(7.4, 1.35);
    c.fillStyle = "#efebe9"; c.fillRect(board.x - 26, board.y - 58, 52, 40);
    c.strokeStyle = "#5d4037"; c.lineWidth = 2; c.strokeRect(board.x - 26, board.y - 58, 52, 40);
    c.fillStyle = "#fffde7"; c.fillRect(board.x - 20, board.y - 50, 16, 18); c.fillRect(board.x + 2, board.y - 48, 16, 14);
    c.font = "12px Tahoma"; c.fillStyle = "#3e2723"; c.textAlign = "center"; c.fillText("المهام", board.x, board.y - 18);
    // sofa
    const sofa = toScreen(3.4, 3.5);
    c.fillStyle = "#2e7d32"; c.fillRect(sofa.x - 28, sofa.y - 22, 56, 20);
    c.fillStyle = "#1b5e20"; c.fillRect(sofa.x - 30, sofa.y - 28, 10, 26); c.fillRect(sofa.x + 20, sofa.y - 28, 10, 26);
    c.fillStyle = "#fff8e1"; c.fillRect(sofa.x - 8, sofa.y - 26, 14, 8);
    // table + chairs + fruit
    const table = toScreen(5.2, 3.3);
    c.fillStyle = "#6d4c41"; c.fillRect(table.x - 20, table.y - 16, 40, 16);
    c.fillStyle = "#8d6e63"; c.fillRect(table.x - 18, table.y - 20, 36, 8);
    c.fillStyle = "#e53935"; c.beginPath(); c.arc(table.x - 6, table.y - 24, 4, 0, 7); c.fill();
    c.fillStyle = "#43a047"; c.beginPath(); c.arc(table.x + 4, table.y - 23, 4, 0, 7); c.fill();
    c.fillStyle = "#ffe082"; c.beginPath(); c.arc(table.x + 10, table.y - 22, 3, 0, 7); c.fill();
    c.fillStyle = "#5d4037"; c.fillRect(table.x - 28, table.y - 10, 10, 12); c.fillRect(table.x + 18, table.y - 10, 10, 12);
    // cupboard
    const cup = toScreen(1.6, 4.4);
    c.fillStyle = "#5d4037"; c.fillRect(cup.x - 18, cup.y - 44, 36, 44);
    c.fillStyle = "#8d6e63"; c.fillRect(cup.x - 14, cup.y - 38, 28, 12); c.fillRect(cup.x - 14, cup.y - 22, 28, 14);
    c.fillStyle = "#fbc02d"; c.fillRect(cup.x + 8, cup.y - 18, 4, 4);
    c.fillStyle = "#fff8e4"; c.font = "11px Tahoma"; c.fillText("بذور", cup.x, cup.y - 48);
    // plant
    const pl = toScreen(8.6, 2.2);
    c.fillStyle = "#8d6e63"; c.fillRect(pl.x - 6, pl.y - 8, 12, 10);
    c.fillStyle = "#2e7d32"; c.beginPath(); c.ellipse(pl.x, pl.y - 18, 10, 12, 0, 0, 7); c.fill();
    // chest
    const chest = toScreen(8.1, 4.6);
    c.fillStyle = "#6d4c41"; c.fillRect(chest.x - 20, chest.y - 24, 40, 24);
    c.fillStyle = "#8d6e63"; c.fillRect(chest.x - 18, chest.y - 20, 36, 12);
    c.fillStyle = "#fbc02d"; c.fillRect(chest.x - 4, chest.y - 12, 8, 6);
    c.font = "11px Tahoma"; c.fillStyle = "#fff8e4"; c.fillText("صندوق", chest.x, chest.y - 28);
    // door
    const door = toScreen(4.8, 6.2);
    c.fillStyle = "#3e2723"; c.fillRect(door.x - 18, door.y - 46, 36, 46);
    c.fillStyle = "#5d4037"; c.fillRect(door.x - 15, door.y - 42, 30, 42);
    c.fillStyle = "#fbc02d"; c.beginPath(); c.arc(door.x + 8, door.y - 20, 2.4, 0, 7); c.fill();
    c.fillStyle = "#ffe082"; c.font = "12px Tahoma"; c.fillText("باب", door.x, door.y - 50);
    bits.forEach((b) => { const p = toScreen(b.x, b.y); c.globalAlpha = Math.max(0, b.life); c.fillStyle = b.color; c.beginPath(); c.arc(p.x, p.y, 3, 0, 7); c.fill(); c.globalAlpha = 1; });
    drawShayef(c, t);
  }

  /* ===== HUD ===== */
  function hud() {
    $("#hud-coins").textContent = state.coins; $("#hud-gems").textContent = state.gems; $("#hud-level").textContent = state.level;
    const need = xpNeeded(state.level); $("#xp-fill").style.width = Math.min(100, (state.xp / need) * 100) + "%"; $("#xp-label").textContent = state.xp + " / " + need;
  }
  function renderTray() {
    const owned = Object.values(CROPS).filter((c) => (state.seeds[c.id] || 0) > 0 && state.level >= c.lv);
    $("#seed-tray").innerHTML = owned.map((c) => `<button class="seed-btn ${selectedSeed === c.id ? "active" : ""}" data-seed="${c.id}"><div class="se">${c.emoji}</div><div class="sc">×${state.seeds[c.id]}</div></button>`).join("") +
      `<button class="seed-btn add" data-tab-jump="shop"><div class="se">➕</div><div class="sc">بذور</div></button>`;
  }
  function renderPanel() {
    if (activeTab === "farm") { $("#panel").classList.add("hidden"); return; }
    $("#panel").classList.remove("hidden");
    $("#panel-title").textContent = { shop: "البذور والسوق", quests: "المهام", barn: "الصندوق" }[activeTab];
    if (activeTab === "shop") renderShop(); if (activeTab === "quests") renderQuests(); if (activeTab === "barn") renderBarn();
  }
  function renderShop() {
    const segs = [["seeds", "بذور"], ["build", "بناء"], ["animals", "حيوانات"], ["up", "تحسين"]];
    let html = `<div class="seg">${segs.map(([id, n]) => `<button data-shopseg="${id}" class="${shopSeg === id ? "on" : ""}">${n}</button>`).join("")}</div>`;
    if (shopSeg === "seeds") html += Object.values(CROPS).map((c) => {
      const locked = state.level < c.lv;
      return `<div class="card"><div class="ce">${c.emoji}</div><div><h3>${c.name}</h3><p>ينمو ${formatTime(c.grow)} · بيع ${sellPrice(c)}🪙</p></div><div>${locked ? `<div class="lock-note">مستوى ${c.lv}</div>` : `<button class="btn tiny" data-buy-seed="${c.id}">اشترِ</button>`}</div></div>`;
    }).join("");
    if (shopSeg === "build") html += SITES.map((s) => {
      const open = isOpen(s.x, s.y);
      return `<div class="card"><div class="ce">🏗️</div><div><h3>${s.name}</h3><p>مستوى ${s.lv} · ${s.cost}🪙</p><div class="meta">${open ? "الأرض جاهزة" : "اقطع الغابة للوصول"}</div></div><div>${state.built[s.id] ? `<div class="lock-note">مبني ✓</div>` : `<button class="btn tiny" data-build="${s.id}" ${!open || state.level < s.lv ? "disabled" : ""}>ابنِ</button>`}</div></div>`;
    }).join("");
    if (shopSeg === "animals") html += Object.values(ANIMALS).map((a) => {
      const st = state.animals[a.id], need = !state.built[a.need];
      return `<div class="card"><div class="ce">${a.emoji}</div><div><h3>${a.name}</h3><p>${a.productName} كل ${formatTime(a.interval)}</p><div class="meta">${st.owned}/${a.max} · يلزم ${SITES.find((s) => s.id === a.need).name}</div></div><div>${need ? `<div class="lock-note">ابنِ المبنى أولاً</div>` : st.owned >= a.max ? `<div class="lock-note">مكتمل</div>` : `<button class="btn tiny" data-buy-animal="${a.id}">${a.cost}🪙</button>`}</div></div>`;
    }).join("");
    if (shopSeg === "up") html += `<div class="card"><div class="ce">🎃</div><div><h3>الفزاعة</h3><p>+10٪ خبرة</p></div><div>${state.upgrades.scarecrow ? `<div class="lock-note">تم</div>` : `<button class="btn tiny" data-up="scarecrow">220🪙</button>`}</div></div>`;
    $("#panel-body").innerHTML = html;
  }
  function renderQuests() {
    const segs = [["story", "رحلة شايف"], ["daily", "اليوم"], ["ach", "إنجازات"]];
    let html = `<div class="seg">${segs.map(([id, n]) => `<button data-questseg="${id}" class="${questSeg === id ? "on" : ""}">${n}</button>`).join("")}</div>`;
    if (questSeg === "story") {
      const q = STORY[state.story];
      if (!q) html += `<div class="empty-state"><div class="ee">🌟</div><p>كمّلت الرحلة!</p></div>`;
      else { const ready = q.check(state); html += `<div class="quest"><h3>${q.title}</h3><p>${q.desc}</p><div class="bar"><i style="width:${ready ? 100 : 30}%"></i></div><div class="qrow"><span class="reward">🎁 ${q.reward.coins || 0}🪙</span><button class="btn tiny" data-claim-story="1" ${ready ? "" : "disabled"}>${ready ? "استلم" : "تابع"}</button></div></div>`; }
    }
    if (questSeg === "daily") { refreshDaily(); html += state.daily.map((q) => { const p = dailyProgress(q), done = p >= q.target; return `<div class="quest"><h3>${q.title}</h3><p>${q.desc}</p><div class="bar"><i style="width:${(p / q.target) * 100}%"></i></div><div class="qrow"><span>${p}/${q.target}</span><button class="btn tiny" data-claim-daily="${q.id}" ${done && !q.claimed ? "" : "disabled"}>${q.claimed ? "تم" : done ? "استلم" : "تابع"}</button></div></div>`; }).join(""); }
    if (questSeg === "ach") html += ACHIEVEMENTS.map((a) => `<div class="quest"><h3>${state.achievements[a.id] ? "✅ " : "🔒 "}${a.title}</h3><p>${a.desc}</p></div>`).join("");
    $("#panel-body").innerHTML = html;
  }
  function renderBarn() {
    const ids = Object.keys(state.items).filter((id) => state.items[id] > 0);
    if (!ids.length) { $("#panel-body").innerHTML = `<div class="empty-state"><div class="ee">📦</div><p>الصندوق فارغ. احصد ثم عُد.</p></div>`; return; }
    let html = `<button class="btn" data-sell-all="1" style="width:100%;margin-bottom:8px">بيع الكل</button>`;
    html += ids.map((id) => { const c = CROPS[id], q = state.items[id]; return `<div class="card"><div class="ce">${c.emoji}</div><div><h3>${c.name} ×${q}</h3><p>${sellPrice(c)}🪙 للحبة</p></div><div><button class="btn tiny" data-sell="${id}">بيع 1</button></div></div>`; }).join("");
    $("#panel-body").innerHTML = html;
  }
  function setTab(tab) { activeTab = tab; renderPanel(); sfx("click"); }
  function openSettings() {
    closeModal(); closeSheet();
    syncSettingsForm();
    $("#settings").classList.remove("hidden");
    unlockAudio();
  }
  function closeSettings() { $("#settings").classList.add("hidden"); }
  function goMenu() {
    running = false; closeSettings(); closeModal(); closeSheet();
    $("#game").classList.add("hidden"); $("#menu").classList.remove("hidden");
    save();
  }
  function beginLayoutEdit() {
    if (!started) { toast("ادخل اللعبة أولاً عشان تعدّل مواقع الأزرار"); return; }
    closeSettings();
    $("#game").classList.add("layout-edit");
    $("#layout-bar").classList.remove("hidden");
  }
  function endLayoutEdit() {
    $("#game").classList.remove("layout-edit");
    $("#layout-bar").classList.add("hidden");
    save();
  }
  function resetLayout() {
    const u = uiCfg();
    u.custom = false; u.pos = {}; u.joySide = "left"; u.ctrlScale = 1;
    applyUI(); save(); toast("رجّعنا الأزرار لمواقعها");
  }

  function resize() {
    const cv = $("#view"), st = $("#stage");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    viewW = st.clientWidth; viewH = st.clientHeight;
    cv.width = Math.floor(viewW * dpr); cv.height = Math.floor(viewH * dpr);
    cv.style.width = viewW + "px"; cv.style.height = viewH + "px";
    ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = true;
  }
  function setJoyFromEvent(e) {
    const r = $(".joy-base").getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 10, len = Math.hypot(dx, dy) || 1;
    if (len > max) { dx *= max / len; dy *= max / len; }
    joy.x = dx / max; joy.y = dy / max; joy.on = true;
    $("#joy-knob").style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }
  function resetJoy() { joy.x = 0; joy.y = 0; joy.on = false; joy.pid = null; $("#joy-knob").style.transform = "translate(-50%, -50%)"; }

  function bind() {
    $("#btn-start").onclick = startGame;
    $("#btn-menu-settings").onclick = () => { unlockAudio(); openSettings(); };
    $("#menu").addEventListener("pointerdown", unlockAudio, { once: true });
    $("#btn-act").onclick = (e) => { e.preventDefault(); if ($("#game").classList.contains("layout-edit")) return; if (!uiOpen()) doAction(); };
    $("#btn-settings").onclick = openSettings;
    $("#btn-to-menu").onclick = goMenu;
    $("#btn-layout-edit").onclick = beginLayoutEdit;
    $("#btn-layout-done").onclick = endLayoutEdit;
    $("#btn-layout-reset").onclick = resetLayout;
    $("#tog-music").onclick = () => { const u = uiCfg(); u.musicOn = !u.musicOn; if (u.musicOn) ensureMusic(); else stopMusic(); save(); syncSettingsForm(); sfx("click"); };
    $("#tog-sfx").onclick = () => { state.sound = !state.sound; save(); syncSettingsForm(); sfx("click"); };
    $("#vol-music").oninput = (e) => { uiCfg().musicVol = (+e.target.value) / 100; ensureMusic(); save(); };
    $("#vol-sfx").oninput = (e) => { uiCfg().sfxVol = (+e.target.value) / 100; save(); };
    $("#ctrl-scale").oninput = (e) => { uiCfg().ctrlScale = (+e.target.value) / 100; $("#ctrl-scale-lab").textContent = e.target.value + "%"; applyUI(); save(); };
    $("#joy-side").addEventListener("click", (e) => {
      const b = e.target.closest("[data-side]"); if (!b) return;
      uiCfg().joySide = b.dataset.side; uiCfg().custom = false; applyUI(); save(); sfx("click");
    });
    $("#btn-reset").onclick = () => { if (!confirm("مسح المزرعة؟")) return; localStorage.removeItem(SAVE_KEY); location.reload(); };
    $("#panel-close").onclick = () => setTab("farm");
    $("#chip-coins").onclick = () => { shopSeg = "seeds"; setTab("shop"); };
    $("#chip-level").onclick = () => { questSeg = "story"; setTab("quests"); };
    $("#chip-gems").onclick = () => { shopSeg = "build"; setTab("shop"); };
    $("#seed-tray").addEventListener("click", (e) => {
      const s = e.target.closest("[data-seed]"); if (s) { selectedSeed = s.dataset.seed; renderTray(); }
      const j = e.target.closest("[data-tab-jump]"); if (j) { shopSeg = "seeds"; setTab("shop"); }
    });
    const joyEl = $("#joy");
    joyEl.addEventListener("pointerdown", (e) => { if ($("#game").classList.contains("layout-edit")) return; joy.pid = e.pointerId; joyEl.setPointerCapture(e.pointerId); setJoyFromEvent(e); });
    joyEl.addEventListener("pointermove", (e) => { if ($("#game").classList.contains("layout-edit")) return; if (joy.pid === e.pointerId) setJoyFromEvent(e); });
    joyEl.addEventListener("pointerup", (e) => { if (joy.pid === e.pointerId) resetJoy(); });
    joyEl.addEventListener("pointercancel", resetJoy);
    let dragHud = null;
    function startHudDrag(e) {
      if (!$("#game").classList.contains("layout-edit")) return;
      const el = e.currentTarget, key = el.dataset.hud; if (!key) return;
      e.preventDefault(); e.stopPropagation();
      const st = $("#stage").getBoundingClientRect();
      dragHud = { el, key, id: e.pointerId, ox: e.clientX - el.getBoundingClientRect().left, oy: e.clientY - el.getBoundingClientRect().top, st };
      el.setPointerCapture(e.pointerId);
      uiCfg().custom = true; $("#game").dataset.custom = "1";
    }
    function moveHudDrag(e) {
      if (!dragHud || dragHud.id !== e.pointerId) return;
      const st = dragHud.st;
      let x = (e.clientX - st.left - dragHud.ox) / st.width;
      let y = (e.clientY - st.top - dragHud.oy) / st.height;
      x = Math.max(0.01, Math.min(0.88, x)); y = Math.max(0.08, Math.min(0.88, y));
      dragHud.el.style.setProperty("--hud-x", (x * 100) + "%");
      dragHud.el.style.setProperty("--hud-y", (y * 100) + "%");
      uiCfg().pos[dragHud.key] = { x, y };
    }
    function endHudDrag(e) {
      if (!dragHud || dragHud.id !== e.pointerId) return;
      dragHud = null; save();
    }
    ["#joy", "#btn-act", "#seed-tray"].forEach((sel) => {
      const el = $(sel);
      el.addEventListener("pointerdown", startHudDrag);
      el.addEventListener("pointermove", moveHudDrag);
      el.addEventListener("pointerup", endHudDrag);
      el.addEventListener("pointercancel", endHudDrag);
    });
    $("#view").addEventListener("pointerdown", (e) => {
      if (uiOpen() || e.target !== $("#view")) return;
      const r = $("#view").getBoundingClientRect();
      const w = screenToWorld(e.clientX - r.left, e.clientY - r.top);
      const d = Math.hypot(w.x - player.x, w.y - player.y);
      if (d < 1.05) doAction(); else walkTo = { x: w.x, y: w.y, act: false };
    });
    window.addEventListener("keydown", (e) => {
      keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if ((e.key === " " || e.key === "Enter" || e.key === "e") && !uiOpen()) doAction();
      if (e.key === "Escape") { closeModal(); closeSheet(); closeSettings(); if ($("#game").classList.contains("layout-edit")) endLayoutEdit(); else if (mode === "house") toggleHouse(); else setTab("farm"); }
    });
    window.addEventListener("keyup", (e) => { keys[e.key] = false; });
    window.addEventListener("resize", resize);
    document.addEventListener("click", (e) => {
      const d = (sel) => e.target.closest(sel);
      if (d("[data-close=modal]")) closeModal(); if (d("[data-close=sheet]")) closeSheet(); if (d("[data-close=settings]")) closeSettings();
      const bs = d("[data-buy-seed]"); if (bs) buySeed(bs.dataset.buySeed, 1);
      const bd = d("[data-build]"); if (bd) { closeSheet(); buildSite(bd.dataset.build); }
      const ba = d("[data-buy-animal]"); if (ba) buyAnimal(ba.dataset.buyAnimal);
      const upg = d("[data-up]"); if (upg) buyUpgrade(upg.dataset.up);
      const ss = d("[data-shopseg]"); if (ss) { shopSeg = ss.dataset.shopseg; renderShop(); }
      const qs = d("[data-questseg]"); if (qs) { questSeg = qs.dataset.questseg; renderQuests(); }
      if (d("[data-claim-story]")) claimStory();
      const cd = d("[data-claim-daily]"); if (cd) claimDaily(cd.dataset.claimDaily);
      if (d("[data-sell-all]")) sellAll();
      const sl = d("[data-sell]"); if (sl) sellItem(sl.dataset.sell, 1);
      const pl = d("[data-plant]"); if (pl) { plant(+pl.dataset.plot, pl.dataset.plant); closeSheet(); }
      const ft = d("[data-fert]"); if (ft) fertilize(+ft.dataset.fert);
      const ins = d("[data-instant]"); if (ins) instant(+ins.dataset.instant);
    });
  }

  function loop(t) {
    const dt = Math.min(0.033, (t - lastT) / 1000 || 0.016); lastT = t;
    if (running) { if (!uiOpen()) update(dt, t); else player.moving = false; draw(t); }
    requestAnimationFrame(loop);
  }
  function startGame() {
    unlockAudio();
    sfx("click");
    $("#menu").classList.add("hidden"); $("#game").classList.remove("hidden");
    applyUI();
    if (started) { running = true; resize(); return; }
    started = true;
    player.x = state.px || 9.2; player.y = state.py || 11.2; player.riding = false;
    if (!isOpen(player.x, player.y)) { player.x = 9.2; player.y = 11.2; }
    truckPos.x = TRUCK.x; truckPos.y = TRUCK.y;
    const ip = iso(player.x, player.y); cam.x = ip.sx; cam.y = ip.sy;
    resize(); rebuildMap(); ensureAnimalTimers(); spawnFauna();
    clouds = [{ x: 80, y: 36, s: 1, sp: 14 }, { x: 260, y: 58, s: 1.2, sp: 9 }, { x: 480, y: 28, s: 0.8, sp: 16 }];
    hud(); renderTray(); running = true;
    const login = checkDailyLogin(); refreshDaily();
    if (state.tutorial === 0) setTutorial(1);
    else if (login) openModal(`<h2>أهلاً بعودتك</h2><p>سلسلة ${login.streak} يوم · ${login.coins}🪙</p><div class="actions"><button class="btn" data-close="modal">إلى المزرعة</button></div>`);
    else say("ساحتنا صغيرة. الغابة تنتظر الفأس.");
  }

  state = load(); bind(); applyUI(); requestAnimationFrame(loop);
  if (localStorage.getItem(SAVE_KEY)) { $("#btn-start").textContent = "العودة إلى المزرعة"; $("#splash-hint").textContent = "شايف عند البيت"; }
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
