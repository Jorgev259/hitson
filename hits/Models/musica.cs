using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Interno.Models
{
    public class musica
    {
        private int num_cancion ;
        private string nombre ;
        private string genero ;
        private string artista ;
        private string album ;
        private string comentario ;
        private int rating ;

        musica(){}

        public int _num_cancion {  get {return num_cancion;} set {num_cancion=value;} }
        public string _nombre {  get {return nombre;} set {nombre=value;} }
        public string _genero {  get {return genero;} set {genero=value;} }
        public string _artista {  get {return artista;} set {artista=value;} }
        public string _album {  get {return album;} set {album=value;} }
        public string _comentario {  get {return comentario;} set {comentario=value;} }
        public int _rating {  get {return rating;} set {rating=value;} }

        public static int insertarCancion(int num_cancion,string nombre,string genero,string artista,string album,string comentario,int rating){
            int respuesta = 0;
            
            //var server = MongoServer.Create("mongodb://localhost:27017");
            var client = new MongoClient("mongodb://localhost:27017");
            var db = client.GetDatabase("hitson");

            var collection = db.GetCollection<BsonDocument>("musica");

            var document = new BsonDocument
            {
                { "num_cancion", num_cancion },
                {"nombre",nombre},
                {"genero",genero},
                {"artista",artista},
                {"album",album},
                {"comentario",comentario},
                {"rating",rating},
            };

            collection.InsertOne(document);

            respuesta = 1;
            return respuesta;
        }
    }
}