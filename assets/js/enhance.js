/* ============================================================
   enhance.js — turns Kramdown-rendered newsletter markdown into
   the Terminal/Technical design, client-side.

   Pipeline per issue page:
     1. strip Obsidian cruft (#newsletter tag, the duplicate H1)
     2. lift the "**Week …**" line into the meta
     3. split the body on its <hr> rules into intro | threads | synthesis
     4. rebuild as .thesis / .toc / .threads / .synthesis (styled by style.css)

   Also runs site-wide: theme toggle (persisted) + smooth jump-nav.
   Authoring stays plain markdown; this layer does the structuring.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  function initTheme() {
    var KEY = "wibe-theme";
    var root = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    root.setAttribute("data-theme", stored || root.getAttribute("data-default-theme") || "dark");
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-theme-toggle]");
      if (!btn) return;
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e2) {}
    });
  }

  /* ---------- smooth jump nav (no scrollIntoView) ---------- */
  function initJumpNav() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: top, behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
  }

  /* ---------- helpers ---------- */
  function host(url) {
    try { return new URL(url, location.href).hostname.replace(/^www\./, ""); }
    catch (e) { return ""; }
  }
  function pad2(n) { n = String(n); return n.length < 2 ? "0" + n : n; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function make(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function deNum(s) { return s.replace(/^\s*\d+\.\s*/, ""); }

  /* ---------- transform the issue body ---------- */
  function enhanceBody() {
    var src = document.getElementById("issue-body");
    if (!src) return;

    // 1. strip the redundant H1 + Obsidian "#tag" paragraphs
    slice(src.children).forEach(function (n) {
      if (n.tagName === "H1") n.remove();
      else if (n.tagName === "P" && /^#[A-Za-z][\w-]*$/.test(n.textContent.trim())) n.remove();
    });

    // 2. lift the bold "Week …" line into the meta slot, then remove it
    var kids = slice(src.children);
    for (var i = 0; i < kids.length; i++) {
      var p = kids[i];
      if (p.tagName === "P" && p.children.length === 1 &&
          p.firstElementChild.tagName === "STRONG" && /^week\b/i.test(p.textContent.trim())) {
        var slot = document.querySelector("[data-week-slot]");
        if (slot && !slot.textContent.trim()) slot.textContent = p.textContent.trim();
        p.remove();
        break;
      }
    }

    // 3. partition on <hr>: intro | threads | synthesis
    kids = slice(src.children);
    var hrs = [];
    kids.forEach(function (n, idx) { if (n.tagName === "HR") hrs.push(idx); });
    var introNodes, threadNodes, synthNodes;
    if (hrs.length) {
      var first = hrs[0], last = hrs[hrs.length - 1];
      introNodes = kids.slice(0, first);
      if (last > first) { threadNodes = kids.slice(first + 1, last); synthNodes = kids.slice(last + 1); }
      else { threadNodes = kids.slice(first + 1); synthNodes = []; }
    } else {
      var fh2 = -1;
      for (var k = 0; k < kids.length; k++) { if (kids[k].tagName === "H2") { fh2 = k; break; } }
      introNodes = fh2 >= 0 ? kids.slice(0, fh2) : kids.slice();
      threadNodes = fh2 >= 0 ? kids.slice(fh2) : [];
      synthNodes = [];
    }

    var frag = document.createDocumentFragment();

    // ---- thesis ----
    var dataThesis = (src.getAttribute("data-thesis") || "").trim();
    var introParas = introNodes.filter(function (n) { return n.tagName === "P"; });
    var thesis = make("section", "thesis");
    thesis.appendChild(make("div", "thesis-label", "This week\u2019s thread"));
    if (dataThesis) {
      thesis.appendChild(make("p", "thesis-text", esc(dataThesis)));
      introParas.forEach(function (n) { thesis.appendChild(make("p", "thesis-intro", n.innerHTML)); });
    } else if (introParas.length) {
      thesis.appendChild(make("p", "thesis-text", introParas[0].innerHTML));
      introParas.slice(1).forEach(function (n) { thesis.appendChild(make("p", "thesis-intro", n.innerHTML)); });
    }
    frag.appendChild(thesis);

    // ---- group threads ----
    var threads = [];
    var cur = null;
    threadNodes.forEach(function (n) {
      if (n.tagName === "H2") { cur = { title: n, body: [], links: null }; threads.push(cur); }
      else if (cur) {
        if (n.tagName === "UL" && !cur.links) cur.links = n;
        else cur.body.push(n);
      }
    });

    // ---- table of contents ----
    if (threads.length) {
      var toc = make("nav", "toc");
      toc.setAttribute("aria-label", "In this issue");
      toc.appendChild(make("div", "toc-head", "threads"));
      var list = make("ol", "toc-list");
      threads.forEach(function (t, idx) {
        var a = make("a", null,
          '<span class="toc-num">' + pad2(idx + 1) + '</span>' +
          '<span class="toc-title">' + esc(deNum(t.title.textContent)) + "</span>");
        a.setAttribute("href", "#t" + (idx + 1));
        var li = document.createElement("li");
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.appendChild(list);
      frag.appendChild(toc);
    }

    // ---- threads ----
    var ol = make("ol", "threads");
    threads.forEach(function (t, idx) {
      var li = make("li", "thread");
      li.id = "t" + (idx + 1);

      var head = make("div", "thread-head");
      head.appendChild(make("span", "thread-index", pad2(idx + 1)));
      var anchor = make("a", "thread-anchor", "#");
      anchor.setAttribute("href", "#t" + (idx + 1));
      anchor.setAttribute("aria-label", "Link to this thread");
      head.appendChild(anchor);
      li.appendChild(head);

      li.appendChild(make("h2", "thread-title", deNum(t.title.innerHTML)));

      t.body.forEach(function (n) {
        if (n.tagName === "P") li.appendChild(make("p", "thread-body", n.innerHTML));
        else li.appendChild(n.cloneNode(true));
      });

      if (t.links) {
        var ul = make("ul", "thread-links");
        slice(t.links.children).forEach(function (rawLi) {
          var a = rawLi.querySelector("a");
          if (!a) return;
          var href = a.getAttribute("href");
          var label = a.textContent.trim();
          var note = rawLi.textContent.replace(label, "").replace(/^\s*[\u2014\u2013\-:]+\s*/, "").trim();
          var item = document.createElement("li");
          var la = document.createElement("a");
          la.setAttribute("href", href);
          la.setAttribute("target", "_blank");
          la.setAttribute("rel", "noopener");
          la.innerHTML =
            '<span class="link-label">' + esc(label) + "</span>" +
            '<span class="link-host">' + esc(host(href)) + "</span>" +
            (note ? '<span class="link-note">' + esc(note) + "</span>" : "");
          item.appendChild(la);
          ul.appendChild(item);
        });
        li.appendChild(ul);
      }
      ol.appendChild(li);
    });
    if (threads.length) frag.appendChild(ol);

    // ---- synthesis ----
    var synthParas = synthNodes.filter(function (n) { return n.tagName === "P"; });
    if (synthParas.length) {
      var signoffPara = null, mainPara = null;
      synthParas.forEach(function (n) {
        if (/^see you next week/i.test(n.textContent.trim())) signoffPara = n;
        else if (!mainPara) mainPara = n;
      });
      var label = "The through-line";
      var text = mainPara ? mainPara.innerHTML : "";
      if (mainPara) {
        var raw = mainPara.textContent;
        var ci = raw.indexOf(": ");
        if (ci > 0 && ci < 64) {
          label = raw.slice(0, ci).trim();
          text = mainPara.innerHTML.replace(/^[^:]*:\s*/, "");
        }
      }
      var synth = make("section", "synthesis");
      synth.appendChild(make("div", "synthesis-label", esc(label)));
      synth.appendChild(make("p", "synthesis-text", text));
      var author = src.getAttribute("data-author") || "";
      var signoff = make("p", "signoff");
      signoff.innerHTML =
        (signoffPara ? esc(signoffPara.textContent.trim()) : "See you next week.") +
        (author ? '<span class="signoff-name">\u2014 ' + esc(author) + "</span>" : "");
      synth.appendChild(signoff);
      frag.appendChild(synth);
    }

    src.innerHTML = "";
    src.appendChild(frag);
    src.setAttribute("data-enhanced", "1");
  }

  function slice(x) { return Array.prototype.slice.call(x); }

  /* ---------- boot ---------- */
  function boot() {
    initTheme();
    try { enhanceBody(); } catch (e) { if (window.console) console.warn("enhance:", e); }
    var b = document.getElementById("issue-body");
    if (b) b.style.opacity = "1";
    initJumpNav();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
