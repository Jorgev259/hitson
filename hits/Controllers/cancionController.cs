using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Web;
using System.Web.Http;

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
            var collectionCanciones = db.GetCollection<BsonDocument>("canciones.files");
            var bucket = new GridFSBucket(db, new GridFSBucketOptions
            {
                BucketName = "canciones",
                ChunkSizeBytes = 1048576,
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary,
            });

            switch (Request["op"]) {
                case "agregar":
                    int numero = unchecked((int)collectionCanciones.Count(new BsonDocument()));

                    var file = Request.Files[0];
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    file.SaveAs(path + "/" + numero + ".mp3");

                    var valor = hits.Models.cancion.insertarCancion(numero, Request["nombre"], Request["genero"], Request["artista"], Request["album"], Request["com"], Request["usuario"], client, db, collectionCanciones, bucket);

                    return valor;
                    break;

                case "play":
                    var cancionSend =hits.Models.cancion.reproducir(Convert.ToInt32(Request["id"]), client, db, collectionCanciones, bucket);

                    return cancionSend;
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
                
                default:
                    return "opa";
                    break;
            }

        }  
    }
}
