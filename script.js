/* Sangeet Manjari Kala Kendra – site script.
   All editable content lives in content.json (edit it at /admin.html). */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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
  const price = (v) => (v ? "₹" + esc(v) : "₹ —");
  $("#course-grid").innerHTML = courses.map((c) => `
    <article class="course" data-cat="${esc(c.cat)}">
      <div class="course-img"><img src="assets/img/gallery/${esc(c.img)}-sm.jpg" alt="" loading="lazy"><span class="course-badge">${esc(c.badge)}</span></div>
      <div class="course-body">
        <h3>${esc(c.title)}</h3>
        <p class="course-dur">🗓 Course duration: ${esc(c.duration)}</p>
        <div class="price-row">
          <div><small class="pr-label">Group Classes</small><b class="${c.group ? "" : "ph"}">${price(c.group)}<i>/month</i></b><small>${esc(c.groupNote)}</small></div>
          <div><small class="pr-label">Personal (One-on-One)</small><b class="${c.personal ? "" : "ph"}">${price(c.personal)}<i>/month</i></b><small>${esc(c.personalNote)}</small></div>
        </div>
        <div class="course-btns">
          <a href="#contact" class="btn btn-red btn-sm" data-open-enquiry data-course="${esc(c.title)}">Enroll now</a>
          <a href="#contact" class="btn btn-outline btn-sm" data-open-enquiry data-course="${esc(c.title)}">Explore →</a>
        </div>
      </div>
    </article>`).join("");
  // only show filter tabs that have courses
  const cats = new Set(courses.map((c) => c.cat));
  $$("[data-filters] button").forEach((b) => { b.hidden = b.dataset.f !== "all" && !cats.has(b.dataset.f); });
  $("#footer-courses").innerHTML = courses.map((c) => `<a href="#courses">${esc(c.title)}</a>`).join("");

  const courseOptions = [...courses.map((c) => c.title), "Personal (One-to-One)", "Performance booking", "Workshops", "Upcoming events", "Not sure yet"];
  $$("[data-course-select]").forEach((sel) => courseOptions.forEach((t) => sel.add(new Option(t, t))));

  /* ---------- photos ---------- */
  const photos = (C.photos || []).filter((p) => p.show !== false);
  $("#photo-track").innerHTML = photos.map((p, i) =>
    `<button class="photo" data-i="${i}" aria-label="Open photo: ${esc(p.alt)}"><img src="assets/img/gallery/${esc(p.id)}-sm.jpg" alt="${esc(p.alt)}" loading="lazy"></button>`).join("");

  /* ---------- videos ---------- */
  const videos = (C.videos || []).filter((v) => v.show !== false);
  $("#video-track").innerHTML = videos.map((v) => `
    <figure class="vcard"><video src="assets/video/${esc(v.src)}.mp4" poster="assets/img/${esc(v.src)}-poster.jpg" preload="none" playsinline controls></video>
    <figcaption><b>${esc(v.title)}</b><small>${esc(v.caption)}</small></figcaption></figure>`).join("");

  /* ---------- reviews ---------- */
  const reviews = (C.reviews || []).filter((r) => r.show !== false && r.text);
  $("#review-grid").innerHTML = reviews.length
    ? reviews.map((r) => `<div class="review"><span class="avatar">${esc((r.name || "?").trim()[0].toUpperCase())}</span><p>${esc(r.text)}</p><b>${esc(r.name)}</b>${r.batch ? ` <small>· ${esc(r.batch)}</small>` : ""}</div>`).join("")
    : [1, 2, 3].map(() => `<div class="review"><span class="avatar">★</span><p class="ph">[Add a review in the admin panel.]</p><b>[Name]</b></div>`).join("");

  setupInteractions(C, photos, LINKS);
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
  const sections = $$("#menu a:not([hidden])").map((a) => $(a.getAttribute("href"))).filter(Boolean);
  window.addEventListener("scroll", () => {
    $(".header").classList.toggle("scrolled", scrollY > 40);
    let cur = sections[0];
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 140) cur = s; });
    $$("#menu a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur.id));
  }, { passive: true });

  // hero slideshow
  {
    const imgs = $$(".hero-slides img"), dots = $$(".hero-dots button");
    let i = 0, t;
    const go = (n) => {
      imgs[i].classList.remove("is-on"); dots[i].classList.remove("is-on");
      i = (n + imgs.length) % imgs.length;
      imgs[i].classList.add("is-on"); dots[i].classList.add("is-on");
    };
    const auto = () => { clearInterval(t); t = setInterval(() => go(i + 1), 5500); };
    dots.forEach((d, n) => d.addEventListener("click", () => { go(n); auto(); }));
    auto();
  }

  // small image slider
  $$("[data-slider]").forEach((box) => {
    const imgs = $$("img", box), dotsBox = $(".slider-dots", box);
    let i = 0;
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
    setInterval(() => {
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
  const lb = $("#lightbox"), lbImg = $("img", lb);
  let cur = 0;
  const show = (i) => { cur = (i + photos.length) % photos.length; lbImg.src = `assets/img/gallery/${photos[cur].id}.jpg`; lbImg.alt = photos[cur].alt; };
  $$(".photo").forEach((p) => p.addEventListener("click", () => { show(+p.dataset.i); lb.hidden = false; document.body.classList.add("locked"); }));
  const closeLb = () => { lb.hidden = true; document.body.classList.remove("locked"); };
  $(".lb-x", lb).onclick = closeLb;
  $(".lb-prev", lb).onclick = () => show(cur - 1);
  $(".lb-next", lb).onclick = () => show(cur + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

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
    if (course) $$("[data-course-select]").forEach((s) => (s.value = course));
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

  // forms -> WhatsApp
  $$("[data-enquiry-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const lines = [
      "Namaste! I'd like to enquire about Kathak classes.",
      "Name: " + d.get("name"),
      "Phone: " + d.get("phone"),
      d.get("mode") && "Class mode: " + d.get("mode"),
      d.get("course") && "Course: " + d.get("course"),
      d.get("message") && "Message: " + d.get("message"),
    ].filter(Boolean).join("\n");
    if (!LINKS.whatsappLink) { alert("WhatsApp number isn't set up yet."); return; }
    window.open(LINKS.whatsappLink + "?text=" + encodeURIComponent(lines), "_blank", "noopener");
  }));

  // reveal on scroll
  const revIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revIO.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".head-center, .about-copy, .collage, .course, .ex-card, .why-card, .stat, .join-copy, .join-slider, .form-card, .contact-img, .live-box, .review")
    .forEach((el) => { el.classList.add("rv"); revIO.observe(el); });

  $("#year").textContent = new Date().getFullYear();
}
