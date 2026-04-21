import { Request, Response } from "express";
import ContactInquiry from "../models/Contact.model";
import OtpSchema from "../models/Otp.model";


export const createInquiry = async (req: Request, res: Response) => {
    try {
        const { Last_Name, Email, Phone, Message, Remarks ,otp} = req.body;
        if(!otp){
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
        // const newInquiry = new ContactInquiry({
        //     Last_Name,
        //     Email,
        //     Phone,
        //     message: message || "",
        //     Remarks: Remarks || false
        // });

        // await newInquiry.save();
        res.status(201).json({ message: "Inquiry submitted successfully", inquiry: {Last_Name, Email, Phone, Message, Remarks ,otp} });
    } catch (error) {
        console.error("Create Inquiry Error", error);
        res.status(500).json({ message: "Error submitting inquiry" });
    }
};

export const getInquiries = async (req: Request, res: Response) => {
    try {
        const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        console.error("Get Inquiries Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getInquiryStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalInquiries = await ContactInquiry.countDocuments();
        const todayInquiries = await ContactInquiry.countDocuments({
            createdAt: { $gte: today }
        });

        res.status(200).json({
            total: totalInquiries,
            today: todayInquiries
        });
    } catch (error) {
        console.error("Inquiry Stats Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
