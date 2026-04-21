import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Step1Location from './Step1Location';
import Step2PersonalDetails from './Step2PersonalDetails';
import Step3TravellingDetails from './Step3TravellingDetails';
import Step4SubmitPay from './Step4SubmitPay';
import formConfig from '../../data/digitalArrivalForm.json';

const DigitalArrivalForm = ({ onSubmit,sendOpt, serverError, loading ,checkopt}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        Country: '',
        Phone: '',
        First_Name: '',
        Middle_Name: '',
        Last_Name: '',
        Email: '',
        Nationality: '',
        Gender: '',
        DOB: '',
        Accommodation_Line_1: '',
        Accommodation_Line_2: '',
        Accommodation_City: '',
        Accommodation_State: '',
        Accommodation_Zip: '',
        Passport_Number: '',
        Passport_Expiry: '',
        Arrival_Date: '',
        Departure_Date: '',
        Travel_Mode: '',
        Flight_Number: '',
        Departure_Flight_Number: '',
        Total_Persons: 1,
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Location
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        options={{ countries: formConfig.countries }}
                    />
                );
            case 2:
                return (
                    <Step2PersonalDetails
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        options={{
                            nationalities: formConfig.nationalities,
                            genderOptions: formConfig.genderOptions,
                            countries: formConfig.countries
                        }}
                    />
                );
            case 3:
                return (
                    <Step3TravellingDetails
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        options={{ travelModes: formConfig.travelModes }}
                    />
                );
            case 4:
                return (
                    <Step4SubmitPay
                        formData={formData}
                        sendOpt={sendOpt}
                        checkopt={checkopt}
                        handleChange={handleChange}
                        submitForm={onSubmit}
                        prevStep={prevStep}
                        loading={loading}
                        error={serverError}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8  border-[3px] border-[#FF1033]">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-10 overflow-x-auto">
                {formConfig.steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1 min-w-[80px]">
                        <div className="flex flex-col items-center w-full z-10">
                            <div
                                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep === step.number
                                    ? 'text-white bg-[#FF1033]'
                                    : currentStep > step.number
                                        ? 'text-white bg-[#FF1033]'
                                        : 'text-gray-600 border-2 border-gray-300 bg-white'
                                    }`}
                                aria-current={currentStep === step.number ? 'step' : undefined}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`text-xs mt-2 text-center whitespace-nowrap hidden sm:block ${currentStep === step.number ? 'font-semibold text-[#FF1033]' : 'text-gray-500'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {index < formConfig.steps.length - 1 && (
                            <div
                                className="flex-1 h-0.5 mx-2 -mt-6 transition-colors duration-300"
                                style={{
                                    backgroundColor: currentStep > step.number ? '#FF1033' : '#e5e7eb'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-auto">
                {renderStep()}
            </div>
        </div>
    );
};

export default DigitalArrivalForm;
