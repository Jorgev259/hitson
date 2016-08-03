using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
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

        public static String insertarCancion(int num_cancion, string nombre, string genero, string artista, string album, string comentario, string usuario, MongoClient client, IMongoDatabase db, IMongoCollection<BsonDocument> collection, GridFSBucket bucket) {

            //var server = MongoServer.Create("mongodb://localhost:27017");

            var numero = collection.Count(new BsonDocument());

            byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");
            var id = bucket.UploadFromBytes(num_cancion.ToString(), file);

            var filter = Builders<BsonDocument>.Filter.Eq("filename", num_cancion.ToString());
            var update = Builders<BsonDocument>.Update.Set("nombre", nombre).Set("genero", genero).Set("artista", artista).Set("album", album).Set("comentario", comentario).Set("rating", 0).Set("usuario",usuario);

            var update2 = collection.UpdateOne(filter, update);

            File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");


            return "Subida Completada";
        }

        public static String reproducir(int id, MongoClient client, IMongoDatabase db, IMongoCollection<BsonDocument> collection, GridFSBucket bucket)
        {
            var array = bucket.DownloadAsBytesByName(id.ToString());
            String cancion = "data:audio/mp3;base64," + Convert.ToBase64String(array);

            //var documento = new BsonDocument();
            //documento.Add("cancion", cancion);

            //var final = documento.ToJson();

            return cancion;
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

            List<String> canciones = new List<string>();
            var cuenta = lista.Count();

            canciones.Add(cuenta.ToString());

            for(int i = 0; i < lista.Count();i++)
            {
                lista[i].Remove("_id");
                lista[i].Remove("length");
                lista[i].Remove("uploadDate");
                canciones.Add(lista[i].ToJson());
            }
              
            return canciones;
        }

        public static List<String> listaCanciones2(IMongoDatabase db)
        {
            var coleccion = db.GetCollection<BsonDocument>("canciones.usuario");

            var filtro = new BsonDocument();
            var lista = coleccion.Find(filtro).ToList();

            List<String> canciones = new List<string>();
            var cuenta = lista.Count();

            canciones.Add(cuenta.ToString());

            for (int i = 0; i < lista.Count(); i++)
            {
                lista[i].Remove("_id");
                canciones.Add(lista[i].ToJson());
            }

            return canciones;
        }
    }
}