import React from 'react';
import { ChevronDown } from "lucide-react";

const Step3TravellingDetails = ({ formData, handleChange, nextStep, prevStep, options }) => {
    const { travelModes } = options;

    const requiredFields = [
        'Passport_Number', 'Passport_Expiry', 'Arrival_Date', 'Departure_Date',
        'Travel_Mode', 'Flight_Number'
    ];

    // Optional: check valid passport expiry vs arrival/departure logic here
    const isStepValid = requiredFields.every(field => formData[field] && formData[field].trim() !== '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isStepValid) {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    Travelling Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="Passport_Number" className="block text-gray-700 font-medium mb-2">Passport Number <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Passport_Number"
                            type="text"
                            name="Passport_Number"
                            value={formData.Passport_Number}
                            onChange={handleChange}
                            placeholder="Enter Passport Number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none uppercase"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Passport_Expiry" className="block text-gray-700 font-medium mb-2">Passport Expiry Date <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Passport_Expiry"
                            type="date"
                            name="Passport_Expiry"
                            value={formData.Passport_Expiry}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="Arrival_Date" className="block text-gray-700 font-medium mb-2">Date of Arrival <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Arrival_Date"
                            type="date"
                            name="Arrival_Date"
                            value={formData.Arrival_Date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Departure_Date" className="block text-gray-700 font-medium mb-2">Date of Departure <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Departure_Date"
                            type="date"
                            name="Departure_Date"
                            value={formData.Departure_Date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="Travel_Mode" className="block text-gray-700 font-medium mb-2">Mode of Travel <span className="text-[#FF1033]">*</span></label>
                        <div className="relative">
                            <select
                                id="Travel_Mode"
                                name="Travel_Mode"
                                value={formData.Travel_Mode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none bg-white"
                                required
                            >
                                <option value="">- Select Mode -</option>
                                {travelModes.map(mode => (
                                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="Flight_Number" className="block text-gray-700 font-medium mb-2">Flight/Transport Number <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Flight_Number"
                            type="text"
                            name="Flight_Number"
                            value={formData.Flight_Number}
                            onChange={handleChange}
                            placeholder="e.g. EK501"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none uppercase"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="Departure_Flight_Number" className="block text-gray-700 font-medium mb-2">Departure Flight Number (Optional)</label>
                        <input
                            id="Departure_Flight_Number"
                            type="text"
                            name="Departure_Flight_Number"
                            value={formData.Departure_Flight_Number}
                            onChange={handleChange}
                            placeholder="e.g. EK502"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none uppercase"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors "
                >
                    Previous
                </button>
                <button
                    type="submit"
                    disabled={!isStepValid}
                    className="px-8 py-3 font-semibold rounded-full bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save and Continue
                </button>
            </div>
        </form>
    );
};

export default Step3TravellingDetails;
