import { LocationEdit } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VisaServices = ({ data }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const navigate = useNavigate();

    const indiaRedirects = {
        'UAE 5-year Tourist Visa': `/dubai-5year-tourist-visa`,
        'Armenia': `/apply-for-any-visa`,
        'Australia': `/australia-tourist-visa`,
        'Azerbaijan': `/apply-for-any-visa`,
        'Bahrain': `/apply-for-any-visa`,
        'Bangladesh': 'https://www.bdvisa.com/',
        // 'Bangladesh': `/bangladesh-vac`,
        'Cambodia': `/apply-for-any-visa`,
        'Canada': `/apply-for-any-visa`,
        'China': `/apply-for-any-visa`,
        'Egypt': `/egypt-visa-for-indians`,
        'France': `/apply-for-any-visa`,
        'Georgia': `/georgia-evisa`,
        'Germany': `/apply-for-any-visa`,
        'Greece': `/greece-work-visa`,
        'Indonesia': `/apply-for-any-visa`,
        'Japan': `/japan-tourist-visa-for-indians`,
        'Kenya': `/apply-for-any-visa`,
        'Lebanon': `/lebanon`,
        'Malaysia': `/malaysia-visa-for-indians`,
        'Morocco': `/morocco-visa`,
        'Oman': `/apply-for-any-visa`,
        'Russia': `/apply-for-any-visa`,
        'Serbia': `/serbia-work-permit-visa`,
        'Singapore': `/apply-for-any-visa`,
        'South Korea': `/south-korea-visa-for-indians`,
        'Switzerland': `/apply-for-any-visa`,
        'Thailand': `/digital-arrival-cards`,
        'Tunisia': `/apply-for-any-visa`,
        'Turkey': `/apply-for-any-visa`,
        'UK': `/apply-for-any-visa`,
        'USA': `/apply-for-any-visa`,
        'Uzbekistan': `/apply-for-any-visa`,
        'Vietnam': `/apply-for-any-visa`,
        'Other Countries': `/apply-for-any-visa`
    };

    const defaultRedirect = `/apply-for-any-visa`;

    // Dynamic options for "Applying from"
    const fromOptions = ["India", "South Korea", "Bangladesh", "Thailand"];

    // Dynamic options for "Applying to", dependent on "from"
    const getToOptions = () => {
        if (from === 'India') {
            return Object.keys(indiaRedirects);
        } else if (from === 'South Korea' || from === 'Thailand') {
            return ['India'];
        } else if (from === 'Bangladesh') {
            return ['UAE', 'Singapore', 'Ireland'];
        }
        return [];
    };

    const handleGo = () => {
        let redirectURL = defaultRedirect;

        if (from === 'India') {
            redirectURL = indiaRedirects[to] || defaultRedirect;
        } else if (from === 'South Korea' && to === 'India') {
            redirectURL = '/apply-for-any-visa';
        } else if (from === 'Thailand' && to === 'India') {
            redirectURL = '/apply-for-any-visa';
        } else if (from === 'Bangladesh') {
            if (to === 'UAE' || to === 'Singapore' || to === 'Ireland') {
                redirectURL = '/bangladesh-visas-for-uae-singapore';
            }
        }

        if (to) {
            if (redirectURL.startsWith('http')) {
                window.open(redirectURL, '_blank', 'noopener,noreferrer');
            } else {
                navigate(redirectURL);
            }
        } else {
            alert('Please select a destination.');
        }
    };

    return (
        <section className="relative py-16">
            {/* ... dotted background commented out ... */}

            <div className="relative max-w-5xl mx-auto px-6 md:px-20">

                <div className="bg-white rounded-2xl  xl overflow-hidden ">

                    {/* Header */}
                    <div className="bg-[#FF1033] text-white text-center   text-2xl font-[400] mb-1">
                        {data.title}
                    </div>

                    {/* Form */}
                    <div className="grid lg:grid-cols-3 gap-6 px-3 py-3 items-end">

                        {/* From */}
                        <div>
                            <label htmlFor="visa-from" className="flex items-center gap-2 py-2 ps-2 text-[#FF1033] text-lg">
                                <LocationEdit backgroundColor="#FF1033" /> {data.fromLabel}
                            </label>
                            <select
                                id="visa-from"
                                value={from}
                                onChange={(e) => {
                                    setFrom(e.target.value);
                                    setTo(""); // Reset 'to' when 'from' changes
                                }}
                                className="w-full border border-red-500 rounded-full px-6 py-3.5 focus:outline-none appearance-none bg-no-repeat bg-position-[right_1.5rem_center] bg-size-[1em_1em] text-lg cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FF1033' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                                }}
                            >
                                <option value="" disabled>
                                    -{data.fromPlaceholder}-
                                </option>
                                {fromOptions.map((loc, i) => (
                                    <option key={i} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* To */}
                        <div>
                            <label htmlFor="visa-to" className="py-2 flex items-center gap-2 ps-2 text-[#FF1033] text-lg ">
                                <LocationEdit backgroundColor="#FF1033" /> {data.toLabel}
                            </label>
                            <select
                                id="visa-to"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full border border-red-500 rounded-full px-6 py-3.5 focus:outline-none appearance-none bg-no-repeat bg-position-[right_1.5rem_center] bg-size-[1em_1em] text-lg cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FF1033' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                                }}
                            >
                                <option value="" disabled>
                                    -{data.toPlaceholder}-
                                </option>
                                {getToOptions().map((loc, i) => (
                                    <option key={i} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Button */}
                        <div className="pb-1">

                            <button
                                onClick={handleGo}
                                className="w-full bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] transition-all duration-300 rounded-full py-3.5 px-10 text-center text-lg flex items-center justify-center gap-2 cursor-pointer border border-[#FF1033] hover:border-[#FF1033]"
                            >
                                {data.buttonText}
                                <span className="text-xl">→</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisaServices;
