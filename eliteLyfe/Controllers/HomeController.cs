using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using eliteLyfe.Models;
using Microsoft.Ajax.Utilities;
using WebGrease.Css.Ast;

namespace eliteLyfe.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        [HttpPost]
        public ActionResult GetListingCounts()
        {
            SqlDataReader rdr = null;
            List<ListingCount> theListingCounts = new List<ListingCount>();
            ListingCount myListingCount = new ListingCount();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingCounts", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingCount = new ListingCount();
                            myListingCount.listingCode = rdr["name"].ToString();
                            myListingCount.listingCount = rdr["ct"].ToString();
                            theListingCounts.Add(myListingCount);
                        }
                    }

                    return Json(theListingCounts);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();

                return Json(new {code = exception});

            }

        }

        [HttpPost]
        public ActionResult UpdateCurrency(string rateDate, string USD, string EUR, string CAD, string GBP, string JPY,
            string CHF)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Updating Currency " + rateDate;
            newAudit.description = "USD: " + USD.ToString() + " |EUR: " + EUR.ToString() + " |CAD: " + CAD.ToString() +
                                   " |GBP: " + GBP.ToString() + " |JPY: " + JPY.ToString() + " |CHF: " + CHF.ToString();
            SqlDataReader rdr = null;

            List<Currency> theCurrencies = new List<Currency>();

            Currency myCurrency = new Currency();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("updateCurrency", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@rateDate", rateDate);
                    sqlComm.Parameters.AddWithValue("@USD", USD);
                    sqlComm.Parameters.AddWithValue("@EUR", EUR);
                    sqlComm.Parameters.AddWithValue("@CAD", CAD);
                    sqlComm.Parameters.AddWithValue("@GBP", GBP);
                    sqlComm.Parameters.AddWithValue("@JPY", JPY);
                    sqlComm.Parameters.AddWithValue("@CHF", CHF);


                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myCurrency = new Currency();
                            myCurrency.currencyAmount = Convert.ToDouble(rdr["currencyAmount"]);
                            myCurrency.currencyCode = (rdr["currencyCode"].ToString());
                            myCurrency.currencyId = Convert.ToInt32(rdr["currencyId"]);
                            myCurrency.currencyTitle = rdr["currencyTitle"].ToString();
                            myCurrency.lastUpdate = rdr["lastUpdate"].ToString();
                            theCurrencies.Add(myCurrency);
                        }
                    }


                    AddLogRecord(newAudit);
                    return Json(theCurrencies);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Updating Currency " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }

        [HttpPost]
        public ActionResult GetListingFees(int listingId)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Fees " + listingId;
            newAudit.description = "Getting Fees";

            SqlDataReader rdr = null;

            List<Fees> theFees = new List<Fees>();

            Fees myFees = new Fees();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingFees", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myFees = new Fees();
                            myFees.feeAmount = Convert.ToDouble(rdr["feeAmount"].ToString());
                            myFees.feeId = Convert.ToInt32((rdr["id"]));
                            myFees.feeType = rdr["feeType"].ToString();
                            theFees.Add(myFees);
                        }
                    }


                    AddLogRecord(newAudit);
                    return Json(theFees);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Getting Fees " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }
        }

        [HttpPost]
        public ActionResult GetListingRates(int listingId, string currType)
        {

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Rates " + listingId;
            newAudit.description = "Getting Rates";

            SqlDataReader rdr = null;

            List<Rates> theRates = new List<Rates>();

            Rates myRates = new Rates();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingRates", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@currType", currType);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myRates = new Rates();
                            myRates.rateId = Convert.ToInt32(rdr["id"]);
                            myRates.unitId = Convert.ToInt32(rdr["unitId"]);
                            myRates.rateType = rdr["rateType"].ToString();
                            myRates.rateAmount = Convert.ToDouble(rdr["rateAmount"]);
                            myRates.startDate = rdr["startDate"].ToString();
                            myRates.endDate = rdr["endDate"].ToString();
                            myRates.minStay = rdr["minStay"].ToString();
                            myRates.cancelDays = rdr["cancelDays"].ToString();

                            theRates.Add(myRates);
                        }
                    }


                    AddLogRecord(newAudit);
                    return Json(theRates);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Getting Fees " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }

        [HttpPost]
        public ActionResult AddNewRate(string userid, int listingId, string type, string amount, string startDate,
            string endDate, string minStay, string cancelPolicy)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = userid;
            newAudit.title = "Add Rate to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Rate: " + type + " : " + amount.ToString();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertListingRate", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@rateType", type);
                    sqlComm.Parameters.AddWithValue("@rateAmount", amount);
                    sqlComm.Parameters.AddWithValue("@startDate", startDate);
                    sqlComm.Parameters.AddWithValue("@endDate", endDate);
                    sqlComm.Parameters.AddWithValue("@minStay", minStay);
                    sqlComm.Parameters.AddWithValue("@cancelDays", cancelPolicy);
                    sqlComm.Parameters.AddWithValue("@createdBy", userid);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Fee Added to Listing " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }
        }

        [HttpPost]
        public ActionResult AddNewFee(string userid, int listingId, string type, string amount)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = userid;
            newAudit.title = "Add Fee to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Fee: " + type + " : " + amount.ToString();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertListingFee", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@feeType", type);
                    sqlComm.Parameters.AddWithValue("@feeAmount", amount);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Fee Added to Listing " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }

        [HttpPost]
        public ActionResult AddAmenityToListing(int listingId, int amenityId)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Add amenity to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Amenity id: " + amenityId.ToString();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertlistingamenity", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@amenityId", amenityId);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Amenity Added to Listing " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }

        [HttpPost]
        public ActionResult UpdateBathroom(string userid, int listingId, int bathroomId, string title, string type, string desc, string amenities)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Update bathroom details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title + " | Desc:" + desc + " | Amenities:" + amenities;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("updateListingBathroom", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bathroomId", bathroomId);
                    sqlComm.Parameters.AddWithValue("@bathroomTitle", title);
                    sqlComm.Parameters.AddWithValue("@bathroomType", type);
                    sqlComm.Parameters.AddWithValue("@bathroomDescription", desc);
                    sqlComm.Parameters.AddWithValue("@bathroomAmenities", amenities);
                    
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding bedroom " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }
        }

        [HttpPost]
        public ActionResult UpdateBedroom(string userid, int listingId, int bedroomId, string title, string desc, string amenities, string king, string queen, string doubleBed, string twin, string bunk, string child, string futon, string murphy, string crib, string bedroomType)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Update bedrom details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title + " | Desc:" + desc + " | Amenities:" + amenities;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("updateListingBedroom", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bedroomId", bedroomId);
                    sqlComm.Parameters.AddWithValue("@bedroomTitle", title);
                    sqlComm.Parameters.AddWithValue("@bedroomDescription", desc);
                    sqlComm.Parameters.AddWithValue("@bedroomAmenities", amenities);
                    sqlComm.Parameters.AddWithValue("@kingBed", king);
                    sqlComm.Parameters.AddWithValue("@queenBed", queen);
                    sqlComm.Parameters.AddWithValue("@doubleBed", doubleBed);
                    sqlComm.Parameters.AddWithValue("@twinBed", twin);
                    sqlComm.Parameters.AddWithValue("@bunkBed", bunk);
                    sqlComm.Parameters.AddWithValue("@childBed", child);
                    sqlComm.Parameters.AddWithValue("@futonBed", futon);
                    sqlComm.Parameters.AddWithValue("@murphyBed", murphy);
                    sqlComm.Parameters.AddWithValue("@cribBed", crib);
                    sqlComm.Parameters.AddWithValue("@bedroomType", bedroomType);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding bedroom " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }

        [HttpPost]
        public ActionResult AddNewBedroom(string userid, int listingId, string title, string desc, string amenities, string king, string queen, string doubleBed, string twin, string bunk, string child, string futon, string murphy,string crib, string bedType )
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Add new bedrom details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title + " | Desc:" + desc + " | Amenities:" + amenities;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertlistingbedroom", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bedroomTitle", title);
                    sqlComm.Parameters.AddWithValue("@bedroomDescription", desc);
                    sqlComm.Parameters.AddWithValue("@bedroomAmenities", amenities);
                    sqlComm.Parameters.AddWithValue("@kingBed", king);
                    sqlComm.Parameters.AddWithValue("@queenBed", queen);
                    sqlComm.Parameters.AddWithValue("@doubleBed", doubleBed);
                    sqlComm.Parameters.AddWithValue("@twinBed", twin);
                    sqlComm.Parameters.AddWithValue("@bunkBed", bunk);
                    sqlComm.Parameters.AddWithValue("@childBed", child);
                    sqlComm.Parameters.AddWithValue("@futonBed", futon);
                    sqlComm.Parameters.AddWithValue("@murphyBed", murphy);
                    sqlComm.Parameters.AddWithValue("@cribBed", crib);
                    sqlComm.Parameters.AddWithValue("@bedroomType", bedType);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding bedroom " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }
        [HttpPost]
        public ActionResult AddNewBathroom(string userid, int listingId, string title, string desc, string amenities, string type)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Add new bathroom details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title + " | Desc:" + desc + " | Amenities:" + amenities;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertlistingbathroom", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bathroomTitle", title);
                    sqlComm.Parameters.AddWithValue("@bathroomDescription", desc);
                    sqlComm.Parameters.AddWithValue("@bathroomAmenities", amenities);
                    sqlComm.Parameters.AddWithValue("@bathroomType", type);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding bathroom " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }

        [HttpPost]
        public ActionResult GetBedroomDetails(int listingId, int bedroomId)
        {
            SqlDataReader rdr = null;
            List<ListingBedroom> theBedrooms = new List<ListingBedroom>();
            ListingBedroom myBedroom = new ListingBedroom();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Bedrooms for " + listingId.ToString();
            newAudit.description = "Getting Bedrooms ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getBedroomDetail", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bedroomId", bedroomId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myBedroom = new ListingBedroom();
                            myBedroom.bedroomId = Convert.ToInt32(rdr["id"]);
                            myBedroom.listingId = Convert.ToInt32(rdr["listingId"]);
                            myBedroom.dateCreated = rdr["createdOn"].ToString();
                            myBedroom.createdBy = rdr["createdBy"].ToString();
                            myBedroom.bedroomTitle = rdr["bedroomTitle"].ToString();
                            myBedroom.bedroomType = rdr["bedroomType"].ToString();
                            myBedroom.bedroomDescription = rdr["bedroomDescription"].ToString();
                            myBedroom.bedroomAmenities = rdr["bedroomAmenities"].ToString();
                            myBedroom.kingBed = rdr["kingBed"].ToString();
                            myBedroom.queenBed = rdr["queenBed"].ToString();
                            myBedroom.doubleBed = rdr["doubleBed"].ToString();
                            myBedroom.twinBed = rdr["twinBed"].ToString();
                            myBedroom.bunkBed = rdr["bunkBed"].ToString();
                            myBedroom.childBed = rdr["childBed"].ToString();
                            myBedroom.futonBed = rdr["futonBed"].ToString();
                            myBedroom.murphyBed = rdr["murphyBed"].ToString();
                            myBedroom.cribBed = rdr["cribBed"].ToString();
                            theBedrooms.Add(myBedroom);
                        }
                    }
                    return Json(theBedrooms);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetBathroomDetails(int listingId, int bathroomId)
        {
            SqlDataReader rdr = null;
            List<ListingBathrooms> theBathrooms = new List<ListingBathrooms>();
            ListingBathrooms myBathroom = new ListingBathrooms();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Bedrooms for " + listingId.ToString();
            newAudit.description = "Getting Bathroom Detail ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getBathroomDetail", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@bathroomId", bathroomId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myBathroom = new ListingBathrooms();
                            myBathroom.bathroomId = Convert.ToInt32(rdr["id"]);
                            myBathroom.listingId = Convert.ToInt32(rdr["listingId"]);
                            myBathroom.dateCreated = rdr["createdOn"].ToString();
                            myBathroom.createdBy = rdr["createdBy"].ToString();
                            myBathroom.bathroomTitle = rdr["bathroomTitle"].ToString();
                            myBathroom.bathroomType = rdr["bathroomType"].ToString();
                            myBathroom.bathroomDescription = rdr["bathroomDescription"].ToString();
                            myBathroom.bathroomAmenities = rdr["bathroomAmenities"].ToString();
                           
                            theBathrooms.Add(myBathroom);
                        }
                    }
                    return Json(theBathrooms);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingBedrooms(int listingId)
        {
           
            SqlDataReader rdr = null;
            List<ListingBedroom> theBedrooms = new List<ListingBedroom>();
            ListingBedroom myBedroom = new ListingBedroom();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Bedrooms for " + listingId.ToString();
            newAudit.description = "Getting Bedrooms ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingBedrooms", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myBedroom = new ListingBedroom();
                            myBedroom.bedroomId = Convert.ToInt32(rdr["id"]);
                            myBedroom.listingId = Convert.ToInt32(rdr["listingId"]);
                            myBedroom.bedroomType = rdr["bedroomType"].ToString();
                            myBedroom.dateCreated = rdr["createdOn"].ToString();
                            myBedroom.createdBy = rdr["createdBy"].ToString();
                            myBedroom.bedroomTitle = rdr["bedroomTitle"].ToString();
                            myBedroom.bedroomDescription = rdr["bedroomDescription"].ToString();
                            myBedroom.bedroomAmenities = rdr["bedroomAmenities"].ToString();
                            myBedroom.kingBed = rdr["kingBed"].ToString();
                            myBedroom.queenBed = rdr["queenBed"].ToString();
                            myBedroom.doubleBed = rdr["doubleBed"].ToString();
                            myBedroom.twinBed = rdr["twinBed"].ToString();
                            myBedroom.bunkBed = rdr["bunkBed"].ToString();
                            myBedroom.childBed = rdr["childBed"].ToString();
                            myBedroom.futonBed = rdr["futonBed"].ToString();
                            myBedroom.murphyBed = rdr["murphyBed"].ToString();
                            myBedroom.cribBed = rdr["cribBed"].ToString();
                            theBedrooms.Add(myBedroom);
                        }
                    }
                    return Json(theBedrooms);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingBathrooms(int listingId)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<ListingBathrooms> theBathrooms = new List<ListingBathrooms>();
            ListingBathrooms myBathroom = new ListingBathrooms();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Bathrooms for " + listingId.ToString();
            newAudit.description = "Getting Bathrooms ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingBathrooms", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myBathroom = new ListingBathrooms();
                            myBathroom.bathroomId = Convert.ToInt32(rdr["id"]);
                            myBathroom.listingId = Convert.ToInt32(rdr["listingId"]);
                            myBathroom.dateCreated = rdr["createdOn"].ToString();
                            myBathroom.createdBy = rdr["createdBy"].ToString();
                            myBathroom.bathroomTitle = rdr["bathroomTitle"].ToString();
                            myBathroom.bathroomDescription = rdr["bathroomDescription"].ToString();
                            myBathroom.bathroomAmenities = rdr["bathroomAmenities"].ToString();
                            myBathroom.bathroomType = rdr["bathroomType"].ToString();
                            theBathrooms.Add(myBathroom);
                        }
                    }
                    return Json(theBathrooms);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingWebsites(int listingId)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<RelatedWebsite> theWebsites = new List<RelatedWebsite>();
            RelatedWebsite myWebsite = new RelatedWebsite();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Websites for " + listingId.ToString();
            newAudit.description = "Getting Wesites ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getRelatedWebsites", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myWebsite = new RelatedWebsite();
                            myWebsite.websiteId = Convert.ToInt32(rdr["id"]);
                            myWebsite.listingId = Convert.ToInt32(rdr["listingId"]);

                            myWebsite.dateCreated = rdr["createdOn"].ToString();
                            myWebsite.createdBy = rdr["createdBy"].ToString();
                            myWebsite.websiteTitle = rdr["websiteTitle"].ToString();
                            myWebsite.websiteURL = rdr["websiteURL"].ToString();

                            theWebsites.Add(myWebsite);
                        }
                    }
                    //newAudit.title = "**Success** - " + newAudit.title;
                    //AddLogRecord(newAudit);

                    return Json(theWebsites);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult AddNewWebsite(string userid, int listingId, string title, string url)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Add new website details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title + " | URL:" + url;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertRelatedWebsites", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@websiteTitle", title);
                    sqlComm.Parameters.AddWithValue("@websiteURL", url);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding website " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }

        [HttpPost]
        public ActionResult GetListingPOI(int listingId)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<POI> thePOI = new List<POI>();
            POI myPOI = new POI();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get POI for " + listingId.ToString();
            newAudit.description = "Getting POI ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingPOI", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myPOI = new POI();
                            myPOI.poiId = Convert.ToInt32(rdr["id"]);
                            myPOI.listingId = Convert.ToInt32(rdr["listingId"]);
                            myPOI.poiTitle = rdr["poiTitle"].ToString();
                            thePOI.Add(myPOI);
                        }
                    }
                    //newAudit.title = "**Success** - " + newAudit.title;
                    //AddLogRecord(newAudit);

                    return Json(thePOI);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult AddNewPOI(string userid, int listingId, string title)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.title = "Add new POI details to Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Title: " + title ;
            newAudit.user = userid;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertpointofinterest", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    //sqlComm.Parameters.AddWithValue("@userid", userid);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@poiTitle", title);
                    //sqlComm.Parameters.AddWithValue("@websiteURL", url);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Adding POI " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }

        [HttpPost]
        public ActionResult RemoveItem(string type, string listingId, string deleteId)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Remove item from listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Type: " + type + " | Delete id: " + deleteId;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("DeleteItemByType", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@type", type);
                    sqlComm.Parameters.AddWithValue("@id", deleteId);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);

                    //TODO:special case for pictures ... mak sure we delete the images as well
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Remove item from Listing " + " **Error**  ListingId: " + listingId + " | Type:" + type + " | id: " + deleteId;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }


        [HttpPost]
        public ActionResult DeleteAmenityFromListing(int listingId, int amenityId)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Remove amenity from Listing " + listingId.ToString();
            newAudit.description = "Listing id: " + listingId + " | Amenity id: " + amenityId.ToString();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("deletelistingamenity", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@amenityId", amenityId);
                    sqlComm.ExecuteNonQuery();
                    AddLogRecord(newAudit);
                    return Json(new { created = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "Remove amenity from Listing " + " **Error**  ListingId: "  + listingId + " | Amenity id: " + amenityId.ToString();
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });

            }

        }

        [HttpPost]
        public ActionResult DeleteAmenity(int amenityId)
        {
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("DeleteAmenity", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@id", amenityId);
                    sqlComm.ExecuteNonQuery();
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();

                AuditRecord newAudit = new AuditRecord();
                newAudit.title = "Delete Amenity " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }


        [HttpPost]
        public ActionResult InsertNewAmenity(string amenityType, string amenityTitle, string amenityDescription)
        {
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertAmenity", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@type", amenityType);
                    sqlComm.Parameters.AddWithValue("@title", amenityTitle);
                    sqlComm.Parameters.AddWithValue("@description", amenityDescription);
                    sqlComm.ExecuteNonQuery();
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();

                AuditRecord newAudit = new AuditRecord();
                newAudit.title = "Delete Amenity " + " **Error** ";
                newAudit.description = " Exception: " + exception;
                newAudit.user = "System";
                AddLogRecord(newAudit);
                return Json(new {code = exception});

            }

        }


        [HttpPost]
        public ActionResult InsertNewTicket(string userId, string ticketTitle, string ticketDesc, string priority,
            string assignedTo, string ticketPic, string dueDate, string ticketType)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = userId;
            newAudit.title = "Add New Ticket: " + ticketTitle;
            newAudit.description = "Desc: " + ticketDesc;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertNewTicket", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@createdBy", userId);
                    sqlComm.Parameters.AddWithValue("@assignedTo", assignedTo);
                    sqlComm.Parameters.AddWithValue("@status", "New");
                    sqlComm.Parameters.AddWithValue("@title", ticketTitle);
                    sqlComm.Parameters.AddWithValue("@description", ticketDesc);
                    sqlComm.Parameters.AddWithValue("@priority", priority);
                    sqlComm.Parameters.AddWithValue("@ticketPic", ticketPic);
                    sqlComm.Parameters.AddWithValue("@dueDate", dueDate);
                    sqlComm.Parameters.AddWithValue("@ticketType", ticketType);

                    sqlComm.ExecuteNonQuery();
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new {code = exception});
            }
        }

        [HttpPost]
        public ActionResult InsertTicketComment(string ticketId, string title, string desc, string user)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = user;
            newAudit.title = "Add Ticket Comment : " + user;
            newAudit.description = "Title: " + title;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertTicketComment", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@ticketId", ticketId);
                    sqlComm.Parameters.AddWithValue("@createdBy", user);
                    sqlComm.Parameters.AddWithValue("@title", title);
                    sqlComm.Parameters.AddWithValue("@description", desc);

                    sqlComm.ExecuteNonQuery();
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);
                    return Json(new {created = "true"});
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }


        }

        [HttpPost]
        public ActionResult GetTicketComments(int ticketId)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Comment> theComments = new List<Comment>();
            Comment myComment = new Comment();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Comment for " + ticketId.ToString();
            newAudit.description = "Getting Comment ";
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetTicketComments", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@ticketId", ticketId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myComment = new Comment();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myComment.commentId = Convert.ToInt32(rdr["id"]);
                            myComment.ticketId = Convert.ToInt32(rdr["ticketId"]);
                            myComment.dateCreated = rdr["dateCreated"].ToString();
                            myComment.createdBy = rdr["createdBy"].ToString();
                            myComment.commentTitle = rdr["title"].ToString();
                            myComment.commentDescription = rdr["description"].ToString();

                            theComments.Add(myComment);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    return Json(theComments);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        //
        [HttpPost]
        public ActionResult GetTicketDetails(int ticketId)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Ticket> theTickets = new List<Ticket>();
            Ticket myTicket = new Ticket();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Ticket Details : " + ticketId.ToString();
            newAudit.description = "Getting Details ";
            try
            {
                
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetTicketDetails", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@ticketId", ticketId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myTicket = new Ticket();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myTicket.ticketid = Convert.ToInt32(rdr["ticketId"]);
                            myTicket.dateCreated = rdr["dateCreated"].ToString();
                            myTicket.createdBy = rdr["createdBy"].ToString();
                            myTicket.ticketStatus = rdr["status"].ToString();
                            myTicket.ticketTitle = rdr["title"].ToString();
                            myTicket.ticketDescription = rdr["description"].ToString();
                            myTicket.ticketPriority = rdr["priority"].ToString();
                            myTicket.ticketSequence = Convert.ToInt32(rdr["sequence"]);
                            myTicket.dateModified = rdr["dateModified"].ToString();
                            myTicket.modifiedBy = rdr["modifiedBy"].ToString();
                            myTicket.dateCompleted = rdr["dateCompleted"].ToString();
                            myTicket.assignedTo = rdr["assignedTo"].ToString();
                            myTicket.ticketPic = rdr["ticketPic"].ToString();
                            myTicket.dueDate = rdr["dueDate"].ToString();
                            myTicket.ticketType = rdr["type"].ToString();

                            theTickets.Add(myTicket);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);


                    return Json(theTickets);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingPictures(int listingId)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting Listing Pictures";
            newAudit.description = "Listing ID: " + listingId.ToString() ;

           

            SqlDataReader rdr = null;
            List<Pictures> myPictures = new List<Pictures>();
            Pictures currentPicture = new Pictures();
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingPictures", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            currentPicture = new Pictures();
                            currentPicture.fileName = rdr["file"].ToString();
                            //currentPicture.height = Convert.ToInt32(dtPictures.Rows[m]["height"]);
                            currentPicture.originalName = rdr["original_name"].ToString();
                            //currentPicture.pictureId = Convert.ToInt32(dtPictures.Rows[m]["height"]);
                            currentPicture.unitId = Convert.ToInt32(rdr["unit_id"]);
                            //currentPicture.width = Convert.ToInt32(dtPictures.Rows[m]["width"]);
                            currentPicture.sequence = Convert.ToInt32(rdr["sequence"]);
                            currentPicture.caption = rdr["caption"].ToString();
                            myPictures.Add(currentPicture);
                        }
                    }

                    return Json(myPictures);
                   
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { rtnVal = exception });
            }


        }

        [HttpPost]
        public ActionResult UpdateTicketSequence(int ticketId, int sequenceNumber)
        {

            //TODO:Add User for audit
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Updating Ticket Sequence";
            newAudit.description =  "Ticket ID:" + ticketId.ToString() + " | Sequence #:" + sequenceNumber.ToString();

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("UpdateTicketSequence", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@ticketId", ticketId);
                    sqlComm.Parameters.AddWithValue("@sequenceNumber", sequenceNumber);

                    string rtnVal = sqlComm.ExecuteNonQuery().ToString();
                    return Json(new { rtnVal = rtnVal });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { rtnVal = exception });
            }
        }

        [HttpPost]
        public ActionResult UpdatePictureSequence(int listingId, string pictureId, int sequenceNumber)
        {
           
          
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Updating Picture Sequence";
            newAudit.description = "Listing ID: " + listingId.ToString() + " | Picture ID:" + pictureId + " | Sequence #:" + sequenceNumber.ToString();

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("UpdatePictureSequence", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@pictureId", pictureId);
                    sqlComm.Parameters.AddWithValue("@sequenceNumber", sequenceNumber);

                    string rtnVal = sqlComm.ExecuteNonQuery().ToString();
                    return Json(new { rtnVal = rtnVal });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { rtnVal = exception });
            }

        }

        [HttpPost]
        public ActionResult GetPhonePrefix(string countryCode)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            String phonePrefix = "";
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting Phone Prefix";
            newAudit.description = "Country: " + countryCode;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetPhonePrefix", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@countryCode", countryCode);

                    phonePrefix = sqlComm.ExecuteScalar().ToString();


                    return Json(new { phonePrefix = phonePrefix });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
           

        }

        [HttpPost]
        public ActionResult GetAmenityListByType(string type)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Amenity> theAmenities = new List<Amenity>();
            Amenity myAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting Amenities By Type";
            newAudit.description = "Getting Type:" + type;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetAmenityListByType", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@type", type);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myAmenity = new Amenity();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myAmenity.amenityId = Convert.ToInt32(rdr["id"]);
                            myAmenity.amenityType = rdr["type"].ToString();
                            myAmenity.amenityTitle = rdr["title"].ToString();
                            myAmenity.amenityDesc = rdr["description"].ToString();
                            myAmenity.amenityClass = rdr["amenityClass"].ToString();

                            theAmenities.Add(myAmenity);
                        }
                    }

                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    return Json(theAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetCountries()
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Countries> theCountries = new List<Countries>();
            Countries myCountry = new Countries();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting Countries";
            newAudit.description = "Getting Countries";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetCountries", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myCountry = new Countries();
                            myCountry.code = rdr["code"].ToString();
                            myCountry.title = rdr["name"].ToString();
                            theCountries.Add(myCountry);
                        }
                    }

                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);
                    return Json(theCountries);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }
        [HttpPost]
        public ActionResult GetStateProv()
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<States> theStates = new List<States>();
            States myState = new States();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting States";
            newAudit.description = "Getting States";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetStateProv", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    //TODO: Pass country and pull back states accordingly
                    sqlComm.Parameters.AddWithValue("@country", "USA");
                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myState = new States();
                            myState.code = rdr["code"].ToString();
                            myState.title = rdr["name"].ToString();
                            theStates.Add(myState);
                        }
                    }

                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);
                    return Json(theStates);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }
        //
        [HttpPost]
        public ActionResult GetAmenityList()
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Amenity> theAmenities = new List<Amenity>();
            Amenity myAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Getting Amenities";
            newAudit.description = "Getting Amenities";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetAmenityList", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myAmenity = new Amenity();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myAmenity.amenityId = Convert.ToInt32(rdr["id"]);
                            myAmenity.amenityType = rdr["type"].ToString();
                            myAmenity.amenityTitle = rdr["title"].ToString();
                            myAmenity.amenityDesc = rdr["description"].ToString();
                            myAmenity.amenityClass = rdr["amenityClass"].ToString();

                            theAmenities.Add(myAmenity);
                        }
                    }

                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    return Json(theAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }


        [HttpPost]
        public ActionResult GetAllTickets(string statusCode, string assignedTo, string createdBy)
        {
            //status code will be blank if pulling all types, otherwise we can pull stuff based on "new" or whatever
            SqlDataReader rdr = null;
            List<Ticket> theTickets = new List<Ticket>();
            Ticket myTicket = new Ticket();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get All Tickets ";
            newAudit.description = "created by " + createdBy + " assigned to "+ assignedTo + " status code " + statusCode;
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetAllTickets", conn);

                    sqlComm.Parameters.AddWithValue("@statusCode", statusCode);
                    sqlComm.Parameters.AddWithValue("@assignedTo", assignedTo);
                    sqlComm.Parameters.AddWithValue("@createdBy", createdBy);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myTicket = new Ticket();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myTicket.ticketid = Convert.ToInt32(rdr["ticketid"]);
                            myTicket.dateCreated = rdr["dateCreated"].ToString();
                            myTicket.createdBy = rdr["createdBy"].ToString();
                            myTicket.ticketStatus = rdr["status"].ToString();
                            myTicket.ticketTitle = rdr["title"].ToString();
                            myTicket.ticketDescription = rdr["description"].ToString();
                            myTicket.ticketPriority = rdr["priority"].ToString();
                            myTicket.ticketSequence = Convert.ToInt32(rdr["sequence"]);
                            myTicket.dateModified = rdr["dateModified"].ToString();
                            myTicket.modifiedBy = rdr["modifiedBy"].ToString();
                            myTicket.dateCompleted = rdr["dateCompleted"].ToString();
                            myTicket.assignedTo = rdr["assignedTo"].ToString();
                            myTicket.ticketPic = rdr["ticketPic"].ToString();
                            myTicket.dueDate = rdr["dueDate"].ToString();
                            theTickets.Add(myTicket);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);


                    return Json(theTickets);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingDetails(int listingId)
        {
            SqlDataReader rdr = null;
            Listing myListing = new Listing();

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Detail : " + listingId.ToString();
            newAudit.description = "Getting Detail . . . ";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingDetails", conn);

                    sqlComm.Parameters.AddWithValue("@unit_id", listingId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    System.Data.SqlClient.SqlDataAdapter adapter = new System.Data.SqlClient.SqlDataAdapter(sqlComm);

                    DataSet ds = new DataSet();
                    adapter.Fill(ds);

                    DataTable dtListingDetails = ds.Tables[0];
                    DataTable dtRates = ds.Tables[1];
                    DataTable dtFees = ds.Tables[2];
                    DataTable dtPictures = ds.Tables[3];

                   

                    myListing = new Listing();
                    //myListing.userId = dtListingDetails.Rows[0]["userId"].ToString();

                    //should only be one row for first datatable
                    for (int i = 0; i < dtListingDetails.Rows.Count; i++)
                    {

                        myListing.listingId = Convert.ToInt32(dtListingDetails.Rows[i]["id"]);
                        myListing.unitId = Convert.ToInt32(dtListingDetails.Rows[i]["unitid"]);
                        myListing.listingNickname = dtListingDetails.Rows[i]["nickname"].ToString();
                        myListing.listingSqFt = dtListingDetails.Rows[i]["sqft"].ToString();
                        myListing.listingStatus = dtListingDetails.Rows[i]["status"].ToString();
                        //myListing.userId = dtListingDetails.Rows[i]["user_id"].ToString();
                        myListing.source = dtListingDetails.Rows[i]["source"].ToString();
                        myListing.listingType = dtListingDetails.Rows[i]["listing_type"].ToString();
                        myListing.address1 = dtListingDetails.Rows[i]["address"].ToString();
                        myListing.address2 = dtListingDetails.Rows[i]["address2"].ToString();
                        myListing.city = dtListingDetails.Rows[i]["city"].ToString();
                        myListing.stateProv = dtListingDetails.Rows[i]["province"].ToString();
                        myListing.zipPostal = dtListingDetails.Rows[i]["postal"].ToString();
                        myListing.country = dtListingDetails.Rows[i]["country"].ToString();
                        myListing.latitude = Convert.ToDecimal(dtListingDetails.Rows[i]["latitude"]);
                        myListing.longitude = Convert.ToDecimal(dtListingDetails.Rows[i]["longitude"]);
                        myListing.baseCurrency = dtListingDetails.Rows[i]["base_currency"].ToString();
                        myListing.taxPercentage = Convert.ToDecimal(dtListingDetails.Rows[i]["tax_percentage"]);
                        myListing.locale = dtListingDetails.Rows[i]["locale"].ToString();
                        myListing.title = dtListingDetails.Rows[i]["title"].ToString();
                        myListing.description = dtListingDetails.Rows[i]["description_property"].ToString();
                        myListing.numBedrooms = Convert.ToDouble(dtListingDetails.Rows[i]["bedrooms"]);
                        myListing.numBathrooms = Convert.ToDouble(dtListingDetails.Rows[i]["bathrooms"]);
                        myListing.maxOccupancy = Convert.ToInt32(dtListingDetails.Rows[i]["occupancy"]);
                        myListing.listingView = dtListingDetails.Rows[i]["View"].ToString();
                        myListing.rateMin = dtListingDetails.Rows[i]["rateMin"].ToString();
                        myListing.rateMax = dtListingDetails.Rows[i]["rateMax"].ToString();
                        myListing.checkIn = dtListingDetails.Rows[i]["checkIn"].ToString();
                        myListing.checkOut = dtListingDetails.Rows[i]["checkOut"].ToString();
                        myListing.geoSubDivision = dtListingDetails.Rows[i]["geoSubDivision"].ToString();
                        myListing.destinationCategory = dtListingDetails.Rows[i]["destinationType"].ToString();
                        myListing.serviceFee = dtListingDetails.Rows[i]["serviceFee"].ToString();
                        myListing.listingNumber = Convert.ToInt32(dtListingDetails.Rows[i]["listingNumber"]);
                        myListing.geoSub1 = Convert.ToInt32(dtListingDetails.Rows[i]["geoSub1"]);
                        myListing.geoSub2 = Convert.ToInt32(dtListingDetails.Rows[i]["geoSub2"]);
                        myListing.geoSub3 = Convert.ToInt32(dtListingDetails.Rows[i]["geoSub3"]);
                        myListing.destinationCategory = dtListingDetails.Rows[i]["listing_type"].ToString();
                        myListing.featuredListing = dtListingDetails.Rows[i]["featuredListing"].ToString();
                        myListing.listingTags = dtListingDetails.Rows[i]["tags"].ToString();


                    }


                    //rates
                    if (dtRates!=null)
                    {
                        List<Rates> myRates = new List<Rates>();
                        Rates currentRate = new Rates();
                        for (int j = 0; j < dtRates.Rows.Count; j++)
                        {
                            currentRate = new Rates();
                            currentRate.startDate = dtRates.Rows[j]["startDate"].ToString();
                            currentRate.endDate = dtRates.Rows[j]["endDate"].ToString();
                            currentRate.cancelDays = dtRates.Rows[j]["cancelDays"].ToString();
                            currentRate.minStay = dtRates.Rows[j]["minStay"].ToString();
                            currentRate.rateAmount = Convert.ToDouble(dtRates.Rows[j]["rateAmount"]);
                            currentRate.rateType = dtRates.Rows[j]["rateType"].ToString();
                            currentRate.rateId = Convert.ToInt32(dtRates.Rows[j]["rateId"]);
                           

                            myRates.Add(currentRate);
                        }
                        myListing.myRates = myRates;
                    }


                    //fees
                    if (dtFees != null)
                    {
                        List<Fees> myFees = new List<Fees>();
                        Fees currentFee = new Fees();
                        for (int k = 0; k < dtFees.Rows.Count; k++)
                        {
                            currentFee = new Fees();
                            currentFee.feeAmount = Convert.ToDouble(dtFees.Rows[k]["feeAmount"]);
                            currentFee.feeId = Convert.ToInt32(dtFees.Rows[k]["feeId"]);
                            currentFee.feeType = dtFees.Rows[k]["feeType"].ToString();
                            //currentFee.unitId = Convert.ToInt32(dtFees.Rows[k]["unitId"]);
                            myFees.Add(currentFee);
                        }
                        myListing.myFees = myFees;
                    }

                    //pictures
                    if (dtPictures != null)
                    {
                        List<Pictures> myPictures = new List<Pictures>();
                        Pictures currentPicture = new Pictures();
                        for (int m = 0; m < dtPictures.Rows.Count; m++)
                        {
                            currentPicture = new Pictures();
                            currentPicture.fileName = dtPictures.Rows[m]["file"].ToString();
                            currentPicture.height = Convert.ToInt32(dtPictures.Rows[m]["height"]);
                            currentPicture.originalName = dtPictures.Rows[m]["original_name"].ToString();
                            //currentPicture.pictureId = Convert.ToInt32(dtPictures.Rows[m]["height"]);
                            currentPicture.unitId = Convert.ToInt32(dtPictures.Rows[m]["unit_id"]);
                            currentPicture.width = Convert.ToInt32(dtPictures.Rows[m]["width"]);
                            currentPicture.sequence = Convert.ToInt32(dtPictures.Rows[m]["sequence"]);
                            currentPicture.caption = dtPictures.Rows[m]["caption"].ToString();
                            myPictures.Add(currentPicture);
                        }
                        myListing.myPictures = myPictures;
                    }
                    
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);


                    return Json(myListing);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult SaveUploadedFile()
        {
            bool isSavedSuccessfully = true;
            string fName = "";

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Save Uploaded File";
            newAudit.description = "Saving File" ;

            try
            {
                foreach (string fileName in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[fileName];
                    //Save file content goes here
                    newAudit.description = newAudit.description + fileName;
                    fName = file.FileName;
                    if (file != null && file.ContentLength > 0)
                    {

                        var originalDirectory =
                            new DirectoryInfo(string.Format("{0}Images\\WallImages", Server.MapPath(@"\")));

                        string pathString = System.IO.Path.Combine(originalDirectory.ToString(), "imagepath");

                        var fileName1 = Path.GetFileName(file.FileName);

                        bool isExists = System.IO.Directory.Exists(pathString);

                        if (!isExists)
                            System.IO.Directory.CreateDirectory(pathString);

                        var path = string.Format("{0}\\{1}", pathString, file.FileName);
                        file.SaveAs(path);
                        newAudit.title = "**Success** - " + newAudit.title;
                        AddLogRecord(newAudit);


                    }

                }

            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }


            if (isSavedSuccessfully)
            {
                return Json(new {Message = fName});
            }
            else
            {
                return Json(new {Message = "Error in saving file"});
            }
        }

        [HttpPost]
        public ActionResult GetListingAmenitiesDisplayByType(int listingId, string type)
        {

            SqlDataReader rdr = null;
            List<Amenity> theListingAmenities = new List<Amenity>();
            Amenity myListingAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Display Listing Amenities By Type ";
            newAudit.description = "Listing Id: " + listingId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingAmenitiesDisplayByType", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@type", type);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingAmenity = new Amenity();

                            myListingAmenity.amenityType = rdr["type"].ToString();
                            myListingAmenity.amenityTitle = rdr["title"].ToString();
                            myListingAmenity.amenityClass = rdr["amenityClass"].ToString();

                            theListingAmenities.Add(myListingAmenity);
                        }
                    }

                    return Json(theListingAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingTopAmenities(int listingId)
        {

            SqlDataReader rdr = null;
            List<Amenity> theListingAmenities = new List<Amenity>();
            Amenity myListingAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Display Listing Amenities (TOP) ";
            newAudit.description = "Listing Id: " + listingId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getListingTopAmenities", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingAmenity = new Amenity();

                            myListingAmenity.amenityType = rdr["type"].ToString();
                            myListingAmenity.amenityTitle = rdr["title"].ToString();
                            myListingAmenity.amenityClass = rdr["amenityClass"].ToString();

                            theListingAmenities.Add(myListingAmenity);
                        }
                    }

                    return Json(theListingAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingAmenitiesDisplay(int listingId)
        {

            SqlDataReader rdr = null;
            List<Amenity> theListingAmenities = new List<Amenity>();
            Amenity myListingAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Display Listing Amenities ";
            newAudit.description = "Listing Id: " + listingId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingAmenitiesDisplay", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingAmenity = new Amenity();
                            
                            myListingAmenity.amenityType = rdr["type"].ToString();
                            myListingAmenity.amenityTitle = rdr["title"].ToString();
                            myListingAmenity.amenityClass = rdr["amenityClass"].ToString();

                            theListingAmenities.Add(myListingAmenity);
                        }
                    }
                   
                    return Json(theListingAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetAmenityDisplay(string type, string amenityList)
        {

            SqlDataReader rdr = null;
            List<Amenity> theListingAmenities = new List<Amenity>();
            Amenity myListingAmenity = new Amenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Display Listing Amenities ";
            newAudit.description = "Type: " + type;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetAmenityTitleAndClass", conn);

                    sqlComm.Parameters.AddWithValue("@type", type);
                    sqlComm.Parameters.AddWithValue("@amenityList", amenityList);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingAmenity = new Amenity();

                            //myListingAmenity.amenityType = rdr["type"].ToString();
                            myListingAmenity.amenityTitle = rdr["title"].ToString();
                            myListingAmenity.amenityClass = rdr["imageClass"].ToString();

                            theListingAmenities.Add(myListingAmenity);
                        }
                    }

                    return Json(theListingAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingAmenities(int listingId)
        {

            SqlDataReader rdr = null;
            List<ListingAmenity> theListingAmenities = new List<ListingAmenity>();
            ListingAmenity myListingAmenity = new ListingAmenity();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Amenities ";
            newAudit.description = "Listing Id: " + listingId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getlistingamenities", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingAmenity = new ListingAmenity();
                            myListingAmenity.id= Convert.ToInt32(rdr["id"]);
                            myListingAmenity.listingId = Convert.ToInt32(rdr["listingId"]);
                            myListingAmenity.amenityId = Convert.ToInt32(rdr["amenityId"]);
                           
                            theListingAmenities.Add(myListingAmenity);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theListingAmenities);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetGeoSubDivisionByParent(int parentId)
        {

            SqlDataReader rdr = null;

            GeoSubDivision myGeoSubDivision = new GeoSubDivision();
            List<GeoSubDivision> theSubDivisions = new List<GeoSubDivision>();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Geo Sub Division By Parent ";
            newAudit.description = "Parent Id: " + parentId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getGeoSubDivisionByParent", conn);

                    sqlComm.Parameters.AddWithValue("@parentId", parentId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myGeoSubDivision = new GeoSubDivision();
                            myGeoSubDivision.gsdId  = Convert.ToInt32(rdr["id"]);
                            myGeoSubDivision.title = rdr["title"].ToString();
                            myGeoSubDivision.parent = Convert.ToInt32(rdr["parent"]);
                            myGeoSubDivision.hasChildren = Convert.ToInt32(rdr["hasChildren"]);
                            myGeoSubDivision.depth = Convert.ToInt32(rdr["depth"]);
                            
                            theSubDivisions.Add(myGeoSubDivision);

                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theSubDivisions);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetOwnerInfo(int listingId)
        {

            SqlDataReader rdr = null;
            
            ListingOwner myListingOwner = new ListingOwner();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Owner ";
            newAudit.description = "Listing Id: " + listingId;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("getOwnerInfo", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListingOwner = new ListingOwner();
                            myListingOwner.ownerId = Convert.ToInt32(rdr["id"]);
                            myListingOwner.listingId= Convert.ToInt32(rdr["listingId"]);
                            myListingOwner.firstName = rdr["firstName"].ToString();
                            myListingOwner.lastName = rdr["lastName"].ToString();
                            myListingOwner.address1 = rdr["address1"].ToString();
                            myListingOwner.address2 = rdr["address2"].ToString();
                            myListingOwner.city = rdr["city"].ToString();
                            myListingOwner.state = rdr["state"].ToString();
                            myListingOwner.zipcode = rdr["zipcode"].ToString();
                            myListingOwner.phone = rdr["phoneNumber"].ToString();
                            myListingOwner.email = rdr["emailAddress"].ToString();
                            myListingOwner.commissionPercentage = rdr["commissionPercentage"].ToString();
                            myListingOwner.headAgent = rdr["headAgent"].ToString();
                            myListingOwner.createdOn = rdr["createdOn"].ToString();
                            myListingOwner.createdBy = rdr["createdBy"].ToString();
                            myListingOwner.modifiedOn = rdr["modifiedOn"].ToString();
                            myListingOwner.modifiedBy = rdr["modifiedBy"].ToString();
                            myListingOwner.country = rdr["country"].ToString();
                            myListingOwner.reservationFName = rdr["reservationFName"].ToString();
                            myListingOwner.reservationLName = rdr["reservationLName"].ToString();
                            myListingOwner.reservationEmail = rdr["reservationEmail"].ToString();
                            myListingOwner.reservationPhone = rdr["reservationPhone"].ToString();
                            myListingOwner.conciergeFName = rdr["conciergeFName"].ToString();
                            myListingOwner.conciergeLName = rdr["conciergeLName"].ToString();
                            myListingOwner.conciergeEmail = rdr["conciergeEmail"].ToString();
                            myListingOwner.conciergePhone = rdr["conciergePhone"].ToString();
                            myListingOwner.ownerCompany = rdr["ownerCompany"].ToString();
                            myListingOwner.reservationCompany = rdr["reservationCompany"].ToString();
                            myListingOwner.conciergeCompany = rdr["conciergeCompany"].ToString();

                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(myListingOwner);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult SubmitInquiry(string fname, string lname, string email, string phone, string travelDates,
            string comments, int listingId, string listingName)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Submit Listing Inquiry ";
            newAudit.description = "First Name: " + fname + "Email: " + email;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertListingInquiryData", conn);

                    sqlComm.Parameters.AddWithValue("@fname", fname);
                    sqlComm.Parameters.AddWithValue("@lname", lname);
                    sqlComm.Parameters.AddWithValue("@email", email);
                    sqlComm.Parameters.AddWithValue("@phone", phone);
                    sqlComm.Parameters.AddWithValue("@travelDates", travelDates);
                    sqlComm.Parameters.AddWithValue("@comments", comments);
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    var rtnVal = sqlComm.ExecuteNonQuery();


                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    SendListingEmail(fname, lname, email, phone,travelDates, comments, listingId,listingName);

                    return Json(new { created = true });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { created = false });
            }

        }

        [HttpPost]
        public ActionResult EmailSubscribe(string email)
        {

            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Email Subscribe ";
            newAudit.description =  "Email: " + email;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("insertEmailSignup", conn);
                    sqlComm.Parameters.AddWithValue("@emailAddress", email);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    var rtnVal = sqlComm.ExecuteScalar();


                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    SendSignUpEmail(email);

                  

                    return Json(new { status = rtnVal });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { created = false });
            }

        }


        [HttpPost]
        public ActionResult SubmitForm(string fname, string lname, string email, string phone, string travelTo,
            string monthToGo, string budget, string occasion, string submissionPage)
        {
            
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Submit Form ";
            newAudit.description = "First Name: " + fname + "Email: " + email;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertFormData", conn);

                    sqlComm.Parameters.AddWithValue("@fname", fname);
                    sqlComm.Parameters.AddWithValue("@lname", lname);
                    sqlComm.Parameters.AddWithValue("@email", email);
                    sqlComm.Parameters.AddWithValue("@phone", phone);
                    sqlComm.Parameters.AddWithValue("@travelTo", travelTo);
                    sqlComm.Parameters.AddWithValue("@monthToGo", monthToGo);
                    sqlComm.Parameters.AddWithValue("@budget", budget);
                    sqlComm.Parameters.AddWithValue("@occasion", occasion);
                    sqlComm.Parameters.AddWithValue("@submissionPage", submissionPage);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    var rtnVal = sqlComm.ExecuteNonQuery();

                   
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);

                    SendFormEmail(fname, lname, email, phone, travelTo, monthToGo, budget,occasion,submissionPage);

                    return Json(new { created = true });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { created = false });
            }
           
        }

        private void SendListingEmail(string fname, string lname, string email, string phone, string travelDates,
            string comments, int listingId, string listingName)
        {
            string emailFrom = ConfigurationManager.AppSettings["sendEmailAddress"];
            string emailFromSales = ConfigurationManager.AppSettings["sendEmailAddressSales"]; 
            string emailPass = ConfigurationManager.AppSettings["sendEmailPassword"];
            string emailHost = ConfigurationManager.AppSettings["sendEmailHost"];
            int emailPort = Convert.ToInt32(ConfigurationManager.AppSettings["sendEmailPort"]);
            string sendEliteEmailTo = ConfigurationManager.AppSettings["sendEmailTo"];

            string myBody = "<b>First Name:</b> " + fname + "<br/><b>Last Name:</b> " + lname + "<br/><b>Phone:</b> " +
                            phone + "<br/><b>Email:</b> " + email + "<br/><b>Travel Dates:</b> " + travelDates +
                            "<br/><b>Comments:</b> " + comments +
                            "<br/><b>Listing:</b> <a href='http://www.elitelyfe.com/listing-details.html?lid=" +
                            listingId + "'>" + listingName + "</a>";


            string myFooter =
                "<a href='http://www.elitelyfe.com'>www.EliteLYFE.com</a><br/>Villas | Real Estate | Super Yachts | Private Jets | Exotic Cars | Hotels<br/>US & Canada: <a href='tel:1-877-887-7818'>1.877.887.7818</a><br/>International: <a href='tel:1-424-281-6881'>+1.424.281.6881</a>";


            // one for us
            MailMessage mElitLyfe = new MailMessage();
            SmtpClient scel = new SmtpClient();
            mElitLyfe.From = new MailAddress(emailFrom);
            mElitLyfe.To.Add(sendEliteEmailTo);
            mElitLyfe.Subject = "Website Inquiry from " + fname + " " + lname;
            mElitLyfe.Body = myBody + myFooter;
            mElitLyfe.IsBodyHtml = true;
            scel.Host = emailHost;

            try
            {
                scel.Port = emailPort;
                scel.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                scel.EnableSsl = true;   //TODO: Revisit if new server needs SSL!!!
                scel.Send(mElitLyfe);


            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }

            //one for the user
            MailMessage mUser = new MailMessage();
            SmtpClient sc = new SmtpClient();
            mUser.From = new MailAddress(emailFrom);
            mUser.To.Add(email);
            mUser.Subject = "Thank you for contacting EliteLyfe";
            mUser.Body = "Thank you for contacting EliteLyfe. We look forward to designing the perfect luxury vacation experience for you. Below are the details of your inquiry. We will be in contact with you shortly.<br/><br/>" + myBody + myFooter;
            mUser.IsBodyHtml = true;
            sc.Host = emailHost;

            try
            {
                sc.Port = emailPort;
                sc.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                sc.EnableSsl = false;   //TODO: Revisit if new server needs SSL!!!
                sc.Send(mUser);


            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }
        }


        private void SendSignUpEmail(string email)
        {
            string emailFrom = ConfigurationManager.AppSettings["sendEmailAddress"];
            string emailPass = ConfigurationManager.AppSettings["sendEmailPassword"];
            string emailHost = ConfigurationManager.AppSettings["sendEmailHost"];
            int emailPort = Convert.ToInt32(ConfigurationManager.AppSettings["sendEmailPort"]);
            string sendEliteEmailTo = ConfigurationManager.AppSettings["sendEmailTo"];

            string myBody = "New Email List Signup:" + email;

            string myFooter =
                "<a href='http://www.elitelyfe.com'>www.EliteLYFE.com</a><br/>Villas | Real Estate | Super Yachts | Private Jets | Exotic Cars | Hotels<br/>US & Canada: <a href='tel:1-877-887-7818'>1.877.887.7818</a><br/>International: <a href='tel:1-424-281-6881'>+1.424.281.6881</a>";


            // one for us
            MailMessage mElitLyfe = new MailMessage();
            SmtpClient scel = new SmtpClient();
            mElitLyfe.From = new MailAddress(emailFrom);
            mElitLyfe.To.Add(sendEliteEmailTo);
            mElitLyfe.Subject = "Email List Signup from " + email;
            mElitLyfe.Body = myBody + myFooter;
            mElitLyfe.IsBodyHtml = true;
            scel.Host = emailHost;

            try
            {
                scel.Port = emailPort;
                scel.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                scel.EnableSsl = false;   //TODO: Revisit if new server needs SSL!!!
                scel.Send(mElitLyfe);


            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }

            //one for the user
            MailMessage mUser = new MailMessage();
            SmtpClient sc = new SmtpClient();
            mUser.From = new MailAddress(emailFrom);
            mUser.To.Add(email);
            mUser.Subject = "Thank you for signing up for the EliteLyfe email newsletter";
            mUser.Body = "Thank you for contacting EliteLyfe. We look forward to designing the perfect luxury vacation experience for you.<br/><br/>"  + myFooter;
            mUser.IsBodyHtml = true;
            sc.Host = emailHost;

            try
            {
                sc.Port = emailPort;
                sc.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                sc.EnableSsl = false;   //TODO: Revisit if new server needs SSL!!!
                sc.Send(mUser);


            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }
        }

        private void SendFormEmail(string fname, string lname, string email, string phone, string travelTo,
            string monthToGo, string budget, string occasion,string submissionPage)
        {

            string emailFrom = ConfigurationManager.AppSettings["sendEmailAddress"];
            string emailPass = ConfigurationManager.AppSettings["sendEmailPassword"];
            string emailHost = ConfigurationManager.AppSettings["sendEmailHost"];
            int emailPort = Convert.ToInt32(ConfigurationManager.AppSettings["sendEmailPort"]);
            string sendEliteEmailTo = ConfigurationManager.AppSettings["sendEmailTo"]; 

            string myBody = "<b>First Name:</b> " + fname + "<br/><b>Last Name:</b> " + lname + "<br/><b>Phone:</b> " +
                            phone + "<br/><b>Email:</b> " + email + "<br/><b>Travel To:</b> " + travelTo +
                            "<br/><b>Month To Go:</b> " + monthToGo + "<br/><b>Budget:</b> " + budget +
                            "<br/><b>Occasion:</b> " + occasion + "<br/>" +
                            "<b>Submitted From:</b><a href='" + submissionPage + "'>" + submissionPage +"</a><br/><br/>";

            string myFooter =
                "<a href='http://www.elitelyfe.com'>www.EliteLYFE.com</a><br/>Villas | Real Estate | Super Yachts | Private Jets | Exotic Cars | Hotels<br/>US & Canada: <a href='tel:1-877-887-7818'>1.877.887.7818</a><br/>International: <a href='tel:1-424-281-6881'>+1.424.281.6881</a>";


            // one for us
            MailMessage mElitLyfe = new MailMessage();
            SmtpClient scel = new SmtpClient();
            mElitLyfe.From = new MailAddress(emailFrom);
            mElitLyfe.To.Add(sendEliteEmailTo);
            mElitLyfe.Subject = "Website Inquiry from " + fname + " " + lname;
            mElitLyfe.Body = myBody + myFooter;
            mElitLyfe.IsBodyHtml = true;
            scel.Host = emailHost;

            try
            {
                scel.Port = emailPort;
                scel.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                scel.EnableSsl = false;   //TODO: Revisit if new server needs SSL!!!
                scel.Send(mElitLyfe);


            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }

            //one for the user
            MailMessage mUser = new MailMessage();
            SmtpClient sc = new SmtpClient();
            mUser.From = new MailAddress(emailFrom);
            mUser.To.Add(email);
            mUser.Subject = "Thank you for contacting EliteLyfe";
            mUser.Body = "Thank you for contacting EliteLyfe. We look forward to designing the perfect luxury vacation experience for you. Below are the details of your inquiry. We will be in contact with you shortly.<br/><br/>" + myBody + myFooter;
            mUser.IsBodyHtml = true;
            sc.Host = emailHost;

            try
            {
                sc.Port = emailPort;
                sc.Credentials = new System.Net.NetworkCredential(emailFrom, emailPass);
                sc.EnableSsl = false;   //TODO: Revisit if new server needs SSL!!!
                sc.Send(mUser);

                
            }
            catch (Exception ex)
            {
                //TODO: HANDLE THIS
                string exSomething = ex.ToString();
                email = exSomething;
            }

        }

        [HttpPost]
        public ActionResult GetListingResults(string searchCriteria)
        {

            SqlDataReader rdr = null;
            List<Listing> theListings = new List<Listing>();
            Listing myListing = new Listing();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing Results ";
            newAudit.description = "Search Criteria: " + searchCriteria;
            if (searchCriteria == "")
            {
                searchCriteria = " ";
            }


            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingsByCriteria", conn);

                    sqlComm.Parameters.AddWithValue("@searchCriteria", searchCriteria);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListing = new Listing();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myListing.unitId = Convert.ToInt32(rdr["unitid"]);
                            ;
                           // myListing.userId = Convert.ToInt32(rdr["user_id"]);
                            myListing.source = rdr["source"].ToString();
                            myListing.listingType = rdr["listing_type"].ToString();
                            myListing.address1 = rdr["address"].ToString();
                            myListing.address2 = rdr["address2"].ToString();
                            myListing.city = rdr["city"].ToString();
                            myListing.stateProv = rdr["province"].ToString();
                            myListing.zipPostal = rdr["postal"].ToString();
                            myListing.country = rdr["country"].ToString();
                            myListing.latitude = Convert.ToDecimal(rdr["latitude"]);
                            myListing.longitude = Convert.ToDecimal(rdr["longitude"]);
                            myListing.baseCurrency = rdr["base_currency"].ToString();
                            myListing.taxPercentage = Convert.ToDecimal(rdr["tax_percentage"]);
                            myListing.locale = rdr["locale"].ToString();
                            myListing.title = rdr["title"].ToString();
                            myListing.listingNickname = rdr["nickname"].ToString();
                            myListing.description = rdr["description_property"].ToString();
                            myListing.numBedrooms = Convert.ToDouble(rdr["bedrooms"]);
                            myListing.numBathrooms = Convert.ToDouble(rdr["baths"]);
                            myListing.maxOccupancy = Convert.ToInt32(rdr["occupancy"]);
                            myListing.displayImage = rdr["displayImage"].ToString();
                            myListing.displayRate = Convert.ToDouble(rdr["displayRate"]);
                            theListings.Add(myListing);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theListings);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }

        }

        [HttpPost]
        public ActionResult GetFeaturedListingsForHomePage()
        {
            SqlDataReader rdr = null;
            List<Listing> theListings = new List<Listing>();
            Listing myListing = new Listing();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Featured Listings ";
            newAudit.description = "Type:Featured";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetFeaturedListings", conn);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListing = new Listing();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myListing.unitId = Convert.ToInt32(rdr["unitid"]);
                            ;
                            // myListing.userId = Convert.ToInt32(rdr["user_id"]);
                            myListing.source = rdr["source"].ToString();
                            myListing.listingType = rdr["listing_type"].ToString();
                            myListing.address1 = rdr["address"].ToString();
                            myListing.address2 = rdr["address2"].ToString();
                            myListing.city = rdr["city"].ToString();
                            myListing.stateProv = rdr["province"].ToString();
                            myListing.zipPostal = rdr["postal"].ToString();
                            myListing.country = rdr["country"].ToString();
                            myListing.latitude = Convert.ToDecimal(rdr["latitude"]);
                            myListing.longitude = Convert.ToDecimal(rdr["longitude"]);
                            myListing.baseCurrency = rdr["base_currency"].ToString();
                            myListing.taxPercentage = Convert.ToDecimal(rdr["tax_percentage"]);
                            myListing.locale = rdr["locale"].ToString();
                            myListing.title = rdr["title"].ToString();
                            myListing.description = rdr["description_property"].ToString();
                            myListing.numBedrooms = Convert.ToDouble(rdr["bedrooms"]);
                            myListing.numBathrooms = Convert.ToDouble(rdr["bathrooms"]);
                            myListing.maxOccupancy = Convert.ToInt32(rdr["occupancy"]);
                            myListing.displayImage = rdr["displayImage"].ToString();
                            myListing.displayRate = Convert.ToDouble(rdr["displayRate"]);
                            myListing.listingNumber = Convert.ToInt32(rdr["listingNumber"]);
                            myListing.geoSubText1= rdr["geoSubText1"].ToString();
                            myListing.geoSubText2 = rdr["geoSubText2"].ToString();
                            myListing.geoSubText3 = rdr["geoSubText3"].ToString();
                            myListing.listingNickname = rdr["nickname"].ToString();
                            theListings.Add(myListing);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theListings);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetListingByType(string type)
        {

            SqlDataReader rdr = null;
            List<Listing> theListings = new List<Listing>();
            Listing myListing = new Listing();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Listing By Type ";
            newAudit.description = "Type: " + type;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingsByType", conn);

                    sqlComm.Parameters.AddWithValue("@type", type);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myListing = new Listing();
                            //myListing.listingId = Convert.ToInt32(rdr["id"]); ;
                            myListing.unitId = Convert.ToInt32(rdr["unitid"]);
                            ;
                            // myListing.userId = Convert.ToInt32(rdr["user_id"]);
                            myListing.source = rdr["source"].ToString();
                            myListing.listingType = rdr["listing_type"].ToString();
                            myListing.address1 = rdr["address"].ToString();
                            myListing.address2 = rdr["address2"].ToString();
                            myListing.city = rdr["city"].ToString();
                            myListing.stateProv = rdr["province"].ToString();
                            myListing.zipPostal = rdr["postal"].ToString();
                            myListing.country = rdr["country"].ToString();
                            myListing.latitude = Convert.ToDecimal(rdr["latitude"]);
                            myListing.longitude = Convert.ToDecimal(rdr["longitude"]);
                            myListing.baseCurrency = rdr["base_currency"].ToString();
                            myListing.taxPercentage = Convert.ToDecimal(rdr["tax_percentage"]);
                            myListing.locale = rdr["locale"].ToString();
                            myListing.title = rdr["title"].ToString();
                            myListing.description = rdr["description_property"].ToString();
                            myListing.numBedrooms = Convert.ToDouble(rdr["bedrooms"]);
                            myListing.numBathrooms = Convert.ToDouble(rdr["bathrooms"]);
                            myListing.maxOccupancy = Convert.ToInt32(rdr["occupancy"]);
                            myListing.displayImage = rdr["displayImage"].ToString();
                            myListing.displayRate = Convert.ToDouble(rdr["displayRate"]);
                            myListing.listingNumber = Convert.ToInt32(rdr["listingNumber"]);
                            myListing.listingStatus = rdr["listingStatus"].ToString();
                            myListing.geoSubText1 = rdr["geoSubText1"].ToString();
                            myListing.geoSubText2 = rdr["geoSubText2"].ToString();
                            myListing.geoSubText3 = rdr["geoSubText3"].ToString();
                            myListing.featuredListing = rdr["featuredListing"].ToString();
                            theListings.Add(myListing);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theListings);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }

        }

        [HttpPost]
        public ActionResult UpdateListing(int id, string table,string field, string value, string user)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = user;
            newAudit.title = "Update Listing: " + id.ToString();
            newAudit.description = "Table:" + table + " | Field: " + field + " | Value: " + value;
            Boolean blnFld = false;


            if (field == "")
            {
                return Json(new { created = "false", exception = "No Field Passed" });
            }

            blnFld = CheckColumnInDB(field, table);

            if (blnFld)
            {

                try
                {

                    using (
                        SqlConnection conn =
                            new SqlConnection(
                                System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"]
                                    .ConnectionString)
                        )
                    {
                        conn.Open();
                        SqlCommand sqlComm = new SqlCommand("UpdateWithValue", conn);
                        value = value.Replace("'", "''");
                        sqlComm.Parameters.AddWithValue("@pField", field);
                        sqlComm.Parameters.AddWithValue("@pValue", value);
                        sqlComm.Parameters.AddWithValue("@pMyId", id);
                        sqlComm.Parameters.AddWithValue("@pMyTable", table);
                        sqlComm.CommandType = CommandType.StoredProcedure;
                        sqlComm.ExecuteNonQuery();
                        return Json(new {created = "true", exception = ""});

                    }
                }
                catch (Exception ex)
                {
                    string exception = ex.ToString();
                    return Json(new {created = "false", exception = exception});

                }
            }
            else
            {
                
                newAudit.title = "**INVALID** - " + newAudit.title;
                newAudit.description = "Table:" + table + " | Field: " + field + " | Value:" + value;
                AddLogRecord(newAudit);
                return Json(new { code = "Invalid Field" });
            }
        }

        [HttpPost]
        public ActionResult UpdateTicket(int id, string field, string value, string user)
        {

            //TODO Setup updatelisting to call this guy and pass what its updating...
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = user;
            newAudit.title = "Update Ticket: " + id.ToString();
            newAudit.description = "Field: " + field + " | Value: " + value;
            Boolean blnFld = false;


            if (field == "")
            {
                return Json(new { created = "false", exception = "No Field Passed" });
            }

            blnFld = CheckColumnInDB(field,"tickets");

            if (blnFld)
            {

                try
                {

                    using (
                        SqlConnection conn =
                            new SqlConnection(
                                System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"]
                                    .ConnectionString)
                        )
                    {
                        conn.Open();
                        SqlCommand sqlComm = new SqlCommand("UpdateWithValue", conn);

                        sqlComm.Parameters.AddWithValue("@pField", field);
                        sqlComm.Parameters.AddWithValue("@pValue", value);
                        sqlComm.Parameters.AddWithValue("@pMyId", id);
                        sqlComm.Parameters.AddWithValue("@pMyTable", "tickets");
                        sqlComm.CommandType = CommandType.StoredProcedure;
                        sqlComm.ExecuteNonQuery();
                        return Json(new {created = "true", exception = ""});

                    }
                }
                catch (Exception ex)
                {
                    string exception = ex.ToString();
                    return Json(new {created = "false", exception = exception});

                }
            }
            else
            {
                
                newAudit.title = "**INVALID** - " + newAudit.title;
                newAudit.description = " Field: " + field + " | Value:" + value;
                AddLogRecord(newAudit);
                return Json(new { code = "Invalid Field" });
            }
        }

        private Boolean CheckColumnInDB(string field, string table)
        {
            SqlDataReader rdr = null;
            AuditRecord newAudit = new AuditRecord();

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("checkcolumnindb", conn);

                    sqlComm.Parameters.AddWithValue("@ColName", field);
                    sqlComm.Parameters.AddWithValue("@TableName", table);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    var returnVal = sqlComm.ExecuteScalar();
                   

                    return true;
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.user = "System";
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return false;
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }

        }

        [HttpPost]
        public ActionResult AddNewListing(string title, string category)
        {

            string myReturnId = "0";
            try
            {

                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertNewListing", conn);

                    sqlComm.Parameters.AddWithValue("@listingTitle", title);
                    sqlComm.Parameters.AddWithValue("@listingCategory", category);

                    sqlComm.CommandType = CommandType.StoredProcedure;
                    myReturnId = sqlComm.ExecuteScalar().ToString();
                    return Json(new { id = myReturnId});

                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                return Json(new { id = exception });

            }
        }

        [HttpPost]
        public ActionResult ZipAndArchive(string listingId)
        {
            try
            {
                string archivePath = Server.MapPath("~/");
                string archiveFile = listingId + "  - Listing Pictures.zip";
                string archiveName = archivePath + "\\admin\\ListingZipFiles\\"  + archiveFile;
                string pictureLocation = archivePath + "\\img\\properties\\" + listingId;
                DirectoryInfo dir = new DirectoryInfo(archivePath + "\\admin\\ListingZipFiles\\");
                foreach (FileInfo fInfo in dir.GetFiles())
                {
                    if (fInfo.Name.Contains(archiveFile))
                    {
                        fInfo.Delete();
                    }
                }
                ZipFile.CreateFromDirectory(pictureLocation, archiveName, CompressionLevel.Optimal, true);
                //Response.ContentType ="application/zip";
                //Response.AddHeader("Content-Disposition", "attachment; filename=\"archiveFile\"");
                //Response.setHeader("Content-Length", myFile.length());
                //return File(archiveName, "application/zip", archiveFile);



                return Json(new { downloadPath = "/admin/ListingZipFiles/" + archiveFile });
            }
            catch (Exception ex)
            {
                AuditRecord newAudit = new AuditRecord();
                newAudit.user = "System";
                newAudit.title = "Zip File Creation  " + " **Error** ";
                newAudit.description = " Exception: " + ex.Message.ToString();
                AddLogRecord(newAudit);
                return Json(new { downloadPath = "ErrorDownloading" });
            }
        }

        [HttpPost]
        public ActionResult AuthenticateUser(string user, string pass)
        {
          
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Authenticating User ";
            newAudit.description = "User: " + user;
            string rtnVal = "Invalid";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("CheckLogin", conn);

                    sqlComm.Parameters.AddWithValue("@userName", user);
                    sqlComm.Parameters.AddWithValue("@passWord", pass);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rtnVal = sqlComm.ExecuteScalar().ToString();

                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(new { loginStatus = rtnVal });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { loginStatus = "Error" });
            }
           
        }

        //TODO:insert new message

        [HttpPost]
        public ActionResult GetListingMessages(string messageStatus)
        {

            SqlDataReader rdr = null;

            List<ListingMessage> theMessages = new List<ListingMessage>();
            ListingMessage myMessage = new ListingMessage();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Messages";
            newAudit.description = "Type: " + messageStatus;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetListingMessages", conn);

                    sqlComm.Parameters.AddWithValue("@messageStatus", messageStatus);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myMessage = new ListingMessage();

                            myMessage.messageId = Convert.ToInt32(rdr["id"]);
                            myMessage.createdBy = rdr["createdBy"].ToString();
                            myMessage.createdOn = rdr["createdOn"].ToString();
                            myMessage.listingId= Convert.ToInt32(rdr["listingId"]);
                            myMessage.messageBody = rdr["messageBody"].ToString();
                            myMessage.messageTitle = rdr["messageTitle"].ToString();
                            myMessage.messageType = rdr["messageTitle"].ToString();
                            myMessage.messageStatus = rdr["messageStatus"].ToString();
                            myMessage.replyBy = rdr["replyBy"].ToString();
                            myMessage.replyOn = rdr["replyOn"].ToString();
                            theMessages.Add(myMessage);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theMessages);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetFormSubmissions(string messageStatus)
        {

            SqlDataReader rdr = null;

            List<FormRequests> theMessages = new List<FormRequests>();
            FormRequests myMessage = new FormRequests();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Form Submissions";
            newAudit.description = "Type: " + messageStatus;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetFormRequests", conn);

                    sqlComm.Parameters.AddWithValue("@messageStatus", messageStatus);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myMessage = new FormRequests();

                            myMessage.id = Convert.ToInt32(rdr["id"]);
                            myMessage.firstName = rdr["fname"].ToString();
                            myMessage.lastName = rdr["lname"].ToString();
                            myMessage.email = rdr["email"].ToString();
                            myMessage.phone = rdr["phone"].ToString();
                            myMessage.travelTo = rdr["travelTo"].ToString();
                            myMessage.monthToGo = rdr["monthToGo"].ToString();
                            myMessage.budget = rdr["budget"].ToString();
                            myMessage.occasion = rdr["occasion"].ToString();
                            myMessage.createdOn = rdr["createdOn"].ToString();
                            myMessage.status = rdr["status"].ToString();
                            myMessage.submissionPage = rdr["submissionPage"].ToString();
                            theMessages.Add(myMessage);
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(theMessages);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        [HttpPost]
        public ActionResult GetProfileInformation(string user)
        {

            SqlDataReader rdr = null;

            UserProfile myProfile = new UserProfile();
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Get Profile Information ";
            newAudit.description = "User: " + user;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetProfileInformation", conn);

                    sqlComm.Parameters.AddWithValue("@userName", user);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            myProfile = new UserProfile();
                            
                            myProfile.firstName = rdr["firstName"].ToString();
                            myProfile.lastName = rdr["lastName"].ToString();
                            myProfile.userType = rdr["userType"].ToString();
                            myProfile.phoneNumber = rdr["phoneNumber"].ToString();
                            myProfile.emailAddress = rdr["emailAddress"].ToString();
                            myProfile.profileImage = rdr["profileImage"].ToString();
                        }
                    }
                    newAudit.title = "**Success** - " + newAudit.title;
                    AddLogRecord(newAudit);



                    return Json(myProfile);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { code = exception });
            }
            finally
            {
                // 3. close the reader
                if (rdr != null)
                {
                    rdr.Close();
                }

            }
        }

        private void MovePictureToListingFolder(string listingId, string imgName)
        {
            //Go find the image in the temp directory
            //create copy and save into /img/properties/listingid/imgname
            //delete from temp directory

            string sourcePath = System.Web.HttpContext.Current.Server.MapPath("~/uploads/temp/");
            string targetPath = System.Web.HttpContext.Current.Server.MapPath("~/img/properties/" + listingId + "/");

            string sourceFile = System.IO.Path.Combine(sourcePath, imgName);
            string destFile = System.IO.Path.Combine(targetPath, imgName);

            if (!System.IO.Directory.Exists(targetPath))
            {
                System.IO.Directory.CreateDirectory(targetPath);
            }
            System.IO.File.Copy(sourceFile, destFile, true);
            

            //delete from temp directory
            System.IO.File.Delete(sourceFile);
        }

        [HttpPost]
        public ActionResult UpdateListingPicture(string listingId, string imgName)
        {

          
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "Updating Listing Picture ";
            newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
            string pictureSequence = "";

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("UpdateListingPicture", conn);

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@imgName", imgName);

                    sqlComm.CommandType = CommandType.StoredProcedure;

                    pictureSequence = sqlComm.ExecuteScalar().ToString();
                    MovePictureToListingFolder(listingId, imgName);

                    return Json(new { sequenceNumber = pictureSequence });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                AddLogRecord(newAudit);
                return Json(new { sequenceNumber = "0" });
            }
            
        }




        [HttpPost]
        public ActionResult AddLogRecord(AuditRecord newAudit)
        {
            try
            {

                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("InsertAuditRecord", conn);

                    sqlComm.Parameters.AddWithValue("@user", newAudit.user);
                    sqlComm.Parameters.AddWithValue("@title", newAudit.title);
                    sqlComm.Parameters.AddWithValue("@description", newAudit.description);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.ExecuteNonQuery();
                    return Json(new {created = "true", exception = ""});

                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                return Json(new {created = "false", exception = exception});

            }
        }

        [HttpPost]
        public ActionResult GetTicketCSV()
        {
            
            string fileName = "TicketCSV";

            string rightNow = DateTime.Now.ToFileTime().ToString();

            using (SqlConnection conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString))
            {
                conn.Open();
                SqlCommand sqlComm = new SqlCommand("getalltickets", conn);
                sqlComm.Parameters.AddWithValue("@statusCode", "");
                sqlComm.Parameters.AddWithValue("@assignedTo", "");
                sqlComm.Parameters.AddWithValue("@createdBy", "");
                //sqlComm.Parameters.AddWithValue("@userName", "PF\\" + userName);

                sqlComm.CommandType = CommandType.StoredProcedure;
                sqlComm.CommandTimeout = 90;
                SqlDataReader dr = sqlComm.ExecuteReader();
                string csvFolder = Server.MapPath("/admin/ticketing/download");
                //string csvFolder = System.Configuration.ConfigurationManager.AppSettings["csvLocation"];

                //DirectoryInfo dir = new DirectoryInfo("\\\\scrweb01d-v\\inetpub\\ricky\\x");
                var memStream = new MemoryStream();

                using (StreamWriter fs = new StreamWriter(csvFolder + "/" + fileName + "-" + rightNow + ".csv"))
                {
                    // Loop through the fields and add headers
                    for (int i = 0; i < dr.FieldCount; i++)
                    {
                        string name = dr.GetName(i);
                        if (name.Contains(","))
                            name = "\"" + name + "\"";

                        fs.Write(name + ",");
                    }
                    fs.WriteLine();

                    // Loop through the rows and output the data
                    while (dr.Read())
                    {
                        for (int i = 0; i < dr.FieldCount; i++)
                        {
                            string value = dr[i].ToString();
                            if (value.Contains(","))
                                value = "\"" + value + "\"";

                            fs.Write(value + ",");
                        }
                        fs.WriteLine();
                    }


                    fs.Flush();
                    //memStream.Seek(0, SeekOrigin.Begin);
                    //fs.Close();
                    return Json(new { created = "true", fileLocation = fileName + "-" + rightNow + ".csv" });

                  //  return offerName + " - " + summOrDet + " - " + userName + " - " + rightNow + ".csv";

                    //return new FileContentResult(memStream.ToArray(), "text/html");
                }
            }

        }

        public bool WriteDataTableToExcel(System.Data.DataTable dataTable, string worksheetName, string saveAsLocation, string ReporType)
        {
            Microsoft.Office.Interop.Excel.Application excel;
            Microsoft.Office.Interop.Excel.Workbook excelworkBook;
            Microsoft.Office.Interop.Excel.Worksheet excelSheet;
            Microsoft.Office.Interop.Excel.Range excelCellrange;

            try
            {
                // Start Excel and get Application object.
                excel = new Microsoft.Office.Interop.Excel.Application();

                // for making Excel visible
                excel.Visible = false;
                excel.DisplayAlerts = false;

                // Creation a new Workbook
                excelworkBook = excel.Workbooks.Add(Type.Missing);

                // Workk sheet
                excelSheet = (Microsoft.Office.Interop.Excel.Worksheet)excelworkBook.ActiveSheet;
                excelSheet.Name = worksheetName;

                excelSheet.Cells[1, 1] = ReporType;
                excelSheet.Cells[1, 2] = "Date : " + DateTime.Now.ToShortDateString();

                // loop through each row and add values to our sheet
                int rowcount = 2;

                foreach (DataRow datarow in dataTable.Rows)
                {
                    rowcount += 1;
                    for (int i = 1; i <= dataTable.Columns.Count; i++)
                    {
                        // on the first iteration we add the column headers
                        if (rowcount == 3)
                        {
                            excelSheet.Cells[2, i] = dataTable.Columns[i - 1].ColumnName;
                            excelSheet.Cells.Font.Color = System.Drawing.Color.Black;
                        }

                        excelSheet.Cells[rowcount, i] = datarow[i - 1].ToString();

                        //for alternate rows
                        if (rowcount > 3)
                        {
                            if (i == dataTable.Columns.Count)
                            {
                                if (rowcount % 2 == 0)
                                {
                                    excelCellrange = excelSheet.Range[excelSheet.Cells[rowcount, 1], excelSheet.Cells[rowcount, dataTable.Columns.Count]];
                                    FormattingExcelCells(excelCellrange, "#CCCCFF", System.Drawing.Color.Black, false);
                                }

                            }
                        }
                    }
                }

                // now we resize the columns
                excelCellrange = excelSheet.Range[excelSheet.Cells[1, 1], excelSheet.Cells[rowcount, dataTable.Columns.Count]];
                excelCellrange.EntireColumn.AutoFit();
                Microsoft.Office.Interop.Excel.Borders border = excelCellrange.Borders;
                border.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                border.Weight = 2d;


                excelCellrange = excelSheet.Range[excelSheet.Cells[1, 1], excelSheet.Cells[2, dataTable.Columns.Count]];
                FormattingExcelCells(excelCellrange, "#000099", System.Drawing.Color.White, true);


                //now save the workbook and exit Excel

                excelworkBook.SaveAs(saveAsLocation); ;
                excelworkBook.Close();
                excel.Quit();

                return true;
            }
            catch (Exception ex)
            {
               // DXMessageBox.Show(ex.Message);
                return false;
            }
            finally
            {
                excelSheet = null;
                excelCellrange = null;
                excelworkBook = null;
            }

        }

        /// <summary>
        /// FUNCTION FOR FORMATTING EXCEL CELLS
        /// </summary>
        /// <param name="range"></param>
        /// <param name="HTMLcolorCode"></param>
        /// <param name="fontColor"></param>
        /// <param name="IsFontbool"></param>
        public void FormattingExcelCells(Microsoft.Office.Interop.Excel.Range range, string HTMLcolorCode, System.Drawing.Color fontColor, bool IsFontbool)
        {
            range.Interior.Color = System.Drawing.ColorTranslator.FromHtml(HTMLcolorCode);
            range.Font.Color = System.Drawing.ColorTranslator.ToOle(fontColor);
            if (IsFontbool == true)
            {
                range.Font.Bold = IsFontbool;
            }
        }
    }
}

