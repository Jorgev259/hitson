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
    public class respuesta
    {
        private string respuesta2;

        public respuesta (){}

        public string _respuesta2 {  get {return respuesta2;} set {respuesta2=value;} }
        
    }
}