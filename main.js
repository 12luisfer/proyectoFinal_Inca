document.addEventListener('DOMContentLoaded', () => {
    // URL  archivo JSON local
    const url = 'data.json';
    // Función para cargar los datos desde el archivo JSON
    function cargarDatos() {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    // Llamar a la función para cargar los datos
    cargarDatos()
        .then(data => {
            // Aquí mostraremos los datos en la página
            console.log('Datos cargados:', data);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    // Lista de productos disponibles
    const productosDisponibles = [
        { nombre: 'Portátil', marca: 'Asus', precio: 1000, imagen: 'img/laptop.webp' },
        { nombre: 'Escritorio', marca: 'MaNitro5', precio: 800, imagen: 'img/ah_t200_1nw.webp' },
        { nombre: 'Monitor', marca: 'Lgd', precio: 200, imagen: 'img/Asus.webp' },
        { nombre: 'Teclado', marca: 'Hyperx', precio: 50, imagen: 'img/teclado.webp' },
        { nombre: 'SSD', marca: 'Kingston', precio: 120, imagen: 'img/hdd.webp' },
        { nombre: 'Memoria RAM', marca: 'Ram Ddr4 8gb Fury Hyperx ', precio: 80, imagen: 'img/black452.webp' },
        { nombre: 'Pad', marca: 'Lenovo', precio: 15, imagen: 'img/Ergonomic_mouse_pad.webp' },
        { nombre: 'Fuente', marca: 'Vx650', precio: 90, imagen: 'img/gf1650w.webp' },
        { nombre: 'Tarjeta de Video', marca: 'GeForce RTX 3060', precio: 350, imagen: 'img/6700Xteagle3.webp' }
    ];

    let carrito = [];
    const simboloMoneda = '$';
    const contenedorProductos = document.querySelector('#items');
    const contenedorCarrito = document.querySelector('#carrito');
    const contenedorTotal = document.querySelector('#total');
    const botonVaciar = document.querySelector('#boton-vaciar');
    const botonComprar = document.querySelector('#boton-comprar');
    const almacenamientoLocal = window.localStorage;

    // Función para mostrar los productos disponibles en la página
    function mostrarProductos() {
        productosDisponibles.forEach((producto) => {
            const nodoProducto = document.createElement('div');
            nodoProducto.classList.add('card', 'col-sm-4');

            const nodoCuerpo = document.createElement('div');
            nodoCuerpo.classList.add('card-body');
            
            const nodoTitulo = document.createElement('h5');
            nodoTitulo.classList.add('card-title');
            nodoTitulo.textContent = producto.nombre;
            
            const nodoImagen = document.createElement('img');
            nodoImagen.classList.add('img-fluid');
            nodoImagen.setAttribute('src', producto.imagen);
            
            const nodoPrecio = document.createElement('p');
            nodoPrecio.classList.add('card-text');
            nodoPrecio.textContent = `${simboloMoneda}${producto.precio}`;
            
            const nodoBoton = document.createElement('button');
            nodoBoton.classList.add('btn', 'btn-primary');
            nodoBoton.textContent = '+';
            nodoBoton.setAttribute('data-producto', producto.nombre);
            nodoBoton.addEventListener('click', agregarAlCarrito);

            nodoCuerpo.appendChild(nodoImagen);
            nodoCuerpo.appendChild(nodoTitulo);
            nodoCuerpo.appendChild(nodoPrecio);
            nodoCuerpo.appendChild(nodoBoton);
            nodoProducto.appendChild(nodoCuerpo);
            contenedorProductos.appendChild(nodoProducto);
        });
    }

    // Función para agregar un producto al carrito
    function agregarAlCarrito(evento) {
        const nombreProducto = evento.target.getAttribute('data-producto');
        carrito.push(nombreProducto);
        mostrarCarrito();
        guardarCarritoEnAlmacenamiento();
        mostrarMensaje(`${nombreProducto} agregado al carrito`, 'success');
    }

    // Función para mostrar los productos en el carrito
    function mostrarCarrito() {
        contenedorCarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = productosDisponibles.find((producto) => producto.nombre === item);
            const cantidadItem = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);
            const nodoItem = document.createElement('li');
            nodoItem.classList.add('list-group-item', 'text-right', 'mx-2');
            nodoItem.textContent = `${cantidadItem} x ${miItem.nombre} = ${simboloMoneda}${miItem.precio}`;
            
            const nodoBoton = document.createElement('button');
            nodoBoton.classList.add('btn', 'btn-danger', 'mx-6');
            nodoBoton.textContent = 'eliminar';
            nodoBoton.style.marginLeft = '1rem';
            nodoBoton.dataset.item = item;
            nodoBoton.addEventListener('click', eliminarDelCarrito);
            nodoItem.appendChild(nodoBoton);
            contenedorCarrito.appendChild(nodoItem);
        });

        contenedorTotal.textContent = calcularTotal();
    }

    // Función para eliminar un producto del carrito
    function eliminarDelCarrito(evento) {
        const nombreItem = evento.target.dataset.item;
        carrito = carrito.filter((item) => item !== nombreItem);
        mostrarCarrito();
        guardarCarritoEnAlmacenamiento();
        mostrarMensaje(`${nombreItem} eliminado del carrito`, 'info');
    }

    // Función para calcular el total del carrito
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = productosDisponibles.find((producto) => producto.nombre === item);
            return total + miItem.precio;
        }, 0).toFixed(2);
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        carrito = [];
        mostrarCarrito();
        localStorage.clear();
        mostrarMensaje('Carrito vaciado', 'success');
    }

    // Función para procesar la compra
    function procesarCompra() {
        if (carrito.length === 0) {
            mostrarMensaje('¡Carrito vacío! Agrega productos antes de confirmar la compra', 'error');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro de realizar la compra?',
            text: "Una vez confirmada, la compra será procesada y el carrito se vaciará.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar compra',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                mostrarCarrito();
                localStorage.clear();
                mostrarMensaje('¡Compra realizada con éxito!', 'success');
            }
        });
    }

    // Función para guardar el carrito en el almacenamiento local
    function guardarCarritoEnAlmacenamiento() {
        almacenamientoLocal.setItem('carrito', JSON.stringify(carrito));
    }

    // Función para cargar el carrito desde el almacenamiento local
    function cargarCarritoDesdeAlmacenamiento() {
        if (almacenamientoLocal.getItem('carrito') !== null) {
            carrito = JSON.parse(almacenamientoLocal.getItem('carrito'));
            mostrarCarrito();
        }
    }

    // Función para mostrar mensajes de notificación
    function mostrarMensaje(mensaje, tipo) {
        Swal.fire({
            position: 'center',
            icon: tipo,
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
        });
    }

    // Eventos de los botones
    botonVaciar.addEventListener('click', vaciarCarrito);
    botonComprar.addEventListener('click', procesarCompra);

    // Cargar carrito desde el almacenamiento local al cargar la página
    cargarCarritoDesdeAlmacenamiento();
    // Mostrar los productos en la página
    mostrarProductos();
});
