import React from 'react';
import { ChevronDown } from "lucide-react";

const Step2PersonalDetails = ({ formData, handleChange, nextStep, prevStep, options }) => {
    const { nationalities, genderOptions } = options;

    const requiredFields = [
        'First_Name', 'Last_Name', 'Email', 'Nationality', 'Gender', 'DOB',
        'Accommodation_Line_1', 'Accommodation_City', 'Accommodation_State', 'Accommodation_Zip'
    ];

    const isStepValid = requiredFields.every(field => formData[field] && formData[field].trim() !== '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isStepValid) {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

            {/* Personal Details Section */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    Personal Details
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="First_Name" className="block text-gray-700 font-medium mb-2">First Name <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="First_Name"
                            type="text"
                            name="First_Name"
                            value={formData.First_Name}
                            onChange={handleChange}
                            placeholder="Enter Your First Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Middle_Name" className="block text-gray-700 font-medium mb-2">Middle Name</label>
                        <input
                            id="Middle_Name"
                            type="text"
                            name="Middle_Name"
                            value={formData.Middle_Name}
                            onChange={handleChange}
                            placeholder="Enter Your Middle Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="Last_Name" className="block text-gray-700 font-medium mb-2">Last Name <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Last_Name"
                            type="text"
                            name="Last_Name"
                            value={formData.Last_Name}
                            onChange={handleChange}
                            placeholder="Enter Your Last Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="Email" className="block text-gray-700 font-medium mb-2">Email Address <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Email"
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="Nationality" className="block text-gray-700 font-medium mb-2">Nationality/Citizenship <span className="text-[#FF1033]">*</span></label>
                        <div className="relative">
                            <select
                                id="Nationality"
                                name="Nationality"
                                value={formData.Nationality}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none bg-white"
                                required
                            >
                                <option value="">- Select Nationality -</option>
                                {nationalities.map((nat, idx) => (
                                    <option key={idx} value={nat}>{nat}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="Gender" className="block text-gray-700 font-medium mb-2">Gender <span className="text-[#FF1033]">*</span></label>
                        <div className="relative">
                            <select
                                id="Gender"
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none bg-white"
                                required
                            >
                                <option value="">- Select Gender -</option>
                                {genderOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="DOB" className="block text-gray-700 font-medium mb-2">Date of Birth <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="DOB"
                            type="date"
                            name="DOB"
                            value={formData.DOB}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Accommodation Section */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    Accommodation Details in {formData.Country ? options.countries.find(c => c.value === formData.Country)?.label : 'Destination'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="Accommodation_Line_1" className="block text-gray-700 font-medium mb-2">Address Line 1 <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Accommodation_Line_1"
                            type="text"
                            name="Accommodation_Line_1"
                            value={formData.Accommodation_Line_1}
                            onChange={handleChange}
                            placeholder="Street Address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Accommodation_Line_2" className="block text-gray-700 font-medium mb-2">Address Line 2</label>
                        <input
                            id="Accommodation_Line_2"
                            type="text"
                            name="Accommodation_Line_2"
                            value={formData.Accommodation_Line_2}
                            onChange={handleChange}
                            placeholder="Apartment, Suite, Unit, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="Accommodation_City" className="block text-gray-700 font-medium mb-2">City <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Accommodation_City"
                            type="text"
                            name="Accommodation_City"
                            value={formData.Accommodation_City}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Accommodation_State" className="block text-gray-700 font-medium mb-2">State/Province <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Accommodation_State"
                            type="text"
                            name="Accommodation_State"
                            value={formData.Accommodation_State}
                            onChange={handleChange}
                            placeholder="State/Province"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Accommodation_Zip" className="block text-gray-700 font-medium mb-2">Zip/Postal Code <span className="text-[#FF1033]">*</span></label>
                        <input
                            id="Accommodation_Zip"
                            type="text"
                            name="Accommodation_Zip"
                            value={formData.Accommodation_Zip}
                            onChange={handleChange}
                            placeholder="Zip Code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            required
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
                    className="px-8 py-3 font-semibold rounded-full bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
                >
                    Save and Continue
                </button>
            </div>
        </form>
    );
};

export default Step2PersonalDetails;
