using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{

    public class Amenities
    {
        public List<Amenity> TheAmenities { get; set; }
    }

    public class Amenity
    {
        public int amenityId { get; set; }
        public string amenityType { get; set; }
        public string amenityTitle { get; set; }
        public string amenityDesc { get; set; }
        public string amenityClass { get; set; }
       
    }

    public class ListingAmenity
    {
        public int id { get; set; }
        public int listingId { get; set; }
        public int amenityId { get; set; }
    }

}