/* BREACHMATRIX ice kit, plain JavaScript (no framework, no build step).
 *
 * The SAME numbers as the React engine in assets/react/engine.ts and Ice.tsx.
 * Do not change any constant in this file: the look depends on them.
 * If you need different behaviour, you are probably using the wrong piece.
 *
 * Use it with data attributes, then call BreachmatrixIce.init() once (it also runs
 * itself on DOMContentLoaded):
 *
 *   <div class="ice-host"><canvas aria-hidden="true" class="ice-patch" data-ice="drift" data-ice-amount="0.9"></canvas></div>
 *   <div class="ice-band" data-ice-band="broken"><canvas aria-hidden="true" class="ice-patch"></canvas></div>
 *   <span data-scramble="51"></span>                 a number that scrambles in once
 *   <p class="ice-prompt" data-prompt="breachmatrix run baseline"></p>   a typed command line
 *   <span data-ice-meter="67" data-cells="20" data-tone="ok"></span>  ####······
 *
 * Every animation stops under prefers-reduced-motion, off screen, and in a
 * hidden tab. Canvases read their colours from CSS (`color` = glyphs,
 * `border-top-color` = accent), so light and dark themes work with no code.
 */
(function () {
  "use strict";

  var ICE_CHARS = " .:+*#";          // thin to solid. Never add or reorder.
  var CELL = 14;                      // px between glyphs (12 for the band)
  var SETTLE_MS = 1100;               // the field fades in over this
  var TICK_MS = 420;                  // after settling, cells turn over this often
  var TURN_SHARE = 0.06;              // share of cells that turn each tick
  var SCRAMBLE_MS = 520;
  var TYPE_MS = 28;                   // per character for typed prompts
  var SCRAMBLE_GLYPHS = "#*+:.0123456789";

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /** A stable 0..1 noise value for a cell (and an optional tick). */
  function iceHash(x, y, k) {
    var v = Math.sin(x * 127.1 + y * 311.7 + (k || 0) * 74.7) * 43758.5453;
    return v - Math.floor(v);
  }

  /** How much ice a cell gets (0..1) for a shape, at x,y in a W x H box. */
  function iceDensity(shape, x, y, W, H) {
    var u = x / Math.max(1, W), v = y / Math.max(1, H);
    switch (shape) {
      case "rise": return Math.pow(v, 2.2);                                            // thick at the bottom
      case "drift": return Math.pow(u, 2.4) * (0.55 + 0.45 * Math.sin(Math.PI * v));  // thick on the right
      case "corner": return Math.pow(Math.max(0, 1 - Math.hypot(1 - u, v) / 1.05), 1.8); // top-right corner
      default: return 0.35;                                                            // "even"
    }
  }

  function rgb(c) { return c.replace(/^rgba?\(|\)$/g, "").split(",").slice(0, 3).join(","); }

  /**
   * Start the ice on a canvas. opts: { shape, amount=1, hot(x,y,W,H)->bool, cell=14 }.
   * Returns a stop function.
   */
  function startIce(canvas, opts) {
    canvas.setAttribute("aria-hidden", "true");   // decorative, always
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return function () {};
    var shape = opts.shape, amount = opts.amount == null ? 1 : opts.amount, hot = opts.hot, cell = opts.cell || CELL;
    var reduce = reducedMotion();
    var frame = 0, timer = 0, visible = true, t0 = 0;

    function draw(settle, tick) {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var W = canvas.clientWidth, H = canvas.clientHeight;
      if (!W || !H) return;
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var style = getComputedStyle(canvas);
      var glyph = rgb(style.color), accent = rgb(style.borderTopColor);
      ctx.font = Math.round(cell * 0.86) + "px " + style.fontFamily;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var y = cell / 2; y < H; y += cell) for (var x = cell / 2; x < W; x += cell) {
        var d = iceDensity(shape, x, y, W, H) * amount;
        var n = iceHash(x, y);
        var isHot = !!(hot && hot(x, y, W, H));
        if (isHot ? n > 0.7 : n > d * 0.55 + 0.004) continue;
        var turn = tick > 0 && iceHash(x, y, tick) < TURN_SHARE;
        var m = turn ? iceHash(y, x, tick) : n;
        var s = Math.min(1, Math.max(0, settle * 1.6 - n * 0.6));
        var level = isHot ? 0.9 : d * 0.85 + m * 0.3;
        var ch = ICE_CHARS[Math.min(ICE_CHARS.length - 1, Math.max(1, Math.floor(level * ICE_CHARS.length * (0.4 + 0.6 * s))))];
        var alpha = (isHot ? 0.75 : 0.07 + 0.28 * Math.min(1, d)) * s;   // never above 0.35 for plain ice
        ctx.fillStyle = "rgba(" + (isHot ? accent : glyph) + ", " + alpha.toFixed(3) + ")";
        ctx.fillText(ch, x, y);
      }
    }

    function loop(now) {
      var settle = Math.min(1, (now - t0) / SETTLE_MS);
      if (settle < 1) { draw(settle, 0); frame = requestAnimationFrame(loop); return; }
      draw(1, Math.floor(now / TICK_MS));
      timer = setTimeout(function () { if (visible && !document.hidden) frame = requestAnimationFrame(loop); }, TICK_MS);
    }
    function stopLoop() { cancelAnimationFrame(frame); clearTimeout(timer); }
    function resume() { stopLoop(); if (reduce) { draw(1, 0); return; } frame = requestAnimationFrame(loop); }

    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      if (reduce) { draw(1, 0); return; }
      t0 = performance.now();
      frame = requestAnimationFrame(loop);
    });

    var resize = window.ResizeObserver ? new ResizeObserver(function () { draw(1, 0); }) : null;
    if (resize) resize.observe(canvas);
    var theme = new MutationObserver(function () { draw(1, 0); });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    var seen = window.IntersectionObserver ? new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting; if (visible && t0) resume(); else stopLoop();
    }) : null;
    if (seen) seen.observe(canvas);
    function onVis() { if (!document.hidden && visible && t0) resume(); }
    document.addEventListener("visibilitychange", onVis);

    return function stop() {
      stopLoop();
      if (resize) resize.disconnect(); theme.disconnect(); if (seen) seen.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }

  /** The band between "what ran" and "was it seen": held | broken | open. */
  function startBand(canvas, state) {
    var amount = state === "held" ? 2.8 : state === "broken" ? 1.8 : 0.8;
    var hot = state === "broken" ? function (x, _y, W) {
      var u = x / W, edge = 0.05 * Math.sin(x * 0.37);
      return u > 0.4 + edge && u < 0.6 - edge;          // a ragged red gap through the middle
    } : null;
    return startIce(canvas, { shape: "even", amount: amount, hot: hot, cell: 12 });
  }

  /** Scramble an element's text in once, then show the real value. */
  function scramble(el, text) {
    text = String(text);
    el.setAttribute("aria-label", text);
    if (reducedMotion()) { el.textContent = text; return; }
    var t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / SCRAMBLE_MS), fixed = Math.floor(p * text.length);
      el.textContent = text.split("").map(function (c, i) {
        return i < fixed || c === " " ? c : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
      }).join("");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /** A typed bash line: "$ command" then a cursor that blinks three times. */
  function prompt(el, command) {
    el.classList.add("ice-prompt");
    el.setAttribute("aria-label", command);
    el.innerHTML = '<span class="ice-prompt__sign" aria-hidden="true">$</span><span aria-hidden="true"></span><span class="ice-prompt__cursor" aria-hidden="true"></span>';
    var out = el.children[1], cur = el.children[2];
    if (reducedMotion()) { out.textContent = command; cur.classList.add("is-done"); return; }
    var i = 0, id = setInterval(function () {
      i += 1; out.textContent = command.slice(0, i);
      if (i >= command.length) { clearInterval(id); cur.classList.add("is-done"); }
    }, TYPE_MS);
  }

  /** A bar drawn in ice: "#" for the filled share, "·" for the rest. */
  function meter(el, value, cells, tone) {
    var v = Math.max(0, Math.min(100, Number(value) || 0)), n = cells || 20, on = Math.round((v / 100) * n);
    el.classList.add("ice-meter", "is-" + (tone || "plain"));
    el.setAttribute("role", "meter");
    el.setAttribute("aria-valuenow", String(Math.round(v)));
    el.setAttribute("aria-valuemin", "0");
    el.setAttribute("aria-valuemax", "100");
    el.innerHTML = '<span class="ice-meter__on">' + "#".repeat(on) + '</span><span class="ice-meter__off">' + "·".repeat(n - on) + "</span>";
  }

  /** Light or dark: the root carries html.light or html.dark; remembered in localStorage. */
  function setTheme(mode) {
    var root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode !== "dark");
    try { localStorage.setItem("theme-preference", mode); } catch (e) { /* storage may be blocked */ }
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme-preference"); } catch (e) { /* ignore */ }
    setTheme(saved === "dark" ? "dark" : "light");
  }


  /* ── Popups: Esc closes, focus moves in and stays in, returns on close,
     the page behind does not scroll. scrim = the .ds-scrim element. ── */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var popupStack = [];
  function openPopup(scrim, onClose) {
    var box = scrim.querySelector(".ds-popup") || scrim.firstElementChild;
    var before = document.activeElement, prevOverflow = document.body.style.overflow;
    scrim.hidden = false;
    document.body.style.overflow = "hidden";
    popupStack.push(scrim);
    var first = box.querySelector("input, select, textarea") || box.querySelector(FOCUSABLE) || box;
    first.focus({ preventScroll: true });
    function close() {
      if (scrim.hidden) return;
      scrim.hidden = true;
      document.body.style.overflow = prevOverflow;
      popupStack.splice(popupStack.indexOf(scrim), 1);
      document.removeEventListener("keydown", onKey);
      if (before && before.focus) before.focus({ preventScroll: true });
      if (onClose) onClose();
    }
    function onKey(e) {
      if (popupStack[popupStack.length - 1] !== scrim) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      var items = Array.prototype.filter.call(box.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
    document.addEventListener("keydown", onKey);
    scrim.addEventListener("mousedown", function (e) { if (e.target === scrim) close(); });
    scrim.querySelectorAll("[data-popup-close]").forEach(function (b) { b.addEventListener("click", close); });
    return close;
  }

  /* ── Toasts: bottom-left beside the rail. tone: ok | warn | error | info | (none = "#") ── */
  var TOAST_ICON = { ok: "check", warn: "triangle-alert", error: "x", info: "info" };
  function toast(opts) {
    var host = document.querySelector(".hk-toasts");
    if (!host) { host = document.createElement("div"); host.className = "hk-toasts"; host.setAttribute("aria-live", "polite"); document.body.appendChild(host); }
    var t = document.createElement("div");
    var tone = opts.tone || "";
    t.className = "ds-toast hk-toast" + (tone ? " is-" + ({ ok: "success", warn: "warning", error: "error", info: "info" }[tone]) : "");
    t.setAttribute("role", tone === "error" ? "alert" : "status");
    var icon = tone ? '<span class="ds-toast__icon"><i data-lucide="' + TOAST_ICON[tone] + '" width="14" height="14" stroke-width="2.25"></i></span>' : "";
    t.innerHTML = icon + '<div class="ds-toast__content"><div class="ds-toast__title"></div>' + (opts.description ? '<div class="ds-toast__desc"></div>' : "") + "</div>" +
      '<button type="button" class="hk-toast__close" aria-label="Close"><i data-lucide="x" width="14" height="14"></i></button>';
    t.querySelector(".ds-toast__title").textContent = opts.title;
    if (opts.description) t.querySelector(".ds-toast__desc").textContent = opts.description;
    host.prepend(t);
    if (window.BreachmatrixIcons) window.BreachmatrixIcons.render(t);
    function remove() { t.remove(); }
    t.querySelector(".hk-toast__close").addEventListener("click", remove);
    setTimeout(remove, opts.duration || 4000);
    return remove;
  }

  // The status lookup (references/status-lookup.md). "live" tones end in "!": the glyph pulses.
  var STATUS = {
    "assessments": { "executed": "ok", "running": "run!", "failed": "bad", "not executed": "idle" },
    "execution": { "pending": "run!", "dispatched": "run!", "running": "run!", "completed": "ok",
      "failed": "bad", "timeout": "bad", "cancelled": "idle", "skipped": "idle" },
    "detection": { "detected": "ok", "not detected": "bad", "checking…": "run!", "checking...": "run!",
      "waiting telemetry": "run!", "check expired": "run", "provider error": "bad", "skipped": "idle",
      "not checked yet": "idle", "n/a": "idle" },
    "rules": { "new": "run", "publishing": "run", "revoking": "run", "ready": "ok", "published": "ok",
      "failed": "bad", "revoked": "idle" },
    "rule-validation": { "valid": "ok", "invalid": "run" },
    "agents-licence": { "active": "ok", "pending_approval": "run", "rejected": "bad", "revoked": "bad", "expired": "bad" },
    "agents-connection": { "online": "ok", "not_activated": "idle", "offline": "bad" },
    "licences": { "active": "ok", "revoked": "bad", "expired": "bad" },
    "join-requests": { "pending": "run", "approved": "ok", "rejected": "bad" },
    "approvals": { "waiting": "run", "approved": "ok", "dismissed": "idle", "failed": "bad" },
    "intel-sync": { "content_changed": "ok", "no_change": "idle", "running": "run!", "syncing": "run!",
      "pending": "run!", "queued": "run!", "failed": "bad", "error": "bad", "": "idle", "not run yet": "idle" },
    "reports": { "ready": "ok", "draft": "run", "scheduled": "idle" },
  };
  // statusTone("agents-connection", "OFFLINE") -> "bad". Unknown words return "idle"; add them to the table.
  function statusTone(area, word) {
    var t = (STATUS[area] || {})[String(word == null ? "" : word).trim().toLowerCase()];
    return t ? t.replace("!", "") : "idle";
  }
  function statusLive(area, word) {
    var t = (STATUS[area] || {})[String(word == null ? "" : word).trim().toLowerCase()];
    return !!t && t.slice(-1) === "!";
  }
  // <span data-status-area="rules">PUBLISHED</span> -> class "hk-status is-ok" (+ is-pulse when live).
  function paintStatus(el) {
    var area = el.getAttribute("data-status-area"), word = el.textContent;
    el.classList.add("hk-status", "is-" + statusTone(area, word));
    if (statusLive(area, word)) el.classList.add("is-pulse");
    if (/^[A-Z_]+$/.test(word.trim())) el.classList.add("hk-status--mono");
  }

  var started = new WeakSet();
  function init(root) {
    root = root || document;
    root.querySelectorAll("[data-status-area]").forEach(paintStatus);
    root.querySelectorAll("canvas[data-ice]").forEach(function (c) {
      if (started.has(c)) return; started.add(c);
      startIce(c, { shape: c.getAttribute("data-ice"), amount: parseFloat(c.getAttribute("data-ice-amount") || "1") });
    });
    root.querySelectorAll("[data-ice-band]").forEach(function (b) {
      var c = b.querySelector("canvas"); if (!c || started.has(c)) return; started.add(c);
      startBand(c, b.getAttribute("data-ice-band"));
    });
    root.querySelectorAll("[data-scramble]").forEach(function (el) {
      if (started.has(el)) return; started.add(el); scramble(el, el.getAttribute("data-scramble"));
    });
    root.querySelectorAll("[data-prompt]").forEach(function (el) {
      if (started.has(el)) return; started.add(el); prompt(el, el.getAttribute("data-prompt"));
    });
    root.querySelectorAll("[data-ice-meter]").forEach(function (el) {
      meter(el, el.getAttribute("data-ice-meter"), parseInt(el.getAttribute("data-cells") || "20", 10), el.getAttribute("data-tone"));
    });
  }

  window.BreachmatrixIce = {
    ICE_CHARS: ICE_CHARS, iceHash: iceHash, iceDensity: iceDensity,
    startIce: startIce, startBand: startBand, scramble: scramble, prompt: prompt, meter: meter,
    setTheme: setTheme, initTheme: initTheme, init: init, reducedMotion: reducedMotion,
    openPopup: openPopup, toast: toast,
    STATUS: STATUS, statusTone: statusTone, statusLive: statusLive, paintStatus: paintStatus,
  };
  initTheme();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
