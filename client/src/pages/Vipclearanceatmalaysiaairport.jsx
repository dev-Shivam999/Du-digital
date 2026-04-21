import React, { useState, useEffect } from "react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import DynamicFormField from "../components/reusable/DynamicFormField";
import { Loader2, Check, Users, Plane, ArrowRight, MapPin, FileText } from "lucide-react";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Vipclearanceatmalaysiaairport = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        fetchFormData();
    }, []);

    const fetchFormData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BackendURL}/api/forms/slug/vip-clearance-at-malaysia-airport`);
            if (!response.ok) throw new Error("Failed to fetch page data");
            const data = await response.json();
            setFormData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('/api/')) return `${BackendURL}${imagePath}`;
        if (imagePath.startsWith('/uploads/')) return `${BackendURL}/api${imagePath}`;
        return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitStatus(null);
        setSubmitMessage('');

        try {
            const response = await fetch(`${BackendURL}/api/form-submissions/slug/vip-clearance-at-malaysia-airport`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });
            const res = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Thank you! Your request has been submitted.');
                setFormValues({});
            } else {
                setSubmitStatus('error');
                setSubmitMessage(res.message || 'Something went wrong.');
            }
        } catch (err) {
            setSubmitStatus('error');
            setSubmitMessage('Failed to submit. Please try again.');
        } finally {
            setSubmitLoading(false);
            setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
        }
    };

    if (loading) return <LoadingState message="Loading Content..." fullScreen />;
    if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

    const { fields = [], contentSections = {}, documents = [], faqs = [], description, image } = formData || {};

    const vipServiceItems = contentSections['VIP clearance service at Malaysian Immigration'] || [];
    const whatWeOfferItems = contentSections['What we offer ?'] || [];
    const allServices = [...vipServiceItems, ...whatWeOfferItems];
    const visaCentresSection = contentSections['Official Malaysia Visa Application Centres now near you'] || [];
    const howItWorksItems = contentSections['How It Works?'] || [];

    return (
        <div className="bg-white  ">
            {/* ===== HERO SECTION ===== */}
            <section className="relative w-full h-[800px] sm:h-[800px] flex items-end justify-end text-center bg-gray-900">
                <img
                    src={image ? getImageUrl(image) : ''}
                    alt="VIP Clearance at Malaysia Airport"
                    className="absolute inset-0 w-full h-full object-center object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className="z-10 max-w-4xl px-6 mb-6">
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScB4u2Ovi_PMj_st6lqisz8NqNgeTdr9d2737UzTvaNcOAnaw/viewform"
                        target="_blank"
                        className="px-10 py-4 bg-[#FF1033] text-white hover:bg-[#2D1F1F] hover:text-[#FF1033] rounded-full font-bold text-lg transition-all duration-300  xl"
                    >
                        Book Now
                    </a>
                </div>
            </section>

            {/* ===== VIP SERVICES SECTION ===== */}
            <section id="services-section" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-lg md:text-2xl font-bold  mb-2">
                            Say goodbye to long airport lines and hello to a seamless journey with our exclusive
                        </h2>
                        <h2 className="text-4xl   font-bold  mb-12">
                            VIP clearance service at Malaysian Immigration
                        </h2>
                        <div className="inline-block bg-[#FF1033] text-white px-8 py-3 rounded-lg text-2xl font-bold  ">
                            <span className="">What we offer ?</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {allServices.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center border-r border-dotted border-gray-300 last:border-r-0 px-4 transition-all duration-300 group"
                            >
                                <div className="mb-6 h-32 w-full flex items-center justify-center">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={getImageUrl(item.images[0])}
                                            alt={item.title}
                                            className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                            <Plane className="w-10 h-10 text-[#FF1033]" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-[#333333] leading-relaxed text-base">
                                    {item.contentHtml}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <a
                            href="https://docs.google.com/forms/d/e/1FAIpQLScB4u2Ovi_PMj_st6lqisz8NqNgeTdr9d2737UzTvaNcOAnaw/viewform"
                            target="_blank"
                            className="px-10 py-4 bg-[#FF1033] text-white hover:bg-[#2D1F1F] hover:text-[#FF1033] rounded-full font-bold text-lg transition-all duration-300  xl"
                        >
                            Book Now
                        </a>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-10 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {howItWorksItems.length > 0 ? (
                        <>
                            {howItWorksItems[0].title && (
                                <h2 className="text-center text-4xl  font-bold text-black mb-16">
                                    {howItWorksItems[0].title}
                                </h2>
                            )}
                            <div className="flex justify-center">
                                {howItWorksItems[0].images && howItWorksItems[0].images.length > 0 && (
                                    <img
                                        src={getImageUrl(howItWorksItems[0].images[0])}
                                        alt={howItWorksItems[0].title || "How It Works"}
                                        className="w-full max-w-4xl object-contain"
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-center text-4xl  font-bold text-black mb-16">
                                How It Works?
                            </h2>
                            <div className="flex justify-center">
                                <img
                                    src="/assets/vip-clearance-malaysia/Fill-in-the-form-e1714727110441-1.png"
                                    alt="How It Works"
                                    className="w-full max-w-4xl object-contain"
                                />
                            </div>
                        </>
                    )}
                </div>
            </section>


            {/* ===== DOCUMENTS REQUIRED ===== */}
            {documents && documents.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-6 md:px-20">

                        {/* Heading */}
                        <div className="text-center mb-14">
                            <h2 className="text-4xl   font-bold text-black">
                                Documents Required
                            </h2>
                        </div>

                        {/* List */}
                        <div className="space-y-8">
                            {documents.map((doc, index) => (
                                <ul key={index} className="space-y-4">
                                    {doc.description
                                        ?.split("\n")
                                        .filter(line => line.trim())
                                        .map((line, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center justify-center gap-4 text-lg md:text-xl font-semibold text-[#333333]"
                                            >
                                                {/* Red Check */}
                                                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#FF1033] flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </span>

                                                {/* Text */}
                                                <span>{line.trim()}</span>
                                            </li>
                                        ))}
                                </ul>
                            ))}
                        </div>

                        <div className="flex justify-center mt-12">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLScB4u2Ovi_PMj_st6lqisz8NqNgeTdr9d2737UzTvaNcOAnaw/viewform"
                                target="_blank"
                                className="px-10 py-4 bg-[#FF1033] text-white hover:bg-[#2D1F1F] hover:text-[#FF1033] rounded-full font-bold text-lg transition-all duration-300  xl"
                            >
                                Book Now
                            </a>
                        </div>

                    </div>
                </section>
            )}


            {/* ===== VISA CENTRES SECTION ===== */}
            {visaCentresSection.length > 0 && (
                <section
                    className="relative py-20 bg-white overflow-hidden"
                    style={{
                        backgroundImage: visaCentresSection[0]?.images?.[0]
                            ? `url(${getImageUrl(visaCentresSection[0].images[0])})`
                            : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-2 md:px-6 text-center relative z-10">

                        {/* Red Banner Heading */}
                        <div className="mb-12">
                            <h2 className="inline-block w-full max-w-6xl mx-auto
          bg-[#FF1033] text-white text-xl md:text-3xl font-bold
          py-4 p-4 md:px-8 rounded-full">
                                {visaCentresSection[0]?.title}
                            </h2>
                        </div>

                        {/* Cities Row */}
                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 text-lg font-semibold text-[#222]">
                            {visaCentresSection[0]?.contentHtml
                                ?.split("\n")
                                .filter(city => city.trim())
                                .map((city, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <MapPin className="w-4 h-4 text-[#FF1033]" />
                                        <span>{city.trim()}</span>
                                    </div>
                                ))}
                        </div>

                    </div>
                </section>
            )}


            {/* ===== FORM SECTION (Conditional - Only if fields exist) ===== */}
            {fields && fields.length > 0 && (
                <section className="py-24 bg-[#2D1F1F]">
                    <div className="max-w-2xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl  font-bold text-white mb-4">Book Your VIP Service</h2>
                            <p className="text-gray-300">Fill in your details and we'll get back to you</p>
                        </div>

                        {submitStatus && (
                            <div className={`p-4 mb-6 rounded-lg text-center ${submitStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {submitMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((field, index) => (
                                <DynamicFormField
                                    key={index}
                                    field={field}
                                    formValues={formValues}
                                    handleInputChange={handleInputChange}
                                    allFields={fields}
                                    theme="dark"
                                />
                            ))}
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full py-4 bg-[#FF1033] text-white rounded-full font-bold text-lg hover:bg-white hover:text-[#FF1033] transition-all flex justify-center items-center gap-4"
                            >
                                {submitLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </section>
            )}

            {/* ===== FAQ SECTION (Conditional) ===== */}
            {faqs && faqs.length > 0 && (
                <section className="py-24 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-6 md:px-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl  font-bold text-gray-900 mb-4">
                                Frequently Asked <span className="text-[#FF1033]">Questions</span>
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6   transition- ">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Vipclearanceatmalaysiaairport;