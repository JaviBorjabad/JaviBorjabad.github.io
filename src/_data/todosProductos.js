const palas = require("./productos/palas.json");
const zapatillas = require("./productos/zapatillas.json");
const ropa = require("./productos/ropa.json");
const accesorios = require("./productos/accesorios.json");

const NOMBRES_CATEGORIA = {
  palas: "Palas",
  zapatillas: "Zapatillas",
  ropa: "Ropa",
  accesorios: "Accesorios",
};

function conCategoria(items, categoria) {
  return items.map((item) => ({
    ...item,
    categoria,
    categoriaNombre: NOMBRES_CATEGORIA[categoria],
  }));
}

module.exports = [
  ...conCategoria(palas, "palas"),
  ...conCategoria(zapatillas, "zapatillas"),
  ...conCategoria(ropa, "ropa"),
  ...conCategoria(accesorios, "accesorios"),
];
