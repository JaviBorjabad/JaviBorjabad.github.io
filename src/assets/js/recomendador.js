(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-recomendador-form]");
    var grid = document.querySelector("[data-recomendador-grid]");
    if (!form || !grid) return;

    var tarjetas = Array.prototype.slice.call(grid.querySelectorAll("[data-producto-card]"));
    var grupos = Array.prototype.slice.call(form.querySelectorAll("[data-recomendador-grupo]"));

    var afinidadForma = {
      Control: { Redonda: 3, Híbrida: 1, Diamante: 0, Lágrima: 1 },
      Equilibrado: { Redonda: 1, Híbrida: 3, Diamante: 1, Lágrima: 3 },
      Potencia: { Redonda: 0, Híbrida: 1, Diamante: 3, Lágrima: 1 },
    };

    function respuestas() {
      var valores = {};
      grupos.forEach(function (grupo) {
        var activo = grupo.querySelector(".is-activo");
        valores[grupo.getAttribute("data-recomendador-grupo")] = activo ? activo.getAttribute("data-valor") : "";
      });
      return valores;
    }

    function puntuarBalance(balance) {
      if (balance.indexOf("Muy alto") !== -1) return -4;
      if (balance.indexOf("Medio-Alto") !== -1) return -2;
      if (balance.indexOf("Alto") !== -1) return -3;
      if (balance.indexOf("Bajo-Medio") !== -1 || balance.indexOf("Medio-Bajo") !== -1) return 2;
      if (balance.indexOf("Bajo") !== -1) return 3;
      if (balance.indexOf("Medio") !== -1) return 0;
      return 0;
    }

    function puntuar(card, r) {
      var nivel = card.getAttribute("data-nivel") || "";
      var forma = card.getAttribute("data-forma") || "";
      var balance = card.getAttribute("data-balance") || "";
      var precio = parseFloat(card.getAttribute("data-precio") || "0");
      var max = r.presupuesto === "Infinity" ? Infinity : parseFloat(r.presupuesto);

      var score = 0;
      if (nivel.indexOf(r.nivel) !== -1) score += 4;
      var afinidad = afinidadForma[r.prioridad] || {};
      score += afinidad[forma] || 0;
      if (!isNaN(max)) {
        score += precio <= max ? 2 : -3;
        if (isFinite(max)) {
          score += Math.max(0, Math.min(1, (max - precio) / max));
        }
      }
      if (r.codo === "Si") {
        score += puntuarBalance(balance);
      }
      return score;
    }

    function calcular() {
      var r = respuestas();
      var puntuadas = tarjetas
        .map(function (card) {
          return { card: card, score: puntuar(card, r) };
        })
        .sort(function (a, b) {
          return b.score - a.score;
        });

      var top = puntuadas.slice(0, 5);
      var topCards = top.map(function (t) {
        return t.card;
      });

      tarjetas.forEach(function (card) {
        card.hidden = topCards.indexOf(card) === -1;
      });
      topCards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    grupos.forEach(function (grupo) {
      var opciones = Array.prototype.slice.call(grupo.querySelectorAll("[data-valor]"));
      opciones.forEach(function (boton) {
        boton.addEventListener("click", function () {
          opciones.forEach(function (b) {
            b.classList.toggle("is-activo", b === boton);
          });
          calcular();
        });
      });
    });

    calcular();
  });
})();
