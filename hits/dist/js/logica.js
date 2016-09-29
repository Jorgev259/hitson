//variables globales
var canciones;
var cancionesU;
var datosCanciones = [];
var numPlay;
var reproductor;
var contA = -1;
var playlists;
var divPlay = "";
var divInicio = "";
var listaRandom = [];
var meta = [];
var archivosMeta;
var metaNum = 0;

//funcion para crear una alerta en pantalla
function mensaje(text1, text2) {
    document.getElementById("carga").style.display = "block";
    document.getElementById("transparencia").style.display = "block";
    $("#carga2").append("<div id='base'>" + text1 + "</div>");
    $("#carga2").append("<div id='play'>" + text2 + "</div>");
}

//funcion para quitar alerta de pantalla
function quitarMensaje(opcion) {
    $("#play").remove();
    $("#base").remove();
    document.getElementById("carga").style.display = "none";
    if(opcion != "true"){
        document.getElementById("transparencia").style.display = "none";
    }
}

//funcion para actualizar datos locales sobre canciones, playlists y otros datos relacionados
function lista() {
    mensaje("Preparando Canciones", "Preparando Playlists");

    //Revisa el contenido de la variable para guardar una copia de la barra lateral
    if (divPlay == "") {
        divPlay = $("#sidebarPlaylist").clone();
    }

    //Revisa el contenido de la variable para guardar una copia de la pantalla de inicio
    if (divInicio == "") {
        divInicio = $("#inicio").clone();
    }

    //FormData usado para la descarga de los datos de las canciones y datos de las playlists
    var data = new FormData();
    data.append('op', 'busqueda');

    //Ajax para la descarga de los datos de las canciones
    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        quitarMensaje();
        console.log(result);
        //Revisa el contenido devuelto por el servidor para evita procesar datos vacios
        if (result != "") {
            canciones = result.split(">"); //Divide en la lista canciones cada uno de los grupos de datos de las canciones
            var i=0;
            canciones.forEach(function (c) { //Revisa cada uno de los datos y convierte los strings en JSON's
                    canciones[i] = JSON.parse(c);
                i++
            })

            var listaUpdate = [];
            canciones.forEach(function (c) { //Agrega cada id de cancion a una lista para actualizar la lista local
                listaUpdate.push(c.cancion);
            });

            datosCancion(listaUpdate); //Compara los ids recibidos con los ids ya descargados y agrega los que no estaban
           //Fin ajax para la descarga de los datos de las canciones


            //FormData usado para la descarga de las asociaciones Cancion-Usuario
            var data2 = new FormData();
            data2.append('op', 'busqueda2');
            //Ajax para la descarga de las asociaciones Cancion-Usuario
            $.ajax({
                url: '/Api/cancion',
                processData: false,
                contentType: false,
                data: data2,
                type: 'POST'
            }).done(function (result) {
                //Revisa el contenido devuelto por el servidor para evita procesar datos vacios
                if(result != ""){
                    cancionesU = result.split(">"); //Divide en la lista cancionesU cada uno de las asociaciones Cancion-Usuario

                    cancionesU.forEach(function (c) { //Revisa cada uno de los datos y convierte los strings en JSON's
                        cancionesU[JSON.parse(c).cancion] = JSON.parse(c);
                    })

                    console.log(cancionesU);
                    $("#base").remove();

                    document.getElementById("carga").style.display = "none";
                    document.getElementById("transparencia").style.display = "none";

                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
            });
            //Fin Ajax para la descarga de las asociaciones Cancion-Usuario
        }
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });

    //Ajax para la descarga de datos de la playlist
    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        if (result != "") { //Revisa el contenido devuelto por el servidor para evita procesar datos vacios
            playlists = result.split(">"); //Divide en la lista playlists cada uno de lo grupos de datos de las playlists

            playlists.forEach(function (c) { //Revisa cada uno de los datos y convierte los strings en JSON's
                playlists[JSON.parse(c).numero] = JSON.parse(c);
            })

            $("#play").remove();

            $("#sidebarPlaylist").replaceWith(divPlay.clone());

            var parametros = "'normal'";

            playlists.forEach(function (play) { //Revisa cada una de las playlists
                if (pedirCampo("num_usuario") == play.usuario) { //Compara con el id del usuario actual para agregar esa playlist a la barra lateral
                    $("#sidebarPlaylist").append("<li ><a><i class='fa fa-link'></i><span onclick='mostrarPlay(" + play.numero +")'>" + play.nombre + "</span><i id='p1" + play.numero + "' class='fa fa-fw fa-play'></i><i id='p2" + play.numero + "' class='fa fa-fw fa-random'></i></a></li>");
                    $('#p1' + play.numero).attr('onClick', 'cargarPlaylist(' + play.numero + ',"normal")');
                    $('#p2' + play.numero).attr('onClick', 'cargarPlaylist(' + play.numero + ',"random")');
                }
            });
        }
        //Fin Ajax para la descarga de datos de la playlist

        //FormData usado para la descarga de las asociaciones Playlist-Usuario
        var playlistUsuario = new FormData();
        playlistUsuario.append("op", "busquedaUsuario");
        playlistUsuario.append("id_usuario", pedirCampo("num_usuario"));

        //Ajax para la descarga de las asociaciones Playlist-Usuario
        $.ajax({
            url: '/Api/playlist',
            processData: false,
            contentType: false,
            data: playlistUsuario,
            type: 'POST'
        }).done(function (result) {
            if (result != "") { //Revisa el contenido devuelto por el servidor para evita procesar datos vacios
                var list = result.split(">"); //Divide en la lista playlists cada uno de las asociaciones Playlist-Usuario

                list.forEach(function (c) { //Revisa cada uno de los datos y convierte los strings en JSON's
                   list[JSON.parse(c).playlist] = JSON.parse(c);
                })

                list.forEach(function (play) { //Revisa cada una de las playlists
                    if (pedirCampo("num_usuario") == play.usuario) { //Compara con el id del usuario actual para agregar esa playlist a la barra lateral
                        $("#sidebarPlaylist").append("<li ><a><i class='fa fa-link'></i><span onclick='mostrarPlay(" + playlists[play.playlist].numero + ")'>" + playlists[play.playlist].nombre + "</span><i id='p21" + playlists[play.playlist].numero + "' class='fa fa-fw fa-play'></i><i id='p22" + playlists[play.playlist].numero + "' class='fa fa-fw fa-random'></i><i class='fa fa-fw fa-ban' onclick='eliminarPlay(" + playlists[play.playlist].numero + ")'></i></a></li>");
                        $('#p21' + playlists[play.playlist].numero).attr('onClick', 'cargarPlaylist(' + playlists[play.playlist].numero + ',"normal")');
                        $('#p22' + playlists[play.playlist].numero).attr('onClick', 'cargarPlaylist(' + playlists[play.playlist].numero + ',"random")');
                    }
                });
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
    //Fin Ajax para la descarga de las asociaciones Playlist-Usuario
}
//Fin funcion para actualizar datos locales sobre canciones, playlists y otros datos relacionados

//Funcion para devolver el inicio al estado original
function inicio() {
    $("#inicio").replaceWith(divInicio.clone());
}

//Funcion para mostrar u ocultar los formularios
function mostrarCancion(id) {
    if (document.getElementById(id).style.display == "none" || document.getElementById(id).style.display == "") {
        document.getElementById(id).style.display = "block";
        document.getElementById("transparencia").style.display = "block";
    } else {
        document.getElementById(id).style.display = "none";
        document.getElementById("transparencia").style.display = "none";

        if (id == "gamer") {
            document.getElementById("generoCancion").value = "";
            document.getElementById("nombreCancion").value = "";
            document.getElementById("artistaCancion").value = "";
            document.getElementById("albumCancion").value = "";
            document.getElementById("comentarioCancion").value = "";
        }

        if (id == "opcionMasiva") {
            meta = [];
        }
    }
}

//Funcion para subir una cancion
function subirCancion() {
    //Crea el form data correspondiente y le agrega los valores necesarios
    var data = new FormData();
    var Files = $("#archivoCancion").get(0).files;

    data.append('Files', Files[0]);
    data.append('nombre', document.getElementById('nombreCancion').value);
    data.append('genero', document.getElementById('generoCancion').value);
    data.append('artista', document.getElementById('artistaCancion').value);
    data.append('album', document.getElementById('albumCancion').value);
    data.append('com', document.getElementById('comentarioCancion').value);
    data.append('usuario', pedirCampo("num_usuario"));
    data.append('op', 'agregar');

    //Crea mensaje para el usuario
    mensaje("Subiendo Cancion", "");

    //Ajax para subir cancion
    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) { //Cuando el query se termine
        quitarMensaje(""); //Quita la alerta del usuario
        alert(result); //Devuelve el mensaje del servidor
        mostrarCancion("gamer"); //Oculta el formulario
        lista(); //Actualiza los datos
    }).fail(function (a, b, c) {
        console.log(a, b, c);
        mostrarCancion("gamer");
    });
    //Fin Ajax para subir cancion
}
//Fin funcion para subir una cancion

//Funcion para actualizar la lista canciones
function datosCancion(listaId) {
    datosCanciones.forEach(function (cancion) { //Revisa cada uno de los datos de las canciones
        listaId.forEach(function (item) { //Revisa cada uno de los ids recibidos
            if (cancion["filename"] == item) { //si el id ya existia en canciones
                //lo elimina de la lista recibida
                var index = listaId.indexOf(cancion["filename"]);
                listaId.splice(index, 1);
            }
        });
    });
    
    if (listaId != "") { //Revisa si la lista esta vacia para evitar procesar datos nulos
        var listaEnviar = JSON.stringify(listaId); //Convierte la lista en un JSON string para envio

        //Crea el form data correspondiente y agrega los datos necesarios
        var data = new FormData;
        data.append("lista", listaEnviar);
        data.append("op", "datos");

        //Ajax para recibir los datos de las canciones nuevas
        $.ajax({
            url: '/Api/cancion',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST'
        }).done(function (result) { //Cuando el query se termine
            var lista = result.split(">"); //Divide los datos recibidos en lista
            var i = 0;
           lista.forEach(function (c) { //Revisa cada uno de los datos y convierte los strings en JSON's
               lista[i] = JSON.parse(c);
               i++
            })

            lista.forEach(function (item) { //Revisa cada elemento de lista
                var numero = item["filename"];
                datosCanciones[numero] = item;
            })
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
        //Fin Ajax para recibir los datos de las canciones nuevas
    } 
}
//Fin Funcion para actualizar la lista canciones

function subirAlbum() {
    var archivos = $("#archivoAlbum").get(0).files;
    var data = new FormData;
    var lista = [];
    var num = 0;
    var user = pedirCampo("num_usuario");
    data.append("op", "album");

    for (i = 0; i < archivos.length; i++) {

        data.append("Files" + i, archivos[i]);

        jsmediatags.read(archivos[i], {
            onSuccess: function (tag) {
                var dato = {};

                if(tag.tags.title == undefined || tag.tags.title == ""){
                    dato["nombre"] = archivos[i].name;
                }else{
                    dato["nombre"] = tag.tags.title;
                }

                dato["genero"] = tag.tags.genre;
                dato["artista"] = tag.tags.artist;
                dato["album"] = $("#nombreAlbum").val();
                dato["com"] = tag.tags.comment;
                dato["usuario"] = user;

                $.each(dato, function (key, value) {
                    if (value == "" || value == undefined) {
                        dato[key] = "Desconocido";
                    }
                });

                lista.push(JSON.stringify(dato));

                if (num == archivos.length - 1) {
                    data.append("datos", JSON.stringify(lista));
                    $.ajax({
                        url: '/Api/cancion',
                        processData: false,
                        contentType: false,
                        data: data,
                        type: 'POST'
                    }).done(function (result) {
                        alert(result);
                        mostrarCancion("subirAlbum");
                        lista();
                    }).fail(function (a, b, c) {
                        console.log(a, b, c);
                        mostrarCancion("SubirAlbum");
                    });
                }

                num++;
            },
            onError: function (error) {
                console.log(error);
            }
        });      
    };    
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

    mensaje("Agregando Playlist","");

    $.ajax({
        url: '/Api/playlist',
        data: data,
        type: 'POST',
        processData: false,
        contentType: false
    }).done(function (result) {
        alert(result);
        mostrarCancion('crearPlaylist');
        quitarMensaje("");
        lista();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function reproducir(id) {
    var iframe = document.getElementById('reproductor');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    innerDoc.getElementById("audio-player").src = "temp/" + id + ".mp3";
    innerDoc.getElementById("etiqueta").innerHTML = datosCanciones[id]["artista"] + " - " + datosCanciones[id]["nombre"];
}

function busqueda() {
    var cajaBusqueda = document.getElementById("busquedaMusica").value.toLowerCase();
    var listaBusqueda = [];
    var num = 0;
    var num2 = 0;
    var existe;
    var nombre = "";
    var genero = "";
    var artista = "";
    var album = "";
    var id;
    $("#inicio").html("");

    mensaje("Realizando Busqueda");

    canciones.forEach(function (s) {
        existe = false;
        num2 = 0;
        listaBusqueda.forEach(function (s) {
            if (s.filename === listaBusqueda[num2]) {
                existe = true;
            }
            num2++;
        })
        
        nombre = datosCanciones[s.cancion]["nombre"].toLowerCase().indexOf(cajaBusqueda);
        genero = datosCanciones[s.cancion]["genero"].toLowerCase().indexOf(cajaBusqueda);
        artista = datosCanciones[s.cancion]["artista"].toLowerCase().indexOf(cajaBusqueda);
        album = datosCanciones[s.cancion]["album"].toLowerCase().indexOf(cajaBusqueda);

        if (existe == false && (nombre !== -1 || genero !== -1 || artista !== -1 || album !== -1)) {
            listaBusqueda[num] = s;
            num++;
            console.log(listaBusqueda[num]);
        }
    })

    var listaPlaylist = [];
    var user = pedirCampo("num_usuario");

    playlists.forEach(function (s) {
        num = 0;
        console.log(s);
        if (s["nombre"].toLowerCase().indexOf(cajaBusqueda) !== -1 && s.usuario != user) {
            listaPlaylist[num] = s;
            num++;
        }
    });
    console.log(listaPlaylist);

    $("#inicio").html("");

    listaBusqueda.forEach(function (cancion) {       
        $("#inicio").append(" <div class='row' id='" + datosCanciones[cancion.cancion]["nombre"] + "'><div class='col-xs-12'><div class='box'><div class='box-body table-responsive no-padding'><table class='table table-hove'><tr><th>Canción</th><th>Artista</th><th>Album</th><th>Género</th></tr><tr><td>" + datosCanciones[cancion.cancion]["nombre"] + "</td><td>" + datosCanciones[cancion.cancion]["artista"] + "</td><td>" + datosCanciones[cancion.cancion]["album"] + "</td><td>" + datosCanciones[cancion.cancion]["genero"] + "</td></tr><tr><button id='boton' class='btn btn-flat btn-success' onclick='uniraPlaylist(" + cancion.cancion + ")'>Agregar a la Playlist</button><button id='boton' class='btn btn-flat btn-success' onclick='agregarMiMusica(" + cancion.cancion + ")'>Agregar a mi musica</button></tr></table></div></div></div></div>");
    })

    var Id_usuario = pedirCampo("num_usuario");
    listaPlaylist.forEach(function (playlist) {
        $("#inicio").append(" <div class='row' id='" + playlists[playlist.numero]["numero"] + "'><div class='col-xs-12'><div class='box'><div class='box-body table-responsive no-padding'><table class='table table-hove'><tr><th>Playlist</th><th>Creador</th><th>Comentario</th></tr><tr><td>" + playlists[playlist.numero]["nombre"] + "</td><td>" + playlists[playlist.numero]["usuario"] + "</td><td>" + playlists[playlist.numero]["comentario"] + "</td></tr><tr><button id='boton' class='btn btn-flat btn-success' onclick='unirPlaylist(" + playlists[playlist.numero]["numero"] + "," + Id_usuario + ")'>Agregar a mis Playlists</button></tr></table></div></div></div></div>");
    })

    quitarMensaje("");
}

function pedirImagen(id, src) {
    document.getElementById(src).src = "temp/" + id + ".png";
}

function logout() {
    sessionStorage.clear();
    alert("Adiooos :3");
    document.location.href = "login.html";
}

function verificar() {
    if (sessionStorage == null || sessionStorage == "" || sessionStorage.length == 0) {
        document.location.href = "login.html";
    }
}

function miMusica(modo) {
    listaRandom = [];

    if (modo == "normal") {
        if ($("#random").length) {
            $("#random").prop("id", modo);
        }
    } else {
        if ($("#normal").length) {
            $("#normal").prop("id", "random");
        }
    }
    
    var id = pedirCampo("num_usuario");

    contA = -1;
    var cont = 0;
    reproductor = [];
    if(canciones != undefined){
        canciones.forEach(function (c) {
            if (c.user == id) {
                reproductor[cont] = c.cancion;
                cont++;
        }
        })
    }

    cont = 0;

    if(cancionesU != undefined){
        cancionesU.forEach(function (cU) {
            if (cU.usuario == id) {
                reproductor[cont] = cU.cancion;
                cont++;
            }
        })
    }

    contA = -1;

    nextC(modo);

    var iframe = document.getElementById('reproductor');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    innerDoc.getElementById("audio-player").addEventListener("ended", nextC, false)


    alert("Canciones del usuario cargadas al reproductor");
}

function mostrarMiMusica() {
    $("#inicio").html("");

    var id = pedirCampo("num_usuario");
    var lista = []

    if (canciones != undefined) {
        canciones.forEach(function (c) {
            console.log(c);
            if (c.user == id) {
                
                lista.push(c.cancion);
            }
        })
    }

    if (cancionesU != undefined) {
        cancionesU.forEach(function (cU) {
            if (cU.usuario == id) {
                lista.push(cU.cancion);
            }
        })
    }
    console.log(lista);
    lista.forEach(function (cancion) {
        $("#inicio").append(" <div class='row' id='" + datosCanciones[cancion]["nombre"] + "'><div class='col-xs-12'><div class='box'><div class='box-body table-responsive no-padding'><table class='table table-hove'><tr><th>Canción</th><th>Artista</th><th>Album</th><th>Género</th><th></th></tr><tr><td>" + datosCanciones[cancion]["nombre"] + "</td><td>" + datosCanciones[cancion]["artista"] + "</td><td>" + datosCanciones[cancion]["album"] + "</td><td>" + datosCanciones[cancion]["genero"] + "</td><td onclick='eliminarC(" + datosCanciones[cancion]["filename"] + ")'>Eliminar</td></tr></table></div></div></div></div>");
    })
}

function mostrarPlay(numero) {
    $("#inicio").html("");

    var id = pedirCampo("num_usuario");
    var lista = []

    var data = new FormData();
    data.append("op", "reproducir");
    data.append("id_playlist", numero);

    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        if (result == "") {
            alert("Playlist vacia");
        } else {
            var lista = result.split(">");

            var i=0;

            lista.forEach(function (c) {
                lista[i] = JSON.parse(c).cancion;
                i++;
            })

            console.log(lista);
            lista.forEach(function (cancion) {
                console.log(cancion);
                $("#inicio").append(" <div class='row' id='" + datosCanciones[cancion]["nombre"] + "'><div class='col-xs-12'><div class='box'><div class='box-body table-responsive no-padding'><table class='table table-hove'><tr><th>Canción</th><th>Artista</th><th>Album</th><th>Género</th><th></th></tr><tr><td>" + datosCanciones[cancion]["nombre"] + "</td><td>" + datosCanciones[cancion]["artista"] + "</td><td>" + datosCanciones[cancion]["album"] + "</td><td>" + datosCanciones[cancion]["genero"] + "</td><td onclick='eliminarCPlay(" + datosCanciones[cancion]["filename"] + ", " + numero + ")'>Eliminar</td></tr></table></div></div></div></div>");
            })
        }
    });

    
}

function nextC(id) {
    if(id=="normal"){
        contA++;
        if (contA == reproductor.length) {
            contA = 0;
            alert("la lista se reinicio porque llego a su final");
        };
        reproducir(reproductor[contA]);
    } else if (id == "random") {
        if (listaRandom.length == reproductor.length) {
            listaRandom = [];
        }

        var numero = 99;
        var max = reproductor.length - 1;
        var min = 0;
        var reproducida = false;
        
        do {
            numero = Math.floor(Math.random() * (max - min + 1) + min);
            reproducida = false;
            listaRandom.forEach(function (numero2) {
                if (numero == numero2) {
                    reproducida = true;
                }
            });
        } while (reproducida == true);

        listaRandom.push(numero);
        reproducir(reproductor[numero]);
    }
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
    data.append('cancion', objeto);
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

function unirPlaylist(id_playlist, id_usuario) {
    var data = new FormData();
    data.append("op", "unirAUsuario");
    data.append("id_playlist", id_playlist);
    data.append("id_usuario", id_usuario);

    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
       
    }).done(function (result) {
        alert(result);
        lista();
    });
}


function cargarPlaylist(id_playlist,modo) {
    if (modo == "normal") {
        if ($("#random").length) {
            $("#random").prop("id", modo);
        }
    } else {
        if ($("#normal").length) {
            $("#normal").prop("id", "random");
        }
    }

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
        if (result == "") {
            alert("Playlist vacia");
        }else{
            var lista = result.split(">");
            var cancionesP = [];
            reproductor = [];

            for (i = 0; i < lista.length; i++) {
                cancionesP[i] = JSON.parse(lista[i]);
                reproductor[i] = cancionesP[i].cancion;
            }

            contA = -1;
            nextC(modo);
        
            alert("playlists cargada al reproductor");
        }
    });
}

function subidaMasivaModificar() {
    if (metaNum == 0) {
        mostrarCancion("opcionMasiva");
        mostrarCancion("cancionMasiva");
    } else {
            var elemento = [];
            elemento.genero = document.getElementById("generoCancionM").value;
            elemento.cancion = document.getElementById("nombreCancionM").value;
            elemento.artista = document.getElementById("artistaCancionM").value;
            elemento.album = document.getElementById("albumCancionM").value;
            elemento.comentario = document.getElementById("comentarioCancionM").value;
            meta.push(elemento);
            mostrarCancion("cancionMasiva");
            mostrarCancion("cancionMasiva");
    }
    
    if (metaNum == archivosMeta.length) {
        mostrarCancion("cancionMasiva");
        mensaje("Subiendo las canciones");
        var archivos = $("#archivoAlbum").get(0).files;
        var data = new FormData;
        var listaC = [];
        var user = pedirCampo("num_usuario");
        data.append("op", "masiva");

        for (i = 0; i < archivosMeta.length; i++) {
            var dato = {};
            console.log(meta[i]);
            data.append("Files" + i, archivosMeta[i]);
            dato["genero"] = meta[i].genero;
            dato["nombre"] = meta[i].cancion;
            dato["artista"] = meta[i].artista;
            dato["album"] = meta[i].album;
            dato["com"] = meta[i].comentario;
            dato["usuario"] = user;

            $.each(dato, function (key, value) {
                if ((value == "" || value == undefined) && key != "usuario") {
                    dato[key] = "Desconocido";
                }
            });

            listaC.push(JSON.stringify(dato));

        };

        data.append("datos", JSON.stringify(listaC));

        $.ajax({
            url: '/Api/cancion',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST'
        }).done(function (result) {
            alert(result);
            quitarMensaje("");
            lista();
            meta = [];
            archivosMeta=[];
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            quitarMensaje("");
        });

    } else {
        var paso = archivosMeta[metaNum];
        mensaje("cargando datos", "");
        jsmediatags.read(paso, {
            onSuccess: function (tag) {
                quitarMensaje("true");
                document.getElementById("generoCancionM").value = tag.tags.genre;
                document.getElementById("nombreCancionM").value = tag.tags.title;
                document.getElementById("artistaCancionM").value = tag.tags.artist;
                document.getElementById("albumCancionM").value = tag.tags.album;
                document.getElementById("comentarioCancionM").value = tag.tags.comment;
            },
            onError: function (error) {
                console.log(error);
            }
        });
        metaNum++;
    }
}

function subidaMasiva() {
    mostrarCancion("opcionMasiva");
    mensaje("Subiendo Cancione","");
    var data = new FormData;
    var listaC = [];
    var num = 0;
    var user = pedirCampo("num_usuario");
    data.append("op", "album");

    for (i = 0; i < archivosMeta.length; i++) {

        data.append("Files" + i, archivosMeta[i]);

        jsmediatags.read(archivosMeta[i], {
            onSuccess: function (tag) {
                var dato = {};

                if (tag.tags.title == undefined || tag.tags.title == "") {
                    dato["nombre"] = archivosMeta[i].name;
                } else {
                    dato["nombre"] = tag.tags.title;
                }

                dato["genero"] = tag.tags.genre;
                dato["artista"] = tag.tags.artist;
                dato["album"] = tag.tags.album;
                dato["com"] = tag.tags.comment;
                dato["usuario"] = user;

                $.each(dato, function (key, value) {
                    if ((value == "" || value == undefined) && key != "usuario") {
                        dato[key] = "Desconocido";
                    }
                });

                listaC.push(JSON.stringify(dato));

                if (num == archivosMeta.length - 1) {
                    data.append("datos", JSON.stringify(listaC));
                    $.ajax({
                        url: '/Api/cancion',
                        processData: false,
                        contentType: false,
                        data: data,
                        type: 'POST'
                    }).done(function (result) {
                        alert("Canciones Subidas");
                        quitarMensaje("");
                        lista();
                    }).fail(function (a, b, c) {
                        console.log(a, b, c);
                        quitarMensaje("");
                    });
                }

                num++;
            },
            onError: function (error) {
                console.log(error);
            }
        });
    };
}

function eliminarC(numero) {
    var dataEC = new FormData;
    dataEC.append("numero", numero);
    dataEC.append("op", "eliminar");
    mensaje("eliminando cancion","")
    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: dataEC,
        type: 'POST'
    }).done(function (result) {
        quitarMensaje("");
        inicio();
        lista();

    }).fail(function (a, b, c) {
        console.log(a, b, c);
        quitarMensaje("");
    });
}

function eliminarCPlay(numero,play) {
    var dataEC = new FormData;
    dataEC.append("numeroC", numero);
    dataEC.append("numeroP", play);
    dataEC.append("op", "eliminarC");
    mensaje("eliminando cancion", "")
    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: dataEC,
        type: 'POST'
    }).done(function (result) {
        quitarMensaje("");
        inicio();
        lista();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
        quitarMensaje("");
    });
}


function eliminarPlay(numero) {
    var dataEC = new FormData;
    dataEC.append("numero", numero);
    dataEC.append("op", "eliminar");
    mensaje("eliminando playlist", "")
    $.ajax({
        url: '/Api/playlist',
        processData: false,
        contentType: false,
        data: dataEC,
        type: 'POST'
    }).done(function (result) {
        quitarMensaje("");
        lista();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
        quitarMensaje("");
    });
}

$(document).ready(function () {
    var campo = pedirCampo('nickname');
    document.getElementById("nick1").innerHTML = campo;
    document.getElementById("nick2").innerHTML = campo;
    document.getElementById("user1").innerHTML = pedirCampo('usuario');
    var inputTypeFile = document.getElementById("archivoCancion");   

    inputTypeFile.addEventListener("change", function (event) {
        var file = event.target.files[0];

        jsmediatags.read(file, {
            onSuccess: function (tag) {
                document.getElementById("generoCancion").value = tag.tags.genre;
                document.getElementById("nombreCancion").value = tag.tags.title;
                document.getElementById("artistaCancion").value = tag.tags.artist;
                document.getElementById("albumCancion").value = tag.tags.album;
                document.getElementById("comentarioCancion").value = tag.tags.comment;
            },
            onError: function (error) {
                console.log(error);
            }
        });
    }, false);

    document.getElementById("archivosMasivos").addEventListener("change", function (event) {
        archivosMeta = event.target.files;

        if ($('#modo').prop('checked')) {
            meta = [];
            archivosMeta = [];
        }        
    }, false);
    lista();
});