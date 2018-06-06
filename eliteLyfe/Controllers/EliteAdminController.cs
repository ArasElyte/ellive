using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using eliteLyfe.Models;
using mscomctl;
using Microsoft.Ajax.Utilities;
using WebGrease.Css.Ast;

namespace eliteLyfe.Controllers
{
    public class EliteAdminController : Controller
    {
        // GET: EliteAdmin
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SaveListingAbout(int listingId, string userId, string category, string headline, string propertyName, string status, string sqFt, string maxOccupancy, string bed, string bath, string checkIn, string checkOut, string description, string featured, string tags)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "SaveListingAbout";
           // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
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
                    SqlCommand sqlComm = new SqlCommand("SaveListingAbout", conn);
                    sqlComm.CommandType=CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@userid", userId);
                    sqlComm.Parameters.AddWithValue("@category", category);
                    sqlComm.Parameters.AddWithValue("@headline", headline);
                    sqlComm.Parameters.AddWithValue("@propertyName", propertyName);
                    sqlComm.Parameters.AddWithValue("@status", status);
                    sqlComm.Parameters.AddWithValue("@sqFt", sqFt);
                    sqlComm.Parameters.AddWithValue("@maxOccupancy", maxOccupancy);
                    sqlComm.Parameters.AddWithValue("@bed", bed);
                    sqlComm.Parameters.AddWithValue("@bath", bath);
                    sqlComm.Parameters.AddWithValue("@checkIn", checkIn);
                    sqlComm.Parameters.AddWithValue("@checkOut", checkOut);
                    sqlComm.Parameters.AddWithValue("@description", description);
                    sqlComm.Parameters.AddWithValue("@featured", featured);
                    sqlComm.Parameters.AddWithValue("@tags", tags);

                    //
                    pictureSequence = sqlComm.ExecuteNonQuery().ToString();
                   

                    return Json(new { created = pictureSequence });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }

        }

        public ActionResult SaveListingLocation(int listingId, string userId, string geoSub1, string geoSub2, string geoSub3, string address, string address2, string country, string city, string state, string zip, string latitude, string longitude, string currency, string tax, string service)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "SaveListingLocation";
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
            string pictureSequence = "";

            if (geoSub1 == "null")
            {
                geoSub1 = "0";
            }
            if (geoSub2 == "null")
            {
                geoSub2 = "0";
            }
            if (geoSub3 == "null")
            {
                geoSub3 = "0";
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
                    SqlCommand sqlComm = new SqlCommand("SaveListingLocation", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@userid", userId);
                    sqlComm.Parameters.AddWithValue("@geoSub1", geoSub1);
                    sqlComm.Parameters.AddWithValue("@geoSub2", geoSub2);
                    sqlComm.Parameters.AddWithValue("@geoSub3", geoSub3);
                    sqlComm.Parameters.AddWithValue("@address", address);
                    sqlComm.Parameters.AddWithValue("@address2", address2);
                    sqlComm.Parameters.AddWithValue("@country", country);
                    sqlComm.Parameters.AddWithValue("@city", city);
                    sqlComm.Parameters.AddWithValue("@state", state);
                    sqlComm.Parameters.AddWithValue("@zip", zip);
                    sqlComm.Parameters.AddWithValue("@latitude", latitude);
                    sqlComm.Parameters.AddWithValue("@longitude", longitude);
                    sqlComm.Parameters.AddWithValue("@currency", currency);
                    sqlComm.Parameters.AddWithValue("@tax", tax);
                    sqlComm.Parameters.AddWithValue("@service", service);


                    //
                    pictureSequence = sqlComm.ExecuteNonQuery().ToString();


                    return Json(new { created = pictureSequence });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = "0" });
            }
        }

        public ActionResult UpdatePictureText(string listingId, string pictureId, string text)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "UpdatePictureText";
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
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
                    SqlCommand sqlComm = new SqlCommand("UpdatePictureText", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@pictureId", pictureId);
                    sqlComm.Parameters.AddWithValue("@text", text);
                    
                    pictureSequence = sqlComm.ExecuteNonQuery().ToString();


                    return Json(new { created = pictureSequence });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }

        }

        public ActionResult SaveListingOwner(int listingId, string userId, string ownerFName, string ownerLName,
            string ownerPhone, string ownerEmail, string ownerAddress, string ownerAddress2, string ownerCountry,
            string ownerCity, string ownerState, string ownerZip, string ownerCommission, string ownerAgent,
            string reservationFName, string reservationLName, string reservationPhone, string reservationEmail,
            string conciergeFName, string conciergeLName, string conciergePhone, string conciergeEmail, string ownerCompany, string reservationCompany, string conciergeCompany)
        {
            AuditRecord newAudit = new AuditRecord();
            newAudit.user = "System";
            newAudit.title = "SaveListingOwner";
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
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
                    SqlCommand sqlComm = new SqlCommand("SaveListingOwner", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@userid", userId);
                    sqlComm.Parameters.AddWithValue("@ownerFName", ownerFName);
                    sqlComm.Parameters.AddWithValue("@ownerLName", ownerLName);
                    sqlComm.Parameters.AddWithValue("@ownerPhone", ownerPhone);
                    sqlComm.Parameters.AddWithValue("@ownerEmail", ownerEmail);
                    sqlComm.Parameters.AddWithValue("@ownerAddress", ownerAddress);
                    sqlComm.Parameters.AddWithValue("@ownerAddress2", ownerAddress2);
                    sqlComm.Parameters.AddWithValue("@ownerCountry", ownerCountry);
                    sqlComm.Parameters.AddWithValue("@ownerCity", ownerCity);
                    sqlComm.Parameters.AddWithValue("@ownerState", ownerState);
                    sqlComm.Parameters.AddWithValue("@ownerZip", ownerZip);
                    sqlComm.Parameters.AddWithValue("@ownerCommission", ownerCommission);
                    sqlComm.Parameters.AddWithValue("@ownerAgent", ownerAgent);
                    sqlComm.Parameters.AddWithValue("@reservationFName", reservationFName);
                    sqlComm.Parameters.AddWithValue("@reservationLName", reservationLName);
                    sqlComm.Parameters.AddWithValue("@reservationPhone", reservationPhone);
                    sqlComm.Parameters.AddWithValue("@reservationEmail", reservationEmail);
                    sqlComm.Parameters.AddWithValue("@conciergeFName", conciergeFName);
                    sqlComm.Parameters.AddWithValue("@conciergeLName", conciergeLName);
                    sqlComm.Parameters.AddWithValue("@conciergePhone", conciergePhone);
                    sqlComm.Parameters.AddWithValue("@conciergeEmail", conciergeEmail);
                    sqlComm.Parameters.AddWithValue("@ownerCompany", ownerCompany);
                    sqlComm.Parameters.AddWithValue("@reservationCompany", reservationCompany);
                    sqlComm.Parameters.AddWithValue("@conciergeCompany", conciergeCompany);


                    //
                    pictureSequence = sqlComm.ExecuteNonQuery().ToString();


                    return Json(new { created = pictureSequence });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }
        }

        public ActionResult GetFeeInfo(int listingId, int feeId)
        {
            AuditRecord newAudit = new AuditRecord();
            SqlDataReader rdr = null;
            newAudit.user = "System";
            newAudit.title = "GetFeeInfo";
            Fees thisFee = new Fees();
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetFeeInfo", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@feeId", feeId);

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            thisFee = new Fees();
                            thisFee.feeType = rdr["feeType"].ToString();
                            thisFee.feeAmount = Convert.ToDouble(rdr["feeAmount"]);
                        }
                    }

                    return Json(thisFee);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }

        }
        public ActionResult UpdateFee(int listingId, int feeId, string feeType, string feeAmount)
        {
            AuditRecord newAudit = new AuditRecord();
            //SqlDataReader rdr = null;
            newAudit.user = "System";
            newAudit.title = "UpdateFee";
           // Fees thisFee = new Fees();
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("SaveFeeInfo", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;
                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@feeId", feeId);
                    sqlComm.Parameters.AddWithValue("@feeType", feeType);
                    sqlComm.Parameters.AddWithValue("@feeAmount", feeAmount);
                    var nothing = sqlComm.ExecuteNonQuery();
                    return Json(new { updated = "true" });
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }

        }
        public ActionResult UpdateRate(int listingId, int rateId, string rateType, string rateAmount,string startDate, string endDate, string minStay, string cancelPolicy )
        {
            AuditRecord newAudit = new AuditRecord();
            //SqlDataReader rdr = null;
            newAudit.user = "System";
            newAudit.title = "UpdateRate";
            // Fees thisFee = new Fees();
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;

            bool updateThisRate = false;

            if (startDate == "" && endDate == "")
            {
                updateThisRate = true;
            }
            else
            {
                updateThisRate = isDateRangeValid(listingId, rateId, startDate, endDate);
            }

            updateThisRate = true;

            if (updateThisRate)
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
                        SqlCommand sqlComm = new SqlCommand("SaveRateInfo", conn);
                        sqlComm.CommandType = CommandType.StoredProcedure;
                        sqlComm.Parameters.AddWithValue("@listingId", listingId);
                        sqlComm.Parameters.AddWithValue("@rateId", rateId);
                        sqlComm.Parameters.AddWithValue("@rateType", rateType);
                        sqlComm.Parameters.AddWithValue("@rateAmount", rateAmount);
                        sqlComm.Parameters.AddWithValue("@startDate", startDate);
                        sqlComm.Parameters.AddWithValue("@endDate", endDate);
                        sqlComm.Parameters.AddWithValue("@minStay", minStay);
                        sqlComm.Parameters.AddWithValue("@cancelDays", cancelPolicy);
                        var nothing = sqlComm.ExecuteNonQuery();
                        return Json(new {updated = "true",error=""});
                    }
                }
                catch (Exception ex)
                {
                    string exception = ex.ToString();
                    newAudit.title = "**Failure** - " + newAudit.title;
                    newAudit.description = " Exception: " + exception;
                    //AddLogRecord(newAudit);
                    return Json(new {updated="false",error = exception});
                }
            }
            else
            {
                return Json(new { updated = "false", error = "Invalid Date Range - Rate was not updated!" });
            }

        }

        private bool isDateRangeValid(int listingId, int rateId,string startDate, string endDate)
        {
            bool isValid = false;

            string rtnString = "";

            // IsRateDateRangeVaild

            AuditRecord newAudit = new AuditRecord();
            SqlDataReader rdr = null;
            newAudit.user = "System";
            newAudit.title = "IsRateDateRangeVaild";
            Fees thisFee = new Fees();
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;

            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("IsRateDateRangeVaild", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@rateId", rateId);
                    sqlComm.Parameters.AddWithValue("@startDate", startDate);
                    sqlComm.Parameters.AddWithValue("@endDate", endDate);

                    rtnString = sqlComm.ExecuteScalar().ToString();
                    string BS = rtnString;

                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            rtnString = rdr["isValid"].ToString();
                        }
                    }

                    if (rtnString == "True")
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }


                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                isValid = false;
                return false;
            }

            //return isValid;
        }

        public ActionResult GetRateInfo(int listingId, int rateId)
        {
            AuditRecord newAudit = new AuditRecord();
            SqlDataReader rdr = null;
            newAudit.user = "System";
            newAudit.title = "GetRateInfo";
            Rates thisRate = new Rates();
            // newAudit.description = "Listing Id: " + listingId + " | Image Name: " + imgName;
           
            try
            {
                using (
                    SqlConnection conn =
                        new SqlConnection(
                            System.Configuration.ConfigurationManager.ConnectionStrings["dbConnection"].ConnectionString)
                    )
                {
                    conn.Open();
                    SqlCommand sqlComm = new SqlCommand("GetRateInfo", conn);
                    sqlComm.CommandType = CommandType.StoredProcedure;

                    sqlComm.Parameters.AddWithValue("@listingId", listingId);
                    sqlComm.Parameters.AddWithValue("@rateId", rateId);
                    
                    rdr = sqlComm.ExecuteReader();

                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            thisRate = new Rates();

                            //myListingAmenity.amenityType = rdr["type"].ToString();
                            thisRate.rateType = rdr["rateType"].ToString();
                            thisRate.rateAmount = Convert.ToDouble(rdr["rateAmount"]);
                            thisRate.startDate= rdr["startDate"].ToString();
                            thisRate.endDate = rdr["endDate"].ToString();
                            thisRate.minStay =rdr["minStay"].ToString();
                            thisRate.cancelDays = rdr["cancelDays"].ToString();

                        }
                    }

                    return Json(thisRate);
                }
            }
            catch (Exception ex)
            {
                string exception = ex.ToString();
                newAudit.title = "**Failure** - " + newAudit.title;
                newAudit.description = " Exception: " + exception;
                //AddLogRecord(newAudit);
                return Json(new { sequenceNumber = exception });
            }

        }
    }
}