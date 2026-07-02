const todosProductos = require("./todosProductos.js");

const UMBRAL_DESCUENTO = 30;

function descuento(precioAntes, precio) {
  if (!precioAntes || !precio || precioAntes <= precio) return 0;
  return Math.round(100 - (precio / precioAntes) * 100);
}

module.exports = todosProductos
  .filter((producto) => producto.afiliado.red === "amazon")
  .map((producto) => ({
    ...producto,
    porcentajeDescuento: descuento(producto.precioAntes, producto.precio),
  }))
  .filter((producto) => producto.porcentajeDescuento >= UMBRAL_DESCUENTO)
  .sort((a, b) => b.porcentajeDescuento - a.porcentajeDescuento);
