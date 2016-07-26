using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;

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
            var collection = db.GetCollection<BsonDocument>("canciones.files");
            var bucket = new GridFSBucket(db, new GridFSBucketOptions
            {
                BucketName = "canciones",
                ChunkSizeBytes = 1048576,
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary,
            });

            switch (Request["op"]) {
                case "agregar":
                    int numero = unchecked((int)collection.Count(new BsonDocument()));

                    var file = Request.Files[0];
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    file.SaveAs(path + "/" + numero + ".mp3");

                    var valor = hits.Models.cancion.insertarCancion(numero, Request["nombre"], Request["genero"], Request["artista"], Request["album"], Request["com"], client, db);

                    return valor;
                    break;

                case "play":
                    var array = bucket.DownloadAsBytesByName(Request["id"]);
                    String cancion = "data:audio/mp3;base64," + Convert.ToBase64String(array);
                    var cancionSend = new JavaScriptSerializer().Serialize(hits.Models.cancion.reproducir(Convert.ToInt32(Request["id"])));
                    
                    return cancionSend;
                    break;

                default:
                    return "opa";
                    break;
            }

        }  
    }
}
