using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class AuditRecord
    {
        public int id { get; set; }
        public string user { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string datecreated { get; set; }
    }
}