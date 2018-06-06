using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class ListingMessages
    {
        public List<ListingMessages> theMessages { get; set; }
    }

    public class FormRequests
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string travelTo { get; set; }
        public string monthToGo { get; set; }
        public string budget { get; set; }
        public string occasion { get; set; }
        public string createdOn { get; set; }
        public string status { get; set; }
        public string submissionPage { get; set; }
    }

    public class ListingMessage
    {
        public int messageId { get; set; }
        public string messageType { get; set; }
        public string messageTitle { get; set; }
        public string messageBody { get; set; }
        public string messageStatus { get; set; }
        public string createdOn { get; set; }
        public string createdBy { get; set; }
        public string replyOn { get; set; }
        public string replyBy { get; set; }
        public string notes { get; set; }
        public int listingId { get; set; }
      

    }

}