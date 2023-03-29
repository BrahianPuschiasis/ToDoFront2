window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const nombre = document.querySelector("#inputNombre");
    const apellido = document.querySelector("#inputApellido");
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");
    const repetirPassword = document.querySelector("#inputPasswordRepetida");

    const url = 'https://todo-api.ctd.academy/v1';


    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener("submit", (e)=>{
        e.preventDefault();      

        const payload = 
        {
            firstName: nombre.value,
            lastName: apellido.value,
            email: email.value,
            password: password.value,
           // repetirPassword:  repetirPassword.value,
           
          }

     const settings  = {
        method:"POST",
        body: JSON.stringify(payload),
        headers:{
            'Content-Type': 'application/json'
        }


     };
     realizarRegister(settings);
     form.reset();
    })

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
    
            console.log("lanzando la consulta a la API");
        
            fetch(`${url}/users`, settings)
            .then(response =>{
        console.log(response);
        if (response.ok != true){
            alert("Alguno de los datos es incorrecto");
        }
        return response.json();
        })
        .then(data=>{
            console.log("Promesa cumplida")
            console.log(data)
            
        if(data.jwt){
            localStorage.setItem("jwt",JSON.stringify(data.jwt));
            location.replace("./index.html")
        
        }
        
        })
        
        .catch(err=>{
        console.log("Promesa rechazada");
        console.log(err);
        })
                
            };
        
        
        });