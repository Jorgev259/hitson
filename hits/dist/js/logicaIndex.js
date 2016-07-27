function registro() {
    if ($("#password").val() == $("#password2").val()) {
        var data = new FormData();
        var user = $("#user").val();
        var pass = $("#password").val();
        var nick = $("#nickname").val();
        var email = $("#email").val();
        var foto = $("#perfil").get(0).files;

        data.append('user',user);
        data.append('pass',pass);
        data.append('nick',nick);
        data.append('email',email);
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
}