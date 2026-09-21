# PixelPlay Store - PFY2201 Semana 6

Actividad sumativa "Optimizando la logica y rendimiento de una pagina web con JavaScript".
eCommerce de videojuegos y accesorios construido con Bootstrap 5 y JavaScript puro.

## Estructura

```
index.html
assets/
  css/estilos.css
  js/app.js
  img/*.svg
  data/productos.json
```

## Que incluye

**Bootstrap 5**
- Navbar responsiva con dos categorias simuladas (Videojuegos y Accesorios) y buscador integrado
- Carrusel de banners con cambio automatico cada 3 segundos (`data-bs-interval="3000"`), heredado de la semana 4
- Grilla de productos con `row-cols` adaptable de 1 a 4 columnas segun el ancho de pantalla
- Offcanvas para el carrito, Toast para avisos y Spinner de carga
- Footer con datos de contacto y links a redes sociales
- Accesibilidad: link de salto al contenido, etiquetas `aria-label`, textos alternativos y `visually-hidden`

**JavaScript**
- Evento `click` con delegacion para agregar y quitar productos del carrito
- Evento `submit` para procesar el formulario de busqueda sin recargar la pagina
- Eventos `mouseover` / `mouseout` sobre las tarjetas para mostrar el detalle del producto en un area de vista previa
- Manipulacion dinamica del DOM: el catalogo, el resumen de compra, el contador y los totales se generan por codigo
- Filtro por categoria y busqueda por nombre o plataforma con normalizacion de texto

**Fetch API**
- Carga de `assets/data/productos.json` con `async/await`
- Validacion del estado HTTP y del formato recibido
- Mensaje de error amigable con boton "Reintentar" si la carga falla

**Buenas practicas**
- Codigo dividido en funciones cortas y reutilizables agrupadas por responsabilidad
- Un unico objeto `estado` como fuente de verdad
- Comentarios en las secciones y funciones clave

## Como ejecutarlo

La Fetch API no funciona abriendo el `index.html` directamente con doble click (protocolo `file://`).
Hay que levantar un servidor local:

```bash
python -m http.server 5500
```

Y entrar a http://localhost:5500

Tambien sirve la extension Live Server de VS Code.

## Despliegue en GitHub Pages

```bash
git init
git add .
git commit -m "Actividad sumativa semana 6"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main

git checkout -b gh-pages
git push -u origin gh-pages
```

Luego en GitHub: Settings > Pages > Source: Deploy from a branch > Branch: `gh-pages` / `root`.

La URL publica queda como `https://USUARIO.github.io/REPOSITORIO/`
