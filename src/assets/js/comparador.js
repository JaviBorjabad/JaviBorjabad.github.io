(function () {
  var MAX = 5;

  function clave(categoria) {
    return "comparador:" + categoria;
  }

  function obtenerSeleccion(categoria) {
    try {
      var datos = JSON.parse(localStorage.getItem(clave(categoria)) || "[]");
      return Array.isArray(datos) ? datos : [];
    } catch (e) {
      return [];
    }
  }

  function guardarSeleccion(categoria, seleccion) {
    localStorage.setItem(clave(categoria), JSON.stringify(seleccion));
  }

  function alternar(categoria, id, nombre) {
    var seleccion = obtenerSeleccion(categoria);
    var indice = seleccion.findIndex(function (item) {
      return item.id === id;
    });
    if (indice >= 0) {
      seleccion.splice(indice, 1);
    } else {
      if (seleccion.length >= MAX) {
        return { ok: false, seleccion: seleccion };
      }
      seleccion.push({ id: id, nombre: nombre });
    }
    guardarSeleccion(categoria, seleccion);
    return { ok: true, seleccion: seleccion };
  }

  function quitar(categoria, id) {
    var seleccion = obtenerSeleccion(categoria).filter(function (item) {
      return item.id !== id;
    });
    guardarSeleccion(categoria, seleccion);
    return seleccion;
  }

  function vaciar(categoria) {
    guardarSeleccion(categoria, []);
  }

  function actualizarBotones(categoria) {
    var seleccion = obtenerSeleccion(categoria);
    document
      .querySelectorAll('[data-comparador-toggle][data-categoria="' + categoria + '"]')
      .forEach(function (boton) {
        var id = boton.getAttribute("data-id");
        var activo = seleccion.some(function (item) {
          return item.id === id;
        });
        boton.setAttribute("data-activo", activo ? "true" : "false");
        var texto = boton.querySelector(".boton-comparar__texto");
        if (texto) texto.textContent = activo ? "En comparativa ✓" : "Comparar";
      });
  }

  function actualizarBarra(categoria) {
    var barra = document.getElementById("barra-comparador");
    if (!barra) return;
    var seleccion = obtenerSeleccion(categoria);
    var texto = document.getElementById("barra-comparador-texto");
    var link = document.getElementById("barra-comparador-link");
    barra.setAttribute("data-visible", seleccion.length > 0 ? "true" : "false");
    if (texto) {
      texto.textContent =
        seleccion.length +
        (seleccion.length === 1
          ? " producto seleccionado para comparar (máx. 5)"
          : " productos seleccionados para comparar (máx. 5)");
    }
    if (link) {
      link.href = "/" + categoria + "/comparar/";
    }
    ajustarPosicionBarra();
  }

  function ajustarPosicionBarra() {
    var barra = document.getElementById("barra-comparador");
    if (!barra) return;
    var banner = document.getElementById("banner-cookies");
    if (banner && !banner.hidden) {
      barra.style.bottom = banner.offsetHeight + "px";
    } else {
      barra.style.bottom = "0";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var categoria = document.body.getAttribute("data-comparador-categoria");
    if (!categoria) return;

    actualizarBotones(categoria);
    actualizarBarra(categoria);

    document
      .querySelectorAll('[data-comparador-toggle][data-categoria="' + categoria + '"]')
      .forEach(function (boton) {
        boton.addEventListener("click", function () {
          var id = boton.getAttribute("data-id");
          var nombre = boton.getAttribute("data-nombre");
          var resultado = alternar(categoria, id, nombre);
          if (!resultado.ok) {
            alert("Ya tienes 5 productos en la comparativa. Quita alguno antes de añadir otro.");
            return;
          }
          actualizarBotones(categoria);
          actualizarBarra(categoria);
        });
      });

    var vaciarBtn = document.getElementById("barra-comparador-vaciar");
    if (vaciarBtn) {
      vaciarBtn.addEventListener("click", function () {
        vaciar(categoria);
        actualizarBotones(categoria);
        actualizarBarra(categoria);
      });
    }

    window.addEventListener("resize", ajustarPosicionBarra);

    document.dispatchEvent(new CustomEvent("comparador:listo", { detail: { categoria: categoria } }));
  });

  window.ajustarPosicionBarra = ajustarPosicionBarra;

  window.Comparador = {
    obtenerSeleccion: obtenerSeleccion,
    quitar: quitar,
    vaciar: vaciar,
    actualizarUI: function (categoria) {
      actualizarBotones(categoria);
      actualizarBarra(categoria);
    },
  };
})();
