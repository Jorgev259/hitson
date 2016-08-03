var canciones;
var numCanciones;
var reproductor;
var contA =-1;

function lista() {
    //canciones[i].nombre
    var data = new FormData();
    data.append('op', 'busqueda');

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        canciones = result.split(">");
        numCanciones = canciones[0];
        for (i = 1; i <= numCanciones; i++) {
            canciones[i-1]=JSON.parse(canciones[i]);
        }
        canciones.pop();
        alert("base de datos de canciones actualizada");
        miMusica();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function mostrarCancion() {
    if (document.getElementById("gamer").style.display == "none" || document.getElementById("gamer").style.display == "") {
        document.getElementById("gamer").style.display = "block";
        document.getElementById("transparencia").style.display = "block";
    } else {
        document.getElementById("gamer").style.display = "none";
        document.getElementById("transparencia").style.display = "none";
    }
}

function subirCancion() {
    var data = new FormData();
    var Files = $("#archivoCancion").get(0).files;
    var nombre = document.getElementById('nombreCancion').value;
    var genero = document.getElementById('generoCancion').value;
    var album = document.getElementById('albumCancion').value;
    var artista = document.getElementById('artistaCancion').value;
    var com = document.getElementById('comentarioCancion').value;
    var user = pedirCampo("num_usuario");

    data.append('Files', Files[0]);
    data.append('nombre', nombre);
    data.append('genero', genero);
    data.append('artista', artista);
    data.append('album', album);
    data.append('com', com);
    data.append('usuario', user);
    data.append('op', 'agregar');

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        alert(result);
        mostrarCancion();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
        mostrarCancion();
    });
}

function reproducir(id) {
    var data = new FormData();
    data.append('op', 'play');
    data.append('id', id);
    console.log(id);

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST',
    }).done(function (result) {
        document.getElementById("player").src = result;
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function busqueda() {
    var cajaBusqueda = document.getElementById("busquedaMusica").value;
    var listaBusqueda = [];
    var num = 0;
    var num2 = 0;
    var existe;

    canciones.forEach(function(s) {
        existe = false;
        num2 = 0;
        listaBusqueda.forEach(function (s) {
            if (s.filename === listaBusqueda[num2]) {
                existe = true;
            }
            num2++;
        })

        var nombre = s.nombre.indexOf(cajaBusqueda);
        var genero = s.genero.indexOf(cajaBusqueda);
        var artista = s.artista.indexOf(cajaBusqueda);
        var album = s.album.indexOf(cajaBusqueda);

        if (existe == false && (nombre !== -1 || genero !== -1 || artista !== -1 || album !== -1)) {
            listaBusqueda[num] = s;
            num++;
        }
    })

    document.getElementById("transparencia").style.display = "block";
    document.getElementById("listaMusica").style.display = "block";
    listaBusqueda.forEach(function (cancion) {
        $("#listaMusica").append("<div>Nombre: " + cancion.nombre + "</div><br>");
    })
    console.log(listaBusqueda);
}

function pedirImagen(id,src) {
    var data = new FormData();
    data.append('op', 'imagen');
    data.append('id', id);

    $.ajax({
        url: '/Api/usuario',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        var foto = JSON.parse(result);
        document.getElementById(src).src = foto.datoFoto;
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function miMusica() {
    var id = pedirCampo("num_usuario");

    contA = -1;
    var cont = 0;
    reproductor = [];

    canciones.forEach(function (c) {
        if (c.usuario == id) {
            reproductor[cont] = c.filename;
            cont++;
        }
    })

    alert("Canciones del usuario cargadas al reproductor");
}

function nextC() {
    contA++;
    if (contA == reproductor.length) {
        contA = 0;
        alert("la lista se reinicio porque llego a su final");
    };
    reproducir(reproductor[contA]);
}

function asignarImagen(id) {
    var objeto = JSON.parse(sessionStorage.datosUsuario);
    pedirImagen(objeto.num_usuario,id);
}

function pedirCampo(campo) {
    var dato = JSON.parse(sessionStorage.datosUsuario)[campo];
    return dato;
}

$(document).ready(function () {
    var campo = pedirCampo('nickname');
    document.getElementById("nick1").innerHTML = campo;
    document.getElementById("nick2").innerHTML = campo;
    document.getElementById("user1").innerHTML = pedirCampo('usuario');
    lista();
});