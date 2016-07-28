using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Web;
using System.Web.Http;

namespace hits_server.Controllers
{
    public class usuarioController : ApiController
    {
        [HttpPost]
        public String Post()
        {
            var Request = HttpContext.Current.Request;

            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("hitson");
            var collectionUsuarios = db.GetCollection<BsonDocument>("usuarios");
            var bucket = new GridFSBucket(db, new GridFSBucketOptions
            {
                BucketName = "perfiles",
                ChunkSizeBytes = 1048576,
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary,
            });

            switch (Request["op"]) {
                case "agregar":
                    int numero = unchecked((int)collectionUsuarios.Count(new BsonDocument()));

                    var file = Request.Files[0];
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    file.SaveAs(path + "/" + numero + ".jpg");

                    var valor = hits.Models.usuario.insertarUsuario(numero, Request["user"], Request["pass"], Request["nick"], Request["email"], client, db, collectionUsuarios, bucket);

                    return valor;
                    break;

                case "login":
                    var usuarioSend =hits.Models.usuario.login(Request["user"],Request["pass"],collectionUsuarios);

                    return usuarioSend;
                    break;

                case "busqueda":
                    var listaCanciones = hits.Models.cancion.listaCanciones(collectionUsuarios);
                    var enviar = String.Join(">", listaCanciones.ToArray());
                    return enviar;
                    break;
                
                default:
                    return "opa";
                    break;
            }

        }  
    }
}
