using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace hits.Models
{
    public class playlist
    {
        playlist() { }

        public static String agregarPlaylist(string nombre, string comentario, string usuario, IMongoCollection<BsonDocument> coleccion)
        {
            var numero = coleccion.Count(new BsonDocument());

            var playlist = new BsonDocument
                {
                    {"numero", numero.ToString() },
                    {"nombre", nombre},
                    {"comentario",comentario },
                    {"usuario", usuario }
                };

            coleccion.InsertOne(playlist);

            return "Playlist Creada";
        }

        public static List<String> listaPlaylist(IMongoCollection<BsonDocument> coleccion)
        {
            var filtro = new BsonDocument();
            var lista = coleccion.Find(filtro).ToList();

            List<String> canciones = new List<string>();

            for (int i = 0; i < lista.Count(); i++)
            {
                lista[i].Remove("_id");
                canciones.Add(lista[i].ToJson());
            }

            return canciones;
        }

        public static String unirCancion(string id_cancion, string id_playlist, IMongoCollection<BsonDocument> coleccion)
        {

            var playlist = new BsonDocument
                {
                    {"cancion", id_cancion.ToString() },
                    {"playlist", id_playlist.ToString()},
                };

            coleccion.InsertOne(playlist);

            return "Se agrego la cancion " + id_cancion + " a la playlist " + id_playlist;
        }

        public static List<String> reproPlaylist(string id_playlist, IMongoCollection<BsonDocument> coleccion)
        {
            var filtro = Builders<BsonDocument>.Filter.Eq("playlist", id_playlist);
            var lista = coleccion.Find(filtro).ToList();

            List<String> canciones = new List<string>();

            for (int i = 0; i < lista.Count(); i++)
            {
                lista[i].Remove("_id");
                canciones.Add(lista[i].ToJson());
            }

            return canciones;
        }
    }
}