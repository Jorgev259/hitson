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

    data.append('Files', Files[0]);
    data.append('nombre', nombre);
    data.append('genero', genero);
    data.append('artista', artista);
    data.append('album', album);
    data.append('com', com);
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
        url: 'http://localhost:4684/api/Cliente',
        type: 'POST',
        processData: false,
        contentType: false,
        data: data,
        success: function (data, textStatus, xhr) {
            for (var ele in data) {
                var algo = data[ele]._id;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr);
        }
    });

}
