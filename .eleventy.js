module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

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
