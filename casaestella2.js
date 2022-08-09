/* VARIABLES DOM*/
let contenedorCarrito = document.getElementById('carrito-contenedor')
let contenedorProductos = document.getElementById('contenedor-Productos')
let contadorCarrito = document.getElementById('contadorCarrito')
let botonVaciar = document.getElementById('vaciar-carrito')
let botonComprar = document.getElementById('comprar-carrito')
let botonTachito = document.getElementsByClassName('boton-eliminar')
let input = document.querySelector('#searchInput')
let productList = document.querySelector('#contenedor-Productos')

/* ARRAY VACIO CARRITO*/
let carrito = [];
let arrayproducto = []

/* CARGAMOS LOS PRODUCTOS EN EL HTLM MEDIANTE LOS DATOS TRAIDOS POR EL USO DE FETCH*/  
window.addEventListener('DOMContentLoaded', async () => {

    productList.innerHTML = "<h1 class='loading'>Cargando Productos...</h1>"

    let data = await cargarProductos()
    arrayproducto = data;
    imprimir_cards(arrayproducto)
})

/* BUSCADOR DE PRODUCTOS USANDO EL METODO FILTER PARA RECORRER EL ARRAY Y tolowerCase PARA PASARLO TODO A MINUSCULA */  
input.addEventListener('keyup', e => {
  let newProducto = arrayproducto.filter(prod => `${prod.nombre.toLowerCase()}`.includes(input.value.toLowerCase()))
  imprimir_cards(newProducto)
})

/*TRAEMOS LOS OBJETOS DEL JSON MEDIANTE EL USO DE FETCH*/ 
async function cargarProductos() {
    let response = await fetch("./productos.json")
    return await response.json()
    
  }


/*FUNCIONES*/ 

/* IMPRIMIR  LAS CARDS/PRODUCTOS EN EL HTML Y ALERTA DEL BOTON PARA AGREGAR AL CARRITO*/
function imprimir_cards(lista_productos){

  contenedorProductos.innerHTML = "";

  lista_productos.forEach((info) => {
        let div = document.createElement('div');
        div.classList.add('producto')
        div.classList.add('productoanimation')
        div.innerHTML = `
        <img src=${info.img} class="img-produ">
        <h5>${info.nombre}</h5>
        <p>Precio: ${info.precio}$</p>
        <button id="agg-producto${info.id}" class="boton-agg"><i class="fas fa-shopping-cart"></i></button>
        `
        contenedorProductos.appendChild(div)

        /* ANIMACION DE LAS CARDS CON ANIME.JS*/
        anime({
          targets: '.productoanimation',
          scale: [
            {value: .6, easing: 'easeOutSine', duration: 500},
            {value: 1, easing: 'easeInOutQuad', duration: 1200}
          ],
          delay: anime.stagger(200, {grid: [14, 5], from: 'center'})
        });
        

             /*BOTON AGREGAR PRODUCTOS AL CARRITO*/
        let boton = document.getElementById(`agg-producto${info.id}`)
        
        boton.addEventListener('click', () => {
            agregarAlCarrito(info.id , lista_productos)
            Toastify({
                text: "Se agrego al Carrito",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true, 
                style: {
                  background: "blue",
                },
                onClick: function(){} 
              }).showToast();
        })
})};


/* AGG PRODUCTO AL CARRITO SIN QUE SE REPITA*/
let agregarAlCarrito = (prodId , lista_productos) => {
    let agregar_producto = lista_productos.find(prod => prod.id == prodId)
    let existe = carrito.some(prod => prod.id === prodId)

    existe == true ? agregar_producto.cantidad++ : carrito.push(agregar_producto); 
    localStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarCarrito() 

};



/* IMPRIMIR EL MODAL DEL CARRITO EN EL HTML*/
function actualizarCarrito  () {
    
    contenedorCarrito.innerHTML = ""
    carrito.forEach((info) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${info.nombre}</p>
        <p>Precio:$${info.precio}</p>
        <p>Cantidad: <span id="cantidad">${info.cantidad}</span></p>
        <button onclick="(${info.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)

        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    
    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, info) => acc + info.cantidad * info.precio, 0)


    /* BOTON ELIMINAR CON ICONO TACHITO*/
    let botonEliminar = document.querySelectorAll(".boton-eliminar")

    botonEliminar.forEach(boton => {
        boton.addEventListener("click", tachitoProducto)
        
        
       
    })
    
};


/*CARGA EL HTML Y OBTIENE EL LOCALSTORAGE DE CARRITO*/
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

 /*CODIGO PARA EL BOTON DE  ELIMINAR PRODUCTOS DEL CARRITO CON EL TACHITO*/
let tachitoProducto = (e) => {
  let nuevacantidad = 1;
  carrito.forEach(function(item){
    item.cantidad = nuevacantidad;
  })
  let id = e.target.id
  let index = carrito.findIndex(producto => producto.id == id)
  carrito.splice(index, 1)
  localStorage.removeItem('carrito', JSON.stringify(carrito , id))
  actualizarCarrito()

        Toastify({
          text: "Producto Eliminado",
          duration: 2000,
          newWindow: true,
          close: true,
          gravity: "top", 
          position: "right", 
          stopOnFocus: true, 
          style: {
            background: "red",
          },
          onClick: function(){} 
        }).showToast();
  }



/*BOTON SIMULAR COMPRA Y SUS ALERTAS EN UN FUTURO AGG API DE MERCAFOPAGO*/
botonComprar.addEventListener('click', () => {
    
let swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Confirmar Compra?',
    text: "no puede cancelar si confirma!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Compra Confirmada',
        'se realizo la compra :)',
        'success'
      )
    }
     else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Compra Cancelada',
        'cancelo su compra :(',
        'error'
      )
    }
  })

});


/* CODIGO DEL MODAL*/
let contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
let botonAbrir = document.getElementById('boton-carrito')
let botonCerrar = document.getElementById('carritoCerrar')
let modalCarrito = document.getElementsByClassName('modal-carrito')[0]


botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
});
botonCerrar.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
});

contenedorModal.addEventListener('click', (event) =>{
    contenedorModal.classList.toggle('modal-active')

});
modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation() 
});


 /* ANIMACIONES ANIME.JS NAV*/
anime({
  targets: '.animated',
  translateX: 2000,
  easing: 'easeInOutExpo'
});
