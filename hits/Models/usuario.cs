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

            if (dUser == 0)
            {
                byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_usuario + ".png");
                var id = bucket.UploadFromBytes(num_usuario.ToString(), file);
                File.Delete(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_usuario + ".png");

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
            else
            {
                respuesta = "Usuario ya existe";
            }

            return respuesta;
        }

        public static String login(String user,String pass,IMongoCollection<BsonDocument> collection)
        {
            var filter1 = Builders<BsonDocument>.Filter.Eq("usuario", user);
            var dUser = collection.Find(filter1).ToList();

            BsonDocument usuarioC = new BsonDocument();

            if (dUser.Count() == 0)
            {
                usuarioC.Add("estado", "Ese usuario no existe");
            }else
            {
                usuarioC = dUser[0];
                var id= usuarioC["usuario"];
                var passC = usuarioC["contraseña"];

                usuarioC.Remove("_id");
                usuarioC.Remove("length");
                usuarioC.Remove("uploadDate");

                if (pass == passC)
                {
                    usuarioC.Remove("contraseña");
                    usuarioC.Add("estado","Login exitoso");
                }
                else
                {
                    usuarioC.Add("estado", "Contraseña Incorrecta");
                }
            }

            return usuarioC.ToJson();
        }

        public static String imagen(String id, IGridFSBucket bucket)
        {
            var array = bucket.DownloadAsBytesByName(id);
            String foto = "data:audio/mp3;base64," + Convert.ToBase64String(array);

            return foto;
        }
    }
}