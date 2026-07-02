# Padel Selecto — contexto del proyecto

Web de afiliados sobre material de pádel. El objetivo es generar comisiones
cuando los usuarios compran a través de los enlaces de afiliado (Amazon,
AWIN/Padel-Point).

**Esta es la única sesión de Claude Code del proyecto.** Cualquier decisión
de diseño (colores, estilo, tono de textos) o de contenido (qué productos
destacar, cómo redactar fichas) debe consultarse directamente al usuario en
esta conversación, nunca asumirse.

## Dominio y hosting

- Dominio: `padelselecto.com` (comprado en Porkbun, DNS ya apuntando a GitHub
  Pages)
- Repositorio: `JaviBorjabad/JaviBorjabad.github.io` (GitHub Pages gratis)
- El build debe generar un `CNAME` con `padelselecto.com` en la raíz del
  sitio publicado (gestionado vía passthrough copy de Eleventy, ver abajo)

## Stack técnico: Eleventy (11ty)

Elegido por ser el generador estático más simple que cumple todos los
requisitos:

- Genera HTML puro, sin runtime de JS en cliente necesario → carga rápida,
  bueno para SEO (crítico en un sitio de afiliados).
- **Los productos son datos, no HTML.** Viven en `src/_data/productos/*.json`
  (uno por categoría). Las fichas de producto se generan automáticamente por
  paginación de Eleventy sobre esos datos — añadir un producto nuevo es
  añadir una entrada JSON, nunca tocar plantillas.
- **Enlaces de afiliado centralizados** en `src/_data/afiliados.json` (IDs de
  Amazon Afiliados España y AWIN). Las plantillas y los datos de producto
  referencian estos IDs; cambiar un ID de afiliado se hace en un único
  archivo.
- Encaja con la automatización futura: un job de GitHub Actions que
  descargue el feed de AWIN/Padel-Point solo necesita escribir/actualizar
  los JSON de `src/_data/productos/` y correr `npm run build`.

Comandos:
- `npm install` — instalar dependencias
- `npm run build` — genera el sitio estático en `_site/`
- `npm run serve` — servidor local con recarga en caliente

## Programas de afiliados

- **Amazon Afiliados España** (afiliados.amazon.es) — ropa, zapatillas,
  accesorios en general. ID de asociado en `src/_data/afiliados.json` →
  `amazon.tag`.
- **AWIN** (awin.com), a través del programa de **Padel-Point** (hasta 9% de
  comisión, cookie 30 días, pago por transferencia). ID de afiliado y
  `advertiser id` en `src/_data/afiliados.json` → `awin`.
- Todos los enlaces de producto se construyen a partir de estos IDs
  centralizados, nunca hardcodeados en una página o ficha individual.

## Categorías del catálogo

1. Palas (`/palas/`)
2. Zapatillas (`/zapatillas/`)
3. Ropa (`/ropa/`)
4. Accesorios: muñequeras, protectores de palas, grips, sprays (`/accesorios/`)

## Diseño y tono (decidido con el usuario)

- **Estilo visual**: deportivo y energético — verde pista + naranja pelota
  de pádel, alto contraste, sensación de acción. Favorece los CTA de compra
  y las ofertas destacadas.
- **Tono de los textos**: técnico y experto — specs y comparativas
  objetivas, pensado para jugador intermedio/avanzado que busca datos, no
  paja de marketing.
- Si se necesita revisar o cambiar cualquiera de estos dos puntos, preguntar
  al usuario antes de aplicar cambios masivos de CSS o de copy.

## Requisitos legales (España)

- Aviso visible de enlaces de afiliados en todas las páginas con productos
  (footer + página dedicada)
- Banner de consentimiento de cookies (bloquea cualquier cookie no esencial
  hasta aceptación)
- Página de política de privacidad (`/privacidad/`)
- Página de aviso legal / afiliación (`/aviso-legal/`)
- Página de cookies (`/cookies/`)

## Estado actual (fase de estructura)

- Estructura montada con Eleventy: home, 4 categorías, plantilla de ficha de
  producto, páginas legales.
- Productos: solo 2-3 de ejemplo por categoría, con datos ficticios/genéricos
  para validar diseño. **No son productos reales ni enlaces de afiliado
  reales todavía** — pendiente de revisión del usuario antes de publicar.

## Plan de automatización (fase futura, no implementada aún)

- GitHub Actions programada (cron diario) para descargar el feed de
  producto de AWIN/Padel-Point y regenerar `src/_data/productos/*.json` con
  productos rebajados → sección "Últimas ofertas" → rebuild y deploy
  automático del sitio.
- Amazon: integrar en el futuro con la nueva **Creators API** de Amazon
  (sustituye a la antigua PA-API, deprecada en 2026) para precios
  automáticos — pendiente de tener ventas activas en la cuenta de afiliado
  (requisito de Amazon para dar acceso a la API).
- Por ahora, ninguna de estas automatizaciones está implementada: los datos
  de producto son estáticos y se editan a mano.

## Notas de despliegue

- El deploy a GitHub Pages se hace vía GitHub Actions (build de Eleventy +
  `actions/deploy-pages`), no serving directo de Jekyll.
- El repo es un *user page* (`JaviBorjabad.github.io`), así que Pages sirve
  lo publicado por el Action en la raíz del dominio.
