using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace hits_server.Controllers
{
    public class cancionController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Post()
        {
            var Request = HttpContext.Current.Request;

            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("hitson");
            var collection = db.GetCollection<BsonDocument>("musica");

            switch (Request["op"]) {
                case "agregar":
                    int numero = unchecked((int)collection.Count(new BsonDocument()));

                    var file = Request.Files[0];
                    var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
                    file.SaveAs(path + "/" + numero + ".mp3");

                    hits.Models.cancion.insertarCancion(numero, Request["nombre"], Request["genero"], Request["artista"], Request["album"], Request["com"], client, db);

                    return Ok(true);
                    break;

                case "play":

                    break;

                default:
                    return Ok(true);
                    break;
            }

        }  
    }
}
