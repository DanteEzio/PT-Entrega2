//Aqui se cargan los productos y se lee nuestro sitio web
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  //Aqui estamos generando una condición para poder tener permanencia de información al recargar la página y que no se pierdan nuestros objetos del carrito
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    mostrarCarrito();
  }
});

// Esta función nos ayuda a poder leer nuestro archivo JSON
const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    // console.log(data)
    mostrarProductos(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

const contenedorProductos = document.querySelector("#contenedorLaptops");
const mostrarProductos = (data) => {
  let cards = " ";

  data.forEach((item) => {
    cards = `
      <div class="col">
              <div class="card">
                <a href="">
                  <img
                  src="${item.img}"
                  class="card-img-top"
                  alt="..."
                  style="width: 100%; height: 250px"
                />
                </a>
                <div class="card-body">
                  <a href="">
                    <h5 class="card-title">
                      ${item.descripcion}
                    </h5>
                  </a>
                  <p class="text-muted">${item.sku}</p>
                  <h6><s>$${item.pReal.toLocaleString()} MXN</s></h6>
                  <h6>$${item.pDescuento.toLocaleString()} MXN</h6>
                  <p>Disponibles: ${item.stock}pzs.</p>
                  <button type="button" class="btn btn-secondary agregarCarrito" id=boton${
                    item.id
                  }>
                    Añadir al carrito <i class="fa-solid fa-cart-shopping"></i>
                  </button>
                </div>
              </div>
      </div>
    `;
    contenedorProductos.innerHTML += cards;
  });
};

//Aqui creamos un carrito de objetos para que sea mas sencilla la manipulacion de las cantidades
let carrito = {};

const detectarBotones = (data) => {
  const botones = document.querySelectorAll(".card-body button");

  // console.log(botones)

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log(`Se selecciono ${btn.id}`);
      const producto = data.find((item) => `boton${item.id}` == btn.id);
      // console.log(producto)
      alert(`Se agrego ${producto.nombre} al carrito`);

      // Aquí estamos agregando el atributo cantidad, que sería la cantidad de productos que estaría comprando el usuario
      producto.cantidad = 1;

      //Aqui estamos haciendo nuestra condicion donde mencionamos que si ya existe el producto no lo duplique, únicamente incremente la cantidad
      if (carrito.hasOwnProperty(producto.id)) {
        // console.log("existe");
        producto.cantidad = carrito[producto.id].cantidad + 1;
      }
      //Indicamos su índice y agregamos los elemento del producto, en pocas palabras estamos reemplazando el elemento ya creado y solo se le agrega la cantidad inicializada
      carrito[producto.id] = { ...producto };
      // console.log(carrito);

      mostrarCarrito();
    });
  });
};

// Mostrar Carrito-1
const pAgregados = document.querySelector("#pAgregados");
const mostrarCarrito = () => {
  pAgregados.innerHTML = " ";

  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();

  //Aqui estamos transformando nuestra lista de objetos en un ARRAY
  Object.values(carrito).forEach((producto) => {
    // console.log(producto)

    template.querySelector(".card-img-top").setAttribute("src", producto.img);
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    // template.querySelectorAll("td")[1].textContent = producto.nombre
    template.querySelectorAll("td")[3].textContent = `$${(
      producto.pDescuento * producto.cantidad
    ).toLocaleString()} MXN`;

    //botones
    template.querySelector(".incrementar").dataset.id = producto.id;
    template.querySelector(".decrementar").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  pAgregados.appendChild(fragment);

  mostrarFooterCarrito();
  accionBotones();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Mostrar Carrito-2
const mostrarCarrito2 = () => {
  pAgregados.innerHTML = " ";

  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();

  //Aqui estamos transformando nuestra lista de objetos en un ARRAY
  Object.values(carrito).forEach((producto) => {
    // console.log(producto)

    template.querySelector(".card-img-top").setAttribute("src", producto.img);
    template.querySelectorAll("td")[2].textContent = producto.cantidad;
    template.querySelectorAll("td")[1].textContent = producto.nombre;
    template.querySelectorAll("td")[4].textContent = `$${(
      producto.pDescuento * producto.cantidad
    ).toLocaleString()} MXN`;

    //botones
    template.querySelector(".incrementar").dataset.id = producto.id;
    template.querySelector(".decrementar").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  pAgregados.appendChild(fragment);

  mostrarFooterCarrito();
  accionBotones();
};

const footerCarrito = document.querySelector("#footerCarrito");
const contadorCarrito = document.querySelector("#contadorCar");
const botonesProcesar = document.querySelector(".botonesProcesar");
//Esta función nos muestra el footer del carrito (cantidad total y costo total)
const mostrarFooterCarrito = () => {
  footerCarrito.innerHTML = " ";
  contadorCarrito.innerHTML = " ";
  // botonesProcesar.innerHTML = " "

  if (Object.keys(carrito).length === 0) {
    pAgregados.innerHTML = `
    <th scope="row" colspan="4">Carrito vacío</th>
    `;

    contadorCarrito.innerHTML = `
      <button
                    id="open"
                    class="nav-link text-body btn btn-primary"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                  >
                    <i class="bi bi-cart fa-lg"></i
                    ><span id="contador-carrito">0</span>
    `;

    return;
  }

  const template = document.querySelector("#templateFooterCarrito").content;
  const fragment = document.createDocumentFragment();

  // Este segundo apartado corresponde al contador del carrito
  const template2 = document.querySelector("#templateContador").content;
  const fragment2 = document.createDocumentFragment();

  //En este apartado necesitaremos sumar la cantidad total de los productos y el costo total
  const cTotal = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const cTotal2 = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const pTotal = Object.values(carrito).reduce(
    (acc, { cantidad, pDescuento }) => acc + cantidad * pDescuento,
    0
  );
  // console.log(pTotal)

  template.querySelectorAll("th")[1].textContent = cTotal;
  template.querySelectorAll(
    "th"
  )[3].textContent = `$${pTotal.toLocaleString()} MXN`;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  footerCarrito.appendChild(fragment);

  //Este apartado sirve para el contador del carrito
  template2.querySelector("#contador-carrito").textContent = cTotal2;

  const clone2 = template2.cloneNode(true);
  fragment2.appendChild(clone2);

  contadorCarrito.appendChild(fragment2); //Aqui termina la parte del Contador Carrito

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};

    mostrarCarrito();
  });
};

const mostrarFooterCarrito2 = () => {
  footerCarrito.innerHTML = " ";

  if (Object.keys(carrito).length === 0) {
    footerCarrito.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío</th>
    `;

    return;
  }

  const template = document.querySelector("#templateFooterCarrito").content;
  const fragment = document.createDocumentFragment();

  //En este apartado necesitaremos sumar la cantidad total de los productos y el costo total
  const cTotal = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const pTotal = Object.values(carrito).reduce(
    (acc, { cantidad, pDescuento }) => acc + cantidad * pDescuento,
    0
  );
  // console.log(pTotal)

  template.querySelectorAll("th")[1].textContent = cTotal;
  template.querySelectorAll(
    "th"
  )[2].textContent = `$${pTotal.toLocaleString()} MXN`;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  footerCarrito.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};

    mostrarCarrito();
  });
};

accionBotones = () => {
  const botonesAgregar = document.querySelectorAll(".incrementar");
  const botonesEliminar = document.querySelectorAll(".decrementar");

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log("agregando...")
      const producto = carrito[btn.dataset.id];
      producto.cantidad++;
      carrito[btn.dataset.id] = { ...producto };
      mostrarCarrito();
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log("Eliminando...");
      const producto = carrito[btn.dataset.id];
      producto.cantidad--;
      if (producto.cantidad === 0) {
        delete carrito[btn.dataset.id];
        mostrarCarrito();
      } else {
        carrito[btn.dataset.id] = { ...producto };
        mostrarCarrito();
      }
    });
  });
};
