import { Request, Response } from "express";
import OfficeType from "../models/OfficeType.model";
import OfficeLocation from "../models/OfficeLocation.model";
import { getCache, setCache, deleteCache, deleteCacheByPattern, CACHE_KEYS } from "../utils/cache";

// --- Office Types ---

export const getOfficeTypes = async (req: Request, res: Response) => {
    try {
        const cacheKey = CACHE_KEYS.OFFICE_TYPES;

        // Check cache
        const cachedTypes = getCache(cacheKey);
        if (cachedTypes) {
            return res.status(200).json(cachedTypes);
        }

        const types = await OfficeType.find({ isActive: true });

        // Set cache
        setCache(cacheKey, types, 300);

        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const createOfficeType = async (req: Request, res: Response) => {
    try {
        const { name, code, description } = req.body;
        const newType = new OfficeType({ name, code, description });
        await newType.save();

        // Invalidate cache
        deleteCache(CACHE_KEYS.OFFICE_TYPES);

        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ message: "Error creating office type" });
    }
};

export const deleteOfficeType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await OfficeType.findByIdAndDelete(id);

        // Invalidate cache
        deleteCache(CACHE_KEYS.OFFICE_TYPES);

        res.status(200).json({ message: "Office type deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting office type" });
    }
};

// --- Office Locations ---

export const getLocations = async (req: Request, res: Response) => {
    try {
        // Optional filter by type
        const { typeId } = req.query;
        const cacheKey = `office_locations_${typeId || 'all'}`;

        // Check cache
        const cachedLocations = getCache(cacheKey);
        if (cachedLocations) {
            return res.status(200).json(cachedLocations);
        }

        const filter: any = { isActive: true };
        if (typeId) filter.officeTypeId = typeId;

        const locations = await OfficeLocation.find(filter).populate("officeTypeId");

        // Set cache
        setCache(cacheKey, locations, 300);

        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const createLocation = async (req: Request, res: Response) => {
    try {
        const { officeTypeId, officeName, address, contact, googleMapLink } = req.body;
        const newLocation = new OfficeLocation({
            officeTypeId,
            officeName,
            address,
            contact,
            googleMapLink
        });
        await newLocation.save();

        // Invalidate caches
        deleteCacheByPattern('office_locations_');
        deleteCache('grouped_offices'); // Invalidate grouped offices too

        res.status(201).json(newLocation);
    } catch (error) {
        console.error("Create Location Error", error);
        res.status(500).json({ message: "Error creating location" });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { officeTypeId, officeName, address, contact, googleMapLink } = req.body;

        const updatedLocation = await OfficeLocation.findByIdAndUpdate(
            id,
            {
                officeTypeId,
                officeName,
                address,
                contact,
                googleMapLink
            },
            { new: true }
        ).populate("officeTypeId");

        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Invalidate caches
        deleteCacheByPattern('office_locations_');
        deleteCache('grouped_offices');

        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error("Update Location Error", error);
        res.status(500).json({ message: "Error updating location" });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await OfficeLocation.findByIdAndDelete(id);

        // Invalidate caches
        deleteCacheByPattern('office_locations_');
        deleteCache('grouped_offices');

        res.status(200).json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting location" });
    }
};

export const getGroupedOffices = async (req: Request, res: Response) => {
    try {
        const cacheKey = 'grouped_offices';

        // Check cache
        const cachedGrouped = getCache(cacheKey);
        if (cachedGrouped) {
            return res.status(200).json(cachedGrouped);
        }

        const locations = await OfficeLocation
            .find({ isActive: true })
            .populate("officeTypeId")
            .lean();

        const responseData = {
            india: locations.filter(l => l.address?.country?.toLowerCase() === 'india'),
            international: locations.filter(l => l.address?.country?.toLowerCase() !== 'india')
        };

        setCache(cacheKey, responseData, 300);
        // console.log(responseData);
        
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Grouped Offices Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
