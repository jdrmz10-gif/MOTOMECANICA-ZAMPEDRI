const PRODUCTOS_POR_PAGINA = 4;

function crearTarjeta(producto) {
  const columna = document.createElement("div");
  columna.className = "col";
  columna.innerHTML = `
    <article class="card h-100 rounded-0 tarjeta-producto">
      <div class="card-body d-flex flex-column">
        <h3 class="fs-6 fw-semibold"></h3>
        <p class="titulo fs-2 fw-bold texto-rojo"></p>
        <a class="btn boton-rojo titulo fw-bold text-uppercase mt-auto align-self-start" href="#turno">Consultar</a>
      </div>
    </article>`;

  columna.querySelector("h3").textContent = producto.nombre;
  columna.querySelector("p").textContent = "$" + Number(producto.precio).toLocaleString("es-AR");

  columna.querySelector("a").addEventListener("click", function () {
    document.getElementById("comentarios").value = "Consulta por: " + producto.nombre;
  });

  return columna;
}

function mostrarMensaje(texto) {
  const lista = document.getElementById("listaProductos");
  document.getElementById("puntosProductos").innerHTML = "";
  lista.innerHTML = "";

  const parrafo = document.createElement("p");
  parrafo.className = "text-center fs-5 texto-gris";
  parrafo.textContent = texto;
  lista.appendChild(parrafo);
}

function mostrarProductos(productos) {
  const lista = document.getElementById("listaProductos");
  const puntos = document.getElementById("puntosProductos");

  lista.innerHTML = "";
  puntos.innerHTML = "";

  if (productos.length === 0) {
    mostrarMensaje("Próximamente vas a encontrar nuestros productos en esta sección.");
    return;
  }

  const totalPaginas = Math.ceil(productos.length / PRODUCTOS_POR_PAGINA);

  for (let i = 0; i < totalPaginas; i++) {
    const pagina = document.createElement("div");
    pagina.className = "carousel-item";

    const fila = document.createElement("div");
    fila.className = "row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4";

    const desde = i * PRODUCTOS_POR_PAGINA;
    const grupo = productos.slice(desde, desde + PRODUCTOS_POR_PAGINA);

    grupo.forEach(function (producto) {
      fila.appendChild(crearTarjeta(producto));
    });

    pagina.appendChild(fila);
    lista.appendChild(pagina);

    const punto = document.createElement("button");
    punto.type = "button";
    punto.setAttribute("data-bs-target", "#carruselProductos");
    punto.setAttribute("data-bs-slide-to", i);
    punto.setAttribute("aria-label", "Página " + (i + 1) + " de productos");

    if (i === 0) {
      pagina.classList.add("active");
      punto.className = "active";
      punto.setAttribute("aria-current", "true");
    }

    puntos.appendChild(punto);
  }
}

function cargarProductos() {
  mostrarMensaje("Cargando productos...");

  db.collection("productos").orderBy("creado").get()
    .then(function (resultado) {
      const productos = [];
      resultado.forEach(function (documento) {
        productos.push(documento.data());
      });
      mostrarProductos(productos);
    })
    .catch(function (error) {
      console.error(error);
      mostrarMensaje("No pudimos cargar los productos en este momento. Probá de nuevo más tarde.");
    });
}

function limitarFecha() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  document.getElementById("fecha").min = hoy.getFullYear() + "-" + mes + "-" + dia;
}

cargarProductos();
limitarFecha();