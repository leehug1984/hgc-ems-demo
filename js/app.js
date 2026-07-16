// Hallmark · shared behaviors: nav, dropdowns, tabs, toggles, tree, clock, chart tooltip

(function () {
  "use strict";

  function slugOf(path) {
    var parts = path.split("/").filter(function (p) { return p && p !== "index.html"; });
    return parts[parts.length - 1] || "dashboard";
  }

  function markActiveNav() {
    var current = slugOf(location.pathname);
    document.querySelectorAll(".sidebar-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && slugOf(href) === current) a.classList.add("is-active");
    });
  }

  function mobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var sidebar = document.querySelector(".sidebar");
    var scrim = document.querySelector(".sidebar-scrim");
    if (!toggle || !sidebar || !scrim) return;
    function close() {
      sidebar.classList.remove("is-open");
      scrim.classList.remove("is-open");
    }
    toggle.addEventListener("click", function () {
      sidebar.classList.add("is-open");
      scrim.classList.add("is-open");
    });
    scrim.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function dropdowns() {
    document.querySelectorAll(".dropdown").forEach(function (dd) {
      var trigger = dd.querySelector("[data-dropdown-trigger]");
      if (!trigger) return;
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains("is-open");
        document.querySelectorAll(".dropdown.is-open").forEach(function (o) { o.classList.remove("is-open"); });
        if (!wasOpen) dd.classList.add("is-open");
      });
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".dropdown.is-open").forEach(function (o) { o.classList.remove("is-open"); });
    });
  }

  function tabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var buttons = group.querySelectorAll(".tabs button, .seg-group button, .dial-group button");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var target = btn.getAttribute("data-target");
          if (!target) return;
          var panels = document.querySelectorAll("[data-panel-group='" + group.getAttribute("data-tabs") + "'] [data-panel]");
          panels.forEach(function (p) {
            p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
          });
        });
      });
    });
  }

  function tree() {
    document.querySelectorAll(".tree-node[data-toggle]").forEach(function (node) {
      node.addEventListener("click", function () {
        var childId = node.getAttribute("data-toggle");
        var children = document.getElementById(childId);
        var chev = node.querySelector(".chev");
        if (!children) return;
        children.classList.toggle("is-collapsed");
        if (chev) chev.classList.toggle("is-collapsed");
      });
    });
    document.querySelectorAll(".tree-node[data-select-group]").forEach(function (node) {
      node.addEventListener("click", function () {
        var group = node.getAttribute("data-select-group");
        document.querySelectorAll(".tree-node[data-select-group='" + group + "']").forEach(function (n) {
          n.classList.remove("is-active");
        });
        node.classList.add("is-active");
      });
    });
  }

  function clock() {
    var el = document.querySelector("[data-clock]");
    if (!el) return;
    function tick() {
      var d = new Date();
      var pad = function (n) { return String(n).padStart(2, "0"); };
      el.innerHTML = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  function loadingButtons() {
    document.querySelectorAll("[data-demo-loading]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-loading")) return;
        var original = btn.innerHTML;
        btn.classList.add("is-loading");
        setTimeout(function () {
          btn.classList.remove("is-loading");
        }, 1100);
      });
    });
  }

  // Generic tooltip/crosshair for line charts built with .chart-frame svg + [data-x] points
  function chartHover() {
    document.querySelectorAll(".chart-frame[data-hover]").forEach(function (frame) {
      var svg = frame.querySelector("svg");
      var tooltip = frame.querySelector(".chart-tooltip");
      var crosshair = frame.querySelector(".chart-crosshair");
      var points = Array.prototype.slice.call(frame.querySelectorAll(".chart-point"));
      var hitArea = frame.querySelector(".chart-hover-target");
      if (!svg || !tooltip || !hitArea || points.length === 0) return;

      var samples = points.map(function (p) {
        return {
          x: parseFloat(p.getAttribute("cx")),
          el: p,
          rows: JSON.parse(p.getAttribute("data-rows") || "[]"),
          label: p.getAttribute("data-label") || "",
        };
      }).sort(function (a, b) { return a.x - b.x; });

      function nearest(mouseX) {
        var best = samples[0];
        var bestDist = Infinity;
        samples.forEach(function (s) {
          var d = Math.abs(s.x - mouseX);
          if (d < bestDist) { bestDist = d; best = s; }
        });
        return best;
      }

      function show(evt) {
        var rect = svg.getBoundingClientRect();
        var vb = svg.viewBox.baseVal;
        var scaleX = vb.width / rect.width;
        var mouseSvgX = (evt.clientX - rect.left) * scaleX;
        var sample = nearest(mouseSvgX);

        points.forEach(function (p) { p.classList.remove("is-visible"); });
        sample.el.classList.add("is-visible");

        crosshair.setAttribute("x1", sample.x);
        crosshair.setAttribute("x2", sample.x);
        crosshair.classList.add("is-visible");

        var rowsHtml = sample.rows.map(function (r) {
          return '<div class="row"><span class="sw" style="background:' + r.color + '"></span>' + r.name + ": <strong>" + r.value + "</strong></div>";
        }).join("");
        tooltip.innerHTML = '<div class="u-muted" style="margin-bottom:3px">' + sample.label + "</div>" + rowsHtml;
        tooltip.classList.add("is-visible");

        var px = (sample.x / vb.width) * rect.width;
        tooltip.style.left = px + "px";
        tooltip.style.top = "0px";
      }

      function hide() {
        points.forEach(function (p) { p.classList.remove("is-visible"); });
        crosshair.classList.remove("is-visible");
        tooltip.classList.remove("is-visible");
      }

      hitArea.addEventListener("mousemove", show);
      hitArea.addEventListener("mouseleave", hide);
      hitArea.addEventListener("touchmove", function (e) {
        if (e.touches[0]) show({ clientX: e.touches[0].clientX });
      }, { passive: true });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    mobileNav();
    dropdowns();
    tabs();
    tree();
    clock();
    loadingButtons();
    chartHover();
  });
})();
