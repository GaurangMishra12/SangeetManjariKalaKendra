/* Syllabus page: choose a board, then a year. The choice is kept in the URL hash (#bsv-year-3). */
(function () {
  const sets = [...document.querySelectorAll(".sy-set")];
  const tabs = [...document.querySelectorAll(".sy-tab")];
  if (!sets.length) return;
  let board = sets[0].dataset.b;
  const setOf = (b) => sets.find((s) => s.dataset.b === b);
  const showYear = (i) => {
    const set = setOf(board);
    set.querySelectorAll(".sy-year").forEach((x) => { const on = +x.dataset.y === i; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
    set.querySelectorAll(".sy-panel").forEach((p) => { p.hidden = +p.dataset.y !== i; });
    set.querySelectorAll(".sy-stage").forEach((st) => st.classList.toggle("on", !!st.querySelector(".sy-year.on")));
  };
  const showBoard = (b) => {
    board = b;
    sets.forEach((s) => { s.hidden = s.dataset.b !== b; });
    tabs.forEach((t) => { const on = t.dataset.b === b; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); });
  };
  const save = () => {
    const y = setOf(board).querySelector(".sy-year.on");
    history.replaceState(null, "", "#" + board + "-year-" + ((y ? +y.dataset.y : 0) + 1));
  };
  tabs.forEach((t) => t.addEventListener("click", () => { showBoard(t.dataset.b); save(); }));
  sets.forEach((set) => set.querySelectorAll(".sy-year").forEach((x) => x.addEventListener("click", () => {
    showYear(+x.dataset.y); save();
    const panel = set.querySelector(".sy-board");
    if (panel && panel.getBoundingClientRect().top > innerHeight * 0.6) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  })));
  const m = location.hash.match(/^#(\w+)-year-(\d)/);
  if (m && setOf(m[1])) { showBoard(m[1]); showYear(Math.min(+m[2], 9) - 1); }
  else { showBoard(board); showYear(0); }
})();
