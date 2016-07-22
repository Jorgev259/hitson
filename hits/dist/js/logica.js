function mostrarCancion() {



    if (document.getElementById("gamer").style.display == "none") {
        document.getElementById("gamer").style.display = "block";
        document.getElementById("transparencia").style.display = "block";

    } else {
        document.getElementById("gamer").style.display = "none";
        document.getElementById("transparencia").style.display = "none";
    }

}