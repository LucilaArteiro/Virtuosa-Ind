const productos = [
  {
    id: 1,
    nombre: 'Remera Essential',
    categoria: 'remeras',
    precio: 28000,
    imagen: 'imagenes/Remera Essential.jpg'
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

/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

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

/* =========================================================
   CARRITO
========================================================= */

let carritoActual = []

try {
  const carritoGuardado = localStorage.getItem('carritoVirtuosa')

  if (carritoGuardado) {
    carritoActual = JSON.parse(carritoGuardado)
  }
} catch (error) {
  console.error('No se pudo cargar el carrito:', error)
  carritoActual = []
}

/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio (precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(precio)
}

/* =========================================================
   ABRIR CARRITO
========================================================= */

function abrirCarrito () {
  if (!carrito || !overlay) return

  carrito.classList.add('abierto')
  overlay.classList.add('activo')
  document.body.classList.add('no-scroll')
}

/* =========================================================
   CERRAR CARRITO
========================================================= */

function cerrarCarritoFuncion () {
  if (!carrito || !overlay) return

  carrito.classList.remove('abierto')
  overlay.classList.remove('activo')
  document.body.classList.remove('no-scroll')
}

/* =========================================================
   GUARDAR CARRITO
========================================================= */

function guardarCarrito () {
  try {
    localStorage.setItem('carritoVirtuosa', JSON.stringify(carritoActual))
  } catch (error) {
    console.error('No se pudo guardar el carrito:', error)
  }
}

/* =========================================================
   ACTUALIZAR CONTADOR
========================================================= */

function actualizarContador () {
  if (!cantidadCarrito) return

  const cantidad = carritoActual.reduce((total, producto) => {
    return total + producto.cantidad
  }, 0)

  cantidadCarrito.textContent = cantidad
}

/* =========================================================
   MOSTRAR CARRITO
========================================================= */

function mostrarCarrito () {
  if (!carritoProductos || !carritoTotal) return

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

          <img
            src="${producto.imagen}"
            alt="${producto.nombre}"
          >

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

/* =========================================================
   AGREGAR PRODUCTO AL CARRITO
========================================================= */

function agregarAlCarrito (id) {
  const producto = productos.find(producto => producto.id === id)

  if (!producto) {
    console.error('Producto no encontrado:', id)
    return
  }

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

  console.log(`Producto agregado: ${producto.nombre}`)
}

/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

function eliminarDelCarrito (id) {
  carritoActual = carritoActual.filter(producto => producto.id !== id)

  guardarCarrito()
  mostrarCarrito()
  actualizarContador()
}

/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */

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

/* =========================================================
   BOTÓN ABRIR CARRITO
========================================================= */

if (botonCarrito) {
  botonCarrito.addEventListener('click', abrirCarrito)
}

/* =========================================================
   BOTÓN CERRAR CARRITO
========================================================= */

if (cerrarCarrito) {
  cerrarCarrito.addEventListener('click', cerrarCarritoFuncion)
}

/* =========================================================
   OVERLAY
========================================================= */

if (overlay) {
  overlay.addEventListener('click', cerrarCarritoFuncion)
}

/* =========================================================
   BOTONES AGREGAR AL CARRITO
========================================================= */

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', function (evento) {
    evento.preventDefault()

    const id = Number(this.dataset.id)

    agregarAlCarrito(id)
  })
})

/* =========================================================
   BOTONES DEL CARRITO
========================================================= */

if (carritoProductos) {
  carritoProductos.addEventListener('click', function (evento) {
    const botonCantidad = evento.target.closest('.boton-cantidad')

    if (botonCantidad) {
      const id = Number(botonCantidad.dataset.id)

      const cambio = Number(botonCantidad.dataset.cambio)

      cambiarCantidad(id, cambio)

      return
    }

    const botonEliminar = evento.target.closest('.boton-eliminar')

    if (botonEliminar) {
      const id = Number(botonEliminar.dataset.id)

      eliminarDelCarrito(id)
    }
  })
}

/* =========================================================
   FILTROS DE PRODUCTOS
========================================================= */

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', function () {
    const categoria = this.dataset.categoria

    botonesFiltro.forEach(botonFiltro => {
      botonFiltro.classList.remove('activo')
    })

    this.classList.add('activo')

    productosHTML.forEach(producto => {
      const coincide =
        categoria === 'todos' || producto.dataset.categoria === categoria

      producto.hidden = !coincide
    })
  })
})

/* =========================================================
   WHATSAPP
========================================================= */

if (botonWhatsApp) {
  botonWhatsApp.addEventListener('click', function () {
    if (carritoActual.length === 0) {
      alert('Tu carrito está vacío.')
      return
    }

    /*
      REEMPLAZAR ESTE NÚMERO POR EL WHATSAPP REAL
      DE VIRTUOSA IND.

      Formato:
      549 + código de área + número
    */

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

    window.open(url, '_blank')
  })
}

/* =========================================================
   INICIALIZAR
========================================================= */

mostrarCarrito()
actualizarContador()
