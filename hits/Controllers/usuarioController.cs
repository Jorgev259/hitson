using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.IO;
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
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    int numero = unchecked((int)collectionUsuarios.Count(new BsonDocument()));

                    if (Request["foto"] == "vacio")
                    {
                        File.Copy(path + "/default.png", path + "/" + numero + ".png");
                    }
                    else
                    {
                        var file = Request.Files[0];
                        
                        file.SaveAs(path + "/" + numero + ".png");
                    }

                    var valor = hits.Models.usuario.insertarUsuario(numero, Request["user"], Request["pass"], Request["nick"], Request["email"], client, db, collectionUsuarios, bucket);

                    return valor;
                    break;

                case "login":
                    var usuarioSend =hits.Models.usuario.login(Request["user"],Request["pass"],collectionUsuarios);

                    return usuarioSend;
                    break;
                
                default:
                    return "opa";
                    break;
            }

        }  
    }
}
