module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  eleventyConfig.addFilter("euros", (value) => {
    if (typeof value !== "number") return value;
    return (
      value.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €"
    );
  });

  eleventyConfig.addFilter("descuento", (precioAntes, precioAhora) => {
    if (!precioAntes || !precioAhora || precioAntes <= precioAhora) return null;
    return Math.round(100 - (precioAhora / precioAntes) * 100);
  });

  eleventyConfig.addFilter("limite", (array, n) => {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("specValor", (specs, clave) => {
    if (!Array.isArray(specs)) return "";
    const encontrada = specs.find((s) => s.clave === clave);
    return encontrada ? encontrada.valor : "";
  });

  eleventyConfig.addFilter("unicos", (productos, propiedad) => {
    if (!Array.isArray(productos)) return [];
    const valores = productos
      .map((p) => p[propiedad])
      .filter((v) => v !== undefined && v !== null && v !== "");
    return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "es"));
  });

  eleventyConfig.addFilter("unicosSpec", (productos, clave) => {
    if (!Array.isArray(productos)) return [];
    const valores = productos
      .map((p) => (p.specs || []).find((s) => s.clave === clave))
      .filter(Boolean)
      .map((s) => s.valor);
    return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "es"));
  });

  eleventyConfig.addFilter("porMarca", (productos) => {
    if (!Array.isArray(productos)) return [];
    return [...productos].sort((a, b) => {
      const marca = a.marca.localeCompare(b.marca, "es");
      return marca !== 0 ? marca : a.nombre.localeCompare(b.nombre, "es");
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
