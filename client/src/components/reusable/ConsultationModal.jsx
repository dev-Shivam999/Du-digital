import React from 'react';
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ConsultationModal = ({
    isOpen,
    onClose,
    fields = [],
    formValues = {},
    handleInputChange,
    handleSubmit,
    submitStatus,
    submitMessage,
    submitLoading,
    image
}) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-5xl bg-white rounded-3xl  2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-2 transition-colors text-[#FF1033] hover:text-[#FF1033] hover:scale-105 cursor-pointer"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side - Image */}
                <div className="hidden md:block group w-1/2 relative overflow-hidden bg-gray-100">
                    {image ? (
                        <img
                            src={image}
                            alt="Consultation"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-200"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                            <span className="text-gray-500">Image not available</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-start p-8">
                        {/* <div className="text-white">
                            <h3 className="text-2xl font-bold mb-2">Expert Business Setup</h3>
                            <p className="text-gray-300 text-sm">Get your license today with 100% ownership.</p>
                        </div> */}
                        <h2 className="text-xxl md:text-2xl font-bold text-[#333333] mb-6 leading-tight">
                            Begin your journey for <span className="text-[#FF1033]">Business Set-up in the UAE</span> by filling in the details
                        </h2>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                    {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                        Begin your journey for <span className="text-[#FF1033]">Business Set-up in the UAE</span> by filling in the details
                    </h2> */}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field, index) => {
                            const fieldType = field.type || field.fieldType;
                            const isFullWidth = fieldType === 'select' || fieldType === 'dropdown' || fieldType === 'textarea' || fieldType === 'checkbox';

                            const commonClasses = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none text-gray-700 placeholder-gray-400";

                            if (fieldType === 'select' || fieldType === 'dropdown') {
                                // Filter options for cascading dropdowns
                                let displayOptions = field.options;
                                if (field.parentField) {
                                    const parentValue = formValues[field.parentField];
                                    if (!parentValue) {
                                        return null;
                                    } else {
                                        const parentFieldDef = fields.find(f => f.name === field.parentField);
                                        // Note: formValues stores the 'value' (or label/string) of the selected option
                                        const selectedParentOption = parentFieldDef?.options?.find(opt =>
                                            (opt.value || opt) === parentValue
                                        );

                                        const parentId = selectedParentOption?.id || selectedParentOption?._id;
                                        const parentVal = selectedParentOption?.value || selectedParentOption?.label || selectedParentOption;

                                        if (parentId || parentVal) {
                                            displayOptions = field.options?.filter(opt => {
                                                // Robust matching: ID or Value
                                                return opt.connectId === parentId || opt.connectId === parentVal;
                                            }) || [];
                                        } else {
                                            displayOptions = []; // Parent option found but has no identifiers?
                                        }
                                    }
                                }

                                return (
                                    <div key={field._id || index} className="col-span-1 md:col-span-2">
                                        <select
                                            name={field.name}
                                            value={formValues[field.name] || ''}
                                            onChange={handleInputChange}
                                            className={`${commonClasses} appearance-none cursor-pointer`}
                                            required={field.required || field.isRequired}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                backgroundPosition: 'right 0.75rem center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '1.5em 1.5em',
                                                paddingRight: '2.5rem'
                                            }}
                                            aria-label={field.label || field.placeholder}
                                        >
                                            <option value="" disabled>{field.placeholder || field.label}</option>
                                            {displayOptions?.map((opt, optIdx) => (
                                                <option key={opt._id || optIdx} value={opt.value || opt}>
                                                    {opt.label || opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            } else if (fieldType === 'textarea') {
                                return (
                                    <textarea
                                        key={field._id || index}
                                        name={field.name}
                                        value={formValues[field.name] || ''}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder || field.label}
                                        rows={3}
                                        className={`${commonClasses} resize-none col-span-1 md:col-span-2`}
                                        required={field.required || field.isRequired}
                                        aria-label={field.label || field.placeholder}
                                    />
                                );
                            } else if (fieldType === 'checkbox') {
                                return (
                                    <div key={field._id || index} className="col-span-1 md:col-span-2 flex items-start gap-3 mt-2">
                                        <input
                                            type="checkbox"
                                            name={field.name}
                                            checked={formValues[field.name] || false}
                                            onChange={handleInputChange}
                                            id={`modal-field-${index}`}
                                            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF1033] focus:ring-red-500 cursor-pointer"
                                            required={field.required || field.isRequired}
                                        />
                                        <label htmlFor={`modal-field-${index}`} className="text-xs md:text-sm text-gray-500 leading-snug cursor-pointer">
                                            {field.label || field.placeholder}
                                        </label>
                                    </div>
                                );
                            } else {
                                const inputType = fieldType === 'email' ? 'email'
                                    : fieldType === 'phone' ? 'tel'
                                        : fieldType === 'number' ? 'number'
                                            : 'text';
                                return (
                                    <input
                                        key={field._id || index}
                                        name={field.name}
                                        value={formValues[field.name] || ''}
                                        onChange={handleInputChange}
                                        type={inputType}
                                        placeholder={field.placeholder || field.label}
                                        className={commonClasses}
                                        required={field.required || field.isRequired}
                                        aria-label={field.label || field.placeholder}
                                    />
                                );
                            }
                        })}

                        {/* Disclaimer Checkbox (Hardcoded based on mockup if not in fields) - 
                     I'll verify if I should add this. The user said "put the hero section form", 
                     so strict adherence means only render 'fields'. I will skip hardcoding for now. 
                     The layout will just handle what's given. */}

                        {/* Submit Status & Button */}
                        <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
                            {submitStatus && (
                                <div className={`flex items-center gap-3 p-3 rounded-lg ${submitStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {submitStatus === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    <p className="text-sm font-medium">{submitMessage}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-[#FF1033] text-white hover:bg-[#D9001B]   disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                            >
                                {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit'}
                            </button>

                            <p className="text-center text-gray-400 text-sm mt-4">
                                Looking for Job? <a href="/careers" className="text-[#FF1033] hover:underline">Click Here</a>
                            </p>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ConsultationModal;
