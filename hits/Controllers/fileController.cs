using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace hits_server.Controllers
{
    public class fileController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Post()
        {
            var Request = HttpContext.Current.Request;
            var file = Request.Files[0];
            var path = HttpContext.Current.Server.MapPath(string.Format("~/temp"));
            file.SaveAs(path + "/" + Request["num"] + ".mp3");
            return Ok(true);

        }  
    }
}
