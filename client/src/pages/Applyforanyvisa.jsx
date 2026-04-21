import { useState, useEffect } from "react";
import { Check, ChevronDown, Award, Clock, Shield, Globe, MapPin, Users, FileCheck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import WhyUsSection from "../components/reusable/WhyUsSection";
import homeData from "../data/homeData.json"
import IsoCertificates from "../components/home/IsoCertificates";
import OurFootprints from "../components/home/OurFootprints";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Applyforanyvisa = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('');
  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/apply-for-any-visa`);
      if (!response.ok) throw new Error("Failed to fetch form data");
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
    if (imagePath.startsWith('/api/')) {
      return `${BackendURL}${imagePath}`;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${BackendURL}/api${imagePath}`;
    }
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
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/apply-for-any-visa`, {
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
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number || formValues.Phone ||'' }),
        });

        const res = await data.json()
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
      setSubmitMessage('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitLoading(false);
      setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
    }
  };

  if (loading) return <LoadingState message="Loading..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const {
    description,
    fields = [],
    faqs = [],
    documents = [],
    contentSections = {}
  } = formData || {};

  // Get sections by API keys
  const globalExpertsSection = contentSections['Global Experts in'] || [];
  const footprintsSection = contentSections['Our Footprints'] || [];
  const isoCertificatesSection = contentSections['ISO Certificates'] || [];
  const whyDuGlobalSection = contentSections['Why DU GLOBAL'] || contentSections['Why DU GLOBAL'] || [];

  // Why DU GLOBAL items (static for design matching)
  const whyDuGlobalItems = [
    { icon: Award, title: "Quality and Value", description: "Since 2015, the company has been expanding its offerings and geographical reach." },
    { icon: Clock, title: "Speed", description: "Prioritizing your time with quick processing and efficient service delivery." },
    { icon: Shield, title: "Fast Delivery", description: "Hassle-free passport delivery right to your doorstep." },
    { icon: Globe, title: "Trusted Network", description: "35+ locations across 6 countries with global partner offices." }
  ];

  const getFilteredOptions = (field) => {
    if (!field.parentField) return field.options;

    const parentValue = formValues[field.parentField];
    if (!parentValue) return [];

    const parentFieldDef = fields.find(f => f.name === field.parentField);
    if (!parentFieldDef) return field.options;

    const selectedParentOption = parentFieldDef.options?.find(opt =>
      (opt.value || opt.label || opt) === parentValue
    );

    if (!selectedParentOption) return [];

    const parentId = selectedParentOption.id || selectedParentOption._id;
    const parentOptionValue = selectedParentOption.value || selectedParentOption.label || selectedParentOption;

    return field.options?.filter(opt => {
      // If the option has no connectId, it's considered valid (e.g. the parent options themselves)
      if (!opt.connectId) return true;
      // Match against ID or Value
      return opt.connectId === parentId || opt.connectId === parentOptionValue;
    }) || [];
  };

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION (Text Only) ===== */}
      <section className="relative w-full py-32 h-[800px]">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative left-0 z-10 max-w-7xl mx-auto pt-20 px-6 md:px-35">
          <div className="text-white max-w-xl">
            {/* <p className="text-lg mb-2 text-gray-300">Welcome to</p> */}
            <h1 className="text-3xl md:text-4xl   font-bold leading-tight mb-6">
              Welcome to
              <br />
              DU GLOBAL
              {/* <span style={{ color: '#FF1033' }}></span> */}
            </h1>
            {/* <p className="text-gray-300 text-lg mb-8">
              Your trusted partner for visa services worldwide
            </p> */}
            <a
              href="#apply-form"
              className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]"
            >
              Apply for Any Visa
            </a>
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION (Separate with BG Image) ===== */}
      {fields.length > 0 && (
        <section
          id="apply-form"
          className="relative max-w-6xl mx-auto pb-16 pt-4 my-5 rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: 'url(/Visa-banner-2.jpg)'
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-8">
              <p className="text-xl font-semibold mb-2" style={{ color: '#FF1033' }}>VISA APPLICATION</p>
              <h2 className="text-4xl md:text-4xl font-bold text-white">Apply for Any Visa</h2>
            </div>

            <form className="bg-white rounded-xl p-8  2xl" onSubmit={handleSubmit}>
              {(() => {
                const textFields = fields.filter(f => ['text', 'email', 'number'].includes(f.type));
                const selectFields = fields.filter(f => f.type === 'select');
                const checkboxFields = fields.filter(f => f.type === 'checkbox');
                const radioFields = fields.filter(f => f.type === 'radio');
                const textarea = fields.filter(f => f.type === "textarea")

                return (
                  <>
                    {/* All text fields in one row */}
                    {textFields.length > 0 && (
                      <div className={`grid gap-4 mb-4 ${textFields.length >= 3 ? 'md:grid-cols-3' : textFields.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        {textFields.map((field, index) => (
                          <input
                            key={field._id || `text-${index}`}
                            type={field.type === 'number' ? 'tel' : field.type}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            aria-label={field.label || field.placeholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                            required={field.required}
                          />
                        ))}
                      </div>
                    )}

                    {/* Select fields - Country & State in one row, others full width */}
                    {selectFields.length > 0 && (
                      <div className="grid md:grid-cols-3 gap-4">
                        {selectFields.map((field, index) => (
                          <select
                            key={field._id || index}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            className="flex-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer text-sm"
                            required={field.required}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.25em 1.25em',
                              paddingRight: '2rem'
                            }}
                          >
                            <option value="">{field.placeholder || field.label}</option>
                            {getFilteredOptions(field)?.map((opt, optIdx) => (
                              <option key={opt._id || optIdx} value={opt.value || opt}>
                                {opt.label || opt}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    )}
                    {
                      textarea.map((field, index) => <div key={index}>
                        {field.label && (
                          <label className={`${labelClass} block mb-2`}>
                            {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                          </label>
                        )}
                        <textarea
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          placeholder={field.placeholder || field.label}
                          className={`${baseInputClass} min-h-[100px]`}
                          required={field.required}
                        />
                      </div>)
                    }

                    {/* Checkbox fields */}
                    {checkboxFields.map((field, index) => (
                      <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-gray-600 cursor-pointer my-4">
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={formValues[field.name] || false}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 accent-red-600 rounded flex-shrink-0"
                        />
                        <span className="text-xs leading-relaxed">{field.label}</span>
                      </label>
                    ))}

                    {radioFields.map((index, field) => <div key={index} className="space-y-4">
                      <label className="text-white text-sm font-medium block mb-2">
                        {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {field.options?.map((opt, i) => (
                          <label key={i} className="flex items-center gap-4 text-white cursor-pointer">
                            <input
                              type="radio"
                              name={field.name}
                              value={opt.value || opt.label || opt}
                              checked={formValues[field.name] === (opt.value || opt.label || opt)}
                              onChange={handleInputChange}
                              className="w-4 h-4"
                              required={field.required}
                            />
                            <span className="text-sm">{opt.label || opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>)

                    }
                    {
                      otpSent && (
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
                      )
                    }
                    {/* Submit Status Message */}
                    {submitStatus && (
                      <div className={`flex items-center gap-4 p-4 rounded-lg mb-4 ${submitStatus === 'success' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                        {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-[#FF1033] flex-shrink-0" />}
                        <p className={`text-sm ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>{submitMessage}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-70 flex items-center justify-center gap-4"
                    >
                      {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Application'}
                    </button>
                  </>
                );
              })()}
            </form>
          </div>
        </section>
      )}

      {/* ===== GLOBAL EXPERTS SECTION ===== */}
      {globalExpertsSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {globalExpertsSection.map((item, index) => {
              // Convert YouTube URL to embed format
              const getYouTubeEmbedUrl = (url) => {
                if (!url) return null;
                // Handle different YouTube URL formats
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;
                return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
              };

              const embedUrl = getYouTubeEmbedUrl(item.youtubeUrl);

              return (
                <div key={item._id || index} className="grid lg:grid-cols-2  gap-y-12 items-center place-items-center">
                  <div>
                    <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#333333' }}>Global Experts in</p>
                    <div className="w-14 h-0.5 mr-2"></div>
                    <h2 className="text-xl font-semibold text-[#333333] my-6">
                      {item.title}
                    </h2>
                    <p className="text-[#333333] leading-relaxed">
                      {item.contentHtml}
                    </p>
                  </div>
                  {embedUrl && (
                    <div className="rounded-xl w-full overflow-hidden  ">
                      <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title={item.title || "DU GLOBAL Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== WHY DU GLOBAL SECTION ===== */}


      <WhyUsSection data={homeData.whyUsSection} button={true} buttonLink="/about-us" buttonName="About Us" />
      {/* ===== OUR FOOTPRINTS SECTION ===== */}
      {footprintsSection.length > 0 && (


        <OurFootprints data={homeData.ourFootprintsSection} />


      )}



      {/* ===== ISO CERTIFICATES SECTION ===== */}
      {isoCertificatesSection.length > 0 && (
        <div className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <IsoCertificates data={homeData.certificationsSection} />
          </div>
        </div>
      )}

      {/* ===== DOCUMENTS SECTION (only if documents exist) ===== */}
      {documents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Documents Required</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc._id || index} className="bg-white rounded-xl p-6  sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-4">
                    <Check className="w-5 h-5" style={{ color: '#FF1033' }} />
                    {doc.title}
                  </h3>
                  <ul className="space-y-4">
                    {doc.description?.split('\n').filter(line => line.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-gray-600">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ SECTION (only if faqs exist) ===== */}
      {faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className="rounded-lg overflow-hidden border border-gray-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left bg-white"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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

export default Applyforanyvisa;