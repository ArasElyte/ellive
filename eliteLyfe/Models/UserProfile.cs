using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class UserProfile
    {
        public string userName { get; set; }
        public string userType { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string emailAddress { get; set; }
        public string phoneNumber { get; set; }
        public string profileImage { get; set; }
    }
}