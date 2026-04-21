import { Request, Response } from "express";
import Form from "../models/Pages.model";
import FormField from "../models/FormField.model";
import FormSubmission from "../models/FormSubmission.model";
import { sendEmail } from "../utils/emailService";
import OtpSchema from "../models/Otp.model";
import User from "../models/User.model";
import { createLead } from "../utils/ZohoCms";
import { refreshZohoToken } from "../utils/RefreashToken";

// HTML Email Template for User Confirmation
const generateUserEmail = (
  formName: string,
  userName: string,
  submissionData: any,
) => {
  const dataRows = Object.entries(submissionData)
    .map(
      ([key, value]) => `
            <tr>
                <td style="padding: 12px 15px; border: 1px solid #e0e0e0; background-color: #f8f9fa; font-weight: 600; text-transform: capitalize; width: 35%;">
                    ${key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/[_-]/g, " ")
                      .trim()}
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e0e0e0;">
                    ${value || "-"}
                </td>
            </tr>
        `,
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Thank You for Your Submission!</h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px 20px;">
                    <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear <strong>${userName || "Valued Customer"}</strong>,
                    </p>
                    <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                        Thank you for submitting your inquiry for <strong>${formName}</strong>. We have received your request and our team will get back to you shortly.
                    </p>
                    
                    <!-- Submission Details -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Your Submission Details:</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            ${dataRows}
                        </table>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">
                        If you have any questions, please don't hesitate to contact us.
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #888; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} DuDigital Global. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// HTML Email Template for Admin Notification
const generateAdminEmail = (
  formName: string,
  formSlug: string,
  userName: string,
  userEmail: string,
  userPhone: string,
  submissionData: any,
) => {
  const dataRows = Object.entries(submissionData)
    .map(
      ([key, value]) => `
            <tr>
                <td style="padding: 12px 15px; border: 1px solid #e0e0e0; background-color: #f8f9fa; font-weight: 600; text-transform: capitalize; width: 35%;">
                    ${key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/[_-]/g, " ")
                      .trim()}
                </td>
                <td style="padding: 12px 15px; border: 1px solid #e0e0e0;">
                    ${value || "-"}
                </td>
            </tr>
        `,
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔔 New Form Submission</h1>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px 20px;">
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            <strong>New submission received for:</strong> ${formName}
                        </p>
                        <p style="color: #856404; margin: 5px 0 0 0; font-size: 12px;">
                            Form Slug: ${formSlug}
                        </p>
                    </div>
                    
                    <!-- User Info -->
                    <div style="background-color: #e7f3ff; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                        <h3 style="color: #0066cc; margin: 0 0 10px 0; font-size: 16px;">👤 User Information</h3>
                        <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${userName || "Not provided"}</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${userEmail || "Not provided"}</p>
                        <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${userPhone || "Not provided"}</p>
                    </div>
                    
                    <!-- Submission Details -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">📝 Submission Details:</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            ${dataRows}
                        </table>
                    </div>
                    
                    <div style="margin-top: 25px; text-align: center;">
                        <p style="color: #666; font-size: 12px;">
                            Submitted at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #333; padding: 20px; text-align: center;">
                    <p style="color: #fff; font-size: 12px; margin: 0;">
                        DuDigital Admin Panel
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Submit form by slug (Public API)
export const submitFormBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const submissionData = req.body;
    // console.log("slug", slug);
    if (!submissionData["otp"]) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find form by slug
    const form = await Form.findOne({ slug, isActive: true });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Get form fields for validation
    const formFields = await FormField.find({
      formId: form._id,
      isActive: true,
    });

    // Validate required fields
    const missingFields: string[] = [];
    formFields.forEach((field: any) => {
      if (field.required && !submissionData[field.name]) {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    // Extract user info from common field names
    const userName =
      submissionData.fullName ||
      submissionData.name ||
      submissionData.firstName ||
      submissionData.Last_Name ||
      "";
    const userEmail =
      submissionData.email ||
      submissionData.userEmail ||
      submissionData.emailAddress ||
      submissionData.Email ||
      "";
    const userPhone =
      submissionData.mobile ||
      submissionData.phone ||
      submissionData.mobileNumber ||
      submissionData.phoneNumber ||
      submissionData.number ||
      submissionData.Phone ||
      "";

    // Create form submission
    const otp = await OtpSchema.findOne({
      mobile: userPhone,
      otp: submissionData["otp"],
      $or: [
        { createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } },
        { updatedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } },
      ],
    });

    if (!otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await OtpSchema.deleteOne({
      mobile: userPhone,
      otp: submissionData["otp"],
    });

 

    const token = await refreshZohoToken()

    //  const formSubmission = new FormSubmission({
    //     formId: form._id,
    //     formSlug: slug,
    //     formName: form.name,
    //     submissionData,
    //     userName,
    //     userEmail,
    //     userPhone,
    //     status: "new"
    // });

    // const savedSubmission = await formSubmission.save()

    submissionData.Lead_Source = slug;

    await createLead(submissionData, token);
   res.status(201).json({
      message: "Form submitted successfully",
    });
    // Send confirmation email to user
 
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Error submitting form", error });
  }
};

// Get all form submissions (Admin)
export const getFormSubmissions = async (req: Request, res: Response) => {
  try {
    const { formId, status, page = 1, limit = 20 } = req.query;

    const filter: any = { isActive: true };
    if (formId) filter.formId = formId;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [submissions, total] = await Promise.all([
      FormSubmission.find(filter)
        .populate("formId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      FormSubmission.countDocuments(filter),
    ]);

    res.status(200).json({
      submissions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching form submissions", error });
  }
};

// Get single form submission by ID (Admin)
export const getFormSubmissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await FormSubmission.findById(id).populate(
      "formId",
      "name slug",
    );

    if (!submission) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    // Mark as read if it's new
    if (submission.status === "new") {
      submission.status = "read";
      await submission.save();
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Error fetching form submission", error });
  }
};

// Update form submission status (Admin)
export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const submission = await FormSubmission.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("formId", "name slug");

    if (!submission) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Error updating form submission", error });
  }
};

// Delete form submission (Admin - soft delete)
export const deleteFormSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await FormSubmission.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!submission) {
      return res.status(404).json({ message: "Form submission not found" });
    }

    res.status(200).json({ message: "Form submission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form submission", error });
  }
};

// Get submissions by form slug (Admin)
export const getSubmissionsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = { formSlug: slug, isActive: true };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [submissions, total] = await Promise.all([
      FormSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      FormSubmission.countDocuments(filter),
    ]);

    res.status(200).json({
      submissions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions by slug", error });
  }
};

// Get submission stats (Admin)
export const getSubmissionStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalSubmissions,
      newSubmissions,
      readSubmissions,
      respondedSubmissions,
      closedSubmissions,
      todaySubmissions,
    ] = await Promise.all([
      FormSubmission.countDocuments({ isActive: true }),
      FormSubmission.countDocuments({ status: "new", isActive: true }),
      FormSubmission.countDocuments({ status: "read", isActive: true }),
      FormSubmission.countDocuments({ status: "responded", isActive: true }),
      FormSubmission.countDocuments({ status: "closed", isActive: true }),
      FormSubmission.countDocuments({
        isActive: true,
        createdAt: { $gte: today },
      }),
    ]);

    // Get submissions by form
    const submissionsByForm = await FormSubmission.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$formSlug",
          count: { $sum: 1 },
          formName: { $first: "$formName" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      total: totalSubmissions,
      today: todaySubmissions,
      byStatus: {
        new: newSubmissions,
        read: readSubmissions,
        responded: respondedSubmissions,
        closed: closedSubmissions,
      },
      byForm: submissionsByForm,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching submission stats", error });
  }
};

// Get today's submissions for dashboard
export const getTodaySubmissions = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySubmissions = await FormSubmission.find({
      isActive: true,
      createdAt: { $gte: today },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(todaySubmissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching today's submissions", error });
  }
};
