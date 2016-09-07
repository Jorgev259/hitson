using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Web;
using System.Web.Http;

namespace hits.Controllers
{
    public class playlistController : ApiController
    {
        [HttpPost]
        public string Post() {

            var client = new MongoClient("mongodb://localhost:27017");
            var coleccion = client.GetDatabase("hitson").GetCollection<BsonDocument>("playlists");
            var coleccion2 = client.GetDatabase("hitson").GetCollection<BsonDocument>("playlist.cancion");
            var Request = HttpContext.Current.Request;
            var respuesta = "";

            switch (Request["op"])
            {
                case "agregar":
                    respuesta = Models.playlist.agregarPlaylist(Request["nombre"], Request["com"], Request["usuario"], coleccion);
                    break;

                case "busqueda":
                    var listaCanciones = hits.Models.playlist.listaPlaylist(coleccion);
                    respuesta = String.Join(">", listaCanciones.ToArray());
                    break;

                case "unir":
                    respuesta = Models.playlist.unirCancion(Request["id_cancion"],Request["id_playlist"],coleccion2);
                    break;

                case "reproducir":
                    var lista = Models.playlist.reproPlaylist(Request["id_playlist"],coleccion2);
                    respuesta = String.Join(">", lista.ToArray());
                    break;
            }

            return respuesta;
        }
    }
}
