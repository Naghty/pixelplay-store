# PixelPlay Store - React 

Version en React del eCommerce PixelPlay Store, construida con Vite.

## Estructura

```
index.html
vite.config.js
public/
  data/productos.json      -> fuente externa que se carga con fetch
src/
  main.jsx
  App.jsx                  -> estado global: carrito, categoria, panel del carrito
  App.css
  hooks/
    useProductos.js        -> useState + useEffect, simula carga desde una API
  components/
    Navbar.jsx
    ProductList.jsx
    ProductCard.jsx        -> useState propio para el boton "Ver detalle"
    CartPanel.jsx
    Footer.jsx
  assets/
    img/*.svg
    imagenes.js             -> mapa de imagenes importadas
  utils/
    formato.js
```

## Que cubre cada requisito

**useState**
- Lista de productos y estado de carga/error (dentro de `useProductos`)
- Productos del carrito (`App.jsx`)
- Categoria activa y apertura del panel del carrito (`App.jsx`)
- Boton "Ver detalle / Ocultar detalle" en cada tarjeta (`ProductCard.jsx`)

**useEffect**
- `useProductos.js` hace `fetch` a `public/data/productos.json` al montar el componente,
  simulando una llamada a una API con un pequeno retardo, y actualiza el estado
  correspondiente (cargando, error, productos).

**Renderizado condicional**
- Spinner mientras carga, mensaje de error si falla, mensaje si no hay productos
- Precio tachado + precio oferta solo si el producto tiene oferta
- Boton "Agregar al carrito" vs "En el carrito (quitar)" segun si el producto ya esta en el carrito
- Mensaje de "carrito vacio" cuando no hay productos agregados

## Como ejecutarlo localmente

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente http://localhost:5173).

## Como generar el build de produccion

```bash
npm run build
npm run preview
```

## Despliegue en GitHub Pages

El archivo `vite.config.js` ya tiene configurado:

```js
base: '/pixelplay-store/'
```

Si tu repositorio se llama distinto a `pixelplay-store`, cambia ese valor por
`/NOMBRE-DE-TU-REPO/` antes de desplegar.

```bash
git init
git add .
git commit -m "Version React - semanas 7 y 8"
git branch -M main
git remote add origin https://github.com/USUARIO/pixelplay-store.git
git push -u origin main

npm run deploy
```

`npm run deploy` compila el proyecto y publica automaticamente la carpeta `dist`
en la rama `gh-pages` gracias al paquete `gh-pages` ya incluido en `devDependencies`.

Luego en GitHub: Settings > Pages > Source: Deploy from a branch > Branch: `gh-pages` / `root`.

La URL publica queda como `https://USUARIO.github.io/pixelplay-store/`
