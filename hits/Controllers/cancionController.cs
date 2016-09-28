using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Web;
using System.Web.Http;
using System.Linq;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

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

                case "album":
                    int i = 0;
                    int numero2 = unchecked((int)collectionCanciones.Count(new BsonDocument()));

                    JavaScriptSerializer serializer = new JavaScriptSerializer();
                    var datos = JsonConvert.DeserializeObject<string[]>(Request["datos"]);

                    foreach (var dato in datos)
                    {
                        var dato2 = JsonConvert.DeserializeObject<dynamic>(dato);

                        var archivo = Request.Files[i];
                        file = archivo;
                        path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                        file.SaveAs(path + "/" + numero2 + ".mp3");

                        var respuesta = hits.Models.cancion.insertarCancion(numero2,Convert.ToString(dato2["nombre"]), Convert.ToString(dato2["genero"]), Convert.ToString(dato2["artista"]), Convert.ToString(dato2["album"]), Convert.ToString(dato2["com"]), Convert.ToString(dato2["usuario"]),client,db,collectionCanciones);
                        numero2++;
                        i++;
                    }

                    return "Album subido";
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

                case "masiva":
                    i = 0;
                    numero2 = unchecked((int)collectionCanciones.Count(new BsonDocument()));

                    serializer = new JavaScriptSerializer();
                    datos = JsonConvert.DeserializeObject<string[]>(Request["datos"]);

                    foreach (var dato in datos)
                    {
                        var dato2 = JsonConvert.DeserializeObject<dynamic>(dato);

                        var archivo = Request.Files[i];
                        file = archivo;
                        path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                        file.SaveAs(path + "/" + numero2 + ".mp3");

                        var respuesta = hits.Models.cancion.insertarCancion(numero2, Convert.ToString(dato2["nombre"]), Convert.ToString(dato2["genero"]), Convert.ToString(dato2["artista"]), Convert.ToString(dato2["album"]), Convert.ToString(dato2["com"]), Convert.ToString(dato2["usuario"]), client, db, collectionCanciones);
                        numero2++;
                        i++;
                    }

                    return "Canciones subidas";
                    break;

                case "eliminar":
                    var respuesta3 = hits.Models.cancion.eliminarCancion(Request["numero"],db);
                    return "";
                    break;
                default:
                    return "opa";
                    break;
            }

        }  
    }
}
