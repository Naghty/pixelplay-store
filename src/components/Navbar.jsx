function Navbar({ categoriaActiva, onCambiarCategoria, totalCarrito, onAbrirCarrito }) {
  const categorias = [
    { id: 'todos', etiqueta: 'Todos' },
    { id: 'juegos', etiqueta: 'Videojuegos' },
    { id: 'accesorios', etiqueta: 'Accesorios' }
  ];

  return (
    <header className="navbar">
      <div className="navbar-marca">PixelPlay</div>

      <nav className="navbar-categorias">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            className={`navbar-categoria ${categoriaActiva === categoria.id ? 'activa' : ''}`}
            onClick={() => onCambiarCategoria(categoria.id)}
          >
            {categoria.etiqueta}
          </button>
        ))}
      </nav>

      <button type="button" className="navbar-carrito" onClick={onAbrirCarrito}>
        Carrito
        <span className="navbar-carrito-contador">{totalCarrito}</span>
      </button>
    </header>
  );
}

export default Navbar;
