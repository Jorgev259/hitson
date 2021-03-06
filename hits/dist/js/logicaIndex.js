﻿function mensaje(text1, text2) {
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

function registro() {
    mensaje("Registrando", "Por favor espere");
    if ($("#password").val() == $("#password2").val()) {
        var data = new FormData();
        var user = $("#user").val();
        var pass = $("#password").val();
        var nick = $("#nickname").val();
        var email = $("#email").val();

        if (document.getElementById("perfil").files[0] == undefined) {
            foto = "vacio";
        } else {
            foto = $("#perfil").get(0).files[0];
        }

        data.append('user', user);
        data.append('pass', pass);
        data.append('nick', nick);
        data.append('email', email);
        data.append('foto', foto);
        data.append('op', 'agregar');

        $.ajax({
            url: '/Api/usuario',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST'
        }).done(function (result) {
            alert(result);
            document.location.href = "login.html";
            quitarMensaje();
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            quitarMensaje();
        });
    } else {
        alert("Contraseñas no concuerdan");
        quitarMensaje();
    }
};


function login() {
    mensaje("logeando","");
    var data = new FormData();
    var user = $("#user").val();
    var pass = $("#pass").val();

    data.append('user', user);
    data.append('pass', pass);
    data.append('op', 'login');

    $.ajax({
        url: '/Api/usuario',
        processData: false,
        contentType: false,
        data: data,
        type: 'POST'
    }).done(function (result) {
        var usuario = JSON.parse(result);
        if (usuario.estado == "Login exitoso") {
            console.log(usuario.estado);
            sessionStorage.datosUsuario = JSON.stringify(usuario);
            console.log(sessionStorage.datosUsuario);
            document.location.href = "index.html";
            quitarMensaje("");
        } else {
            quitarMensaje("");
            alert(usuario.estado);
        }

    }).fail(function (a, b, c) {
        quitarMensaje("");
        console.log(a, b, c);
    });
};

$(document).ready(function () {
    if (sessionStorage.datosUsuario != undefined) {
        document.location.href = "index.html";
    }
})