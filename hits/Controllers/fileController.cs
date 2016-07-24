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
    public class fileController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Post()
        {
            //Crea un objeto con lo enviado
            var Request = HttpContext.Current.Request;

            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("hitson");
            var collection = db.GetCollection<BsonDocument>("musica");

            int numero = unchecked((int)collection.Count(new BsonDocument()));
            
            var file = Request.Files[0];
            var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
            file.SaveAs(path + "/" + numero + ".mp3");

            hits.Models.musica.insertarCancion(numero, Request["nombre"], Request["genero"],Request["artista"],Request["album"],Request["com"],Convert.ToInt32(Request["rating"]),client,db);

            return Ok(true);

        }  
    }
}
