import React from 'react';
import { ChevronDown } from "lucide-react";

const Step1Location = ({ formData, handleChange, nextStep, options }) => {
    const { countries } = options;
    const { Country, Phone } = formData;

    const isStepValid = Country && Phone;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isStepValid) {
            nextStep();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="Country" className="block text-gray-700 font-medium mb-2">
                        Where are you going? <span className="text-[#FF1033]">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="Country"
                            name="Country"
                            value={Country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer bg-white"
                            required
                        >
                            <option value="">- Select Country -</option>
                            {countries.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="Phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number <span className="text-[#FF1033]">*</span>
                    </label>
                    <div className="flex">
                        <div className="flex items-center gap-2 px-3 py-3 border border-gray-300 border-r-0 rounded-l-lg bg-gray-50">
                            <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 h-4 object-cover" />
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                            id="Phone"
                            type="tel"
                            name="Phone"
                            value={Phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            required
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
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

export default Step1Location;
