using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace eliteLyfe.Models
{
    public class Listings
    {
        public List<Listing> theListings { get; set; }
    }

    public class Listing
    {
        public int listingId { get; set; }
        public int unitId { get; set; }
        public int userId { get; set; }
        public int exernalId { get; set; }
        public string source { get; set; }
        public string listingType { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string city { get; set; }
        public string stateProv { get; set; }
        public string zipPostal { get; set; }
        public string country { get; set; }
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
        public string baseCurrency { get; set; }
        public decimal taxPercentage { get; set; }
        public string locale { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public double numBedrooms { get; set; }
        public double numBathrooms { get; set; }
        public int maxOccupancy { get; set; }
        public List<Rates> myRates { get; set; }
        public List<Fees> myFees { get; set; }
        public List<Pictures> myPictures { get; set; }
        public string displayImage { get; set; }
        public double displayRate { get; set; }
        public string listingNickname { get; set; }
        public string listingSqFt { get; set; }
        public string listingStatus { get; set; }
        public string listingView { get; set; }
        public string rateMin { get; set; }
        public string rateMax { get; set; }
        public string checkIn { get; set; }
        public string checkOut { get; set; }
        public string geoSubDivision { get; set; }
        public string destinationCategory { get; set; }
        public string serviceFee { get; set; }
        public int listingNumber { get; set; }
        public int geoSub1 { get; set; }
        public int geoSub2 { get; set; }
        public int geoSub3 { get; set; }
        public string featuredListing { get; set; }

        public string geoSubText1 { get; set; }
        public string geoSubText2 { get; set; }
        public string geoSubText3 { get; set; }
        public string listingTags { get; set; }


    }


    public class POI
    {
        public int poiId { get; set; }
        public int listingId { get; set; }
        public string poiTitle { get; set; }
    
    }

    public class Rates
    {
        public int rateId { get; set; }
        public int unitId { get; set; }
        public string rateType { get; set; }
        public double rateAmount { get; set; }

        public string startDate { get; set; }
        public string endDate { get; set; }
        public string maxStay { get; set; }
        public string minStay { get; set; }
        public string cancelDays { get; set; }
    }

    public class Fees
    {
        public int feeId { get; set; }
        public int unitId { get; set; }
        public string feeType { get; set; }
        public double feeAmount { get; set; }
    }

    public class Pictures
    {
        public int pictureId { get; set; }
        public int unitId { get; set; }
        public string fileName { get; set; }
        public string originalName { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public int sequence { get; set; }
        public string caption { get; set; }
    }

    public class Countries
    {
        public string code { get; set; }
        public string title { get; set; }
    }

    public class States
    {
        public string code { get; set; }
        public string title { get; set; }
    }

    public class ListingOwner
    {
        public int ownerId { get; set; }
        public int listingId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zipcode { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string commissionPercentage { get; set; }
        public string headAgent { get; set; }
        public string createdOn { get; set; }
        public string createdBy { get; set; }
        public string modifiedOn { get; set; }
        public string modifiedBy { get; set; }
        public string country { get;set; }
        public string dateModified { get; set; }
        public string reservationFName { get; set; }
        public string reservationLName { get; set; }
        public string reservationPhone { get; set; }
        public string reservationEmail { get; set; }
        public string conciergeFName { get; set; }
        public string conciergeLName { get; set; }
        public string conciergePhone { get; set; }
        public string conciergeEmail { get; set; }
        public string ownerCompany { get; set; }
        public string reservationCompany { get; set; }
        public string conciergeCompany { get; set; }

    }

    public class ListingBedroom
    {
        public int bedroomId { get; set; }
        public int listingId { get; set; }
        public string createdBy { get; set; }
        public string dateCreated { get; set; }
        public string bedroomTitle { get; set; }
        public string bedroomType { get; set; }
        public string bedroomDescription { get; set; }
        public string bedroomAmenities { get; set; }
        public string kingBed { get; set; }
        public string queenBed { get; set; }
        public string doubleBed { get; set; }
        public string twinBed { get; set; }
        public string bunkBed { get; set; }
        public string childBed { get; set; }
        public string futonBed { get; set; }
        public string murphyBed { get; set; }
        public string cribBed { get; set; }
    }

    public class ListingBathrooms
    {
        public int bathroomId { get; set; }
        public int listingId { get; set; }
        public string createdBy { get; set; }
        public string dateCreated { get; set; }
        public string bathroomTitle { get; set; }
        public string bathroomDescription { get; set; }
        public string bathroomAmenities { get; set; }
        public string bathroomType { get; set; }
    }

    public class RelatedWebsite
    {
        public int websiteId { get; set; }
        public int listingId { get; set; }
        public string createdBy { get; set; }
        public string dateCreated { get; set; }
        public string websiteTitle { get; set; }
        public string websiteURL { get; set; }
    }

    public class GeoSubDivision
    {
        public int gsdId { get; set; }
        public string title { get; set; }
        public int parent { get; set; }
        public int hasChildren { get; set; }
        public int depth { get; set;} 
    }
}
