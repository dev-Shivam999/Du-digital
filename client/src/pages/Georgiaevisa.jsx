import React, { useState, useEffect } from "react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import { Loader2, Check, ChevronDown } from "lucide-react";
import DynamicFormField from "../components/reusable/DynamicFormField";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Georgiaevisa = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('');
    useEffect(() => {
        fetchFormData();
    }, []);

    const fetchFormData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BackendURL}/api/forms/slug/georgia-evisa`);
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

            if (otpSent) {
                const response = await fetch(`${BackendURL}/api/form-submissions/slug/georgia-evisa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formValues, otp }),
                });
                const res = await response.json();
                if (res.ok) {
                    setSubmitStatus('success');
                    setSubmitMessage('Thank you! Your  application has been submitted successfully. Our team will contact you shortly.');
                    // Reset form
                    // const resetValues = {};
                    // formData?.fields?.forEach(field => { resetValues[field.name] = ''; });
                    // setFormValues(resetValues);
                } else {

                    setSubmitStatus('error');
                    setSubmitMessage(res.message || 'Something went wrong. Please try again.');
                }
            } else {

                const data = await fetch(`${BackendURL}/api/otp/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number ||formValues.Phone|| '' }),
                });

                const res =await data.json()
                if (res.success) {
                    setSubmitMessage('Thank you! submit the 6 digit otp');
                    setSubmitStatus('success');
                    alert('submit the 6 digit otp');
                    setOtpSent(true);
                } else {
                    setSubmitMessage('Invaild Number');

                    setSubmitStatus('error');
                }

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

    const { fields = [], contentSections = {}, documents = [], faqs = [], image } = formData || {};

    // Get content sections dynamically
    const bottomHeroSection = contentSections['bottomhero'] || [];
    const revisedProcessSection = contentSections['Revised process to apply Georgia Visa-'] || [];
    const duVerifySection = contentSections['What is DuVerify'] || [];

    return (
        <div className="bg-white  ">
            {/* ===== HERO SECTION (Split Layout) ===== */}
            <section className="relative w-full min-h-[800px] lg:h-[800px] flex items-center bg-[#1D2A37]">
                <img
                    src={image ? getImageUrl(image) : ''}
                    alt="Georgia eVisa"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 grid lg:grid-cols-2 gap-12 items-center place-items-center w-full place-items-center py-20">

                    {/* Left - Title */}
                    <div className="text-white">
                        <h1 className="text-4xl  lg:text-5xl  font-bold leading-tight">
                            Georgia eVisa <br /> for Indians
                        </h1>
                    </div>

                    {/* Right - Form (Only if fields exist) */}
                    {fields && fields.length > 0 && (
                        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full ml-auto">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Apply Now</h3>

                            {submitStatus && (
                                <div className={`p-3 mb-4 text-sm rounded ${submitStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                                {otpSent && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-[#c60505] focus:ring-1 focus:ring-[#c60505] outline-none text-gray-900 bg-white text-sm"
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full py-4 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] rounded-full font-bold transition-all flex justify-center items-center gap-4"
                                >
                                    {submitLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Apply Now'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            {/* ===== INTRO TEXT + VIDEO SECTION ===== */}
            {(bottomHeroSection.length > 0 || revisedProcessSection.length > 0) && (
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        {/* Intro Paragraph */}
                        {bottomHeroSection.length > 0 && (
                            <p className="text-lg text-gray-700 leading-relaxed mb-12">
                                {bottomHeroSection[0]?.contentHtml}
                            </p>
                        )}

                        {/* Video Section */}
                        {revisedProcessSection.length > 0 && (
                            <>
                                <h2 className="text-4xl md:text-4xl font-bold text-[#FF1033] mb-8">
                                    {revisedProcessSection[0]?.title}
                                </h2>

                                {revisedProcessSection[0]?.youtubeUrl && (
                                    <div className="aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden  xl mb-12">
                                        <video
                                            src={revisedProcessSection[0].youtubeUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <p className="text-lg text-gray-700 leading-relaxed text-left whitespace-pre-line">
                                    {revisedProcessSection[0]?.contentHtml}
                                </p>
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* ===== WHAT IS DUVERIFY SECTION (Conditional) ===== */}
            {duVerifySection.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-8">
                            {duVerifySection[0]?.title}
                        </h2>
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line text-left">
                            {duVerifySection[0]?.contentHtml}
                        </p>
                    </div>
                </section>
            )}

            {/* ===== DOCUMENTS / CAPABILITIES SECTION (Conditional) ===== */}
            {documents && documents.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-6 md:px-20">
                        {documents.map((doc, docIndex) => (
                            <div key={docIndex} className="mb-12 last:mb-0">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                                    {doc.title}
                                </h3>
                                <ul className="space-y-4 text-left max-w-xl mx-auto">
                                    {doc.description?.split('\n').map((line, i) => (
                                        line.trim() && (
                                            <li key={i} className="flex items-center gap-4">
                                                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 text-lg">{line.trim()}</span>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ===== FAQ SECTION (Conditional) ===== */}
            {faqs && faqs.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-6 md:px-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-lg  sm overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-all"
                                    >
                                        <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-4 pb-4">
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Georgiaevisa;