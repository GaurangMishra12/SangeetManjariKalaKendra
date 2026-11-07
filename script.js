/* Sangeet Manjari Kala Kendra – site script.
   All editable content lives in content.json (edit it at /admin.html). */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const put = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; return el; };
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- animated classical instrument icons (line art, gold) ---------- */
const INSTRUMENTS = {
  tabla: `<svg viewBox="0 0 48 48" aria-hidden="true">
    <g class="i-wave"><path d="M10 9q5-4 10 0"/><path d="M30 5q5-4 10 0"/></g>
    <g class="t-l"><ellipse cx="15" cy="22" rx="11" ry="4"/><ellipse class="fill" cx="15" cy="22" rx="4" ry="1.5"/></g>
    <path d="M4 22c0 15 22 15 22 0"/>
    <g class="t-r"><ellipse cx="35" cy="15" rx="8" ry="3"/><ellipse class="fill" cx="35" cy="15" rx="3" ry="1.1"/></g>
    <path d="M27 15l2 23q6 3 12 0l2-23"/><path class="thin" d="M30 18l1.5 19M34 18.5l.5 20M37 18.5l-.5 20M40 18l-1.5 19"/>
  </svg>`,
  ghungroo: `<svg viewBox="0 0 48 48" aria-hidden="true"><g class="g-swing">
    <path d="M5 12q19 14 38 0"/>
    <g class="bell b1"><circle cx="9" cy="19" r="3.4"/><path class="thin" d="M7.6 20h2.8"/></g>
    <g class="bell b2"><circle cx="16" cy="23.5" r="3.4"/><path class="thin" d="M14.6 24.5h2.8"/></g>
    <g class="bell b3"><circle cx="24" cy="25" r="3.4"/><path class="thin" d="M22.6 26h2.8"/></g>
    <g class="bell b2"><circle cx="32" cy="23.5" r="3.4"/><path class="thin" d="M30.6 24.5h2.8"/></g>
    <g class="bell b1"><circle cx="39" cy="19" r="3.4"/><path class="thin" d="M37.6 20h2.8"/></g>
    <g class="bell b3"><circle cx="20" cy="33" r="3"/><circle cx="28" cy="33" r="3"/></g>
  </g></svg>`,
  sitar: `<svg viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="13" cy="36" r="9"/><circle cx="40" cy="8" r="3"/>
    <path d="M19 30L38 10M21.5 32.5L40.5 12.5"/>
    <path class="thin" d="M24 27l2 2M27 24l2 2M30 21l2 2M33 18l2 2"/>
    <g class="s-str"><path class="thin" d="M10 39L39 9M12.5 40.5L40.5 11"/></g>
    <g class="i-note n1"><ellipse class="fill" cx="31" cy="34" rx="2.4" ry="1.8"/><path d="M33.2 33.5V26q3 1 3 4"/></g>
    <g class="i-note n2"><ellipse class="fill" cx="39" cy="28" rx="2" ry="1.5"/><path d="M40.8 27.6V21.5"/></g>
  </svg>`,
  bansuri: `<svg viewBox="0 0 48 48" aria-hidden="true">
    <rect x="3" y="27" width="42" height="6" rx="3"/>
    <path class="thin" d="M9 27v6M41 27v6"/>
    <g class="fill"><circle cx="17" cy="30" r="1.1"/><circle cx="22" cy="30" r="1.1"/><circle cx="27" cy="30" r="1.1"/><circle cx="32" cy="30" r="1.1"/><circle cx="37" cy="30" r="1.1"/><circle cx="12.5" cy="30" r="1.3"/></g>
    <g class="i-note n1"><ellipse class="fill" cx="16" cy="18" rx="2.4" ry="1.8"/><path d="M18.2 17.5V9q3 1 3 4"/></g>
    <g class="i-note n2"><ellipse class="fill" cx="28" cy="16" rx="2.2" ry="1.7"/><path d="M30.2 15.5V8.5"/></g>
    <g class="i-note n3"><ellipse class="fill" cx="37" cy="19" rx="2" ry="1.5"/><path d="M38.8 18.6V12q2.6 1 2.6 3.6"/></g>
  </svg>`,
  harmonium: `<svg viewBox="0 0 48 48" aria-hidden="true">
    <g class="h-bel"><path d="M8 20l4-6 4 6 4-6 4 6 4-6 4 6 4-6 4 6"/></g>
    <rect x="5" y="20" width="38" height="19" rx="2"/>
    <rect x="9" y="29" width="30" height="7" rx="1"/>
    <path class="thin" d="M13 29v7M17 29v7M21 29v7M25 29v7M29 29v7M33 29v7"/>
    <g class="fill"><rect x="14.3" y="29" width="1.6" height="4"/><rect x="18.3" y="29" width="1.6" height="4"/><rect x="26.3" y="29" width="1.6" height="4"/><rect x="30.3" y="29" width="1.6" height="4"/></g>
    <g class="fill"><circle cx="11" cy="24.5" r="1.2"/><circle cx="16" cy="24.5" r="1.2"/><circle cx="21" cy="24.5" r="1.2"/></g>
  </svg>`,
};
$$("[data-ico]").forEach((el) => { if (INSTRUMENTS[el.dataset.ico]) el.innerHTML = INSTRUMENTS[el.dataset.ico]; });

async function loadContent() {
  // ?preview=1 shows the unsaved draft from the admin panel (same browser only)
  if (new URLSearchParams(location.search).has("preview")) {
    try {
      const draft = localStorage.getItem("smkk-draft");
      if (draft) return JSON.parse(draft);
    } catch (_) {}
  }
  const res = await fetch("content.json?t=" + Date.now(), { cache: "no-store" });
  return res.json();
}

loadContent().then(render).catch((err) => {
  console.error("Could not load content.json", err);
});

function render(C) {
  const S = C.site || {};

  /* ---------- show / hide sections ---------- */
  $$("[data-section]").forEach((el) => {
    const on = C.sections?.[el.dataset.section] !== false;
    el.hidden = !on;
    if (!on && el.id) {
      $$(`a[href="#${el.id}"]`).forEach((a) => {
        if (a.closest("#menu, .footer-grid")) a.hidden = true;
      });
    }
  });

  /* ---------- contact details ---------- */
  const waDigits = (S.whatsapp || S.phone || "").replace(/\D/g, "");
  const LINKS = {
    phoneLink: S.phone ? "tel:" + S.phone.replace(/\s/g, "") : "",
    emailLink: S.email ? "mailto:" + S.email : "",
    whatsappLink: waDigits.length >= 10 ? "https://wa.me/" + waDigits : "",
    instagramLink: S.instagram || "",
    reviewLink: S.googleReviews || "",
  };
  const n = C.numbers || {};
  const TEXT = {
    phone: S.phone || "[Phone number]",
    email: S.email || "[Email]",
    address: S.address || "[Address]",
    guru: S.guru || "[Guru's name]",
    years: n.years ? n.years + "+" : "–",
  };
  $$("[data-site]").forEach((el) => {
    const k = el.dataset.site;
    if (k in LINKS) {
      if (LINKS[k]) { el.href = LINKS[k]; el.classList.remove("no-link"); }
      else { el.removeAttribute("href"); el.classList.add("no-link"); }
    } else if (k in TEXT) {
      el.textContent = TEXT[k];
      el.classList.toggle("ph", !S[k] && k !== "years");
    }
  });
  // hide link buttons that have nowhere to go
  $$('.btn[data-site="instagramLink"], .btn[data-site="reviewLink"]').forEach((b) => (b.hidden = !LINKS[b.dataset.site]));

  /* ---------- editable paragraphs ---------- */
  const PH = {
    guruBio: "[One or two lines about the guru's training, gharana and achievements.]",
    upcomingEvents: "[List your next show, exam date or festival here.]",
  };
  $$("[data-text]").forEach((el) => {
    const v = C.text?.[el.dataset.text];
    el.textContent = v || PH[el.dataset.text] || "";
    el.classList.toggle("ph", !v);
  });

  /* ---------- meet the guru ---------- */
  const G = C.guru || {};
  $$("[data-guru]").forEach((el) => {
    const k = el.dataset.guru;
    if (k === "photo") { if (G.photo) el.src = `assets/img/gallery/${G.photo}.jpg`; el.alt = G.name || ""; }
    else if (k === "credentials") {
      const list = (G.credentials || []).filter(Boolean);
      el.innerHTML = list.map((c) => `<li>${esc(c)}</li>`).join("");
      el.hidden = !list.length;
    } else {
      el.textContent = G[k] || "";
      el.hidden = !G[k];
    }
  });

  /* ---------- social icons ---------- */
  const ICONS = {
    instagram: '<path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8.2A3.2 3.2 0 1 1 15.2 12 3.2 3.2 0 0 1 12 15.2zM17.3 5.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2zM21 7.6a5.7 5.7 0 0 0-1.6-4A5.7 5.7 0 0 0 15.4 2C13.8 2 10.2 2 8.6 2a5.7 5.7 0 0 0-4 1.6A5.7 5.7 0 0 0 3 7.6C3 9.2 3 14.8 3 16.4a5.7 5.7 0 0 0 1.6 4A5.7 5.7 0 0 0 8.6 22c1.6 0 7.2 0 8.8 0a5.7 5.7 0 0 0 4-1.6 5.7 5.7 0 0 0 1.6-4c0-1.6 0-7.2 0-8.8z"/>',
    youtube: '<path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/>',
    facebook: '<path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.3 0-5 2.3-5 5.2V8H6v4h3v11h5V12h3.6l.4-4z"/>',
  };
  $$("[data-socials]").forEach((box) => {
    box.innerHTML = Object.keys(ICONS).filter((k) => S[k]).map((k) =>
      `<a href="${esc(S[k])}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24">${ICONS[k]}</svg></a>`).join("");
  });

  /* ---------- courses ---------- */
  const courses = (C.courses || []).filter((c) => c.show !== false);
  const fee = (v) => (v ? "₹" + esc(v) : "Fee on request");
  put("#course-grid", courses.map((c, i) => `
    <li class="level" data-cat="${esc(c.cat)}">
      <span class="level-step" aria-hidden="true">${i + 1}</span>
      <div class="level-img"><img src="assets/img/gallery/${esc(c.img)}-sm.jpg" alt="" loading="lazy"></div>
      <div class="level-body">
        ${c.badge ? `<p class="level-tag">${esc(c.badge)}</p>` : ""}
        <h3>${esc(c.title)}</h3>
        ${c.desc ? `<p>${esc(c.desc)}</p>` : ""}
        <p class="level-meta">${[c.groupNote, c.duration && "Duration: " + c.duration].filter(Boolean).map(esc).join(" · ")}</p>
      </div>
      <div class="level-fee">
        <b class="${c.group ? "" : "ph"}">${fee(c.group)}</b><small>${c.group ? "per month" : ""}</small>
        <a href="#contact" class="btn btn-solid btn-sm" data-open-enquiry data-course="${esc(c.title)}">Join this level</a>
      </div>
    </li>`).join(""));
  const home = document.body.dataset.page === "events" ? "index.html" : "";
  put("#footer-courses", courses.map((c) => `<a href="${home}#courses">${esc(c.title)}</a>`).join(""));

  /* ---------- workshops, events, performances ---------- */
  const shown = (arr) => (arr || []).filter((x) => x.show !== false && x.title);
  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dt = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(s || "") ? new Date(s + "T00:00:00") : null);
  const isPast = (x) => { const d = dt(x.date); return !!d && d < today; };
  const fmt = (s) => { const d = dt(s); return d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : (s || ""); };
  const byDate = (dir) => (a, b) => ((dt(a.date) || (dir > 0 ? Infinity : -Infinity)) - (dt(b.date) || (dir > 0 ? Infinity : -Infinity))) * dir;
  const ws = shown(C.workshops).filter((x) => !isPast(x)).sort(byDate(1));
  const ev = shown(C.events).filter((x) => !isPast(x)).sort(byDate(1));
  const past = [
    ...shown(C.performances).map((x) => ({ ...x, kind: "Performance" })),
    ...shown(C.events).filter(isPast).map((x) => ({ ...x, kind: "Event" })),
    ...shown(C.workshops).filter(isPast).map((x) => ({ ...x, kind: "Workshop" })),
  ].sort(byDate(-1));

  // home page: short lists + "view all"
  const pItem = (x, kind) => `
    <article class="p-item">
      ${x.date ? `<div class="p-date">${esc(fmt(x.date))}</div>` : ""}
      <div class="p-body">
        <b>${esc(x.title)}</b>
        <small>${[x.time, x.place, x.fee && "Fee: " + x.fee].filter(Boolean).map(esc).join(" · ")}</small>
        ${x.details ? `<p>${esc(x.details)}</p>` : ""}
        <div class="p-btns">
          <a href="#contact" class="btn btn-red btn-xs" data-open-enquiry data-course="${esc(kind + ": " + x.title)}">${kind === "Workshop" ? "Register" : "Enquire"}</a>
          <a href="events.html#${kind === "Workshop" ? "workshops" : "upcoming"}" class="btn btn-outline btn-xs">Details →</a>
        </div>
      </div>
    </article>`;
  const pEmpty = (text, course, btn) => `<div class="p-empty"><p>${text}</p><a href="#contact" class="btn btn-outline btn-xs" data-open-enquiry data-course="${course}">${btn}</a></div>`;
  put("#workshop-list", ws.length ? ws.slice(0, 3).map((x) => pItem(x, "Workshop")).join("")
    : pEmpty("No workshops announced right now. Want one for your school, college or group?", "Workshops", "Ask about workshops"));
  put("#event-list", ev.length ? ev.slice(0, 3).map((x) => pItem(x, "Event")).join("")
    : pEmpty("New dates will be announced here soon.", "Upcoming events", "Get event updates"));
  const pw = $("#perf-wrap");
  if (pw) pw.hidden = !past.length;
  put("#perf-list", past.slice(0, 3).map((x) => {
    const url = safeUrl(x.link);
    const inner = `<b>${esc(x.title)}</b><small>${[fmt(x.date), x.place].filter(Boolean).map(esc).join(" · ")}</small>${url ? `<em>▶ Watch</em>` : ""}`;
    return url ? `<a class="perf" href="${esc(url)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="perf">${inner}</div>`;
  }).join(""));

  // events page: full cards
  const evImg = (x) => (x.photo ? `assets/img/gallery/${encodeURIComponent(x.photo)}-sm.jpg` : "assets/img/gallery/c04-sm.jpg");
  const evCard = (x, kind, isOld) => {
    const d = dt(x.date), url = safeUrl(x.link);
    const dateBadge = d ? `<span class="ev-date"><b>${d.getDate()}</b><small>${d.toLocaleDateString("en-IN", { month: "short" })} ${d.getFullYear()}</small></span>`
      : x.date ? `<span class="ev-date wide"><small>${esc(x.date)}</small></span>` : `<span class="ev-date wide"><small>Date TBA</small></span>`;
    const btns = isOld
      ? (url ? `<a href="${esc(url)}" class="btn btn-red btn-xs" target="_blank" rel="noopener">▶ Watch</a>` : "")
      : `<a href="#book" class="btn btn-red btn-xs" data-open-enquiry data-course="${esc(kind + ": " + x.title)}">${kind === "Workshop" ? "Register now" : "Book your seat"}</a>` +
        (url ? `<a href="${esc(url)}" class="btn btn-outline btn-xs" target="_blank" rel="noopener">Details →</a>` : "");
    return `
    <article class="ev-card${isOld ? " old" : ""}">
      <div class="ev-img"><img src="${evImg(x)}" alt="${esc(x.title)}" loading="lazy">${dateBadge}<span class="ev-kind">${esc(kind)}</span></div>
      <div class="ev-body">
        <h3>${esc(x.title)}</h3>
        <p class="ev-meta">${[x.time && "🕒 " + x.time, x.place && "📍 " + x.place].filter(Boolean).map(esc).join("<br>")}</p>
        ${x.fee && !isOld ? `<p class="ev-fee">Fee: ${esc(x.fee)}</p>` : ""}
        ${x.details ? `<p class="ev-text">${esc(x.details)}</p>` : ""}
        ${btns ? `<div class="ev-btns">${btns}</div>` : ""}
      </div>
    </article>`;
  };
  const evEmpty = (text, course, btn) => `<div class="p-empty ev-empty"><p>${text}</p><a href="#book" class="btn btn-outline btn-xs" data-open-enquiry data-course="${course}">${btn}</a></div>`;
  put("#ev-upcoming", ev.length ? ev.map((x) => evCard(x, "Event")).join("")
    : evEmpty("No upcoming events right now – new dates will be announced here soon.", "Upcoming events", "Get event updates"));
  put("#ev-workshops", ws.length ? ws.map((x) => evCard(x, "Workshop")).join("")
    : evEmpty("No workshops announced right now. Want one for your school, college or group?", "Workshops", "Ask about workshops"));
  put("#ev-past", past.length ? past.map((x) => evCard(x, x.kind, true)).join("")
    : evEmpty("Our past performances will appear here.", "Performance booking", "Book a performance"));

  const courseOptions = [...courses.map((c) => c.title), "Online classes", "Trial class", "Performance booking", ...ws.map((x) => "Workshop: " + x.title), "Workshops", ...ev.map((x) => "Event: " + x.title), "Upcoming events", "Not sure yet"];
  $$("[data-course-select]").forEach((sel) => courseOptions.forEach((t) => sel.add(new Option(t, t))));

  /* ---------- photos ---------- */
  const photos = (C.photos || []).filter((p) => p.show !== false);
  put("#photo-track", photos.map((p, i) =>
    `<button class="photo" data-i="${i}" aria-label="Open photo: ${esc(p.alt)}"><img src="assets/img/gallery/${esc(p.id)}-sm.jpg" alt="${esc(p.alt)}"${p.w ? ` width="${+p.w}" height="${+p.h}"` : ""} loading="lazy"></button>`).join(""));

  /* ---------- videos ---------- */
  const videos = (C.videos || []).filter((v) => v.show !== false);
  const igCode = (u) => (String(u || "").match(/instagram\.com\/(?:[\w.]+\/)?(?:reel|reels|p|tv)\/([\w-]+)/) || [])[1];
  const cap = (v) => (v.title || v.caption ? `<figcaption><b>${esc(v.title)}</b><small>${esc(v.caption)}</small></figcaption>` : "");
  put("#video-track", videos.map((v) => {
    const code = igCode(v.instagram);
    if (v.instagram) return code ? `
    <figure class="vcard ig"><iframe src="https://www.instagram.com/reel/${code}/embed/" title="${esc(v.title || "Instagram reel")}" loading="lazy" allowtransparency="true" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" scrolling="no"></iframe>${cap(v)}</figure>` : "";
    return `
    <figure class="vcard"><video src="assets/video/${esc(v.src)}.mp4" poster="assets/img/${esc(v.src)}-poster.jpg" preload="none" playsinline controls></video>${cap(v)}</figure>`;
  }).join(""));

  /* ---------- reviews ---------- */
  const reviews = (C.reviews || []).filter((r) => r.show !== false && r.text);
  put("#review-grid", reviews.length
    ? reviews.map((r) => `<div class="review"><span class="avatar">${esc((r.name || "?").trim()[0].toUpperCase())}</span><p>${esc(r.text)}</p><b>${esc(r.name)}</b>${r.batch ? ` <small>· ${esc(r.batch)}</small>` : ""}</div>`).join("")
    : [1, 2, 3].map(() => `<div class="review"><span class="avatar">★</span><p class="ph">[Add a review in the admin panel.]</p><b>[Name]</b></div>`).join(""));

  /* ---------- photos chosen in the admin panel ---------- */
  const IMG = C.images || {};
  const gal = (id, sm) => `assets/img/gallery/${encodeURIComponent(id)}${sm ? "-sm" : ""}.jpg`;
  const altOf = (id) => (C.library || []).find((p) => p.id === id)?.alt || "";
  $$("[data-img]").forEach((el) => {
    const id = IMG[el.dataset.img];
    if (id) { el.src = gal(id, el.dataset.size === "sm"); if (!el.closest(".private, .invite, .modal-box")) el.alt = altOf(id); }
  });
  $("#live-img")?.classList.toggle("flip", !!IMG.liveFlip);
  const slides = (list) => (Array.isArray(list) ? list.filter((x) => x.show !== false && x.id) : null);
  const hero = slides(IMG.hero);
  const hv = IMG.heroVideo;
  if (!$(".hero-slides")) {} else if (hv && hv.show !== false && /^[\w\/.-]+\.mp4$/.test(hv.src || "")) {
    // looping banner video (muted so browsers allow autoplay)
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    $(".hero").classList.add("has-video");
    $(".hero-slides").innerHTML = `<video src="${esc(hv.src)}" poster="${esc(hv.poster || "")}" muted loop playsinline preload="auto"${still ? "" : " autoplay"} aria-label="Kathak performance video"></video>`;
    $(".hero-dots").hidden = true;
    const v = $(".hero-slides video");
    v.muted = true;
    if (!still) v.play().catch(() => {});
  } else if (hero && hero.length) {
    $(".hero-slides").innerHTML = hero.map((x, i) => `<img src="${gal(x.id)}" alt="${esc(altOf(x.id))}"${i ? ' loading="lazy"' : ' class="is-on"'}>`).join("");
    $(".hero-dots").innerHTML = hero.map((_, i) => `<button${i ? "" : ' class="is-on"'} aria-label="Slide ${i + 1}"></button>`).join("");
    $(".hero-dots").hidden = hero.length < 2;
  }
  const join = slides(IMG.join);
  if (join && join.length) {
    put("[data-slider]", join.map((x, i) => `<img src="${gal(x.id)}" alt="${esc(altOf(x.id))}"${i ? "" : ' class="is-on"'}>`).join("") + `<div class="slider-dots"></div>`);
  } else if (join && $("[data-slider]")) $("[data-slider]").hidden = true;

  /* ---------- parts switched off in the admin panel ---------- */
  const P = C.parts || {};
  $$("[data-part]").forEach((el) => { if (P[el.dataset.part] === false) el.hidden = true; });
  [".stats", ".explore-grid", ".why-grid"].forEach((sel) => {
    const box = $(sel); if (box) box.style.setProperty("--n", Math.max(1, [...box.children].filter((c) => !c.hidden).length));
  });

  setupInteractions(C, photos, LINKS);
  setupMotion();
}


/* ---------- motion: word reveals, scroll effects, tilt, magnetic buttons ---------- */
function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = "1";
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement("span"); w.className = "w";
          const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains("ico")) walk(n);
    });
  };
  walk(el);
}
function setupScrollStory(still) {
  const stage = $(".stage");
  if (!stage) return;
  const cards = $$(".stage-deck .card").filter((c) => !c.hidden);
  const steps = $$(".steps .step").filter((s) => !s.hidden);
  const total = Math.max(1, steps.length);
  $(".hud-total").textContent = String(total).padStart(2, "0");
  let active = -1, beatTimer = null, beat = 0;
  const beats = $$(".taal-grid .beat");
  const tick = () => { beats.forEach((b, i) => b.classList.toggle("on", i === beat)); beat = (beat + 1) % beats.length; };
  const setActive = (n) => {
    if (n === active) return;
    active = n;
    const step = steps[n], key = step ? +step.dataset.step : 0;
    const idx = Math.max(0, cards.findIndex((c) => +c.dataset.i === key));
    cards.forEach((c, i) => { c.dataset.d = Math.max(-1, Math.min(3, i - idx)); });
    steps.forEach((s, i) => s.classList.toggle("is-active", i === n));
    $(".hud-now").textContent = String(n + 1).padStart(2, "0");
    const taalOn = cards[idx]?.classList.contains("card-taal");
    clearInterval(beatTimer); beatTimer = null;
    if (taalOn && !still) { tick(); beatTimer = setInterval(tick, 420); }
    else if (taalOn) beats[0]?.classList.add("on");
  };
  setActive(0);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(steps.indexOf(e.target)); }), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
  const rail = $(".hud-rail i"), sec = $("#about");
  const prog = () => {
    const r = sec.getBoundingClientRect(), span = r.height - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (innerHeight * 0.3 - r.top) / Math.max(1, span)));
    if (rail) rail.style.transform = `scaleY(${p.toFixed(3)})`;
  };
  addEventListener("scroll", prog, { passive: true }); prog();
}

function setupMotion() {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("motion-ready");
  // headings rise word by word
  $$(".split, main h2:not([data-guru]), .gate-head h2").forEach((el) => { el.classList.add("split"); splitWords(el); });
  const hio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); hio.unobserve(e.target); } }), { threshold: 0.3 });
  $$(".split").forEach((el) => (el.closest(".hero") ? requestAnimationFrame(() => el.classList.add("in")) : hio.observe(el)));
  document.body.classList.add("loaded");
  // images open from the bottom
  const iio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); iio.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".guru-photo .arch, .invite-photo, .online-photos, .level-img, .private-img, .story-main .window").forEach((el) => { el.classList.add("rv-img"); iio.observe(el); });
  setupScrollStory(still);
  if (still) return;

  // scroll-driven: progress line, growing banner card, parallax
  const bar = $(".progress"), grow = $("[data-grow]"), par = $$("[data-speed]");
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (grow) {
      const r = grow.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.top - vh * 0.1) / (vh * 0.7)));
      grow.style.setProperty("--p", p.toFixed(3));
    }
    const small = innerWidth < 700;
    par.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const off = (r.top + r.height / 2 - vh / 2) * -(+el.dataset.speed) * (small ? 0.5 : 1);
      el.style.translate = `0 ${off.toFixed(1)}px`;
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();

  // 3D tilt with a soft shine (mouse only)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const tiltSel = ".level, .ev-card, .perf, .private, .p-item, .way-list li";
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(tiltSel);
      $$(".tilting").forEach((c) => { if (c !== card) { c.classList.remove("tilting"); c.style.transform = ""; } });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.classList.add("tilt", "tilting");
      card.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 6).toFixed(2)}deg) rotateY(${((x - 0.5) * 8).toFixed(2)}deg) translateY(-3px)`;
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    }, { passive: true });
    // magnetic buttons
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`;
      });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
  }
}

/* ================= interactions ================= */
function setupInteractions(C, photos, LINKS) {
  // mobile menu
  const burger = $(".burger");
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  // active nav link
  const sections = $$("#menu a:not([hidden])").filter((a) => a.getAttribute("href").startsWith("#")).map((a) => $(a.getAttribute("href"))).filter(Boolean);
  window.addEventListener("scroll", () => {
    $(".header").classList.toggle("scrolled", scrollY > 40);
    if (!sections.length) return;
    let cur = sections[0];
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 140) cur = s; });
    $$("#menu a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur.id));
  }, { passive: true });

  // hero slideshow
  {
    const imgs = $$(".hero-slides img"), dots = $$(".hero-dots button");
    let i = 0, t;
    if (imgs.length < 2) dots.length = 0;
    const go = (n) => {
      imgs[i].classList.remove("is-on"); dots[i]?.classList.remove("is-on");
      i = (n + imgs.length) % imgs.length;
      imgs[i].classList.add("is-on"); dots[i]?.classList.add("is-on");
    };
    const auto = () => { clearInterval(t); if (imgs.length > 1) t = setInterval(() => go(i + 1), 5500); };
    dots.forEach((d, n) => d.addEventListener("click", () => { go(n); auto(); }));
    auto();
  }

  // small image slider
  $$("[data-slider]").forEach((box) => {
    const imgs = $$("img", box), dotsBox = $(".slider-dots", box);
    let i = 0;
    if (imgs.length < 2) return;
    imgs.forEach((_, n) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Image " + (n + 1));
      b.onclick = () => go(n);
      dotsBox.appendChild(b);
    });
    const dots = $$("button", dotsBox);
    const go = (n) => {
      imgs[i].classList.remove("is-on"); dots[i].classList.remove("is-on");
      i = (n + imgs.length) % imgs.length;
      imgs[i].classList.add("is-on"); dots[i].classList.add("is-on");
    };
    dots[0].classList.add("is-on");
    setInterval(() => go(i + 1), 4000);
  });

  // mentor card rotator
  {
    const items = $$(".mc-item");
    let i = 0;
    if (items.length > 1) setInterval(() => {
      items[i].classList.remove("is-on");
      i = (i + 1) % items.length;
      items[i].classList.add("is-on");
    }, 2800);
  }

  // course filters
  $$("[data-filters] button").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filters] button").forEach((x) => x.classList.toggle("is-on", x === b));
    $$(".course").forEach((c) => { c.hidden = b.dataset.f !== "all" && c.dataset.cat !== b.dataset.f; });
  }));

  // carousel arrows
  $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => {
    const tr = $("#" + b.dataset.target);
    tr.scrollBy({ left: +b.dataset.scroll * tr.clientWidth * 0.8, behavior: "smooth" });
  }));

  // lightbox
  const lb = $("#lightbox") || document.createElement("div"), lbImg = $("img", lb) || document.createElement("img");
  let cur = 0;
  const show = (i) => { cur = (i + photos.length) % photos.length; lbImg.src = `assets/img/gallery/${photos[cur].id}.jpg`; lbImg.alt = photos[cur].alt; };
  $$(".photo").forEach((p) => p.addEventListener("click", () => { show(+p.dataset.i); lb.hidden = false; document.body.classList.add("locked"); }));
  const closeLb = () => { lb.hidden = true; document.body.classList.remove("locked"); };
  if ($(".lb-x", lb)) {
    $(".lb-x", lb).onclick = closeLb;
    $(".lb-prev", lb).onclick = () => show(cur - 1);
    $(".lb-next", lb).onclick = () => show(cur + 1);
  } else lb.hidden = true;
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  // Instagram embeds report their height – resize each frame to fit
  window.addEventListener("message", (e) => {
    if (!/^https:\/\/www\.instagram\.com$/.test(e.origin)) return;
    let d = e.data;
    try { if (typeof d === "string") d = JSON.parse(d); } catch (_) { return; }
    const h = d?.type === "MEASURE" && +d.details?.height;
    if (!h) return;
    const fr = $$(".vcard.ig iframe").find((f) => f.contentWindow === e.source);
    if (fr) fr.style.height = Math.min(h, 1200) + "px";
  });

  // one video at a time
  const vids = $$("video");
  vids.forEach((v) => v.addEventListener("play", () => vids.forEach((o) => o !== v && o.pause())));

  // stats count-up
  const nums = C.numbers || {};
  const statIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    statIO.unobserve(e.target);
    const n = +nums[e.target.dataset.count];
    if (!n) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + "+";
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.5 });
  $$("[data-count]").forEach((el) => statIO.observe(el));

  // enquiry popup
  const modal = $("#modal");
  const openModal = (course) => {
    if (course) $$("[data-course-select]").forEach((s) => {
      if (![...s.options].some((o) => o.value === course)) s.add(new Option(course, course));
      s.value = course;
    });
    modal.hidden = false;
    document.body.classList.add("locked");
  };
  const closeModal = () => { modal.hidden = true; document.body.classList.remove("locked"); };
  $(".modal-x").onclick = closeModal;
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  $$("[data-open-enquiry]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(b.dataset.course);
  }));
  if (C.popup?.enabled !== false) {
    try {
      if (!sessionStorage.getItem("smkk-popup")) {
        setTimeout(() => {
          if (lb.hidden) openModal();
          sessionStorage.setItem("smkk-popup", "1");
        }, (+C.popup?.delaySeconds || 6) * 1000);
      }
    } catch (_) {}
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeLb(); }
    if (!lb.hidden && e.key === "ArrowLeft") show(cur - 1);
    if (!lb.hidden && e.key === "ArrowRight") show(cur + 1);
  });

  // forms -> Google Sheet + email (Apps Script) and WhatsApp
  const endpoint = (C.site?.formEndpoint || "").trim();
  $$("[data-enquiry-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const note = $("[data-form-note]", f);
    const say = (t, cls) => { if (note) { note.textContent = t; note.className = "form-note " + (cls || ""); } };

    if (d.get("website")) return; // spam trap filled in – ignore silently

    if (!endpoint && !LINKS.whatsappLink) { say("Sorry, the enquiry form isn't set up yet. Please call us instead.", "bad"); return; }

    // 1) save to Google Sheet + email (fire-and-forget so WhatsApp can open right away)
    if (endpoint) {
      const body = new URLSearchParams();
      ["name", "phone", "mode", "course", "message", "website"].forEach((k) => body.append(k, (d.get(k) || "").toString().slice(0, 2000)));
      body.append("source", f.classList.contains("modal-form") ? "Popup" : "Contact section");
      body.append("page", location.href);
      fetch(endpoint, { method: "POST", mode: "no-cors", body, keepalive: true }).catch(() => {});
    }

    // 2) open WhatsApp with the details filled in
    if (LINKS.whatsappLink) {
      const lines = [
        "Namaste! I'd like to enquire about Kathak classes.",
        "Name: " + d.get("name"),
        "Phone: " + d.get("phone"),
        d.get("mode") && "Learn: " + d.get("mode"),
        d.get("course") && "Interested in: " + d.get("course"),
        d.get("message") && "Message: " + d.get("message"),
      ].filter(Boolean).join("\n");
      window.open(LINKS.whatsappLink + "?text=" + encodeURIComponent(lines), "_blank", "noopener");
    }

    say("Thank you! We've received your enquiry and will contact you soon.", "ok");
    f.reset();
    try { sessionStorage.setItem("smkk-popup", "1"); } catch (_) {}
  }));

  // reveal on scroll
  const revIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revIO.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".sec-head, .story-text, .story-arches, .level, .private, .online-copy, .way-list li, .stat, .portal-col, .perf, .ev-card, .invite-photo, .invite-copy, .reach-info, .reach-form, .review, .guru-photo, .guru-copy")
    .forEach((el) => { el.classList.add("rv"); revIO.observe(el); });

  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
}
