using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;


namespace hits.Models
{
    public class cancion
    {
        private int num_cancion ;
        private string nombre ;
        private string genero ;
        private string artista ;
        private string album ;
        private string comentario ;
        private int rating ;
        private int usuario;

        cancion(){}

        public int _num_cancion {  get {return num_cancion;} set {num_cancion=value;} }
        public string _nombre {  get {return nombre;} set {nombre=value;} }
        public string _genero {  get {return genero;} set {genero=value;} }
        public string _artista {  get {return artista;} set {artista=value;} }
        public string _album {  get {return album;} set {album=value;} }
        public string _comentario {  get {return comentario;} set {comentario=value;} }
        public int _rating {  get {return rating;} set {rating=value;} }
        public int _usario { get { return usuario; } set { usuario = value; } }

        public static String insertarCancion(int num_cancion, string nombre, string genero, string artista, string album, string comentario, string usuario, MongoClient client, IMongoDatabase db, IMongoCollection<BsonDocument> collection) {

            byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");

            var filter = new BsonDocument();
            var cursor = collection.Find(filter).ToList();

            num_cancion = Convert.ToInt32(cursor[num_cancion - 1]["filename"]) + 1;


            var documento = new BsonDocument
            {
                { "filename", num_cancion },
                {"nombre",nombre },
                { "genero", genero },
                { "artista", artista },
                { "album", album },
                { "comentario", comentario },
                { "rating", 0 },
                { "usuario", usuario }
            };

            collection.InsertOne(documento);

            //File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");


            return "Subida Completada";
        }

        public static String agregarCancionUsuario(string usuario,string cancion, IMongoDatabase db)
        {
            var collection = db.GetCollection<BsonDocument>("canciones.usuario");

            var cancionUsuario = new BsonDocument
                {
                    {"cancion", cancion },
                    {"usuario", usuario},
                };

            collection.InsertOne(cancionUsuario);

            return "Cancion agregada a Mi Musica";
        }

        public static List<String> listaCanciones(IMongoCollection<BsonDocument> coleccion)
        {
            var filtro = new BsonDocument();
            var lista = coleccion.Find(filtro).ToList();

            var objeto = new BsonDocument
            {
            };

            List<String> canciones = new List<string>();
            foreach (var elemento in lista)
            {
                objeto = new BsonDocument { };
                var id_c = elemento["filename"];
                var id_user = elemento["usuario"];

                objeto.Add("cancion", id_c);
                objeto.Add("user", id_user);

                canciones.Add(objeto.ToJson());
            }
            return canciones;
        }

        public static List<String> listaCanciones2(IMongoDatabase db)
        {
            var coleccion = db.GetCollection<BsonDocument>("canciones.usuario");

            var filtro = new BsonDocument();
            var lista = coleccion.Find(filtro).ToList();

            List<String> canciones = new List<string>();

            var objeto = new BsonDocument { };

            for (int i = 0; i < lista.Count(); i++)
            {
                objeto = new BsonDocument { };
                var id_c = lista[i]["cancion"];
                var id_user = lista[i]["usuario"];

                objeto.Add("cancion", id_c);
                objeto.Add("user", id_user);

                canciones.Add(objeto.ToJson());
            }

            return canciones;
        }

        public static List<String> datoCancion(IMongoCollection<BsonDocument> coleccion, List<String> listaId)
        {
            var filtro = new BsonDocument();
            var lista = coleccion.Find(filtro).ToList();

            List<String> datoscanciones = new List<string>();

            foreach (var id in listaId)
            {
                foreach (var cancion in lista)
                {
                    if (cancion["filename"].ToString() == id)
                    {
                        cancion.Remove("_id");

                        datoscanciones.Add(cancion.ToJson());
                    } 
                }
            }

            return datoscanciones;
        }

        public static string eliminarCancion(string numero, IMongoDatabase db)
        {
            File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + numero + ".mp3");

            var filter = Builders<BsonDocument>.Filter.Eq("filename", Convert.ToInt32(numero));
            db.GetCollection<BsonDocument>("canciones").DeleteMany(filter);
            filter = Builders<BsonDocument>.Filter.Eq("cancion", Convert.ToInt32(numero));
            db.GetCollection<BsonDocument>("playlist.cancion").DeleteMany(filter);
            db.GetCollection<BsonDocument>("cancion.usuario").DeleteMany(filter);

            return "";
        }
    }
}