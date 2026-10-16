// VIRTUOSA IND — tienda online de demostración.

// Reemplazá este número por el WhatsApp de tu prima.
// Formato: 549 + código de área + número.
// Sin +, espacios ni guiones.
const WHATSAPP_TIENDA = '549XXXXXXXXXX'

// Productos de ejemplo para la maqueta.
// Los precios están expresados en pesos argentinos.
const productos = [
  {
    id: 1,
    nombre: 'Remera Essential',
    categoria: 'Remeras',
    precio: 18000,
    etiqueta: 'MÁS ELEGIDA',
    imagen:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85',
    alt: 'Remera básica clara'
  },
  {
    id: 2,
    nombre: 'Blusa Aura',
    categoria: 'Blusas',
    precio: 24000,
    etiqueta: 'NUEVO',
    imagen:
      'https://images.unsplash.com/photo-1564257577-0a7f3c2b8b8b?auto=format&fit=crop&w=700&q=85',
    alt: 'Blusa de estilo femenino'
  },
  {
    id: 3,
    nombre: 'Pantalón Sastrero',
    categoria: 'Pantalones',
    precio: 32000,
    etiqueta: 'ESENCIAL',
    imagen:
      'https://images.unsplash.com/photo-1506629905607-d9c297d3a8c1?auto=format&fit=crop&w=700&q=85',
    alt: 'Pantalón de vestir'
  },
  {
    id: 4,
    nombre: 'Conjunto Alma',
    categoria: 'Conjuntos',
    precio: 39000,
    etiqueta: 'LOOK COMPLETO',
    imagen:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85',
    alt: 'Inspiración de conjunto de moda'
  }
]

let carrito = []

const productosEl = document.querySelector('#productos')
const contadorEl = document.querySelector('#contador-carrito')
const fondoModal = document.querySelector('#fondo-modal')
const itemsCarritoEl = document.querySelector('#items-carrito')
const carritoVacioEl = document.querySelector('#carrito-vacio')
const carritoPieEl = document.querySelector('#carrito-pie')
const toastEl = document.querySelector('#toast')

let toastTimer

// Mostrar los precios en pesos argentinos.
function formatoPrecio (precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(precio)
}

// Mostrar los productos y filtrar por categoría.
function mostrarProductos (categoria = 'Todos') {
  const lista =
    categoria === 'Todos'
      ? productos
      : productos.filter(producto => producto.categoria === categoria)

  productosEl.innerHTML = lista
    .map(
      producto => `
        <article class="producto">
          <div class="producto-foto">
            <img
              src="${producto.imagen}"
              alt="${producto.alt}"
              loading="lazy"
              onerror="this.style.display='none'; this.parentElement.style.background='#ead0d0'"
            >
            <span class="etiqueta">${producto.etiqueta}</span>
          </div>

          <div class="producto-info">
            <span class="producto-categoria">
              ${producto.categoria}
            </span>

            <h3>${producto.nombre}</h3>

            <p class="producto-precio">
              ${formatoPrecio(producto.precio)}
            </p>

            <div class="producto-acciones">
              <button
                class="boton-agregar"
                data-agregar="${producto.id}"
              >
                Agregar a la bolsa +
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('')
}

// Avisos temporales en pantalla.
function avisar (mensaje) {
  toastEl.textContent = mensaje
  toastEl.classList.add('visible')

  clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toastEl.classList.remove('visible')
  }, 2200)
}

// Agregar una prenda al carrito.
function agregarProducto (id) {
  const existente = carrito.find(item => item.id === id)

  if (existente) {
    existente.cantidad++
  } else {
    carrito.push({
      id,
      cantidad: 1
    })
  }

  actualizarCarrito()
  avisar('Prenda agregada a tu bolsa ♡')
}

// Cambiar la cantidad de una prenda.
function cambiarCantidad (id, cambio) {
  const item = carrito.find(item => item.id === id)

  if (!item) return

  item.cantidad += cambio

  if (item.cantidad <= 0) {
    carrito = carrito.filter(item => item.id !== id)
  }

  actualizarCarrito()
}

// Eliminar una prenda del carrito.
function eliminarProducto (id) {
  carrito = carrito.filter(item => item.id !== id)
  actualizarCarrito()
}

// Actualizar contador, productos y total.
function actualizarCarrito () {
  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  const precioTotal = carrito.reduce((total, item) => {
    const producto = productos.find(producto => producto.id === item.id)

    return total + (producto ? producto.precio * item.cantidad : 0)
  }, 0)

  contadorEl.textContent = cantidadTotal

  carritoVacioEl.hidden = carrito.length > 0
  carritoPieEl.hidden = carrito.length === 0

  itemsCarritoEl.innerHTML = carrito
    .map(item => {
      const producto = productos.find(producto => producto.id === item.id)

      return `
        <article class="item-carrito">
          <img src="${producto.imagen}" alt="${producto.alt}">

          <div>
            <h3>${producto.nombre}</h3>

            <small>
              ${formatoPrecio(producto.precio)} c/u
            </small>

            <div class="controles-cantidad">
              <button
                data-cantidad="${producto.id}"
                data-cambio="-1"
                aria-label="Quitar una unidad"
              >
                −
              </button>

              <span>${item.cantidad}</span>

              <button
                data-cantidad="${producto.id}"
                data-cambio="1"
                aria-label="Agregar una unidad"
              >
                +
              </button>
            </div>

            <button
              class="eliminar-item"
              data-eliminar="${producto.id}"
            >
              Eliminar
            </button>
          </div>

          <strong class="item-subtotal">
            ${formatoPrecio(producto.precio * item.cantidad)}
          </strong>
        </article>
      `
    })
    .join('')

  document.querySelector('#total-carrito').textContent =
    formatoPrecio(precioTotal)
}

// Abrir y cerrar el carrito.
function abrirCarrito () {
  fondoModal.hidden = false
  document.body.style.overflow = 'hidden'

  document.querySelector('#cerrar-carrito').focus()
}

function cerrarCarrito () {
  fondoModal.hidden = true
  document.body.style.overflow = ''

  document.querySelector('#abrir-carrito').focus()
}

// Preparar el pedido y abrir WhatsApp.
function enviarPedidoWhatsApp () {
  if (carrito.length === 0) return

  if (WHATSAPP_TIENDA.includes('X')) {
    avisar('Primero configurá el WhatsApp en script.js')
    return
  }

  const lineas = carrito.map(item => {
    const producto = productos.find(producto => producto.id === item.id)

    return `• ${producto.nombre} x${item.cantidad} — ${formatoPrecio(
      producto.precio * item.cantidad
    )}`
  })

  const total = carrito.reduce((suma, item) => {
    const producto = productos.find(producto => producto.id === item.id)

    return suma + producto.precio * item.cantidad
  }, 0)

  const mensaje = [
    '¡Hola, VIRTUOSA IND! Quiero consultar por este pedido:',
    '',
    ...lineas,
    '',
    `*Total estimado: ${formatoPrecio(total)}*`,
    '',
    '¿Me confirman disponibilidad y talles?'
  ].join('\n')

  const url = `https://wa.me/${WHATSAPP_TIENDA}?text=${encodeURIComponent(
    mensaje
  )}`

  window.open(url, '_blank', 'noopener,noreferrer')
}

// Filtros del catálogo.
document.querySelector('#filtros').addEventListener('click', event => {
  const boton = event.target.closest('[data-categoria]')

  if (!boton) return

  document.querySelectorAll('.filtro').forEach(filtro => {
    filtro.classList.toggle('activo', filtro === boton)
  })

  mostrarProductos(boton.dataset.categoria)
})

// Agregar productos.
productosEl.addEventListener('click', event => {
  const boton = event.target.closest('[data-agregar]')

  if (boton) {
    agregarProducto(Number(boton.dataset.agregar))
  }
})

// Controles de cantidad y eliminación.
itemsCarritoEl.addEventListener('click', event => {
  const botonCantidad = event.target.closest('[data-cantidad]')
  const botonEliminar = event.target.closest('[data-eliminar]')

  if (botonCantidad) {
    cambiarCantidad(
      Number(botonCantidad.dataset.cantidad),
      Number(botonCantidad.dataset.cambio)
    )
  }

  if (botonEliminar) {
    eliminarProducto(Number(botonEliminar.dataset.eliminar))
  }
})

// Eventos del carrito.
document.querySelector('#abrir-carrito').addEventListener('click', abrirCarrito)

document
  .querySelector('#cerrar-carrito')
  .addEventListener('click', cerrarCarrito)

document.querySelector('#seguir-comprando').addEventListener('click', () => {
  cerrarCarrito()

  document.querySelector('#catalogo').scrollIntoView({
    behavior: 'smooth'
  })
})

document
  .querySelector('#enviar-whatsapp')
  .addEventListener('click', enviarPedidoWhatsApp)

// Cerrar al tocar fuera del panel.
fondoModal.addEventListener('click', event => {
  if (event.target === fondoModal) {
    cerrarCarrito()
  }
})

// Cerrar con Escape.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !fondoModal.hidden) {
    cerrarCarrito()
  }
})

// Año automático en el pie de página.
document.querySelector('#anio').textContent = new Date().getFullYear()

// Cargar catálogo al iniciar.
mostrarProductos()
