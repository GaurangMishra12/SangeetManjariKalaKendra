/* Syllabus page: pick a year, see its panel. Remembers the choice in the URL hash (#year-3). */
(function () {
  const btns = [...document.querySelectorAll(".sy-year")];
  const panels = [...document.querySelectorAll(".sy-panel")];
  if (!btns.length) return;
  const show = (i, push) => {
    btns.forEach((b) => { const on = +b.dataset.y === i; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    panels.forEach((p) => { p.hidden = +p.dataset.y !== i; });
    document.querySelectorAll(".sy-stage").forEach((st) => st.classList.toggle("on", !!st.querySelector(".sy-year.on")));
    if (push) history.replaceState(null, "", "#year-" + (i + 1));
  };
  btns.forEach((b) => b.addEventListener("click", () => {
    show(+b.dataset.y, true);
    const board = document.querySelector(".sy-board");
    if (board && board.getBoundingClientRect().top > innerHeight * 0.6) board.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  const m = location.hash.match(/year-(\d)/);
  show(m ? Math.min(+m[1], panels.length) - 1 : 0, false);
})();
