// ============================================================
// PixelPlay Store - Logica principal
// Semana 6 PFY2201: Fetch API, eventos y manipulacion del DOM
// ============================================================

// ---------- Configuracion y estado ----------

const RUTA_DATOS = "assets/data/productos.json";

const estado = {
  productos: [],
  carrito: [],
  categoriaActiva: "todos",
  terminoBusqueda: ""
};

const dom = {
  contenedorProductos: document.getElementById("contenedorProductos"),
  estadoCarga: document.getElementById("estadoCarga"),
  mensajeError: document.getElementById("mensajeError"),
  detalleError: document.getElementById("detalleError"),
  btnReintentar: document.getElementById("btnReintentar"),
  sinResultados: document.getElementById("sinResultados"),
  contadorResultados: document.getElementById("contadorResultados"),
  vistaPrevia: document.getElementById("vistaPrevia"),
  formBusqueda: document.getElementById("formBusqueda"),
  inputBusqueda: document.getElementById("inputBusqueda"),
  filtros: document.querySelectorAll(".filtro-categoria"),
  resumenCarrito: document.getElementById("resumenCarrito"),
  carritoLateral: document.getElementById("carritoLateral"),
  carritoVacio: document.getElementById("carritoVacio"),
  contadorCarrito: document.getElementById("contadorCarrito"),
  totalArticulos: document.getElementById("totalArticulos"),
  totalPrecio: document.getElementById("totalPrecio"),
  totalLateral: document.getElementById("totalLateral"),
  btnVaciar: document.getElementById("btnVaciar"),
  btnPagar: document.getElementById("btnPagar"),
  avisoToast: document.getElementById("avisoToast"),
  avisoTexto: document.getElementById("avisoTexto")
};

// ---------- Utilidades ----------

// Formatea un numero como precio en pesos chilenos
function formatearPrecio(valor) {
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

// Quita acentos y pasa a minusculas para comparar textos de forma flexible
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Muestra un aviso emergente reutilizando el componente Toast de Bootstrap
function mostrarAviso(mensaje, tipo = "success") {
  dom.avisoTexto.textContent = mensaje;
  dom.avisoToast.className = `toast align-items-center text-bg-${tipo} border-0`;
  bootstrap.Toast.getOrCreateInstance(dom.avisoToast, { delay: 2500 }).show();
}

// ---------- Carga de datos externa con Fetch API ----------

// Descarga el JSON local de productos y controla los posibles errores
async function cargarProductos() {
  alternarCarga(true);
  dom.mensajeError.classList.add("d-none");

  try {
    const respuesta = await fetch(RUTA_DATOS, { cache: "no-store" });

    if (!respuesta.ok) {
      throw new Error(`El servidor respondio con estado ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error("El archivo de productos esta vacio o tiene un formato invalido");
    }

    estado.productos = datos;
    renderizarProductos();
  } catch (error) {
    mostrarError(error);
  } finally {
    alternarCarga(false);
  }
}

// Muestra u oculta el indicador de carga
function alternarCarga(visible) {
  dom.estadoCarga.classList.toggle("d-none", !visible);
}

// Gestion basica de errores: mensaje amigable para el usuario
function mostrarError(error) {
  console.error("Error al cargar los productos:", error);
  dom.contenedorProductos.innerHTML = "";
  dom.contadorResultados.textContent = "0 productos";
  dom.sinResultados.classList.add("d-none");
  dom.detalleError.textContent =
    "No fue posible obtener el catalogo. Verifica tu conexion o vuelve a intentarlo en unos segundos.";
  dom.mensajeError.classList.remove("d-none");
}

// ---------- Filtrado y renderizado del catalogo ----------

// Devuelve los productos que cumplen con la categoria y el termino de busqueda
function filtrarProductos() {
  const termino = normalizar(estado.terminoBusqueda);

  return estado.productos.filter((producto) => {
    const coincideCategoria =
      estado.categoriaActiva === "todos" || producto.categoria === estado.categoriaActiva;

    const coincideTexto =
      termino === "" ||
      normalizar(producto.nombre).includes(termino) ||
      normalizar(producto.plataforma).includes(termino);

    return coincideCategoria && coincideTexto;
  });
}

// Construye la tarjeta HTML de un producto
function crearTarjeta(producto) {
  const columna = document.createElement("div");
  columna.className = "col";

  const agotado = producto.stock === 0;

  columna.innerHTML = `
    <article class="card card-producto h-100 shadow-sm">
      <img src="${producto.imagen}" class="card-img-top" alt="Portada de ${producto.nombre}" loading="lazy">
      <div class="card-body d-flex flex-column">
        <span class="badge text-bg-secondary align-self-start mb-2">${producto.plataforma}</span>
        <h3 class="h6 card-title">${producto.nombre}</h3>
        <p class="precio mb-1">${formatearPrecio(producto.precio)}</p>
        <p class="small text-secondary mb-3">${agotado ? "Sin stock" : `Stock: ${producto.stock}`}</p>
        <button class="btn btn-warning mt-auto fw-semibold btn-agregar"
                data-id="${producto.id}" ${agotado ? "disabled" : ""}>
          Agregar al carrito
        </button>
      </div>
    </article>
  `;

  return columna;
}

// Pinta en el DOM el listado de productos ya filtrado
function renderizarProductos() {
  const productos = filtrarProductos();

  dom.contenedorProductos.innerHTML = "";
  dom.sinResultados.classList.toggle("d-none", productos.length > 0);
  dom.contadorResultados.textContent = `${productos.length} producto${productos.length === 1 ? "" : "s"}`;

  const fragmento = document.createDocumentFragment();
  productos.forEach((producto) => fragmento.appendChild(crearTarjeta(producto)));
  dom.contenedorProductos.appendChild(fragmento);
}

// ---------- Carrito de compras ----------

// Agrega un producto al carrito o aumenta su cantidad si ya existe
function agregarAlCarrito(id) {
  const producto = estado.productos.find((item) => item.id === id);
  if (!producto) return;

  const enCarrito = estado.carrito.find((item) => item.id === id);

  if (enCarrito) {
    if (enCarrito.cantidad >= producto.stock) {
      mostrarAviso(`Solo quedan ${producto.stock} unidades de ${producto.nombre}.`, "warning");
      return;
    }
    enCarrito.cantidad += 1;
  } else {
    estado.carrito.push({ ...producto, cantidad: 1 });
  }

  mostrarAviso(`${producto.nombre} agregado al carrito.`);
  renderizarCarrito();
}

// Descuenta una unidad o elimina el producto del carrito
function quitarDelCarrito(id) {
  const indice = estado.carrito.findIndex((item) => item.id === id);
  if (indice === -1) return;

  estado.carrito[indice].cantidad -= 1;

  if (estado.carrito[indice].cantidad <= 0) {
    estado.carrito.splice(indice, 1);
  }

  renderizarCarrito();
}

// Calcula el total en dinero y la cantidad de articulos
function calcularTotales() {
  return estado.carrito.reduce(
    (acumulado, item) => ({
      articulos: acumulado.articulos + item.cantidad,
      precio: acumulado.precio + item.precio * item.cantidad
    }),
    { articulos: 0, precio: 0 }
  );
}

// Actualiza dinamicamente el resumen del carrito en la pagina y en el panel lateral
function renderizarCarrito() {
  const totales = calcularTotales();
  const vacio = estado.carrito.length === 0;

  dom.resumenCarrito.innerHTML = "";
  dom.carritoLateral.innerHTML = "";
  dom.carritoVacio.classList.toggle("d-none", !vacio);

  estado.carrito.forEach((item) => {
    const fila = document.createElement("div");
    fila.className = "list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2";
    fila.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${item.imagen}" alt="" width="64" height="48" class="rounded object-fit-cover">
        <div>
          <p class="mb-0 fw-semibold">${item.nombre}</p>
          <small class="text-secondary">${formatearPrecio(item.precio)} c/u</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="badge text-bg-dark">x${item.cantidad}</span>
        <span class="fw-bold">${formatearPrecio(item.precio * item.cantidad)}</span>
        <button class="btn btn-sm btn-outline-danger btn-quitar" data-id="${item.id}"
                aria-label="Quitar una unidad de ${item.nombre}">-</button>
      </div>
    `;
    dom.resumenCarrito.appendChild(fila);

    const linea = document.createElement("div");
    linea.className = "d-flex justify-content-between small border-bottom border-secondary pb-1";
    linea.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>${formatearPrecio(item.precio * item.cantidad)}</span>
    `;
    dom.carritoLateral.appendChild(linea);
  });

  if (vacio) {
    dom.carritoLateral.innerHTML = '<p class="text-white-50 mb-0">Aun no agregas productos.</p>';
  }

  dom.contadorCarrito.textContent = totales.articulos;
  dom.totalArticulos.textContent = totales.articulos;
  dom.totalPrecio.textContent = formatearPrecio(totales.precio);
  dom.totalLateral.textContent = formatearPrecio(totales.precio);
  dom.btnVaciar.disabled = vacio;
  dom.btnPagar.disabled = vacio;
}

// ---------- Eventos de usuario ----------

function registrarEventos() {
  // Evento click: delegacion sobre el catalogo para agregar productos al carrito
  dom.contenedorProductos.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-agregar");
    if (!boton) return;
    agregarAlCarrito(Number(boton.dataset.id));
  });

  // Evento click: quitar unidades desde el resumen del carrito
  dom.resumenCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-quitar");
    if (!boton) return;
    quitarDelCarrito(Number(boton.dataset.id));
  });

  // Evento mouseover: muestra el detalle del producto sobre el que esta el cursor
  dom.contenedorProductos.addEventListener("mouseover", (evento) => {
    const tarjeta = evento.target.closest(".card-producto");
    if (!tarjeta) return;

    const id = Number(tarjeta.querySelector(".btn-agregar").dataset.id);
    const producto = estado.productos.find((item) => item.id === id);
    if (!producto) return;

    dom.vistaPrevia.textContent =
      `${producto.nombre} - ${producto.plataforma} - ${formatearPrecio(producto.precio)} - ${producto.stock} unidades disponibles`;
  });

  // Evento mouseout: restaura el texto por defecto al salir del catalogo
  dom.contenedorProductos.addEventListener("mouseout", (evento) => {
    if (evento.relatedTarget && dom.contenedorProductos.contains(evento.relatedTarget)) return;
    dom.vistaPrevia.textContent = "Pasa el cursor sobre un producto para ver su detalle.";
  });

  // Evento submit: procesa el formulario de busqueda sin recargar la pagina
  dom.formBusqueda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    estado.terminoBusqueda = dom.inputBusqueda.value.trim();
    renderizarProductos();

    const encontrados = filtrarProductos().length;
    mostrarAviso(
      encontrados > 0
        ? `Se encontraron ${encontrados} resultados.`
        : "No hubo coincidencias para tu busqueda.",
      encontrados > 0 ? "success" : "warning"
    );
  });

  // Filtros de categoria de la barra de navegacion
  dom.filtros.forEach((boton) => {
    boton.addEventListener("click", () => {
      dom.filtros.forEach((item) => item.classList.remove("active"));
      boton.classList.add("active");
      estado.categoriaActiva = boton.dataset.categoria;
      renderizarProductos();
    });
  });

  // Vaciar carrito
  dom.btnVaciar.addEventListener("click", () => {
    estado.carrito = [];
    renderizarCarrito();
    mostrarAviso("Carrito vaciado.", "secondary");
  });

  // Simulacion de pago
  dom.btnPagar.addEventListener("click", () => {
    const totales = calcularTotales();
    mostrarAviso(`Compra simulada por ${formatearPrecio(totales.precio)}. Gracias por preferirnos.`);
    estado.carrito = [];
    renderizarCarrito();
  });

  // Reintentar la carga de datos cuando falla la Fetch API
  dom.btnReintentar.addEventListener("click", cargarProductos);
}

// ---------- Inicializacion ----------

function iniciar() {
  registrarEventos();
  renderizarCarrito();
  cargarProductos();
}

document.addEventListener("DOMContentLoaded", iniciar);
