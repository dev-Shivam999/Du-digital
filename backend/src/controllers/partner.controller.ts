import { Request, Response } from "express";
import PartnerProgram from "../models/PartnerProgram.model";
import Partner from "../models/Partner.model";
import User from "../models/User.model";
import { sendEmail } from "../utils/emailService";
import OtpSchema from "../models/Otp.model";
import { refreshZohoToken } from "../utils/RefreashToken";
import { createLead } from "../utils/ZohoCms";

export const createPartnerRequest = async (req: Request, res: Response) => {
    try {
        const formData = req.body;
        const {Last_Name,Email,City,Looking_For,Business_Name, Country, Phone ,otp }=formData   

        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }
        const otp2 = await OtpSchema.findOne({
            mobile: Phone,
            otp: otp,
            $or: [
                { createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } },
                { updatedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } }
            ]
        })
        if (!otp2) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await OtpSchema.deleteOne({
            mobile: Phone,
            otp: otp
        })
        // const newRequest = new PartnerProgram({
        //     fullName,
        //     email,
        //     phone,
        //     lookingFor,
        //     city,
        //     isMsg,
        //     businessName,
        //     status: "Pending" // Default status
        // });

        // await newRequest.save();

        const token = await refreshZohoToken()
            formData.Lead_Source = "BecomePartner";
        
            await createLead(formData, token);
        // Find users who should receive notifications
        // const recipients = await User.find({ receivePartnerNotifications: true }).select('email');
        // const recipientEmails = recipients.map(user => user.email);

        // if (recipientEmails.length > 0) {
        //     const emailSubject = `New Partner Program Inquiry: ${Last_Name}`;
        //     const emailBody = `
        //         <h2>New Partner Inquiry</h2>
        //         <p><strong>Name:</strong> ${Last_Name}</p>
        //        ${Business_Name ? `<p><strong>Business Name:</strong> ${Business_Name || 'N/A'}</p>` : `<p><strong>Country Name:</strong> ${Country || 'N/A'}</p>`}
        //         <p><strong>Email:</strong> ${Email}</p>
        //         <p><strong>Phone:</strong> ${Phone || 'N/A'}</p>
        //         <p><strong>Looking For:</strong> ${Looking_For || 'N/A'}</p>
        //         <p><strong>City:</strong> ${City || 'N/A'}</p>
        //         <br />
        //         <p>Please check the admin panel for more details.</p>
        //     `;
        //     await sendEmail(recipientEmails, emailSubject, emailBody);
        // }

        res.status(201).json({ message: "Partner request submitted successfully", request: "" });
    } catch (error) {
        console.error("Create Partner Request Error", error);
        res.status(500).json({ message: "Error submitting request" });
    }
};

export const getPartnerRequests = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        let query: any = {};

        if (status) {

            query.status = status;
        }

        const requests = await PartnerProgram.find(query).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error("Get Partner Requests Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updatePartnerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pending", "On Process", "Complete", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedRequest = await PartnerProgram.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        // If status is "Complete", automatically add to Partners table
        if (status === "Complete") {
            const files = (req as any).files;
            const { date, country } = req.body;
            let logoUrl = "https://via.placeholder.com/150";
            let userImageUrl = "https://via.placeholder.com/150";

            if (files) {
                if (files.logo && files.logo[0]) {
                    logoUrl = `/uploads/${files.logo[0].filename}`;
                }
                if (files.userImage && files.userImage[0]) {
                    userImageUrl = `/uploads/${files.userImage[0].filename}`;
                }
            }

            const existingPartner = await Partner.findOne({ partnerProgramId: updatedRequest._id });
            if (!existingPartner) {
                await Partner.create({
                    name: updatedRequest.fullName,
                    partnerProgramId: updatedRequest._id,
                    BussnessName: updatedRequest.businessName || "Pending Business Name",
                    logo: logoUrl,
                    country: country,
                    userImage: userImageUrl,
                    description: updatedRequest.lookingFor,
                    isOfficial: false, // Default to false until verified manually
                    isActive: true,
                    year: new Date(date).getFullYear().toString()
                });
            }

            // Send Welcome Email to the Partner
            try {
                const emailSubject = "Welcome to the DuDigital Partner Program!";
                const emailBody = `
                    <h2>Congratulations, ${updatedRequest.fullName}!</h2>
                    <p>We are thrilled to welcome you to the DuDigital Partner Program.</p>
                    <p>Your application has been approved and you are now an official partner.</p>
                    <p><strong>Business Name:</strong> ${updatedRequest.businessName || 'N/A'}</p>
                    <br />
                    <p>We look forward to a successful partnership.</p>
                    <p>Best Regards,</p>
                    <p>The DuDigital Team</p>
                `;
                await sendEmail(updatedRequest.email, emailSubject, emailBody);
            } catch (emailError) {
                console.error("Error sending welcome email to partner:", emailError);
                // Don't fail the request if email fails, just log it
            }
        }

        // If status changed to Pending or Rejected, remove the partner if they exist
        if (status === "Pending" || status === "Rejected") {
            const existingPartner = await Partner.findOne({ partnerProgramId: updatedRequest._id });
            if (existingPartner) {
                await Partner.findByIdAndDelete(existingPartner._id);
            }
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("Update Partner Status Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getPartnerStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalRequests = await PartnerProgram.countDocuments();
        const todayRequests = await PartnerProgram.countDocuments({
            createdAt: { $gte: today }
        });

        // Maybe add stats by status too?
        const pending = await PartnerProgram.countDocuments({ status: "Pending" });
        const onProcess = await PartnerProgram.countDocuments({ status: "On Process" });
        const complete = await PartnerProgram.countDocuments({ status: "Complete" });
        const rejected = await PartnerProgram.countDocuments({ status: "Rejected" });

        res.status(200).json({
            total: totalRequests,
            today: todayRequests,
            pending,
            onProcess,
            complete,
            rejected
        });
    } catch (error) {
        console.error("Partner Stats Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getOfficialPartners = async (req: Request, res: Response) => {
    try {
        const partners = await Partner.find({ isActive: true })
            .select('year logo description country')
            .sort({ year: -1 });

        res.status(200).json(partners);
    } catch (error) {
        console.error("Get Official Partners Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
