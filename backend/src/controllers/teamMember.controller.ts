import { Request, Response } from "express";
import TeamMember from "../models/TeamMember.model";
import fs from "fs";
import path from "path";
import { getCache, setCache, deleteCacheByPattern } from "../utils/cache";

// Get all team members (optional grouping)
export const getAllTeamMembers = async (req: Request, res: Response) => {
    try {
        const { groupBy } = req.query;
        const cacheKey = `team_members_${groupBy || 'all'}`;

        // Check cache
        const cachedData = getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const members = await TeamMember.find().sort({ createdAt: -1 });

        if (groupBy === 'category') {
            const grouped = members.reduce((acc: any, member) => {
                const category = member.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(member);
                return acc;
            }, {});

            // Set cache
            setCache(cacheKey, grouped, 300);

            return res.status(200).json(grouped);
        }

        // Set cache
        setCache(cacheKey, members, 300);

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching team members", error });
    }
};

// Create a new team member
export const createTeamMember = async (req: Request, res: Response) => {
    try {
        const { name, designation, description, category } = req.body;
        const file = req.file;

        if (!name || !designation) {
            return res.status(400).json({ message: "Name and Designation are required" });
        }

        let profileImage = "";
        if (file) {
            profileImage = `/uploads/${file.filename}`;
        }
        // Fallback to URL if provided in body (though form data usually strings it)
        else if (req.body.profileImage) {
            profileImage = req.body.profileImage;
        }


        const newMember = new TeamMember({
            name,
            designation,
            profileImage,
            description,
            category
        });

        const savedMember = await newMember.save();

        // Invalidate cache
        deleteCacheByPattern('team_members_');

        res.status(201).json(savedMember);
    } catch (error) {
        console.error("Create Team Member Error", error);
        res.status(500).json({ message: "Error creating team member", error });
    }
};

// Update a team member
export const updateTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, designation, description, category } = req.body;
        const file = req.file;

        const member = await TeamMember.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        member.name = name || member.name;
        member.designation = designation || member.designation;
        member.description = description || member.description;
        member.category = category || member.category;

        if (file) {
            // Delete old image if it was a local file
            if (member.profileImage && member.profileImage.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, "../../", member.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            member.profileImage = `/uploads/${file.filename}`;
        } else if (req.body.profileImage) {
            // Allow updating to a URL string if explicitly sent (optional feature support)
            member.profileImage = req.body.profileImage;
        }

        const updatedMember = await member.save();

        // Invalidate cache
        deleteCacheByPattern('team_members_');

        res.status(200).json(updatedMember);
    } catch (error) {
        console.error("Update Team Member Error", error);
        res.status(500).json({ message: "Error updating team member", error });
    }
};

// Delete a team member
export const deleteTeamMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await TeamMember.findById(id);

        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        // Delete image if local
        if (member.profileImage && member.profileImage.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, "../../", member.profileImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await TeamMember.findByIdAndDelete(id);

        // Invalidate cache
        deleteCacheByPattern('team_members_');

        res.status(200).json({ message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Delete Team Member Error", error);
        res.status(500).json({ message: "Error deleting team member", error });
    }
};
