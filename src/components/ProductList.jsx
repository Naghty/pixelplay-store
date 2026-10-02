import ProductCard from './ProductCard';

function ProductList({ productos, cargando, error, carrito, onAgregar, onQuitar }) {
  if (cargando) {
    return (
      <div className="estado-carga">
        <div className="spinner" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estado-error">
        <p>No pudimos cargar el catalogo: {error}</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return <p className="estado-vacio">No hay productos disponibles por el momento.</p>;
  }

  return (
    <div className="grid-productos">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          enCarrito={carrito.some((item) => item.id === producto.id)}
          onAgregar={onAgregar}
          onQuitar={onQuitar}
        />
      ))}
    </div>
  );
}

export default ProductList;
