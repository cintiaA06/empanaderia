//   ---     VARIABLES    ---
const productos = document.querySelector('#productos');
const contenedorCarrito = document.querySelector('#listaCarrito tbody');
const cantidadCarrito = document.getElementById("cantidadCarrito");
const listaCarrito = document.querySelector('#listaCarrito'); 
const vaciarCarritoBtn = document.querySelector('#vaciarCarrito');
const calFooter = document.querySelector('#footerTotal');
let articulosCarrito = [];

//   ---     LISTENERS     ---
document.addEventListener('DOMContentLoaded', () => {
    consultaDatos();
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoCont();
    inyectarCarritoHtml();
})
productos.addEventListener('click', (e) => {
    addCarrito(e)
})

listaCarrito.addEventListener('click', eliminarProducto);

//   ---     FUNCIONES     ---

vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];
    limpiarHTML();
    localStorage.clear();

    if( articulosCarrito.length === 0 ) { 
        calFooter.innerHTML = `
        <th scope="row" colspan="5">Elija la variedad de empanada!</th>
        `;
    }
    carritoCont();
});


const consultaDatos = async () => {
    try {
        const url = "apidata.json";
        const res = await fetch( url );
        const data = await res.json();
        listaProductos(data);
        
    } catch (error) {
        console.log(error);
    }
}

const listaProductos = data => {
    data.forEach( producto => {
        const { id, img, tipo, ingredientes, precio } = producto;
        const card = document.createElement('div');
        card.className = "card";
        card.innerHTML = `
            <img src="${img}" alt="${tipo}">
            <div class="cardbody">
                <h3>Empanadas <span>${tipo}</span></h3>
                <p class="precio">Precio: $<span>${precio}</span></p>
                <button data-id="${id}" class="agregarBtn">Agregar al carrito</button>            
            </div>
        `;
        productos.appendChild(card);     
    });    
    guardarLocStorage();
}

const addCarrito = e => {
    if( e.target.classList.contains('agregarBtn') ) {
        const productoSeleccionado = e.target.parentElement;
        leerDatosProducto( productoSeleccionado );
    }
}

function eliminarProducto(e) {
    const encontrado = e.target.classList.contains('borrarProducto')

    if( encontrado ) {
        const productoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter( producto => producto.id !== productoId );
        inyectarCarritoHtml();
    }
    carritoCont();
    guardarLocStorage();
}


const leerDatosProducto = producto => {
    // Armamos el objeto producto con la info que vamos a mostrar en la tabla
    const datosProducto = {
        tipo: producto.querySelector('h3 span').textContent,
        precio: parseInt(producto.querySelector('.precio span').textContent),
        id: producto.querySelector('button').dataset.id,
        cantidad: 1
    }
    // Revisa si un elemento ya existe en el carrito  
    const existe = articulosCarrito.some( producto => producto.id === datosProducto.id );

    if( existe ) {
        // Actualizamos la cantidad
        const productos = articulosCarrito.map( producto => {
            if( producto.id === datosProducto.id ) {
                producto.cantidad++;
                return producto; // retorna el objeto actualizado
            }else {
                return producto; // retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [ ...productos ]
    }else {
        articulosCarrito = [...articulosCarrito, datosProducto];
    }
    guardarLocStorage();
    carritoCont();
    inyectarCarritoHtml();
}

const inyectarCarritoHtml = () => {
    limpiarHTML();
    // Recorrer el carrito y se genera el html
    articulosCarrito.forEach( producto => {
        const { tipo, precio, cantidad, id } = producto;
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td> ${ tipo } </td>
            <td> ${ precio } </td>
            <td> ${ cantidad } </td>
            <td> ${ precio * cantidad } </td>
            <td>
                <button 
                    class="borrarProducto"
                    id="borraProducto"
                    data-id="${id}"
                >
                    ❌
                </button>
            </td>
        `;
        contenedorCarrito.appendChild(fila);
    });
    inyectarCarritoFooterHTML();
}

// Inyecta en tfoot los calculos totales
const inyectarCarritoFooterHTML = () => {
    calFooter.innerHTML = '';
    if( articulosCarrito.length === 0 ) {
        calFooter.innerHTML = `
        <th scope="row" colspan="5">Elija la variedad de empanada!</th>
        `;
        return
    }
    // calculos de totales
    const cantidadDoc = articulosCarrito.reduce( (acumulador, {cantidad}) => acumulador + cantidad, 0 );
    const precioTotal = articulosCarrito.reduce( (acumulador, { precio, cantidad }) => acumulador + cantidad * precio, 0 );

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <th scope="row" colspan="2">Total a pagar: </th>
        <th scope="row"> ${ cantidadDoc } </th>
        <th scope="row"> ${ precioTotal } </th>
        <th scope="row"></th>
    `;
    calFooter.appendChild(fila);
}


// Elimina los productos del tbody -- vaciar carrito
const limpiarHTML = () => {
    const productos = contenedorCarrito.querySelectorAll('*');
    productos.forEach(producto => producto.remove());
};

const carritoCont = () => {  
    cantidadCarrito.innerText = articulosCarrito.length;
};  

const guardarLocStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}