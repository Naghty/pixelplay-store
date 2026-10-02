import { useState } from 'react';
import useProductos from './hooks/useProductos';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartPanel from './components/CartPanel';
import Footer from './components/Footer';
import './App.css';

function App() {
  // Estado de la lista de productos, manejado por el hook useProductos (useState + useEffect)
  const { productos, cargando, error } = useProductos();

  // Estado del carrito de compras
  const [carrito, setCarrito] = useState([]);

  // Estado de la categoria seleccionada en la navbar
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // Estado que controla si el panel del carrito esta abierto
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  function agregarAlCarrito(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    setCarrito((carritoActual) => {
      const yaExiste = carritoActual.find((item) => item.id === id);

      if (yaExiste) {
        return carritoActual.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  }

  function quitarDelCarrito(id) {
    setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const productosFiltrados =
    categoriaActiva === 'todos'
      ? productos
      : productos.filter((producto) => producto.categoria === categoriaActiva);

  const totalArticulosCarrito = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <div className="app">
      <Navbar
        categoriaActiva={categoriaActiva}
        onCambiarCategoria={setCategoriaActiva}
        totalCarrito={totalArticulosCarrito}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main className="contenido">
        <section className="hero">
          <h1>Tu proxima aventura empieza aqui</h1>
          <p>Videojuegos y accesorios gamer con despacho a todo Chile.</p>
        </section>

        <section className="seccion-catalogo">
          <h2>Catalogo de productos</h2>
          <ProductList
            productos={productosFiltrados}
            cargando={cargando}
            error={error}
            carrito={carrito}
            onAgregar={agregarAlCarrito}
            onQuitar={quitarDelCarrito}
          />
        </section>
      </main>

      <Footer />

      <CartPanel
        carrito={carrito}
        onQuitar={quitarDelCarrito}
        onVaciar={vaciarCarrito}
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />

      {carritoAbierto && <div className="fondo-oscuro" onClick={() => setCarritoAbierto(false)} />}
    </div>
  );
}

export default App;
