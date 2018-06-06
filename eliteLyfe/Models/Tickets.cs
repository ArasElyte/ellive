using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class Tickets
    {
        public List<Ticket> theTickets { get; set; }
    }

    public class Ticket
    {
        public int ticketid { get; set; }
        public string dateCreated { get; set; }
        public string createdBy { get; set; }
        public string ticketStatus { get; set; }
        public string ticketTitle { get; set; }
        public string ticketDescription { get; set; }
        public string ticketPriority { get; set; }
        public int ticketSequence { get; set; }
        public string dateModified { get; set; }
        public string modifiedBy { get; set; }
        public string dateCompleted { get; set; }
        public string assignedTo { get; set; }
        public string ticketPic { get; set; }
        public string dueDate { get; set; }
        public string ticketType { get; set; }
       
    }

    public class Comment
    {
        public int commentId { get; set; }
        public int ticketId { get; set; }
        public string createdBy { get; set; }
        public string dateCreated { get; set; }
        public string commentTitle { get; set; }
        public string commentDescription { get; set; }
    }
}