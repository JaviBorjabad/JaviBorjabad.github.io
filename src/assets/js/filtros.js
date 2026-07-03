(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var barra = document.querySelector("[data-filtros]");
    var grid = document.querySelector(".productos-grid");
    if (!barra || !grid) return;

    var tarjetas = Array.prototype.slice.call(grid.querySelectorAll("[data-producto-card]"));
    var ordenOriginal = tarjetas.slice();
    var vacio = document.querySelector("[data-filtros-vacio]");

    var buscador = barra.querySelector("[data-filtro-buscador]");
    var selMarca = barra.querySelector("[data-filtro-marca]");
    var selForma = barra.querySelector("[data-filtro-forma]");
    var selNivel = barra.querySelector("[data-filtro-nivel]");
    var precioMin = barra.querySelector("[data-filtro-precio-min]");
    var precioMax = barra.querySelector("[data-filtro-precio-max]");
    var selOrden = barra.querySelector("[data-filtro-orden]");
    var botonReset = barra.querySelector("[data-filtro-reset]");

    function aplicarFiltros() {
      var texto = buscador ? buscador.value.trim().toLowerCase() : "";
      var marca = selMarca ? selMarca.value : "";
      var forma = selForma ? selForma.value : "";
      var nivel = selNivel ? selNivel.value : "";
      var min = precioMin && precioMin.value !== "" ? parseFloat(precioMin.value) : null;
      var max = precioMax && precioMax.value !== "" ? parseFloat(precioMax.value) : null;

      var visibles = 0;
      tarjetas.forEach(function (card) {
        var nombre = card.getAttribute("data-nombre") || "";
        var cardMarca = card.getAttribute("data-marca") || "";
        var cardForma = card.getAttribute("data-forma") || "";
        var cardNivel = card.getAttribute("data-nivel") || "";
        var precio = parseFloat(card.getAttribute("data-precio") || "0");

        var ok = true;
        if (texto && nombre.indexOf(texto) === -1 && cardMarca.toLowerCase().indexOf(texto) === -1) {
          ok = false;
        }
        if (marca && cardMarca !== marca) ok = false;
        if (forma && cardForma !== forma) ok = false;
        if (nivel && cardNivel !== nivel) ok = false;
        if (min !== null && !isNaN(min) && precio < min) ok = false;
        if (max !== null && !isNaN(max) && precio > max) ok = false;

        card.hidden = !ok;
        if (ok) visibles++;
      });

      if (vacio) vacio.hidden = visibles > 0;
    }

    function aplicarOrden() {
      if (!selOrden || !selOrden.value) return;
      var orden = selOrden.value;
      var ordenadas = tarjetas.slice().sort(function (a, b) {
        var pa = parseFloat(a.getAttribute("data-precio") || "0");
        var pb = parseFloat(b.getAttribute("data-precio") || "0");
        return orden === "precio-asc" ? pa - pb : pb - pa;
      });
      ordenadas.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    function restablecer() {
      if (buscador) buscador.value = "";
      if (selMarca) selMarca.value = "";
      if (selForma) selForma.value = "";
      if (selNivel) selNivel.value = "";
      if (precioMin) precioMin.value = "";
      if (precioMax) precioMax.value = "";
      if (selOrden) selOrden.value = "";
      ordenOriginal.forEach(function (card) {
        grid.appendChild(card);
      });
      aplicarFiltros();
    }

    [buscador, selMarca, selForma, selNivel, precioMin, precioMax].forEach(function (el) {
      if (el) el.addEventListener("input", aplicarFiltros);
    });
    if (selOrden) {
      selOrden.addEventListener("change", function () {
        aplicarOrden();
      });
    }
    if (botonReset) {
      botonReset.addEventListener("click", restablecer);
    }
  });
})();
