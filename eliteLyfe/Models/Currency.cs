using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class Currency
    {
        public int currencyId { get; set; }
        public string currencyCode { get; set; }
        public string currencyTitle { get; set; }
        public Double currencyAmount { get; set; }
        public String lastUpdate { get; set; }

    }
}