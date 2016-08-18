var canciones;
var cancionesU;
var datosCanciones = [];
var numPlay;
var reproductor;
var contA = -1;
var playlists;
divPlay = "";

function lista() {
    if (divPlay == "") {
        divPlay = $("#sidebarPlaylist").clone();
    }

    var data = new FormData();
    data.append('op', 'busqueda');

    var data2 = new FormData();
    data2.append('op', 'busqueda2');

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        canciones = result.split(">");

        for (i = 0; i < canciones.length; i++) {
            canciones[i] = JSON.parse(canciones[i]);
        }

        $.ajax({
            url: '/Api/cancion',
            processData: false,
            contentType: false,
            data: data2,
            type: 'POST'
        }).done(function (result) {
            cancionesU = result.split(">");
            if (cancionesU[0] = "") {
                console.log(cancionesU);
                for (i = 0; i < cancionesU.length; i++) {
                    cancionesU[i] = JSON.parse(cancionesU[i]);
                }
            }
            alert("base de datos de canciones actualizada");
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });

    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        playlists = result.split(">");

        for (i = 0; i < playlists.length; i++) {
            playlists[i] = JSON.parse(playlists[i]);
        }

        alert("playlists cargadas");

        $("#sidebarPlaylist").replaceWith(divPlay.clone());

        playlists.forEach(function (play) {
            if (pedirCampo("num_usuario") == play.usuario) {
                $("#sidebarPlaylist").append("<li onclick='cargarPlaylist(" + play.numero + ")'><a href='#'><i class='fa fa-link'></i><span>" + play.nombre + "</span></a></li>");
            }
        });
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function mostrarCancion(id) {
    if (document.getElementById(id).style.display == "none" || document.getElementById(id).style.display == "") {
        document.getElementById(id).style.display = "block";
        document.getElementById("transparencia").style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
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

function datosCancion(listaId) {
    datosCanciones.forEach(function (cancion) {
        listaId.forEach(function (item) {
            if (cancion["filename"] == item) {
                var index = listaId.indexOf(cancion["filename"]);
                listaId.splice(index, 1);
            }
        });
    });
    
    if (listaId != "") {
        var listaEnviar = JSON.stringify(listaId);
        var data = new FormData;

        data.append("lista", listaEnviar);
        data.append("op", "datos");

        $.ajax({
            url: '/Api/cancion',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST'
        }).done(function (result) {
            var lista = result.split(">");

            for (i = 0; i < lista.length; i++) {
                lista[i] = JSON.parse(lista[i]);
            }

            lista.forEach(function (item) {
                var numero = item["filename"]
                datosCanciones[numero] = item;
            })
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
    } 
}

function subirPlaylist() {
    var data = new FormData();
    var nombre = document.getElementById('nombrePlaylist').value;
    var com = document.getElementById('comentarioPlaylist').value;
    var user = pedirCampo("num_usuario");

    data.append('nombre', nombre);
    data.append('com', com);
    data.append('usuario', user);
    data.append('op', 'agregar');

    $.ajax({
        url: '/Api/playlist',
        data: data,
        type: 'POST',
        processData: false,
        contentType: false
    }).done(function (result) {
        alert(result);
        mostrarCancion('crearPlaylist');
        lista();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function reproducir(id) {
    document.getElementById("player").src = "temp/" + id + ".mp3"
}

function busqueda() {
    var cajaBusqueda = document.getElementById("busquedaMusica").value;
    var listaBusqueda = [];
    var num = 0;
    var num2 = 0;
    var existe;
    $("#inicio").html("");

    var nombre = "cancion";
    var genero = "genero";
    var artista = "arista";
    var album = "album";

    canciones.forEach(function(s) {
        existe = false;
        num2 = 0;
        listaBusqueda.forEach(function (s) {
            if (s.filename === listaBusqueda[num2]) {
                existe = true;
            }
            num2++;
        })

        //var nombre = s.nombre.indexOf(cajaBusqueda);
        //var genero = s.genero.indexOf(cajaBusqueda);
        //var artista = s.artista.indexOf(cajaBusqueda);
        //var album = s.album.indexOf(cajaBusqueda);

       
        

        if (existe == false && (nombre !== -1 || genero !== -1 || artista !== -1 || album !== -1)) {
            listaBusqueda[num] = s;
            num++;
        }
    })

    playlists.forEach(function(s) {
        num = 0;

        //if (s.nombre.indexOf(cajaBusqueda) !== -1) {
        if (nombre.indexOf(cajaBusqueda) !== -1) {
            listaBusqueda[num] = s;
            num++;
        }
    })

    //document.getElementById("transparencia").style.display = "block";
   
    //limpiar y poner nueva vista
    $("#inicio").html("");
    listaBusqueda.forEach(function (cancion) {
        //agregar nuevo elemento dentro de un div
        //$("#inicio").append("<div id=" + cancion.filename +" onclick='agregarMiMusica(this)'>Nombre: " + cancion.nombre + "</div><button onclick='uniraPlaylist(" + cancion.filename + ")'>Playlist</button><br>");
        $("#inicio").append(" <div class='row' id='" + cancion.filename + "'><div class='col-xs-12'><div class='box'><div class='box-body table-responsive no-padding'><table class='table table-hove'><tr><td>" + cancion.nombre + "</td><td>" + cancion.artista + "</td><td>" + cancion.album + "</td><td>" + cancion.genero + "</td><button id='boton' class='btn btn-flat btn-success' onclick='uniraPlaylist("+ cancion.id + ")'>Agregar a la Playlist</button><button id='boton' class='btn btn-flat btn-success' onclick='agregarMiMusica(this)'>Agregar a mi musica</button></tr></table></div></div></div></div>");
       


    })
}

function pedirImagen(id, src) {
    document.getElementById(src).src = "temp/" + id + ".png";
}

function miMusica() {
    var id = pedirCampo("num_usuario");

    contA = -1;
    var cont = 0;
    reproductor = [];

    canciones.forEach(function (c) {
        if (c.user == id) {
            reproductor[cont] = c.cancion;
            cont++;
        }
    })

    cont = 0;

    cancionesU.forEach(function (cU) {
        if (cU.usuario == id) {
            reproductor[cont] = cU.cancion;
            cont++;
        }
    })

    nextC();
    contA = 0;
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

function agregarMiMusica(objeto) {
    var data = new FormData();
    data.append('cancion', objeto.id);
    data.append('id', pedirCampo("num_usuario"));
    data.append('op', 'agregarMiMusica');

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST',
    }).done(function (result) {
        alert(result);
        lista();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function uniraPlaylist(id_cancion) {
    mostrarCancion("listaMusica");

    $("#listadeplaylist").html("");
    playlists.forEach(function (playl) {
        if (playl.usuario == pedirCampo("num_usuario")) {
            $("#listadeplaylist").append("<div onclick='uniraPlaylist2(" + id_cancion + "," + playl.numero + ")'>" + playl.nombre + "</div>")
        };
    });
}

function uniraPlaylist2(id_cancion,id_playlist) {
    var data = new FormData();
    data.append("op", "unir");
    data.append("id_cancion", id_cancion);
    data.append("id_playlist", id_playlist);

    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        alert(result);
        mostrarCancion("listaMusica");
    });
}

function cargarPlaylist(id_playlist) {
    var data = new FormData();
    data.append("op", "reproducir");
    data.append("id_playlist", id_playlist);

    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        var lista = result.split(">");
        var cancionesP = [];
        reproductor = [];

        for (i = 0; i < lista.length; i++) {
            cancionesP[i] = JSON.parse(lista[i]);
            reproductor[i] = cancionesP[i].cancion;
        }
        nextC();
        contA = 0;
        alert("playlists cargada al reproductor");
    });
}

$(document).ready(function () {
    var campo = pedirCampo('nickname');
    document.getElementById("nick1").innerHTML = campo;
    document.getElementById("nick2").innerHTML = campo;
    document.getElementById("user1").innerHTML = pedirCampo('usuario');
    lista();
});

