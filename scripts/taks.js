// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.


if(!localStorage.jwt){
  alert("adonde vas vos?")
  location.replace("./index.html");
}



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  AOS.init();
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const urlTareas="https://todo-api.ctd.academy/v1/tasks";
  const urlUsuario="https://todo-api.ctd.academy/v1/users/getMe";
  const token = JSON.parse(localStorage.jwt);

  const formCrearTarea= document.querySelector(".nueva-tarea");
  const nuevaTarea=document.querySelector("#nuevaTarea");
  const btnCerrarSesion=document.querySelector("#closeApp");

  obtenerNombreUsuario();
  consultarTareas();
 






  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */
  btnCerrarSesion.addEventListener("click",()=>{
    const cerrarSesion=confirm("Desea cerrar sesión");
    if(cerrarSesion){
      localStorage.clear();
      location.replace("./index.html");
    }
  })


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */
  function obtenerNombreUsuario(){
    const settings={
      method:"GET",
      headers:{
        authorization:token,
      }
    };

    console.log("Consultando el usuario");

    fetch(urlUsuario,settings)
    .then(response=>response.json())
    .then(data=>{
      console.log("Nombre de usuario");
      console.log(data.firstName);
      const nombreUsuario=document.querySelector(".user-info p");
      nombreUsuario.innerText=data.firstName;
    })
    .catch(error=>console.log(error));
  }


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    
    const settings = {
      method: "GET", 
      headers:{
        authorization: token,
      }
    };
    
    console.log("Consultando tareas");

    fetch(urlTareas, settings)
    .then(response=> response.json())
    .then(tareas=>{
      console.log("Tarea");
      console.table(tareas);
      renderizarTareas(tareas);
      botonesCambioEstado();
      botonBorrarTarea();

    })
    .catch(error => console.log(error))


  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', (e)=> {
    e.preventDefault();  

/////
const payload = 
{
    description: nuevaTarea.value,
    completed: false,
  }

const settings  = {
method:"POST",
body: JSON.stringify(payload),
headers:{
    'Content-Type': 'application/json',
      authorization: token,
}


};
/////

    console.log("lanzando la consulta a la API");
        
    fetch(urlTareas, settings)
    .then(response =>{
console.log(response);
consultarTareas();
return response.json();
})
.then(data=>{

    console.log(data)
    
})

.catch(err=>{
console.log("Promesa rechazada");
console.log(err);
})



  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {


console.log("paso por aca")
console.table(listado)

    const verTarea = document.querySelector('.tareas-pendientes');
    verTarea.innerHTML = '';
    let contador = 0;
    const verTareaTerminada = document.querySelector('.tareas-terminadas');
    verTareaTerminada.innerHTML = '';
    const TareaNumero = document.querySelector("#cantidad-finalizadas")





    listado.forEach(tarea=>{
      let fecha = new Date(tarea.createdAt);

      if (tarea.completed){
        contador++;
        verTareaTerminada.innerHTML += `
        
        <li class="tarea" data-aos="flip-up">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>`


   


      }
      else{
      
      verTarea.innerHTML += `

      <li class="tarea" data-aos="flip-up">
      <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
      <div class="descripcion">
        <p class="nombre">${tarea.description}</p>
        <p class="timestamp">${fecha.toLocaleDateString()}</p>
      </div>
    </li>`
     
      }
     
  })

  TareaNumero.innerText = contador;

  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    
    

    const btnCambiarIncompleta = document.querySelectorAll('.change');

    
    btnCambiarIncompleta.forEach(boton => {
      boton.addEventListener('click', function (event) {
        const id = event.target.id;
        const url = `${urlTareas}/${id}`
////////////
        const settings = {
          method: "GET", 
          headers:{
            authorization: token,
          }
        };
        
    
        fetch(url, settings)
        .then(response=> response.json())
        .then(tareas=>{

          
          const payload =  {};

          payload.completed = !tareas.completed;
          
                      const settingsCambio = {
                        method: 'PUT',
                        headers: {
                          "Authorization": token,
                          "Content-type": "application/json"
                        },
                        body: JSON.stringify(payload),
          
                      }
                      fetch(url, settingsCambio)
                        .then(response => {
                          console.log("Cambiando tarea...");
                          console.log(response.status);
                          consultarTareas();
                        })
          
          

        
        })


        /////////////////


      })

    })


  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    //obtenemos los botones de borrado
    const btnBorrarTarea = document.querySelectorAll('.borrar');

    btnBorrarTarea.forEach(boton => {
      //a cada boton de borrado le asignamos la funcionalidad
      boton.addEventListener('click', function (event) {
        Swal.fire({
          title: '¿Confirma eliminar la tarea?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            /* -------------------- disparamos el fetch para eliminar ------------------- */
            const id = event.target.id;
            const url = `${urlTareas}/${id}`

            const settingsCambio = {
              method: 'DELETE',
              headers: {
                "Authorization": token,
              }
            }
            fetch(url, settingsCambio)
              .then(response => {
                console.log("Borrando tarea...");
                console.log(response.status);
                //vuelvo a consultar las tareas actualizadas y pintarlas nuevamente en pantalla
                consultarTareas();
              })

            Swal.fire(
              'Tarea eliminada.',
            );

          }
        });

      })
    });
  }

})