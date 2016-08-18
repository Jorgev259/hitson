using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Web;
using System.Web.Http;
using System.Linq;

namespace hits_server.Controllers
{
    public class cancionController : ApiController
    {
        [HttpPost]
        public String Post()
        {
            var Request = HttpContext.Current.Request;

            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("hitson");
            var collectionCanciones = db.GetCollection<BsonDocument>("canciones");

            switch (Request["op"]) {
                case "agregar":
                    int numero = unchecked((int)collectionCanciones.Count(new BsonDocument()));

                    var file = Request.Files[0];
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    file.SaveAs(path + "/" + numero + ".mp3");

                    var valor = hits.Models.cancion.insertarCancion(numero, Request["nombre"], Request["genero"], Request["artista"], Request["album"], Request["com"], Request["usuario"], client, db, collectionCanciones);

                    return valor;
                    break;


                case "busqueda":
                    var listaCanciones = hits.Models.cancion.listaCanciones(collectionCanciones);
                    var enviar = String.Join(">", listaCanciones.ToArray());
                    return enviar;
                    break;

                case "busqueda2":
                    var listaCanciones2 = hits.Models.cancion.listaCanciones2(db);
                    var enviar2 = String.Join(">", listaCanciones2.ToArray());
                    return enviar2;
                    break;

                case "agregarMiMusica":
                    var resp = hits.Models.cancion.agregarCancionUsuario(Request["id"], Request["cancion"], db);
                    return resp;
                    break;

                case "datos":
                    var lista1 = Request["lista"];
                    char[] corchetes = { '[', ']'};
                    lista1 = lista1.Trim(corchetes);

                    var lista2 = lista1.Split(',').ToList();

                    var datoscanciones = hits.Models.cancion.datoCancion(collectionCanciones,lista2);
                    var enviardatos = String.Join(">", datoscanciones.ToArray());

                    return enviardatos;
                    break;
                
                default:
                    return "opa";
                    break;
            }

        }  
    }
}
