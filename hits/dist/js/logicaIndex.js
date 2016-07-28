function registro() {
    if ($("#password").val() == $("#password2").val()) {
        var data = new FormData();
        var user = $("#user").val();
        var pass = $("#password").val();
        var nick = $("#nickname").val();
        var email = $("#email").val();
        var foto = $("#perfil").get(0).files;

        data.append('user', user);
        data.append('pass', pass);
        data.append('nick', nick);
        data.append('email', email);
        data.append('foto', foto[0]);
        data.append('op', 'agregar');

        $.ajax({
            url: '/Api/usuario',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST'
        }).done(function (result) {
            alert(result);
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
    } else {
        alert("Contraseñas no concuerdan");
    }
};

function login() {
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
            window.location = "localhost:1657/index.html";
            console.log(sessionStorage.datosUsuario);
            document.location.href = "index.html";
        } else {
            alert(usuario.estado);
        }

    }).fail(function (a, b, c) {
        console.log(a, b, c);
    });
};