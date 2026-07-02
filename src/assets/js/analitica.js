(function () {
  var CLAVE_COOKIES = "padelselecto-cookies";

  function cargarGA4() {
    var id = document.body.getAttribute("data-ga4-id");
    if (!id || window.__ga4Cargado) return;
    window.__ga4Cargado = true;

    var script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem(CLAVE_COOKIES) === "aceptadas") {
      cargarGA4();
    }
  });

  window.cargarAnaliticaSiAceptada = cargarGA4;
})();
