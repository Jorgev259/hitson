using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Helpers;
using System.Web.Script.Serialization;

namespace hits.Models
{
    public class usuario
    {
        private int num_usuario ;
        private string Nusuario ;
        private string contraseña ;
        private string nick ;
        private string email ;

        usuario(){}

        public int _num_usuario {  get {return num_usuario;} set {num_usuario=value;} }
        public string _Nusuario {  get {return Nusuario;} set {Nusuario=value;} }
        public string _contraseña {  get {return contraseña;} set {contraseña=value;} }
        public string _nick {  get {return nick;} set {nick=value;} }
        public string _email {  get {return email;} set {email=value;} }

        public static String insertarUsuario(int num_usuario, string usuario, string contraseña, string nick, string email, MongoClient client, IMongoDatabase db, IMongoCollection<BsonDocument> collection, GridFSBucket bucket) {
            var numero = collection.Count(new BsonDocument());
            var respuesta = "Registrado";

            var filter1 = Builders<BsonDocument>.Filter.Eq("usuario", usuario);
            var dUser = collection.Find(filter1).ToList().Count();

            var filter2 = Builders<BsonDocument>.Filter.Eq("nickname", nick);
            var dNick = collection.Find(filter2).ToList().Count();

            if (dUser == 0 && dNick == 0)
            {
                byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_usuario + ".jpg");
                var id = bucket.UploadFromBytes(num_usuario.ToString(), file);
                File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_usuario + ".jpg");

                var UploadUser = new BsonDocument
                {
                    {"num_usuario", num_usuario },
                    {"usuario", usuario},
                    {"contraseña", contraseña },
                    {"nickname", nick },
                    {"email", email }
                };

                collection.InsertOne(UploadUser);
                respuesta = "Registrado Completo";
            }
            else if(dUser > 0)
            {
                respuesta = "Usuario ya existe";
            }else
            {
                respuesta = "Nickname ya utilizado";
            }

            return respuesta;
        }

        public static String reproducir(int id, MongoClient client, IMongoDatabase db, IMongoCollection<BsonDocument> collection, GridFSBucket bucket)
        {
            var array = bucket.DownloadAsBytesByName(id.ToString());
            String cancion = "data:audio/mp3;base64," + Convert.ToBase64String(array);

            var filter = Builders<BsonDocument>.Filter.Eq("filename", id.ToString());
            var documento = collection.Find(filter).ToList()[0].ToBsonDocument();
            documento.Remove("_id");
            documento.Remove("length");
            documento.Remove("uploadDate");
            documento.Add("cancion", cancion);

            var final = documento.ToJson();

            return final;
        }

        public static List<String> listaCanciones(IMongoCollection<BsonDocument> coleccion)
        {
            BsonDocument place = new BsonDocument();
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
    }
}