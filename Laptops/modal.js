// const modalContenedor = document.querySelector(".carritoCompras");

const modalContainer = document.querySelector(".modalCarrito");

const abrirCarrito = document.getElementById("open");

const cerrarCarrito = document.getElementById("cerrar");

abrirCarrito.addEventListener("click", () => {
  modalContainer.classList.toggle("modal-active");
});

cerrarCarrito.addEventListener("click", () => {
  modalContainer.classList.remove("modal-active");
});

// modalContenedor.addEventListener("click", () => {
//   cerrarCarrito.click();
// });

modalContainer.addEventListener("click", (e) => {
  e.stopPropagation();
});
