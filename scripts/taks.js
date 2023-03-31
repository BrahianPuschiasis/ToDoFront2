// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.


if(!localStorage.jwt){
  alert("adonde vas vos?")
  location.replace("./index.html");
}



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

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

    listado.forEach(tarea=>{
      verTarea.innerHTML += `

    <li class = "tarea aos-init aos-animate" data-aos="flip-up"> </li>
    <button class="change"> <i class = "fa-regular fa-circle"> </i> </button> <div class = "desripcion"> <p class = "nombre"> ${tarea.description} </p>
    <p class = "timestamp"> ${tarea.createdAt} </p>
    </div>`
     
         
     
  })



  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    
    



  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
   
    

    

  };

});