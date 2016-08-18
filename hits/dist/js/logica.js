var canciones;
var cancionesU;
var numPlay;
var reproductor;
var contA = -1;
var playlists;
var url = "localhost:1657/temp/";

function lista() {
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
            console.log(result);
            cancionesU = result.split(">");
            if (cancionesU[0] = "") {
                console.log(cancionesU);
                for (i = 0; i < cancionesU.length; i++) {
                    cancionesU[i] = JSON.parse(cancionesU[i]);
                }
            }
            alert("base de datos de canciones actualizada");
            miMusica();
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

function ocultarBusqueda(){
    if ($("#listaMusica").css("display") == "block") {
        $("#listaMusica").css("display", "none");
        $("#transparencia").css("display", "none");
    }
};

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
        $("#sidebarPlaylist").append("<li><a href='#'><i class='fa fa-link'></i><span>" + nombre + "</span></a></li>");
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
    lista();
}

function reproducir(id) {
    document.getElementById("player").src = url + id + ".mp3"
}

function busqueda() {
    var cajaBusqueda = document.getElementById("busquedaMusica").value;
    var listaBusqueda = [];
    var num = 0;
    var num2 = 0;
    var existe;
    $("#listaMusica").html("");

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

    playlists.forEach(function(s) {
        num = 0;

        if (s.nombre.indexOf(cajaBusqueda) !== -1) {
            listaBusqueda[num] = s;
            num++;
        }
    })

    document.getElementById("transparencia").style.display = "block";
    document.getElementById("listaMusica").style.display = "block";
    //limpiar y poner nueva vista
    listaBusqueda.forEach(function (cancion) {
        //agregar nuevo elemento dentro de un div
        $("#listaMusica").append("<div id=" + cancion.filename +" onclick='agregarMiMusica(this)'>Nombre: " + cancion.nombre + "</div><button onclick='uniraPlaylist(" + cancion.filename + ")'>Playlist</button><br>");
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
    $("#listaMusica").html("");

    playlists.forEach(function (playl) {
        if (playl.usuario == pedirCampo("num_usuario")) {
            $("#listaMusica").append("<div onclick='uniraPlaylist2(" + id_cancion + "," + playl.numero + ")'>" + playl.nombre + "</div>")
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

    (function ($) {
        "use strict";
        var dlxPlayer = {
            DOM: function () {
                //Song Details
                this.songTitle = $("#dlxPlayer_song_title");
                this.songAlbum = $("#dlxPlayer_song_album");
                this.songArtist = $("#dlxPlayer_song_artist");
                //Controls
                this.playerPlay = $("#dlxPlayer_play");
                this.playerPause = $("#dlxPlayer_pause");
                this.playerVol = $("#dlxPlayer_volume");
                this.playerVolMuted = $("#dlxPlayer_volume_off");
                this.playerSeeker = $("#dlxPlayer_seeker");
                this.playerAudio = $("#dlxPlayer_audio");
            },
            events: function () {
                this.playerPlay.on("click", this.playBtn.bind(this));
                this.playerPause.on("click", this.pauseBtn.bind(this));
                this.playerVol.on("click", this.muteBtn.bind(this));
                this.playerVolMuted.on("click", this.muteBtn.bind(this));
                this.playerAudio.on("ended", this.songEnded.bind(this));
                this.playerAudio.on("timeupdate", this.progessPos.bind(this));
            },
            init: function () {
                this.DOM();
                this.events();
            },
            playBtn: function () {
                this.playerPlay.hide();
                this.playerPause.show();
                this.playerAudio.trigger("play");
            },
            pauseBtn: function () {
                this.playerPause.hide();
                this.playerPlay.show();
                this.playerAudio.trigger("pause");
            },
            muteBtn: function () {
                var isMuted = this.playerAudio.prop("muted");
                if (isMuted === true) {
                    this.playerAudio.prop("muted", false);
                    this.playerVolMuted.hide();
                    this.playerVol.show();
                } else {
                    this.playerAudio.prop("muted", true);
                    this.playerVol.hide();
                    this.playerVolMuted.show();
                }
            },
            songEnded: function () {
                //    console.log("song ended");
                this.playerAudio.trigger("pause");
                this.playerPause.hide();
                this.playerAudio.trigger("currentTime", 0);
                this.playerPlay.show();
            },
            progessPos: function (audio) {
                audio = audio.currentTarget;
                var dur = audio.duration,
                    curTime = audio.currentTime,
                    seekerPos = (curTime / dur) * 100;
                this.playerSeeker.css("right", (100 - seekerPos) + "%");
            }
        };

        dlxPlayer.init();
    }(jQuery));
});