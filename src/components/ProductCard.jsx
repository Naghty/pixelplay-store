import { useState } from 'react';
import imagenes from '../assets/imagenes';
import { formatearPrecio } from '../utils/formato';

function ProductCard({ producto, enCarrito, onAgregar, onQuitar }) {
  // Estado propio del componente: alterna texto y visibilidad de la descripcion
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const tieneOferta = producto.precioOferta !== null;
  const agotado = producto.stock === 0;

  return (
    <article className="tarjeta-producto">
      <img
        src={imagenes[producto.imagen]}
        alt={`Portada de ${producto.nombre}`}
        className="tarjeta-imagen"
      />

      <div className="tarjeta-cuerpo">
        <span className="tarjeta-badge">{producto.plataforma}</span>
        <h3 className="tarjeta-nombre">{producto.nombre}</h3>

        <div className="tarjeta-precios">
          {tieneOferta ? (
            <>
              <span className="precio-tachado">{formatearPrecio(producto.precio)}</span>
              <span className="precio-oferta">{formatearPrecio(producto.precioOferta)}</span>
            </>
          ) : (
            <span className="precio-normal">{formatearPrecio(producto.precio)}</span>
          )}
        </div>

        <button
          type="button"
          className="boton-detalle"
          onClick={() => setMostrarDetalle(!mostrarDetalle)}
        >
          {mostrarDetalle ? 'Ocultar detalle' : 'Ver detalle'}
        </button>

        {mostrarDetalle && <p className="tarjeta-descripcion">{producto.descripcion}</p>}

        <p className="tarjeta-stock">{agotado ? 'Sin stock' : `Stock: ${producto.stock}`}</p>

        {enCarrito ? (
          <button type="button" className="boton-carrito en-carrito" onClick={() => onQuitar(producto.id)}>
            En el carrito (quitar)
          </button>
        ) : (
          <button
            type="button"
            className="boton-carrito"
            onClick={() => onAgregar(producto.id)}
            disabled={agotado}
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
