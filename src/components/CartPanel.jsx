import { formatearPrecio } from '../utils/formato';

function CartPanel({ carrito, onQuitar, onVaciar, abierto, onCerrar }) {
  const totalArticulos = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPrecio = carrito.reduce((suma, item) => {
    const precioUnitario = item.precioOferta !== null ? item.precioOferta : item.precio;
    return suma + precioUnitario * item.cantidad;
  }, 0);

  return (
    <aside className={`panel-carrito ${abierto ? 'abierto' : ''}`}>
      <div className="panel-carrito-header">
        <h2>Carrito</h2>
        <button type="button" className="boton-cerrar" onClick={onCerrar} aria-label="Cerrar carrito">
          &times;
        </button>
      </div>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">Tu carrito esta vacio. Agrega productos desde el catalogo.</p>
      ) : (
        <>
          <ul className="lista-carrito">
            {carrito.map((item) => {
              const precioUnitario = item.precioOferta !== null ? item.precioOferta : item.precio;
              return (
                <li key={item.id} className="item-carrito">
                  <div>
                    <p className="item-nombre">{item.nombre}</p>
                    <p className="item-detalle">
                      x{item.cantidad} - {formatearPrecio(precioUnitario * item.cantidad)}
                    </p>
                  </div>
                  <button type="button" className="boton-quitar" onClick={() => onQuitar(item.id)}>
                    Quitar
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="panel-carrito-footer">
            <p>Articulos: {totalArticulos}</p>
            <p className="total-precio">Total: {formatearPrecio(totalPrecio)}</p>
            <button type="button" className="boton-vaciar" onClick={onVaciar}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default CartPanel;
