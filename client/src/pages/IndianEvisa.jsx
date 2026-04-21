import { useState, useEffect } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Mail,
  Plane,
  Shield,
  Globe,
  Clock,
  Users,
  Phone,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import whyUsSectionData from "../data/whyUsSection.json";
import WhyUsSection from "../components/reusable/WhyUsSection";
import SEO from "../components/reusable/SEO";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const IndianEvisa = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [openDocIndex, setOpenDocIndex] = useState(0);
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
      const response = await fetch(`${BackendURL}/api/forms/slug/india-evisa`);
      if (!response.ok) throw new Error("Failed to fetch form data");
      const data = await response.json();
      setFormData(data);

      // Initialize form values
      const initialValues = {};
      data.fields?.forEach(field => {
        initialValues[field.name] = '';
      });
      setFormValues(initialValues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const toggleDoc = (index) => {
    setOpenDocIndex(openDocIndex === index ? null : index);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // console.log(JSON.stringify(`${BackendURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`), JSON.stringify(BackendImagesURL));


    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath.replace("/api", '')}`;
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
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/india-evisa`, {
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

  if (loading) return <LoadingState message="Loading eVisa information..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const {
    name,
    description,
    fields = [],
    faqs = [],
    documents = [],
    contentSections = {},
  } = formData || {};

  // Get sections
  const heroSection = contentSections['hero'] || [];
  const applicationProcessSection = contentSections['E-VISA APPLICATION PROCESS'] || [];

  // Process steps with icons
  const processSteps = [
    { icon: FileText, title: "Apply Online", desc: "Upload Photo and Passport Page" },
    { icon: CreditCard, title: "Pay eVisa Fee", desc: "Online Using Credit / Debit card / Payment Wallet" },
    { icon: Mail, title: "Receive ETA Online", desc: "Electronic Travel Authorization Will be sent to your e-mail" },
    { icon: Plane, title: "Fly to India", desc: "Present your ETA at the airport" }
  ];

  // Why choose us features
  const whyChooseFeatures = [
    { icon: Shield, title: "Trusted & Secure", desc: "100% secure processing with data protection" },
    { icon: Clock, title: "Fast Processing", desc: "Quick turnaround time for your eVisa" },
    { icon: Users, title: "Expert Support", desc: "24/7 customer support available" },
    { icon: Globe, title: "Global Reach", desc: "Serving travelers from 150+ countries" }
  ];

  // Quick support countries
  const supportCountries = [
    { name: "South Korea", code: "+82", phone: "tel:+827052342395" },
    { name: "Thailand", code: "+66", phone: "tel:+6620261185" },
    { name: "India", code: "+91", phone: "tel:+917289000071" }
  ];

  return (
    <div className="bg-white  ">
  <SEO />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-[600px] sm:h-[800px] overflow-hidden">
        {/* Hero Image */}
        {formData?.image && (
          <img
            src={getImageUrl(formData.image)}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl h-full mx-auto px-6 md:px-20 py-16">
          <div className="grid lg:grid-cols-2 h-full  gap-14 items-center">

            {/* ===== LEFT CONTENT ===== */}
            <div className="text-white">
              <h1 className="text-4xl font-bold leading-tight mb-6">
                Apply eVisa <br />for India
                {/* Apply eVisa <br />for <span className="text-[#FF1033]">India</span> */}
              </h1>

              <p className="text-gray-200 text-lg mb-8 max-w-lg">
                Simplified Travel to India for Global Travelers. Get your eVisa
                quickly and easily with our streamlined process.
              </p>

              {/* Highlights */}
              {/* Need bg gradient fro left to right */}
              <div className="bg-linear-to-r from-[#FF1033]/80 to-[#FF1033]/10 inline-block px-6 py-4 rounded-xl mb-8">
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white mr-2">
                      <Check className="w-3 h-3 text-[#FF1033]" strokeWidth={3} />
                    </span>
                    Partner of MEA, Government of India
                  </li>
                  <li>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white mr-2">
                      <Check className="w-3 h-3 text-[#FF1033]" strokeWidth={3} />
                    </span>
                    1.7M+ applications processed
                  </li>
                  <li>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white mr-2">
                      <Check className="w-3 h-3 text-[#FF1033]" strokeWidth={3} />
                    </span>
                    Operating in 6 countries
                  </li>
                </ul>
              </div>

              {/* Support Buttons */}
              <div>
                <p className="flex items-center gap-4 mb-4 font-semibold">
                  <Phone className="w-5 h-5 text-[#FF1033]" />
                  Call Us For Quick Support
                </p>

                <div className="flex gap-4 flex-wrap">
                  {supportCountries.map((c, i) => (
                    <a
                      key={i}
                      href={`tel:${c.phone}`}
                      className="px-6 py-3 rounded-full font-semibold bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] transition"
                    >
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== RIGHT FORM CARD ===== */}
            <div className="bg-black/75 backdrop-blur-md rounded-2xl p-4 lg:p-10  2xl">
              {/* <h2 className="text-2xl font-bold text-white mb-6">
                Apply for India E-Visa
              </h2> */}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dynamic Field Rendering */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields
                    .filter(field => {
                      if (!field.isActive) return false;

                      // Logic for "I am interested in" visibility based on Visa Type
                      if (field.name === 'i_am_interested_in') {
                        // If no visa type selected, hide both
                        if (!formValues.visa_type) return false;

                        const isTourist = formValues.visa_type === 'tourist_e-visa';
                        const isBusiness = formValues.visa_type === 'business_e-visa';

                        // Check options count to distinguish between the two same-named fields
                        // Tourist usually has multiple options (1 month, 1 year, 5 year)
                        // Business usually has fewer (e.g. 1 year)
                        // Based on user request/API:
                        // Field with > 1 option is for Tourist
                        // Field with 1 option is for Business (or "other dropdown")

                        // Note: This logic depends on the specific API structure provided by the user.
                        // Ideally we'd use a more robust way to link them, but we'll use option count as a proxy 
                        // or order if distinct. 
                        // User API provided:
                        // Field A (Order 7): 3 options
                        // Field B (Order 8): 1 option

                        if (isTourist) {
                          return field.options.length > 1;
                        }
                        if (isBusiness) {
                          return field.options.length === 1;
                        }
                        return false;
                      }
                      return true;
                    })
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => {
                      const commonClasses = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white text-gray-700 placeholder-gray-400";

                      const fieldType = field.type || field.fieldType;
                      const isFullWidth = ['checkbox', 'textarea'].includes(fieldType);

                      // Wrapper class
                      const wrapperClass = isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1";

                      // Special render for Select
                      if (fieldType === 'select' || fieldType === 'dropdown') {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <select
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              className={`${commonClasses} appearance-none cursor-pointer`}
                              required={field.required}
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="" disabled>{field.placeholder || field.label}</option>
                              {field.options?.map((opt, optIdx) => (
                                <option key={opt._id || optIdx} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      // Special render for Radio (Visa Type)
                      if (fieldType === 'radio') {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <p className="text-white font-medium mb-3">
                              {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                            </p>
                            <div className="flex flex-wrap gap-4">
                              {field.options?.map((opt, optIdx) => (
                                <label key={opt._id || optIdx} className="flex items-center gap-4 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value}
                                    checked={formValues[field.name] === opt.value}
                                    onChange={handleInputChange}
                                    className="hidden"
                                    required={field.required}
                                  />
                                  <span
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formValues[field.name] === opt.value
                                      ? "border-[#FF1033] bg-[#FF1033]"
                                      : "border-gray-400"
                                      }`}
                                  >
                                    {formValues[field.name] === opt.value && (
                                      <span className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                  </span>
                                  <span className="text-white text-sm capitalize">
                                    {opt.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Special render for Checkbox
                      if (fieldType === 'checkbox') {
                        return (
                          <div key={field._id || index} className={`${wrapperClass} flex items-start gap-4 mt-2`}>
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={!!formValues[field.name]}
                              onChange={handleInputChange}
                              id={`field-${field._id || index}`}
                              className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF1033] focus:ring-red-500 cursor-pointer accent-red-600"
                              required={field.required}
                            />
                            <label htmlFor={`field-${field._id || index}`} className="text-white text-xs md:text-sm leading-relaxed cursor-pointer">
                              {field.label || field.placeholder}
                            </label>
                          </div>
                        );
                      }

                      // Special render for Date
                      if (fieldType === 'date') {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <input
                              type={fieldType}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className={`${commonClasses} w-full`} // Ensure full width
                              required={field.required}
                            />
                          </div>
                        )
                      }


                      // Default Input (Text, Email, Number, etc)
                      return (
                        <div key={field._id || index} className={wrapperClass}>
                          <input
                            type={fieldType}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className={commonClasses}
                            required={field.required}
                          />
                        </div>
                      );
                    })}{otpSent && (
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
                </div>

                {/* Submit Status Message */}
                {submitStatus && (
                  <div className={`flex items-center gap-4 p-3 rounded mb-4 ${submitStatus === 'success' ? 'bg-green-500/20' : 'bg-[#FF1033]/20'}`}>
                    {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>{submitMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-70 flex items-center justify-center gap-4 w-full md:w-auto"
                >
                  {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Form'}
                </button>
              </form>
            </div >

          </div >
        </div >
      </section >



      {/* ===== EXPLORE WONDERS SECTION ===== */}
      {
        heroSection.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
              {heroSection.map((item, index) => (
                <div key={item._id || index} className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl md:text-4xl font-bold text-[#333333] mb-2">
                      {item.title}
                    </h2>

                    <div
                      className="text-gray-600 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{ __html: item.contentHtml }}
                    />
                  </div>
                  <div className="relative">

                    <div className="relative">
                      {item?.images?.length > 0 ? (
                        item.images.map(p => <img
                          src={getImageUrl(p)}
                          alt={item.title}
                          className="max-w-full h-auto rounded-xl  "
                        // style={{ maxHeight: '400px' }}
                        />)
                      ) : item.image && <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="max-w-full h-auto rounded-xl  "
                      // style={{ maxHeight: '400px' }}
                      />}
                      {/* Badge overlay */}
                      {item.badge?.text && (
                        <div
                          className="absolute -top-14 -right-4 w-28 h-28 flex flex-col items-center justify-center text-white text-center  "
                          style={{ backgroundColor: item.badge.background || '#FF1033' }}
                        >
                          <span className="text-xs font-medium leading-tight px-2">{item.badge.text}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* ===== ELIGIBILITY SECTION ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-4xl font-bold text-[#333333]">
              Eligibility for India eVisa
            </h2>
          </div>

          <div className="rounded-2xl p-0 md:p-10 pt-3">
            <div className="space-y-4">
              {[
                "International travellers whose sole objective for visiting India is recreation, sightseeing, casual visit to meet friends and relatives, attending a short term yoga programme, Short term courses on local languages, music, dance, arts & crafts, cooking, medicine etc. which should not be a formal or structured course/programme (courses not exceeding 6 months duration and not issued with a qualifying certificate/ diploma etc),Voluntary work of short duration (for a maximum period of one month, which do not involve any monetary payment or consideration of any kind in return), medical treatment including treatment under Indian systems of medicine, business purpose, as attendant to e-Medical visa holder, attending a conference/ seminar/ workshop organized by a Ministry or Department of the Government of India, State Governments or UT Administrations etc. & their subordinate/ attached organizations & PSUs and private conferences organized by private persons/companies/organizations.",
                "Applicant's passport should have at least six months validity at the time of making application for grant of e-Visa.",
                "International Travellers should have return ticket or onward journey ticket, with sufficient money to spend during his/her stay in India.",
                "International Travellers having Pakistani Passport or Pakistani origin may please apply for regular Visa at Indian Mission.",
                "Not available to Diplomatic/Official Passport Holders or Laissez-passer travel document holders.",
                "Not available to individuals endorsed on Parent's/Spouse's Passport i.e. each individual should have a separate passport.",
                "Not available to International Travel Document Holders other than Passport."
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: '#FF1F3D' }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* ===== WHY DU GLOBAL SECTION ===== */}
      <WhyUsSection data={whyUsSectionData.whyUsSection} button={true} buttonLink="/about-us" buttonName="About Us" />


      {/* ===== E-VISA APPLICATION PROCESS ===== */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 md:px-20">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-4xl font-bold text-[#333333] tracking-wide">
              E-VISA APPLICATION PROCESS
            </h2>
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="hidden lg:grid grid-cols-4 gap-10 items-center">
            {(applicationProcessSection.length > 0
              ? applicationProcessSection.sort((a, b) => a.order - b.order)
              : processSteps
            ).map((step, index) => (
              <div key={index} className="relative flex items-center">

                {/* Card */}
                <div className="bg-white rounded-2xl px-8 py-8 text-center   w-full min-h-[250px]">
                  <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-full border-4 border-[#FF1F3D] flex items-center justify-center text-[#FF1F3D] text-xl font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-500 text-md leading-relaxed">
                    {step.contentHtml || step.desc}
                  </p>
                </div>

                {/* Arrow */}
                {index < 3 && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[#FF1033] text-3xl font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ================= MOBILE VIEW ================= */}
          <div className="lg:hidden space-y-10">
            {(applicationProcessSection.length > 0
              ? applicationProcessSection.sort((a, b) => a.order - b.order)
              : processSteps
            ).map((step, index) => (
              <div key={index} className="relative pl-10">

                {/* Vertical Line */}
                {index < 3 && (
                  <div className="absolute left-[22px] top-14 h-full w-[2px] bg-red-200"></div>
                )}

                {/* Step Circle */}
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full border-4 border-[#FF1033] text-[#FF1033] flex items-center justify-center font-bold text-lg bg-white">
                  {index + 1}
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-xl p-6  md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.contentHtml || step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ===== DOCUMENTS REQUIRED ===== */}
      {
        documents.length > 0 && (
          <section className="py-24 pt-10 bg-[#F7F7F7]">
            <div className="max-w-6xl mx-auto px-6 md:px-20">
              <div className="text-center mb-6">
                <h2 className="text-4xl md:text-4xl font-bold text-[#333333] mb-2">
                  Documents Required
                </h2>
              </div>

              <div className="space-y-4">
                {documents.filter(d => d.isActive).sort((a, b) => a.order - b.order).map((doc, index) => (
                  <div
                    key={doc._id || index}
                    className="rounded-xl overflow-hidden  md"
                  >
                    <button
                      onClick={() => toggleDoc(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold transition-colors duration-200"
                      style={{ backgroundColor: '#FF1033' }}
                    >
                      <span className="text-lg">{doc.title}</span>
                      {openDocIndex === index ? (
                        <ChevronUp className="w-6 h-6 text-white flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-white flex-shrink-0" />
                      )}
                    </button>

                    {openDocIndex === index && (
                      <div className="px-6 py-6 bg-white">
                        <div className="space-y-4">
                          {doc.description?.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: '#FF1033' }}
                              >
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </div>
                              <p className="text-black text-base md:text-lg">{line.trim()}</p>
                            </div>
                          ))}
                        </div>
                        {doc.isMandatory && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-[#FF1033] font-medium">* Mandatory Documents</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* ===== FAQ SECTION ===== */}
      {
        faqs.length > 0 && (
          // <section className="py-20 bg-white">
          //   <div className="max-w-4xl mx-auto px-6 md:px-20">
          //     <div className="text-center mb-12">
          //        <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-2">
          //         Frequently Asked Questions
          //       </h2>
          //       <div className="w-20 h-1 mx-auto" style={{ backgroundColor: '#e63938' }}></div>
          //     </div>

          //     <div className="space-y-4">
          //       {faqs.filter(f => f.isActive).map((faq, index) => (
          //         <div 
          //           key={faq._id || index}
          //           className="rounded-xl overflow-hidden  md"
          //         >
          //           <button
          //             onClick={() => toggleFaq(index)}
          //             className="w-full px-6 py-5 flex items-center justify-between text-left text-white font-bold transition-colors duration-200"
          //             style={{ backgroundColor: '#e63938' }}
          //           >
          //             <span className="pr-4">{faq.question}</span>
          //             {openFaqIndex === index ? (
          //               <ChevronUp className="w-6 h-6 text-white flex-shrink-0" />
          //             ) : (
          //               <ChevronDown className="w-6 h-6 text-white flex-shrink-0" />
          //             )}
          //           </button>

          //           {openFaqIndex === index && (
          //             <div className="px-6 py-6 bg-white">
          //               <div className="text-gray-600 leading-relaxed whitespace-pre-line">
          //                 {faq.answer}
          //               </div>
          //             </div>
          //           )}
          //         </div>
          //       ))}
          //     </div>
          //   </div>
          // </section>
          <section className="bg-white py-24">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

              {/* LEFT CONTENT */}
              <div>
                <h2 className="text-4xl  font-bold leading-tight mb-6">
                  Any questions? <br />
                  We got you.
                </h2>

                <p className="text-gray-500 max-w-md mb-6">
                  Yet bed any for assistance indulgence unpleasing. Not thoughts all
                  exercise blessing. Indulgence way everything joy alteration
                  boisterous the attachment.
                </p>


              </div>

              {/* RIGHT FAQ LIST */}
              <div className="divide-y">
                {faqs.filter(f => f.isActive).map((item, index) => (
                  <div key={index} className="py-6">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center text-left"
                      aria-expanded={openFaqIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="text-lg font-semibold text-gray-900">
                        {item.question}
                      </span>

                      <span className="text-2xl text-gray-500">
                        {openFaqIndex === index ? "−" : "+"}
                      </span>
                    </button>

                    {openFaqIndex === index && (
                      <p className="mt-4 text-gray-500 max-w-xl">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </section>
        )
      }


    </div >
  );
};

export default IndianEvisa;
