import React from "react";

/**
 * DynamicFormField - Renders form fields dynamically based on field type
 * Supports: text, email, number, tel, select, dropdown, checkbox, radio, textarea, date, file
 * 
 * @param {Object} field - Field configuration object
 * @param {string} field.name - Field name
 * @param {string} field.type - Field type (text, select, checkbox, radio, etc.)
 * @param {string} field.label - Field label
 * @param {string} field.placeholder - Field placeholder
 * @param {boolean} field.required - If field is required
 * @param {Array} field.options - Options for select/radio fields
 * @param {Object} formValues - Current form values
 * @param {Function} handleInputChange - Change handler function
 * @param {string} theme - 'light' or 'dark' (default: 'light')
 */
const DynamicFormField = ({
    field,
    formValues,
    handleInputChange,
    onFileChange,
    allFields = [], // New prop for cascading logic
    theme = 'light'
}) => {
    const isDark = theme === 'dark';

    const baseInputClass = isDark
        ? "w-full px-4 py-3 bg-white/10 border text-black border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:border-[#FF1033] focus:ring-1 focus:ring-[#FF1033] outline-none transition-all"
        : "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#FF1033] focus:ring-1 focus:ring-[#FF1033] outline-none transition-all placeholder:text-gray-500";

    const labelClass = isDark ? "text-white text-sm" : "text-gray-700 text-sm font-medium";

    // Helper to filter options for cascading dropdowns
    const getFilteredOptions = () => {
        // If not a dependent field, return all options
        if (!field.parentField) return field.options;

        // If parent value is not selected, return empty options (user must select parent first)
        const parentValue = formValues[field.parentField];
        if (!parentValue) return [];

        // If we don't have access to all fields definition, return all options (fallback)
        if (!allFields || allFields.length === 0) return field.options;

        // Find the parent field definition
        const parentFieldDef = allFields.find(f => f.name === field.parentField);
        if (!parentFieldDef) return field.options;

        // Find the selected option object in the parent field to get its ID
        // Note: formValues stores the 'value' (or label/string) of the selected option
        const selectedParentOption = parentFieldDef.options?.find(opt =>
            (opt.value || opt.label || opt) === parentValue
        );

        // If parent option doesn't have an ID (legacy) or not found, we can't filter uniquely by ID
        // But we can try to fall back to value matching if configured that way
        const parentId = selectedParentOption.id || selectedParentOption._id;
        const parentOptionValue = selectedParentOption.value || selectedParentOption.label || selectedParentOption;

        // Filter valid options: match connectId to parent's ID or Value
        return field.options?.filter(opt => {
            if (!opt.connectId) return true; // Keep options with no specific connection? Or hide? usually hide.
            // If strict cascading is desired, options without connectId should probably be hidden if parentField is set.
            // But for now let's assume if connectId is present it must match.

            return opt.connectId === parentId || opt.connectId === parentOptionValue;
        }) || [];
    };

    const displayOptions = (field.type === 'select' || field.type === 'dropdown')
        ? getFilteredOptions()
        : field.options;

    switch (field.type) {
        case 'select':
        case 'dropdown':
            return (
                <div>
                  
                    <select
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={handleInputChange}
                        className={baseInputClass}
                        required={field.required}
                    >
                        <option value="" className="text-gray-900">{field.placeholder || `Select ${field.label}`}</option>
                        {displayOptions?.map((opt, i) => (
                            <option key={i} value={opt.value || opt.label || opt} className="text-gray-900">
                                {opt.label || opt}
                            </option>
                        ))}
                    </select>
                </div>
            );

        case 'checkbox':
            return (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name={field.name}
                        checked={formValues[field.name] || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#FF1033] border-gray-300 rounded focus:ring-[#FF1033]"
                        required={field.required}
                    />
                    <label className={labelClass}>
                        {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                    </label>
                </div>
            );

        case 'radio':
            return (
                <div className="space-y-2">
                    <label className={`${labelClass} block mb-2`}>
                        {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {field.options?.map((opt, i) => (
                            <label key={i} className={`flex items-center gap-2 cursor-pointer ${labelClass}`}>
                                <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value || opt.label || opt}
                                    checked={formValues[field.name] === (opt.value || opt.label || opt)}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#FF1033] focus:ring-[#FF1033]"
                                    required={field.required}
                                />
                                <span>{opt.label || opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );

        case 'textarea':
            return (
                <div>
                    {field.label && (
                        <label htmlFor={field.name} className={`${labelClass} block mb-2`}>
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                        </label>
                    )}
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || field.label}
                        className={`${baseInputClass} min-h-[100px]`}
                        required={field.required}
                    />
                </div>
            );

        case 'date':
            return (
                <div>
                    {field.label && (
                        <label className={`${labelClass} block mb-2`}>
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                        </label>
                    )}
                    <input
                        type="date"
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={handleInputChange}
                        className={baseInputClass}
                        required={field.required}
                    />
                </div>
            );

        case 'file':
            return (
                <div>
                    <label className={`${labelClass} block mb-2`}>
                        {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                    </label>
                    <input
                        type="file"
                        name={field.name}
                        onChange={(e) => onFileChange ? onFileChange(field.name, e.target.files[0]) : handleInputChange(e)}
                        className={`${baseInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF1033] file:text-white hover:file:bg-[#511313]`}
                        required={field.required}
                    />
                </div>
            );

        default:
            // text, email, number, tel, etc.
            return (
                <div>
                    {field.showLabel && field.label && (
                        <label htmlFor={field.name} className={`${labelClass} block mb-2`}>
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                        </label>
                    )}
                    <input
                        id={field.name}
                        type={field.type || 'text'}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || field.label}
                        className={baseInputClass}
                        required={field.required}
                    />
                </div>
            );
    }
};

export default DynamicFormField;
