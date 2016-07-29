using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
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
                byte[] file = File.ReadAllBytes(AppDomain.CurrentDomain.BaseDirectory + "temp\\" + num_usuario + ".png");

                var destRect = new Rectangle(0, 0,400, 400);
                var destImage = new Bitmap(400, 400);

                Bitmap image;
                using (var ms = new MemoryStream(file))
                {
                    image = new Bitmap(ms);
                }

                destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

                using (var graphics = Graphics.FromImage(destImage))
                {
                    graphics.CompositingMode = CompositingMode.SourceCopy;
                    graphics.CompositingQuality = CompositingQuality.HighQuality;
                    graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    graphics.SmoothingMode = SmoothingMode.HighQuality;
                    graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                    using (var wrapMode = new ImageAttributes())
                    {
                        wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                        graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                    }
                }

                ImageConverter convertidor = new ImageConverter();
                file = (byte[])convertidor.ConvertTo(destImage, typeof(byte[]));

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
            else if(dUser > 0)
            {
                respuesta = "Usuario ya existe";
            }else
            {
                respuesta = "Nickname ya utilizado";
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
            String foto = "data:image/png;base64," + Convert.ToBase64String(array);

            var document = new BsonDocument();
            document.Add("datoFoto", foto);

            var documentF = document.ToJson();

            return documentF;
        }
    }
}