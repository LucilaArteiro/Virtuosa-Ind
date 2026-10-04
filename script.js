const productos = [
  {
    id: 1,
    nombre: 'Remera Essential',
    categoria: 'remeras',
    precio: 28000,
    imagen: 'imagenes/remera-rosa.jpg'
  },
  {
    id: 2,
    nombre: 'Pantalón Urban',
    categoria: 'pantalones',
    precio: 48000,
    imagen: 'imagenes/pantalon-negro.jpg'
  },
  {
    id: 3,
    nombre: 'Vestido Aura',
    categoria: 'vestidos',
    precio: 55000,
    imagen: 'imagenes/vestido-negro.jpg'
  },
  {
    id: 4,
    nombre: 'Conjunto Soft',
    categoria: 'conjuntos',
    precio: 62000,
    imagen: 'imagenes/conjunto-beige.jpg'
  },
  {
    id: 5,
    nombre: 'Remera Basic',
    categoria: 'remeras',
    precio: 25000,
    imagen: 'imagenes/remera-blanca.jpg'
  },
  {
    id: 6,
    nombre: 'Jean Classic',
    categoria: 'pantalones',
    precio: 52000,
    imagen: 'imagenes/jean.jpg'
  }
]

const botonCarrito = document.querySelector('#botonCarrito')
const cerrarCarrito = document.querySelector('#cerrarCarrito')
const carrito = document.querySelector('#carrito')
const overlay = document.querySelector('#overlay')
const carritoProductos = document.querySelector('#carritoProductos')
const carritoTotal = document.querySelector('#carritoTotal')
const cantidadCarrito = document.querySelector('#cantidadCarrito')
const botonWhatsApp = document.querySelector('#botonWhatsApp')

const botonesAgregar = document.querySelectorAll('.boton-agregar')
const botonesFiltro = document.querySelectorAll('.filtro')
const productosHTML = document.querySelectorAll('.producto')

let carritoActual = []

try {
  carritoActual = JSON.parse(localStorage.getItem('carritoVirtuosa')) || []
} catch {
  carritoActual = []
}

function formatearPrecio (precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(precio)
}

function abrirCarrito () {
  carrito.classList.add('abierto')
  overlay.classList.add('activo')
  document.body.classList.add('no-scroll')
}

function cerrarCarritoFuncion () {
  carrito.classList.remove('abierto')
  overlay.classList.remove('activo')
  document.body.classList.remove('no-scroll')
}

function guardarCarrito () {
  localStorage.setItem('carritoVirtuosa', JSON.stringify(carritoActual))
}

function actualizarContador () {
  const cantidad = carritoActual.reduce((total, producto) => {
    return total + producto.cantidad
  }, 0)

  cantidadCarrito.textContent = cantidad
}

function mostrarCarrito () {
  if (carritoActual.length === 0) {
    carritoProductos.innerHTML = `
      <div class="carrito-vacio">
        <span>🛍️</span>
        <p>Tu carrito está vacío.</p>
        <small>Agregá productos para comenzar tu compra.</small>
      </div>
    `
    carritoTotal.textContent = formatearPrecio(0)
    return
  }

  carritoProductos.innerHTML = carritoActual
    .map(producto => {
      const subtotal = producto.precio * producto.cantidad

      return `
        <div class="item-carrito">
          <img src="${producto.imagen}" alt="${producto.nombre}">

          <div class="item-carrito-info">
            <h3>${producto.nombre}</h3>
            <p class="precio-unitario">
              ${formatearPrecio(producto.precio)}
            </p>

            <div class="cantidad-control">
              <button
                type="button"
                class="boton-cantidad"
                data-id="${producto.id}"
                data-cambio="-1"
                aria-label="Disminuir cantidad"
              >
                −
              </button>

              <span>${producto.cantidad}</span>

              <button
                type="button"
                class="boton-cantidad"
                data-id="${producto.id}"
                data-cambio="1"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <strong class="subtotal">
              ${formatearPrecio(subtotal)}
            </strong>
          </div>

          <button
            type="button"
            class="boton-eliminar"
            data-id="${producto.id}"
            aria-label="Eliminar ${producto.nombre}"
          >
            ×
          </button>
        </div>
      `
    })
    .join('')

  const total = carritoActual.reduce((acumulador, producto) => {
    return acumulador + producto.precio * producto.cantidad
  }, 0)

  carritoTotal.textContent = formatearPrecio(total)
}

function agregarAlCarrito (id) {
  const producto = productos.find(producto => producto.id === id)

  if (!producto) return

  const productoExistente = carritoActual.find(item => item.id === id)

  if (productoExistente) {
    productoExistente.cantidad += 1
  } else {
    carritoActual.push({
      ...producto,
      cantidad: 1
    })
  }

  guardarCarrito()
  mostrarCarrito()
  actualizarContador()
}

function eliminarDelCarrito (id) {
  carritoActual = carritoActual.filter(producto => producto.id !== id)
  guardarCarrito()
  mostrarCarrito()
  actualizarContador()
}

function cambiarCantidad (id, cambio) {
  const producto = carritoActual.find(item => item.id === id)

  if (!producto) return

  producto.cantidad += cambio

  if (producto.cantidad <= 0) {
    eliminarDelCarrito(id)
    return
  }

  guardarCarrito()
  mostrarCarrito()
  actualizarContador()
}

if (botonCarrito) {
  botonCarrito.addEventListener('click', abrirCarrito)
}

if (cerrarCarrito) {
  cerrarCarrito.addEventListener('click', cerrarCarritoFuncion)
}

if (overlay) {
  overlay.addEventListener('click', cerrarCarritoFuncion)
}

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    agregarAlCarrito(Number(boton.dataset.id))
  })
})

if (carritoProductos) {
  carritoProductos.addEventListener('click', evento => {
    const botonCantidad = evento.target.closest('.boton-cantidad')

    if (botonCantidad) {
      cambiarCantidad(
        Number(botonCantidad.dataset.id),
        Number(botonCantidad.dataset.cambio)
      )
      return
    }

    const botonEliminar = evento.target.closest('.boton-eliminar')

    if (botonEliminar) {
      eliminarDelCarrito(Number(botonEliminar.dataset.id))
    }
  })
}

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    const categoria = boton.dataset.categoria

    botonesFiltro.forEach(botonFiltro => {
      botonFiltro.classList.remove('activo')
    })

    boton.classList.add('activo')

    productosHTML.forEach(producto => {
      const coincide =
        categoria === 'todos' || producto.dataset.categoria === categoria

      producto.hidden = !coincide
    })
  })
})

if (botonWhatsApp) {
  botonWhatsApp.addEventListener('click', () => {
    if (carritoActual.length === 0) {
      alert('Tu carrito está vacío.')
      return
    }

    // Reemplazá este número de prueba por el WhatsApp real, con código de país.
    const numeroWhatsApp = '5493410000000'

    let mensaje = 'Hola VIRTUOSA IND 💗\n\n'
    mensaje += 'Quiero realizar el siguiente pedido:\n\n'

    carritoActual.forEach(producto => {
      const subtotal = producto.precio * producto.cantidad
      mensaje += `• ${producto.nombre} x${
        producto.cantidad
      } — ${formatearPrecio(subtotal)}\n`
    })

    const total = carritoActual.reduce((acumulador, producto) => {
      return acumulador + producto.precio * producto.cantidad
    }, 0)

    mensaje += `\nTotal: ${formatearPrecio(total)}\n\n`
    mensaje += 'Quisiera consultar disponibilidad. ¡Gracias! 💕'

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  })
}

mostrarCarrito()
actualizarContador()
