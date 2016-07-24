﻿function mostrarCancion() {



    if (document.getElementById("gamer").style.display == "none") {
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
    var num = document.getElementById('numeroCancion').value;
    var nombre = document.getElementById('nombreCancion').value;
    var genero = document.getElementById('generoCancion').value;
    var album = document.getElementById('albumCancion').value;
    var rating = document.getElementById('ratingCancion').value;
    var artista = document.getElementById('artistaCancion').value;
    var com = document.getElementById('comentarioCancion').value;

    data.append('Files', Files[0]);
    data.append('num', num);
    data.append('nombre', nombre);
    data.append('genero', genero);
    data.append('artista', artista);
    data.append('rating', rating);
    data.append('album', album);
    data.append('com', com);

    $.ajax({
        url: '/Api/file',
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