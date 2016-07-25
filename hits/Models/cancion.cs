using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

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

        cancion(){}

        public int _num_cancion {  get {return num_cancion;} set {num_cancion=value;} }
        public string _nombre {  get {return nombre;} set {nombre=value;} }
        public string _genero {  get {return genero;} set {genero=value;} }
        public string _artista {  get {return artista;} set {artista=value;} }
        public string _album {  get {return album;} set {album=value;} }
        public string _comentario {  get {return comentario;} set {comentario=value;} }
        public int _rating {  get {return rating;} set {rating=value;} }

        public static int insertarCancion(int num_cancion,string nombre,string genero,string artista,string album,string comentario,MongoClient client,IMongoDatabase db){
            int respuesta = 0;
            
            //var server = MongoServer.Create("mongodb://localhost:27017");
            var collection = db.GetCollection<BsonDocument>("canciones.files");

            var numero = collection.Count(new BsonDocument());

            var bucket = new GridFSBucket(db, new GridFSBucketOptions
            {
                BucketName = "canciones",
                ChunkSizeBytes = 1048576,
                WriteConcern = WriteConcern.WMajority,
                ReadPreference = ReadPreference.Secondary,
            });

            byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");
            var id = bucket.UploadFromBytes(num_cancion.ToString(), file);

            var filter = Builders<BsonDocument>.Filter.Eq("filename", num_cancion.ToString());
            var update = Builders<BsonDocument>.Update.Set("nombre", nombre).Set("genero",genero).Set("artista",artista).Set("album",album).Set("comentario",comentario).Set("rating", 0);

            var update2 = collection.UpdateOne(filter, update);

            File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_cancion + ".mp3");

            respuesta = 1;
            return respuesta;
        }

    }
}