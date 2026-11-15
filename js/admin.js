const auth = firebase.auth();

const seccionLogin = document.getElementById("seccionLogin");
const seccionPanel = document.getElementById("seccionPanel");
const botonSalir = document.getElementById("botonSalir");
const formLogin = document.getElementById("formLogin");
const avisoLogin = document.getElementById("avisoLogin");
const formProducto = document.getElementById("formProducto");
const avisoPanel = document.getElementById("avisoPanel");
const listaAdmin = document.getElementById("listaAdmin");
const cajaIniciales = document.getElementById("cajaIniciales");
const botonIniciales = document.getElementById("botonIniciales");

function mostrarAviso(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "alert alert-" + tipo;
}

function ocultarAviso(elemento) {
  elemento.className = "alert d-none";
}

function crearFila(id, producto) {
  const fila = document.createElement("div");
  fila.className = "card tarjeta-producto rounded-0 mb-2";
  fila.innerHTML = `
    <div class="card-body d-flex justify-content-between align-items-center gap-3">
      <div>
        <p class="fw-semibold mb-0"></p>
        <p class="titulo fs-4 fw-bold texto-rojo mb-0"></p>
      </div>
      <button class="btn boton-negro titulo fw-bold text-uppercase" type="button">Eliminar</button>
    </div>`;

  const textos = fila.querySelectorAll("p");
  textos[0].textContent = producto.nombre;
  textos[1].textContent = "$" + Number(producto.precio).toLocaleString("es-AR");

  fila.querySelector("button").addEventListener("click", function () {
    eliminarProducto(id, producto.nombre);
  });

  return fila;
}

function cargarLista() {
  db.collection("productos").orderBy("creado").get()
    .then(function (resultado) {
      listaAdmin.innerHTML = "";
      cajaIniciales.classList.toggle("d-none", !resultado.empty);

      resultado.forEach(function (documento) {
        listaAdmin.appendChild(crearFila(documento.id, documento.data()));
      });
    })
    .catch(function (error) {
      console.error(error);
      mostrarAviso(avisoPanel, "No se pudo cargar la lista de productos.", "danger");
    });
}

function eliminarProducto(id, nombre) {
  if (!confirm('¿Querés eliminar "' + nombre + '"?')) {
    return;
  }

  db.collection("productos").doc(id).delete()
    .then(function () {
      mostrarAviso(avisoPanel, "Producto eliminado.", "success");
      cargarLista();
    })
    .catch(function (error) {
      console.error(error);
      mostrarAviso(avisoPanel, "No se pudo eliminar el producto.", "danger");
    });
}

auth.onAuthStateChanged(function (usuario) {
  if (usuario) {
    seccionLogin.classList.add("d-none");
    seccionPanel.classList.remove("d-none");
    botonSalir.classList.remove("d-none");
    cargarLista();
  } else {
    seccionLogin.classList.remove("d-none");
    seccionPanel.classList.add("d-none");
    botonSalir.classList.add("d-none");
  }
});

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();
  ocultarAviso(avisoLogin);

  const email = document.getElementById("email").value.trim();
  const clave = document.getElementById("clave").value;

  auth.signInWithEmailAndPassword(email, clave)
    .catch(function () {
      mostrarAviso(avisoLogin, "El email o la contraseña son incorrectos.", "danger");
    });
});

botonSalir.addEventListener("click", function () {
  auth.signOut();
});

formProducto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  ocultarAviso(avisoPanel);

  const nombre = document.getElementById("nombreProducto").value.trim();
  const precio = Number(document.getElementById("precioProducto").value);

  if (nombre === "" || !(precio > 0)) {
    mostrarAviso(avisoPanel, "Completá el nombre y un precio mayor a cero.", "danger");
    return;
  }

  db.collection("productos").add({ nombre: nombre, precio: precio, creado: Date.now() })
    .then(function () {
      formProducto.reset();
      mostrarAviso(avisoPanel, "Producto agregado correctamente.", "success");
      cargarLista();
    })
    .catch(function (error) {
      console.error(error);
      mostrarAviso(avisoPanel, "No se pudo guardar el producto. Revisá las reglas de Firestore.", "danger");
    });
});

botonIniciales.addEventListener("click", function () {
  const lote = db.batch();
  const ahora = Date.now();

  productosIniciales.forEach(function (producto, indice) {
    const referencia = db.collection("productos").doc();
    lote.set(referencia, { nombre: producto.nombre, precio: producto.precio, creado: ahora + indice });
  });

  lote.commit()
    .then(function () {
      mostrarAviso(avisoPanel, "Se cargaron los productos iniciales.", "success");
      cargarLista();
    })
    .catch(function (error) {
      console.error(error);
      mostrarAviso(avisoPanel, "No se pudieron cargar los productos iniciales. Revisá las reglas de Firestore.", "danger");
    });
});