// 	EXPRESIONES REGULARES
const nombreRegex = new RegExp(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+( [a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/);
const direccionRegex = new RegExp(/^[a-zA-Z0-9\s°,]+$/);
const telefonoRegex = new RegExp(/^\d{10,14}$/);
const emailRegex = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
const pedidoRegex = new RegExp(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]+( [a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]+)*$/);

const datos = {
	nombre: false,
	direccion: false,
	telefono: false,
	email: false,
	pedido: false
};
// data para enviar a sheetdb.io
const data = {
  nombre: '',
	direccion: '',
	telefono: '',
	email: '',
	pago: 'efectivo',
	pedido: '',
};

const formulario = document.getElementById('formulario');
const nombre = document.getElementById('nombre');
const direccion = document.getElementById('direccion');
const telefono = document.getElementById('telefono');
const email = document.getElementById('email');
const opRadio = document.getElementsByName('pago');
const pedido = document.getElementById('pedido');

// LISTENERS
nombre.addEventListener("blur", (e) => validarCampo(e) );
direccion.addEventListener("blur", (e) => validarCampo(e) );
telefono.addEventListener("blur", (e) => validarCampo(e) );
email.addEventListener("blur", (e) => validarCampo(e) );
pedido.addEventListener("blur", (e) => validarCampo(e) );
for (let i = 0; i < opRadio.length; i++) {
	opRadio[i].addEventListener("change", (e) => validarCampo(e) );
}
  
// FUNCIONES
const validarCampo = (e) => {
	const campoInput = e.target;
	const campoValor = e.target.value;

	switch (campoInput.name) {
		case 'nombre':
			validacion(nombreRegex, campoValor, campoInput);
			break;
		
		case 'direccion':			
			validacion(direccionRegex, campoValor, campoInput);
			break;

		case 'telefono':
			validacion(telefonoRegex, campoValor, campoInput);	
			break;

		case 'email':			
			validacion(emailRegex, campoValor, campoInput);	
			break;

		case 'pago':
			for (var i = 0; i < opRadio.length; i++) {
				if (opRadio[i].value === "efectivo") {
					data.pago = opRadio[0].value
				} else {
					data.pago = opRadio[1].value
				}
			}
			break;

		case 'pedido':
			validacion(pedidoRegex, campoValor, campoInput)		
			break;

		default:
			break;
	}
}

const validacion = (expresionRegex, campoValor, campoInput) => {
	if( !expresionRegex.test(campoValor)) {
		validacionError(campoInput)
		
	}else {
		validacionOk(campoInput)
		datos[campoInput.name] = true;
		data[campoInput.name] = campoValor;
	}	
}

const validacionError = (inputCampo) => {
	inputCampo.previousElementSibling.classList.add('form-error-icono')
	inputCampo.previousElementSibling.classList.remove('form-icono')

	inputCampo.classList.add('form-input-error');
	inputCampo.classList.remove('form-input');
	
	inputCampo.nextElementSibling.classList.add('form-error-activo')
	inputCampo.nextElementSibling.classList.remove('form-error')
} 

const validacionOk = (inputCampo) => {
	inputCampo.previousElementSibling.classList.remove('form-error-icono')
	inputCampo.previousElementSibling.classList.add('form-icono')

	inputCampo.classList.remove('form-input-error');
	inputCampo.classList.add('form-input');
	
	inputCampo.nextElementSibling.classList.remove('form-error-activo')
	inputCampo.nextElementSibling.classList.add('form-error')
}

const metodoPost = () => {
  		// metodo post -- sheetdb.io
      fetch("https://sheetdb.io/api/v1/armuuoaqvr6wg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
        })
        .then(function(response) {
          if (response.ok) {
  
          document.querySelector('.mensaje-envio').classList.add('mensaje-envio-activo')				
          setTimeout(() => {
            document.querySelector('.mensaje-envio').classList.remove('mensaje-envio-activo')
          }, 4000);
  
          formulario.reset();
          } else {
            const errorMensaje = "Error al enviar los datos. Por favor, inténtalo nuevamente";
            document.getElementById('ErrorApi').innerHTML = errorMensaje;
            setTimeout(() => {
              document.getElementById('ErrorApi').innerHTML = '';
            }, 4000)
            }
        })
        .catch(function(error) {
          console.log(error);
          alert(error.message);
        });
}

const verificacion = () => {
	if( datos.nombre && datos.direccion && datos.telefono && datos.email && datos.pedido ){
    metodoPost();
		
	}else {
		document.querySelector('.mensaje-error').classList.add('mensaje-error-activo');

		setTimeout(() => {
			document.querySelector('.mensaje-error').classList.remove('mensaje-error-activo')
		}, 4000)

		// muestra los campos que contienen errores de validacion o estan vacios
		for( let dato in datos ) {
			if ( !datos[dato] ) {
				const error = document.getElementById(`${dato}`);
				validacionError(error)
			}
		}
	}
}

formulario.addEventListener("submit", (e) => {
	e.preventDefault();	
	verificacion();
})