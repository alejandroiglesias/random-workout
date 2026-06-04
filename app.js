/* ============================================================
   CAST IRON — logic
   Data: yuhonas/free-exercise-db (runtime fetch, CORS-open)
   ============================================================ */
(() => {
  "use strict";

  const DATA_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
  const IMG_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FLIP_MS = reduceMotion ? 1400 : 640;
  const REST_SEC = 90;

  // pip layout on a 3×3 grid (cells 0..8) for each die face
  const FACES = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const $ = (id) => document.getElementById(id);
  const el = {
    timer: $("timer"), clock: $("clock"),
    restClock: $("rest-clock"), restTimer: $("rest-timer"), restBar: $("rest-bar"),
    setCount: $("set-count"), logSetBtn: $("log-set-btn"),
    finish: $("finish-btn"),
    editionDate: $("edition-date"), dbCount: $("db-count"),
    spotLoading: $("spot-loading"), spotEmpty: $("spot-empty"), spotCurrent: $("spot-current"),
    plate: $("plate"), plateImg: $("plate-img"), plateFig: $("plate-fig"),
    plateName: $("plate-name"), plateBadge: $("plate-badge"),
    exName: $("ex-name"), specs: $("specs"), muscles: $("muscles"), steps: $("steps"),
    caster: $("caster"), casterSub: $("caster-sub"),
    card: $("card"), cardCount: $("card-count"), cardEmpty: $("card-empty"), log: $("log"),
    rollbarBtn: $("rollbar-btn"),
    overlay: $("overlay"), tallyTime: $("tally-time"), tallyCount: $("tally-count"),
    tallyMuscles: $("tally-muscles"), tallySets: $("tally-sets"),
    tallyChips: $("tally-chips"), verdict: $("receipt-verdict"),
    newBtn: $("new-session-btn"), live: $("live"),
  };

  const state = {
    all: [], ready: false,
    session: [], counter: 0, currentN: null,
    started: false, startAt: 0, frozenMs: 0,
    timerInt: null, flipInt: null, flipFrame: 0, rolling: false,
    restInt: null, restEnd: 0,
  };

  const imgURL = (p) => IMG_BASE + p;
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "—");

  /* ---------- die rendering ---------- */
  function buildDice() {
    document.querySelectorAll(".die").forEach((d) => {
      d.innerHTML = "";
      for (let i = 0; i < 9; i++) {
        const pip = document.createElement("span");
        pip.className = "pip";
        d.appendChild(pip);
      }
      setDieFace(d, +d.dataset.face || 5);
    });
  }
  function setDieFace(d, face) {
    d.dataset.face = face;
    const on = FACES[face];
    d.querySelectorAll(".pip").forEach((pip, i) => pip.classList.toggle("on", on.includes(i)));
  }
  function rollDiceVisual() {
    const face = 1 + Math.floor(Math.random() * 6);
    document.querySelectorAll(".die").forEach((d) => {
      if (!reduceMotion) {
        d.classList.remove("rolling");
        void d.offsetWidth;
        d.classList.add("rolling");
      }
      setTimeout(() => setDieFace(d, face), reduceMotion ? 0 : 150);
    });
  }

  /* ---------- timer ---------- */
  function fmt(ms) {
    const t = Math.floor(ms / 1000);
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }
  function startTimer() {
    state.started = true;
    state.startAt = Date.now();
    el.clock.dataset.running = "true";
    el.finish.disabled = false;
    el.timerInt = setInterval(() => {
      el.timer.textContent = fmt(Date.now() - state.startAt);
    }, 250);
  }
  function stopTimer() {
    state.frozenMs = state.started ? Date.now() - state.startAt : 0;
    clearInterval(state.timerInt);
    el.clock.dataset.running = "false";
  }

  /* ---------- rest timer ---------- */
  function fmtRest(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
  }
  function stopRestTimer() {
    clearInterval(state.restInt);
    state.restInt = null;
    el.restClock.dataset.active = "false";
    el.restClock.setAttribute("aria-hidden", "true");
    el.restClock.style.removeProperty("--rest-pct");
  }
  function tickRest() {
    const left = Math.max(0, state.restEnd - Date.now());
    const pct = (left / (REST_SEC * 1000)) * 100;
    el.restTimer.textContent = fmtRest(left);
    el.restClock.style.setProperty("--rest-pct", String(pct));
    if (left <= 0) {
      stopRestTimer();
      announce("Rest complete — back to the iron.");
    }
  }
  function startRestTimer() {
    clearInterval(state.restInt);
    state.restInt = null;
    state.restEnd = Date.now() + REST_SEC * 1000;
    el.restClock.dataset.active = "true";
    el.restClock.setAttribute("aria-hidden", "false");
    tickRest();
    state.restInt = setInterval(tickRest, 250);
  }

  function totalSets() {
    return state.session.reduce((sum, e) => sum + (e.sets || 0), 0);
  }

  function logSet() {
    if (!state.currentN) return;
    const entry = state.session.find((e) => e.n === state.currentN);
    if (!entry) return;

    entry.sets = (entry.sets || 0) + 1;
    el.setCount.textContent = entry.sets;
    el.setCount.classList.remove("bump");
    void el.setCount.offsetWidth;
    el.setCount.classList.add("bump");

    renderLog();
    startRestTimer();
    announce(`Set ${entry.sets} for ${entry.ex.name}. Rest ninety seconds.`);
  }

  /* ---------- flip-book ---------- */
  function stopFlip() { clearInterval(state.flipInt); state.flipInt = null; }
  function startFlip(ex) {
    stopFlip();
    state.flipFrame = 0;
    const imgs = (ex.images || []).map(imgURL);
    imgs.forEach((u) => { const im = new Image(); im.src = u; }); // preload
    paintFrame(ex, 0);
    if (imgs.length > 1) {
      el.plateBadge.textContent = "▶ Moving";
      el.plateBadge.classList.remove("is-paused");
      state.flipInt = setInterval(() => {
        state.flipFrame = (state.flipFrame + 1) % imgs.length;
        paintFrame(ex, state.flipFrame);
      }, FLIP_MS);
    } else {
      el.plateBadge.textContent = "● Single plate";
      el.plateBadge.classList.add("is-paused");
    }
  }
  function paintFrame(ex, frame) {
    const imgs = ex.images || [];
    if (!imgs.length) return;
    el.plateImg.src = imgURL(imgs[frame]);
    el.plateImg.alt = `${ex.name}, ${frame === 0 ? "starting" : "finishing"} position`;
    el.plateFig.innerHTML = frame === 0 ? "fig.&nbsp;a" : "fig.&nbsp;b";
    el.plate.dataset.frame = frame;
    el.plate.classList.remove("advance");
    void el.plate.offsetWidth;
    el.plate.classList.add("advance");
  }

  /* ---------- rendering ---------- */
  function metaLine(ex) {
    return [ex.level, ex.equipment, ex.primaryMuscles && ex.primaryMuscles[0]]
      .filter(Boolean).join(" · ");
  }

  function renderCurrent(entry) {
    const ex = entry.ex;
    el.spotLoading.hidden = true;
    el.spotEmpty.hidden = true;
    el.spotCurrent.hidden = false;

    el.exName.textContent = ex.name;
    el.plateName.textContent = ex.name;

    const specs = [
      ["Level", ex.level], ["Equipment", ex.equipment || "none"],
      ["Mechanic", ex.mechanic || "—"], ["Force", ex.force || "—"],
    ];
    el.specs.innerHTML = specs.map(([k, v]) =>
      `<div><dt>${k}</dt><dd>${cap(v)}</dd></div>`).join("");

    const prim = (ex.primaryMuscles || []).map((m) => `<span class="stamp">${m}</span>`);
    const sec = (ex.secondaryMuscles || []).map((m) => `<span class="stamp stamp--secondary">${m}</span>`);
    el.muscles.innerHTML = prim.concat(sec).join("");

    el.steps.innerHTML = (ex.instructions && ex.instructions.length
      ? ex.instructions
      : ["No written cues for this movement — watch the plate and mirror the figure."]
    ).map((s) => `<li>${s}</li>`).join("");

    el.setCount.textContent = entry.sets || 0;
    startFlip(ex);
    announce(`Now on the platform: ${ex.name}`);
  }

  function renderLog() {
    el.cardCount.textContent = `${state.session.length} ${state.session.length === 1 ? "lift" : "lifts"}`;
    el.cardEmpty.hidden = state.session.length > 0;

    // newest first
    el.log.innerHTML = state.session.slice().reverse().map((entry) => {
      const ex = entry.ex;
      const isCur = entry.n === state.currentN;
      const thumb = ex.images && ex.images[0]
        ? `<img src="${imgURL(ex.images[0])}" alt="" loading="lazy" />` : "";
      const sets = entry.sets || 0;
      const setsTag = sets
        ? `<span class="log__sets">${sets} ${sets === 1 ? "set" : "sets"}</span>`
        : "";
      return `<button class="log__item${isCur ? " is-current" : ""}" data-n="${entry.n}">
        <span class="log__thumb">${thumb}<span class="log__num">#${entry.n}</span></span>
        <span class="log__body">
          <span class="log__name">${ex.name}</span>
          <span class="log__meta">${metaLine(ex)}</span>
          ${setsTag}
          ${isCur ? '<span class="log__cur-tag">Current</span>' : ""}
        </span>
      </button>`;
    }).join("");

    // tag the most-recent item for the deal-in flash
    const first = el.log.querySelector(".log__item");
    if (first && state.justAddedN && +first.dataset.n === state.justAddedN) {
      first.classList.add("just-added");
      state.justAddedN = null;
    }
  }

  function setCurrent(n) {
    const entry = state.session.find((e) => e.n === n);
    if (!entry) return;
    state.currentN = n;
    renderCurrent(entry);
    renderLog();
    if (window.matchMedia("(max-width:980px)").matches) {
      document.getElementById("spotlight").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  /* ---------- the roll ---------- */
  function pickExercise() {
    const pool = state.all;
    const curId = state.currentN
      ? (state.session.find((e) => e.n === state.currentN) || {}).ex?.id
      : null;
    let ex = pool[Math.floor(Math.random() * pool.length)];
    for (let i = 0; i < 6 && pool.length > 1 && ex.id === curId; i++) {
      ex = pool[Math.floor(Math.random() * pool.length)];
    }
    return ex;
  }

  function roll() {
    if (!state.ready || state.rolling) return;
    state.rolling = true;
    setTimeout(() => { state.rolling = false; }, reduceMotion ? 60 : 480);

    if (!state.started) startTimer();
    rollDiceVisual();

    const entry = { ex: pickExercise(), n: ++state.counter, sets: 0 };
    state.session.push(entry);
    state.justAddedN = entry.n;
    state.currentN = entry.n;

    el.casterSub.textContent = "Deal the next movement";
    renderCurrent(entry);
    renderLog();
  }

  /* ---------- finish ---------- */
  function finish() {
    if (!state.started || state.session.length === 0) return;
    stopTimer();
    stopRestTimer();
    stopFlip();

    const muscles = new Set();
    state.session.forEach((e) => {
      (e.ex.primaryMuscles || []).forEach((m) => muscles.add(m));
      (e.ex.secondaryMuscles || []).forEach((m) => muscles.add(m));
    });

    el.tallyTime.textContent = fmt(state.frozenMs);
    el.tallyCount.textContent = state.session.length;
    el.tallyMuscles.textContent = muscles.size;
    el.tallySets.textContent = totalSets();
    el.tallyChips.innerHTML = [...muscles].map((m) => `<span class="stamp">${m}</span>`).join("");
    el.verdict.textContent = verdictFor(state.session.length, state.frozenMs, totalSets());

    el.overlay.hidden = false;
    el.newBtn.focus();
  }

  function verdictFor(count, ms, sets) {
    const mins = Math.round(ms / 60000);
    const setsLine = sets > 0 ? ` ${sets} sets logged across the card.` : "";
    if (count >= 10) return `${count} movements in ${mins} min.${setsLine} The dice showed no mercy — and neither did you.`;
    if (count >= 5) return `A full hand of ${count}.${setsLine} Honest work under the iron.`;
    if (count >= 2) return `${count} dealt.${setsLine} A respectable warm-up — the deck had more.`;
    return `One throw, one movement.${setsLine} Every session starts with a single cast.`;
  }

  function resetSession() {
    state.session = []; state.counter = 0; state.currentN = null;
    state.started = false; state.startAt = 0; state.frozenMs = 0;
    clearInterval(state.timerInt); stopRestTimer(); stopFlip();
    el.timer.textContent = "00:00";
    el.clock.dataset.running = "false";
    el.finish.disabled = true;
    el.casterSub.textContent = "Deal your first movement";
    el.spotCurrent.hidden = true;
    el.spotLoading.hidden = true;
    el.spotEmpty.hidden = false;
    renderLog();
    el.overlay.hidden = true;
    buildDice();
  }

  function announce(msg) { el.live.textContent = msg; }

  /* ---------- boot ---------- */
  async function load() {
    el.editionDate.textContent = new Date().toLocaleDateString("en-US",
      { year: "numeric", month: "long", day: "numeric" });
    buildDice();

    try {
      const res = await fetch(DATA_URL, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      state.all = (Array.isArray(data) ? data : data.exercises || [])
        .filter((e) => e && e.name && e.images && e.images.length);
      if (!state.all.length) throw new Error("empty catalogue");
      state.ready = true;
      el.dbCount.textContent = `${state.all.length} movements on file`;
      el.spotLoading.hidden = true;
      el.spotEmpty.hidden = false;
    } catch (err) {
      el.spotLoading.innerHTML =
        `<p style="color:var(--ox-deep)">The catalogue is out of reach.</p>
         <p style="font-size:.72rem;color:var(--ink-soft)">${String(err.message || err)} — check your connection and reload.</p>`;
      el.dbCount.textContent = "catalogue unavailable";
    }
  }

  /* ---------- events ---------- */
  el.caster.addEventListener("click", roll);
  el.rollbarBtn.addEventListener("click", roll);
  el.logSetBtn.addEventListener("click", logSet);
  el.finish.addEventListener("click", finish);
  el.newBtn.addEventListener("click", resetSession);

  el.log.addEventListener("click", (e) => {
    const item = e.target.closest(".log__item");
    if (item) setCurrent(+item.dataset.n);
  });

  el.overlay.addEventListener("click", (e) => {
    if (e.target === el.overlay) el.overlay.hidden = true; // dismiss to review
  });

  document.addEventListener("keydown", (e) => {
    if (!el.overlay.hidden && e.key === "Escape") { el.overlay.hidden = true; return; }
    // space / R rolls when not typing in a field
    if ((e.key === "r" || e.key === "R") && el.overlay.hidden) { e.preventDefault(); roll(); }
    if ((e.key === "s" || e.key === "S") && el.overlay.hidden && state.currentN) {
      e.preventDefault();
      logSet();
    }
  });

  load();
})();
