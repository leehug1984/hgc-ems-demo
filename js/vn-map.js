// Hallmark · Dashboard "All Sites" map — real VN province topology (kcjpop/vietnam-topojson via jsDelivr)
// + mock site coordinates projected with d3-geo. Requires d3 v7 and topojson-client (loaded before this file).

(function () {
  "use strict";

  var TOPOJSON_URL = "https://cdn.jsdelivr.net/gh/kcjpop/vietnam-topojson@main/legacy/adm2/adm2.json";

  // Mock site coordinates — real city lat/lng, mapped to the 6 demo sites
  var SITES = [
    { name: "ETEK BESS 01 · Hải Phòng", lat: 20.8449, lng: 106.6881, status: "good" },
    { name: "ETEK BESS 02 · Bắc Ninh", lat: 21.1861, lng: 106.0763, status: "good" },
    { name: "ETEK BESS 03 · Bắc Ninh", lat: 21.1214, lng: 106.1111, status: "good" },
    { name: "ETEK BESS 04 · Bình Dương", lat: 11.1667, lng: 106.6667, status: "warning" },
    { name: "ETEK BESS 05 · Nghệ An", lat: 18.6796, lng: 105.6813, status: "critical" },
    { name: "ETEK BESS 06 · Tây Ninh", lat: 11.31, lng: 106.0989, status: "good" }
  ];

  var PIN_PATH = "M0,-16 C-6.6,-16 -12,-10.6 -12,-4 C-12,4.5 0,16 0,16 C0,16 12,4.5 12,-4 C12,-10.6 6.6,-16 0,-16 Z";
  var STATUS_COLOR = { good: "var(--color-good)", warning: "var(--color-warning)", critical: "var(--color-critical)" };

  function renderFallback(container) {
    container.innerHTML = '<div class="u-muted" style="font-size:var(--text-2xs);padding:var(--space-md);text-align:center">Không tải được bản đồ (cần kết nối internet tới jsDelivr).</div>';
  }

  function init() {
    var container = document.getElementById("vn-map");
    if (!container || typeof d3 === "undefined" || typeof topojson === "undefined") return;

    var width = container.clientWidth || 260;
    var height = container.clientHeight || 190;

    var svg = d3.select(container).append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("width", "100%")
      .attr("height", "100%");

    fetch(TOPOJSON_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("network response was not ok");
        return res.json();
      })
      .then(function (topology) {
        var objectKey = Object.keys(topology.objects)[0];
        var geo = topojson.feature(topology, topology.objects[objectKey]);

        var projection = d3.geoMercator().fitSize([width, height], geo);
        var path = d3.geoPath(projection);

        svg.selectAll("path.province")
          .data(geo.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "var(--color-paper-4)")
          .attr("stroke", "var(--color-rule)")
          .attr("stroke-width", 0.6);

        var pins = svg.selectAll("g.site-pin")
          .data(SITES)
          .enter()
          .append("g")
          .attr("transform", function (d) {
            var xy = projection([d.lng, d.lat]);
            return "translate(" + xy[0] + "," + xy[1] + ") scale(0.42)";
          })
          .style("color", function (d) { return STATUS_COLOR[d.status]; })
          .style("cursor", "default");

        pins.append("path").attr("d", PIN_PATH).attr("fill", "currentColor");
        pins.append("circle").attr("cx", 0).attr("cy", -4).attr("r", 4.2).attr("fill", "var(--color-paper-3)");
        pins.append("title").text(function (d) { return d.name; });
      })
      .catch(function () {
        renderFallback(container);
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
