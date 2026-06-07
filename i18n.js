/* Cast Iron — UI strings & catalogue lexicon (en / es) */
(() => {
  "use strict";

  const LANG_KEY = "cast-iron-lang";

  const LEX = {
    es: {
      level: {
        beginner: "principiante",
        intermediate: "intermedio",
        expert: "experto",
      },
      equipment: {
        "body only": "solo cuerpo",
        machine: "máquina",
        dumbbell: "mancuernas",
        barbell: "barra",
        kettlebells: "kettlebells",
        cable: "polea",
        bands: "bandas",
        "exercise ball": "balón medicinal",
        "foam roll": "rodillo de espuma",
        "e-z curl bar": "barra EZ",
        other: "otro",
        none: "ninguno",
      },
      force: { pull: "tracción", push: "empuje", static: "estático" },
      mechanic: { compound: "compuesto", isolation: "aislamiento" },
      muscle: {
        abdominals: "abdominales",
        abductors: "abductores",
        adductors: "aductores",
        biceps: "bíceps",
        calves: "gemelos",
        chest: "pecho",
        forearms: "antebrazos",
        glutes: "glúteos",
        hamstrings: "isquiotibiales",
        lats: "dorsales",
        "lower back": "lumbar",
        "middle back": "espalda media",
        neck: "cuello",
        quadriceps: "cuádriceps",
        shoulders: "hombros",
        traps: "trapecios",
        triceps: "tríceps",
      },
    },
  };

  const STRINGS = {
    en: {
      pageTitle: "CAST IRON — Workouts by the roll of the die",
      pageDescription:
        "A physical-culture almanac. Cast the die, take what the gods of iron give you. Random workouts from the free-exercise-db.",
      tagline: "Strength left to chance — workouts dealt by the roll of the die",
      labelRest: "Rest",
      labelSession: "Session",
      btnFinish: "Finish",
      langSwitchAria: "Language",
      editionAlmanac: "The Randomizer\u2019s Almanac",
      dbCountLoading: "consulting the catalogue\u2026",
      dbCountReady: "{count} movements on file",
      dbCountUnavailable: "catalogue unavailable",
      spotLoading: "Consulting the catalogue of iron\u2026",
      spotEmptyTitle: "Cast the die to begin",
      spotEmptySub:
        "Take what the gods of iron give you. The first throw starts the clock.",
      plateBadgeMoving: "\u25b6 Moving",
      plateBadgeSingle: "\u25cf Single plate",
      detailEyebrow: "Now on the platform",
      setsLabel: "Sets on this lift",
      btnMarkSet: "Mark a set",
      btnMarkSetAria: "Mark a set and start ninety second rest",
      movementHead: "The Movement",
      casterDeco: "Cast",
      casterCta: "Cast the die",
      casterAria: "Cast the die for a random exercise",
      casterSubFirst: "Deal your first movement",
      casterSubNext: "Deal the next movement",
      cardAria: "Session card",
      cardTitle: "The Card",
      cardCountZero: "0 lifts",
      cardCountOne: "1 lift",
      cardCountMany: "{count} lifts",
      cardEmpty: "Nothing dealt yet. Cast the die to fill your card.",
      rollbarLabel: "Cast the die",
      rollbarAria: "Cast the die for a random exercise",
      receiptBrand: "Cast Iron \u2014 Physical Culture",
      receiptStamp: "Session<br>Closed",
      receiptTitle: "The Tally",
      tallyTime: "Time under the iron",
      tallyMovements: "Movements dealt",
      tallyMuscles: "Muscle groups struck",
      tallySets: "Sets accounted for",
      btnNewSession: "Begin a new session",
      receiptFootLoading: "Catalogue: free-exercise-db \u00b7 consulting\u2026",
      receiptFootUnavailable: "Catalogue: free-exercise-db \u00b7 unavailable",
      receiptFootReady: "Catalogue: free-exercise-db \u00b7 {count} movements on file",
      catalogueErrorTitle: "The catalogue is out of reach.",
      catalogueErrorHint: "{message} \u2014 check your connection and reload.",
      catalogueEmpty: "empty catalogue",
      noInstructions:
        "No written cues for this movement \u2014 watch the plate and mirror the figure.",
      restComplete: "Rest complete \u2014 back to the iron.",
      setLogged: "Set {n} for {name}. Rest ninety seconds.",
      platformAnnounce: "Now on the platform: {name}",
      imgAltStart: "{name}, starting position",
      imgAltFinish: "{name}, finishing position",
      logSetOne: "1 set",
      logSetMany: "{n} sets",
      logCurrent: "Current",
      specLevel: "Level",
      specEquipment: "Equipment",
      specMechanic: "Mechanic",
      specForce: "Force",
      verdictSetsOne: " 1 set logged across the card.",
      verdictSetsMany: " {n} sets logged across the card.",
      verdict10: "{count} movements in {mins} min.{sets} The dice showed no mercy \u2014 and neither did you.",
      verdict5: "A full hand of {count}.{sets} Honest work under the iron.",
      verdict2: "{count} dealt.{sets} A respectable warm-up \u2014 the deck had more.",
      verdict1: "One throw, one movement.{sets} Every session starts with a single cast.",
    },
    es: {
      pageTitle: "CAST IRON — Entrenamientos a la suerte del dado",
      pageDescription:
        "Un almanaque de cultura f\u00edsica. Tira el dado y acepta lo que los dioses del hierro te den. Entrenamientos aleatorios desde free-exercise-db.",
      tagline: "La fuerza al azar \u2014 entrenamientos repartidos por el dado",
      labelRest: "Descanso",
      labelSession: "Sesi\u00f3n",
      btnFinish: "Terminar",
      langSwitchAria: "Idioma",
      editionAlmanac: "El almanaque del azar",
      dbCountLoading: "consultando el cat\u00e1logo\u2026",
      dbCountReady: "{count} movimientos en el cat\u00e1logo",
      dbCountUnavailable: "cat\u00e1logo no disponible",
      spotLoading: "Consultando el cat\u00e1logo de hierro\u2026",
      spotEmptyTitle: "Tira el dado para empezar",
      spotEmptySub:
        "Acepta lo que los dioses del hierro te den. La primera tirada pone en marcha el cron\u00f3metro.",
      plateBadgeMoving: "\u25b6 En movimiento",
      plateBadgeSingle: "\u25cf Placa \u00fanica",
      detailEyebrow: "Ahora en la plataforma",
      setsLabel: "Series en este ejercicio",
      btnMarkSet: "Marcar serie",
      btnMarkSetAria: "Marcar una serie e iniciar noventa segundos de descanso",
      movementHead: "El movimiento",
      casterDeco: "Tira",
      casterCta: "Tira el dado",
      casterAria: "Tirar el dado para un ejercicio aleatorio",
      casterSubFirst: "Reparte tu primer movimiento",
      casterSubNext: "Reparte el siguiente movimiento",
      cardAria: "Tarjeta de sesi\u00f3n",
      cardTitle: "La tarjeta",
      cardCountZero: "0 ejercicios",
      cardCountOne: "1 ejercicio",
      cardCountMany: "{count} ejercicios",
      cardEmpty: "A\u00fan no hay nada repartido. Tira el dado para llenar tu tarjeta.",
      rollbarLabel: "Tira el dado",
      rollbarAria: "Tirar el dado para un ejercicio aleatorio",
      receiptBrand: "Cast Iron \u2014 Cultura f\u00edsica",
      receiptStamp: "Sesi\u00f3n<br>cerrada",
      receiptTitle: "El balance",
      tallyTime: "Tiempo bajo el hierro",
      tallyMovements: "Movimientos repartidos",
      tallyMuscles: "Grupos musculares trabajados",
      tallySets: "Series registradas",
      btnNewSession: "Empezar una sesi\u00f3n nueva",
      receiptFootLoading: "Cat\u00e1logo: free-exercise-db \u00b7 consultando\u2026",
      receiptFootUnavailable: "Cat\u00e1logo: free-exercise-db \u00b7 no disponible",
      receiptFootReady: "Cat\u00e1logo: free-exercise-db \u00b7 {count} movimientos en archivo",
      catalogueErrorTitle: "El cat\u00e1logo no est\u00e1 disponible.",
      catalogueErrorHint: "{message} \u2014 comprueba tu conexi\u00f3n y recarga.",
      catalogueEmpty: "cat\u00e1logo vac\u00edo",
      noInstructions:
        "Sin instrucciones escritas \u2014 observa la placa e imita la figura.",
      restComplete: "Descanso terminado \u2014 de vuelta al hierro.",
      setLogged: "Serie {n} de {name}. Noventa segundos de descanso.",
      platformAnnounce: "Ahora en la plataforma: {name}",
      imgAltStart: "{name}, posici\u00f3n inicial",
      imgAltFinish: "{name}, posici\u00f3n final",
      logSetOne: "1 serie",
      logSetMany: "{n} series",
      logCurrent: "Actual",
      specLevel: "Nivel",
      specEquipment: "Equipamiento",
      specMechanic: "Mec\u00e1nica",
      specForce: "Fuerza",
      verdictSetsOne: " 1 serie registrada en la tarjeta.",
      verdictSetsMany: " {n} series registradas en la tarjeta.",
      verdict10: "{count} movimientos en {mins} min.{sets} El dado no tuvo piedad \u2014 y t\u00fa tampoco.",
      verdict5: "Una mano completa de {count}.{sets} Trabajo honesto bajo el hierro.",
      verdict2: "{count} repartidos.{sets} Un calentamiento respetable \u2014 el mazo ten\u00eda m\u00e1s.",
      verdict1: "Una tirada, un movimiento.{sets} Toda sesi\u00f3n empieza con una sola tirada.",
    },
  };

  let lang = "en";

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "en" || stored === "es") return stored;
    } catch (_) { /* private mode */ }
    return null;
  }

  function detectNavigatorLang() {
    const candidates = navigator.languages?.length
      ? [...navigator.languages]
      : [navigator.language || navigator.userLanguage || "en"];
    for (const candidate of candidates) {
      const code = String(candidate).toLowerCase().split("-")[0];
      if (code === "es") return "es";
      if (code === "en") return "en";
    }
    return "en";
  }

  function detectLang() {
    return getStoredLang() || detectNavigatorLang();
  }

  function interpolate(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) =>
      (vars[key] != null ? vars[key] : `{${key}}`));
  }

  function t(key, vars) {
    const bucket = STRINGS[lang] || STRINGS.en;
    const fallback = STRINGS.en[key];
    const raw = bucket[key] ?? fallback ?? key;
    return vars ? interpolate(raw, vars) : raw;
  }

  function getLang() { return lang; }

  function getLex(category) {
    if (lang === "en") return null;
    return LEX[lang]?.[category] || null;
  }

  function cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "\u2014";
  }

  function trValue(val, map) {
    if (val == null || val === "\u2014") return "\u2014";
    if (!map) return cap(String(val));
    const key = String(val).toLowerCase();
    return map[key] || map[val] || val;
  }

  function trMuscle(m) {
    return trValue(m, getLex("muscle"));
  }

  function setLang(next, persist = true) {
    if (next !== "en" && next !== "es") return lang;
    lang = next;
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* ignore */ }
    }
    document.documentElement.lang = lang;
    return lang;
  }

  window.CastIronI18n = {
    LANG_KEY,
    detectLang,
    detectNavigatorLang,
    getStoredLang,
    setLang,
    getLang,
    t,
    getLex,
    trValue,
    trMuscle,
    cap,
    applyStatic(root = document) {
      root.querySelectorAll("[data-i18n]").forEach((node) => {
        const key = node.dataset.i18n;
        const text = t(key);
        if (node.dataset.i18nHtml != null) node.innerHTML = text;
        else node.textContent = text;
      });
      root.querySelectorAll("[data-i18n-attr]").forEach((node) => {
        const pairs = node.dataset.i18nAttr.split(",").map((s) => s.trim());
        pairs.forEach((pair) => {
          const [attr, key] = pair.split(":");
          if (attr && key) node.setAttribute(attr, t(key));
        });
      });
      document.title = t("pageTitle");
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = t("pageDescription");
    },
    updateLangButtons() {
      document.querySelectorAll("[data-lang]").forEach((btn) => {
        const active = btn.dataset.lang === lang;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
        btn.classList.toggle("is-active", active);
      });
    },
  };

  setLang(detectLang(), true);
  window.CastIronI18n.applyStatic();
  window.CastIronI18n.updateLangButtons();
})();
