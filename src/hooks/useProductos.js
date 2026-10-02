import { useState, useEffect } from 'react';

// Simula una llamada a una API externa cargando el JSON publico
// con un pequeno retardo, para poder mostrar el estado de carga.
function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch(`${import.meta.env.BASE_URL}data/productos.json`);

        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el catalogo de productos');
        }

        const datos = await respuesta.json();

        // Retardo artificial para simular una API real
        await new Promise((resolver) => setTimeout(resolver, 600));

        if (!cancelado) {
          setProductos(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err.message);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarProductos();

    return () => {
      cancelado = true;
    };
  }, []);

  return { productos, cargando, error };
}

export default useProductos;
