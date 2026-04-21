import { Request, Response } from "express";
import Employee from "../models/Employees.model";
import nodemailer from "nodemailer";

// Configure Nodemailer (Use environment variables in production)
// For now, using a placeholder. User needs to configure this.
const transporter = nodemailer.createTransport({
    service: "gmail", // Example: 'gmail', 'office365', or host/port
    auth: {
        user: process.env.SMT_USER || "your-email@gmail.com",
        pass: process.env.SMT_PASS || "your-password"
    }
});

// Create Employee (Apply)
export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { fullName, email, phone, careerId } = req.body;
        // console.log("body",req.body);

        const file = req.file;

        if (!fullName || !email) {
            return res.status(400).json({ message: "Full Name and Email are required" });
        }

        let cvLink = "";
        if (file) {
            cvLink = `/uploads/${file.filename}`;
        }

        const newEmployee = new Employee({
            fullName,
            email,
            phone,
            CVlink: cvLink,
            career: careerId // Link to Career
        });

        await newEmployee.save();

        // Send Confirmation Email
        if (email) {
            const mailOptions = {
                from: process.env.SMT_USER || "no-reply@dudigital.com",
                to: email,
                subject: "Application Received - DU Digital",
                text: `Dear ${fullName},\n\nThank you for applying. We have received your application and will review it shortly.\n\nBest Regards,\nHR Team`
            };

            // Non-blocking email send
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                } else {
                    console.log("Email sent:", info.response);
                }
            });
        }

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Create Employee Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Employees (Support Filtering)
export const getEmployees = async (req: Request, res: Response) => {
    try {
        const { careerId } = req.query;
        let query: any = {};

        if (careerId) {
            query.career = careerId;
        }

        const employees = await Employee.find(query)
            .populate("career", "title department") // Populate Career details
            .sort({ createdAt: -1 });

        res.status(200).json(employees);
    } catch (error) {
        console.error("Get Employees Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
