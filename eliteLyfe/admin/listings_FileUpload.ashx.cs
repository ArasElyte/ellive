using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace eliteLyfe
{
    /// <summary>
    /// Summary description for hn_FileUpload
    /// </summary>
    public class listings_FileUpload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";

            string dirFullPath = HttpContext.Current.Server.MapPath("~/uploads/temp/");
            string[] files;
            int numFiles;
            files = System.IO.Directory.GetFiles(dirFullPath);
            numFiles = files.Length;
            numFiles = numFiles + 1;
            Guid myGuid;

            // Create and display the value of two GUIDs.
            myGuid = Guid.NewGuid();

            string str_image = "";

            foreach (string s in context.Request.Files)
            {
                HttpPostedFile file = context.Request.Files[s];
                //  int fileSizeInBytes = file.ContentLength;
                string fileName = file.FileName;
                string fileExtension = file.ContentType;

                if (!string.IsNullOrEmpty(fileName))
                {
                    fileExtension = Path.GetExtension(fileName);
                    str_image = myGuid + fileExtension;
                    string pathToSave_100 = HttpContext.Current.Server.MapPath("~/uploads/temp/") + str_image;
                    file.SaveAs(pathToSave_100);
                }
            }
            context.Response.Write(str_image);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}