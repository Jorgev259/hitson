﻿var canciones;
var numCanciones;

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

    $.ajax({
        url: '/Api/cancion',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        var cancion = JSON.parse(result);
        document.getElementById("repro").src = cancion.cancion;
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function lista() {
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
        yolo();
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
}

function pedirImagen(id) {
    var respuesta;
    var data = new FormData();
    data.append('op', 'imagen');
    data.append('id', id);

    $.ajax({
        url: '/Api/usuario',
        processData: false,
        contentType: false,
        async:false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        var foto = JSON.parse(result);
        respuesta = foto.datoFoto;
    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });

    return respuesta;
}

function yolo() {
    for(i=0;i<numCanciones;i++){
        document.getElementById("prueba").innerHTML = document.getElementById("prueba").innerHTML + canciones[i].nombre + "<br>";
    }
}

function asignarImagen(id) {
    var objeto = JSON.parse(sessionStorage.datosUsuario);
    var imagen = pedirImagen(objeto.num_usuario);
    document.getElementById(id).src = imagen;
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
});