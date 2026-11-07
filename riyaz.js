/* Virtual Riyaz Room – taal player with synthesised tabla, tanpura drone and a tatkar guide.
   All sounds are generated in the browser (Web Audio), no recordings are used. */
(() => {
  const root = document.getElementById("riyaz");
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];

  /* ---------- taals ---------- */
  const TAALS = {
    teentaal: { name: "Teentaal", hi: "तीनताल", vib: [4, 4, 4, 4], marks: ["X", "2", "0", "3"],
      bols: ["dha", "dhin", "dhin", "dha", "dha", "dhin", "dhin", "dha", "dha", "tin", "tin", "ta", "ta", "dhin", "dhin", "dha"] },
    jhaptaal: { name: "Jhaptaal", hi: "झपताल", vib: [2, 3, 2, 3], marks: ["X", "2", "0", "3"],
      bols: ["dhi", "na", "dhi", "dhi", "na", "ti", "na", "dhi", "dhi", "na"] },
    ektaal: { name: "Ektaal", hi: "एकताल", vib: [2, 2, 2, 2, 2, 2], marks: ["X", "0", "2", "0", "3", "4"],
      bols: ["dhin", "dhin", "dhage", "tirkit", "tu", "na", "kat", "ta", "dhage", "tirkit", "dhi", "na"] },
    rupak: { name: "Rupak", hi: "रूपक", vib: [3, 2, 2], marks: ["0", "1", "2"],
      bols: ["tin", "tin", "na", "dhi", "na", "dhi", "na"] },
    keherwa: { name: "Keherwa", hi: "कहरवा", vib: [4, 4], marks: ["X", "0"],
      bols: ["dha", "ge", "na", "ti", "na", "ka", "dhi", "na"] },
    dadra: { name: "Dadra", hi: "दादरा", vib: [3, 3], marks: ["X", "0"],
      bols: ["dha", "dhi", "na", "dha", "ti", "na"] },
  };
  const HI = { dha: "धा", dhin: "धिं", dhi: "धी", ta: "ता", tin: "तिं", ti: "ती", na: "ना", ge: "गे", ka: "क", kat: "कत्", tu: "तू", dhage: "धागे", tirkit: "तिरकिट" };
  const TATKAR = ["ता", "थेई", "थेई", "तत्", "आ", "थेई", "थेई", "तत्"];

  /* ---------- state ---------- */
  let taal = TAALS.teentaal, bpm = 90, playing = false, mode = "theka";
  let useTabla = true, useDrone = false, useSam = true;
  let ctx = null, master = null, droneNodes = null, nextTime = 0, beatIdx = 0, timer = null;
  const queue = [];

  /* ---------- sound ---------- */
  const audio = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.8;
      const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const env = (g, t, peak, decay) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + decay); };
  const dayan = (t, f = 440, decay = 0.35, vol = 0.45) => {     // treble drum: ringing harmonic partials
    [[1, 1], [2, 0.5], [3, 0.28], [4.2, 0.12]].forEach(([m, a]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(f * m * 1.02, t); o.frequency.exponentialRampToValueAtTime(f * m, t + 0.03);
      env(g, t, vol * a, decay / (m > 1 ? 1.6 : 1)); o.connect(g); g.connect(master); o.start(t); o.stop(t + decay + 0.05);
    });
  };
  const bayan = (t, f = 92, decay = 0.5, vol = 0.8) => {        // bass drum: low thump with a falling pitch
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.09);
    env(g, t, vol, decay); o.connect(g); g.connect(master); o.start(t); o.stop(t + decay + 0.05);
  };
  const slap = (t, vol = 0.35) => {                              // closed stroke (ka / kat)
    const len = Math.floor(ctx.sampleRate * 0.06), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 1.2; s.buffer = buf;
    env(g, t, vol, 0.07); s.connect(bp); bp.connect(g); g.connect(master); s.start(t);
  };
  const STROKES = {
    dha: (t) => { bayan(t); dayan(t, 440, 0.35); },
    dhin: (t) => { bayan(t, 92, 0.55); dayan(t, 330, 0.5, 0.35); },
    dhi: (t) => { bayan(t, 92, 0.45); dayan(t, 330, 0.3, 0.32); },
    ta: (t) => dayan(t, 440, 0.32, 0.5),
    na: (t) => dayan(t, 440, 0.28, 0.45),
    tin: (t) => dayan(t, 330, 0.3, 0.32),
    ti: (t) => dayan(t, 520, 0.09, 0.3),
    ge: (t) => bayan(t, 100, 0.5, 0.7),
    ka: (t) => slap(t),
    kat: (t) => slap(t, 0.45),
    tu: (t) => dayan(t, 300, 0.55, 0.4),
  };
  const playBol = (bol, t, dur) => {
    if (bol === "dhage") { STROKES.dha(t); STROKES.ge(t + dur / 2); return; }
    if (bol === "tirkit") { [0, 1, 2, 3].forEach((k) => (k === 2 ? slap(t + (k * dur) / 4, 0.25) : dayan(t + (k * dur) / 4, 520, 0.07, 0.28))); return; }
    (STROKES[bol] || STROKES.ta)(t);
  };
  const samBell = (t) => {
    [[880, 0.18], [1320, 0.08]].forEach(([f, v]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = f;
      env(g, t, v, 1.2); o.connect(g); g.connect(master); o.start(t); o.stop(t + 1.3);
    });
  };
  const ghungroo = (t) => {                                      // tatkar mode: little bell jingle
    for (let k = 0; k < 3; k++) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = 2400 + Math.random() * 1600;
      env(g, t + k * 0.012, 0.06, 0.18); o.connect(g); g.connect(master); o.start(t + k * 0.012); o.stop(t + 0.25);
    }
    bayan(t, 70, 0.18, 0.35);
  };
  const startDrone = () => {
    if (droneNodes) return;
    const sa = 138.59, out = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    out.gain.value = 0.05; lp.type = "lowpass"; lp.frequency.value = 1400; lfo.frequency.value = 0.25; lfoG.gain.value = 0.018;
    lfo.connect(lfoG); lfoG.connect(out.gain); lp.connect(out); out.connect(master);
    const oscs = [sa * 0.75, sa, sa, sa * 2].map((f, i) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = (i - 1.5) * 4; o.connect(lp); o.start(); return o; });
    lfo.start(); droneNodes = { out, oscs, lfo };
  };
  const stopDrone = () => {
    if (!droneNodes) return;
    const { out, oscs, lfo } = droneNodes; const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0.0001, t + 0.4);
    setTimeout(() => { oscs.forEach((o) => o.stop()); lfo.stop(); out.disconnect(); }, 500); droneNodes = null;
  };

  /* ---------- scheduler ---------- */
  const beatLen = () => 60 / bpm;
  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.12) {
      const i = beatIdx % taal.bols.length;
      if (mode === "tatkar") ghungroo(nextTime);
      else if (useTabla) playBol(taal.bols[i], nextTime, beatLen());
      if (useSam && i === 0) samBell(nextTime);
      queue.push({ i, t: nextTime });
      nextTime += beatLen(); beatIdx++;
    }
  };
  const start = () => {
    audio(); playing = true; beatIdx = 0; nextTime = ctx.currentTime + 0.08; queue.length = 0;
    if (useDrone) startDrone();
    schedule(); timer = setInterval(schedule, 25); draw();
    $(".rz-play").classList.add("on"); $(".rz-play span").textContent = "Pause";
  };
  const stop = () => {
    playing = false; clearInterval(timer); stopDrone(); queue.length = 0;
    $(".rz-play").classList.remove("on"); $(".rz-play span").textContent = "Play";
  };

  /* ---------- drawing ---------- */
  const svg = $(".rz-wheel");
  const buildWheel = () => {
    const n = taal.bols.length, R = 150, C = 180;
    let starts = [], acc = 0; taal.vib.forEach((v) => { starts.push(acc); acc += v; });
    svg.innerHTML = `<circle cx="${C}" cy="${C}" r="${R}" class="rz-ring"/>` + taal.bols.map((b, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2, x = C + R * Math.cos(a), y = C + R * Math.sin(a);
      const v = starts.indexOf(i), mark = v >= 0 ? taal.marks[v] : "";
      const lx = C + (R + 24) * Math.cos(a), ly = C + (R + 24) * Math.sin(a);
      return `<g class="rz-beat${mark ? " vib" : ""}${mark === "0" ? " khali" : ""}" data-i="${i}">
        <circle cx="${x}" cy="${y}" r="${mark ? 17 : 13}"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle">${i + 1}</text>
        ${mark ? `<text class="rz-mark" x="${lx}" y="${ly + 5}" text-anchor="middle">${mark}</text>` : ""}</g>`;
    }).join("") + `<circle class="rz-hand" cx="${C}" cy="${C - R}" r="6"/>`;
    $(".rz-taal-hi").textContent = taal.hi; $(".rz-taal-info").textContent = `${taal.bols.length} beats · ${taal.vib.length} vibhags (${taal.vib.join("+")})`;
    $(".rz-bols").innerHTML = taal.bols.map((b, i) => {
      const v = starts.indexOf(i);
      return `${v > 0 ? '<i class="sep">|</i>' : ""}<span data-i="${i}">${v >= 0 ? `<em>${taal.marks[v]}</em>` : ""}${HI[b] || b}</span>`;
    }).join("");
    show(0, false);
  };
  const show = (i, lit = true) => {
    const n = taal.bols.length, a = (i / n) * Math.PI * 2 - Math.PI / 2, hand = $(".rz-hand", svg);
    if (hand) { hand.setAttribute("cx", 180 + 150 * Math.cos(a)); hand.setAttribute("cy", 180 + 150 * Math.sin(a)); }
    $$(".rz-beat", svg).forEach((g) => g.classList.toggle("on", lit && +g.dataset.i === i));
    $$(".rz-bols span").forEach((s) => s.classList.toggle("on", lit && +s.dataset.i === i));
    const big = mode === "tatkar" ? TATKAR[i % TATKAR.length] : HI[taal.bols[i]] || taal.bols[i];
    $(".rz-now").textContent = big;
    $(".rz-count").textContent = `${i + 1} / ${n}`;
    let acc = 0, label = ""; taal.vib.forEach((v, k) => { if (i >= acc && i < acc + v) label = taal.marks[k]; acc += v; });
    $(".rz-clap").textContent = label === "0" ? "Khali – wave" : label === "X" ? "Sam – clap" : `Tali ${label} – clap`;
    $(".rz-foot").textContent = mode === "tatkar" ? (i % 2 ? "Left foot" : "Right foot") : "";
    $(".rz-foot").dataset.side = mode === "tatkar" ? (i % 2 ? "L" : "R") : "";
    if (lit) { const p = $(".rz-pulse"); p.classList.remove("go"); void p.offsetWidth; p.classList.add("go"); }
  };
  let last = -1;
  const draw = () => {
    if (!playing) return;
    while (queue.length && queue[0].t <= ctx.currentTime) { const q = queue.shift(); if (q.i !== last) { show(q.i); last = q.i; } }
    requestAnimationFrame(draw);
  };

  /* ---------- controls ---------- */
  $$(".rz-taals button").forEach((b) => b.addEventListener("click", () => {
    $$(".rz-taals button").forEach((x) => x.classList.toggle("on", x === b));
    taal = TAALS[b.dataset.taal]; beatIdx = 0; last = -1; buildWheel();
  }));
  const range = $(".rz-laya input"), out = $(".rz-laya output");
  const setBpm = (v) => { bpm = Math.max(30, Math.min(260, +v)); range.value = bpm; out.textContent = bpm;
    $$(".rz-presets button").forEach((p) => p.classList.toggle("on", Math.abs(+p.dataset.bpm - bpm) < 1)); };
  range.addEventListener("input", () => setBpm(range.value));
  $$(".rz-presets button").forEach((p) => p.addEventListener("click", () => setBpm(p.dataset.bpm)));
  $(".rz-play").addEventListener("click", () => (playing ? stop() : start()));
  $$(".rz-modes button").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode; $$(".rz-modes button").forEach((x) => x.classList.toggle("on", x === b));
    root.classList.toggle("tatkar", mode === "tatkar"); show(Math.max(0, last), playing);
  }));
  $("#rz-tabla").addEventListener("change", (e) => (useTabla = e.target.checked));
  $("#rz-sam").addEventListener("change", (e) => (useSam = e.target.checked));
  $("#rz-drone").addEventListener("change", (e) => { useDrone = e.target.checked; if (playing) (useDrone ? startDrone() : stopDrone()); });
  document.addEventListener("keydown", (e) => { if (e.code === "Space" && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); playing ? stop() : start(); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) stop(); });

  setBpm(bpm); buildWheel();
})();
