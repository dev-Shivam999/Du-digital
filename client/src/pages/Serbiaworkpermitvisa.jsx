import { useState, useEffect } from "react";
import { Shield, Clock, Award, CheckCircle, XCircle, Loader2, Mail, Phone, Check } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Serbiaworkpermitvisa = () => {
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
      const response = await fetch(`${BackendURL}/api/forms/slug/serbia-work-permit-visa`);
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
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/serbia-work-permit-visa`, {
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

        
        const res = await data.json();
        if (res.success) {
          setSubmitStatus('success');
          setSubmitMessage('Thank you! submit the 6 digit otp');
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

  if (loading) return <LoadingState message="Loading Serbia Work Permit Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { description, fields = [], faqs = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const whatIsSection = contentSections['What is a Serbia D-Type Visa?'] || [];
  const whoCanApplySection = contentSections['Who Can Apply?'] || [];
  const whyChooseSection = contentSections['Why Choose DU GLOBAL?'] || [];
  // const getStartedSection = contentSections[' Get Started Today!'] || [];
  const VisaApplicationCentreAddress = contentSections['Visa Application Centre Addresses'] || [];
  const connectWithUsSection = contentSections['Connect with us'] || [];
  const getStartedSection = contentSections['Get Started Today!'] || [];

  // Parse description lines
  const descriptionLines = description?.split('\r\n').filter(line => line.trim()) || [];

  // Icons for Why Choose section
  const whyChooseIcons = [Award, Clock, Shield];

  let centreAddressTableData = null;
  if (VisaApplicationCentreAddress.length > 0) {
    // Check if tableData exists directly (if backend structure supports it)
    if (VisaApplicationCentreAddress[0]?.tableData) {
      centreAddressTableData = VisaApplicationCentreAddress[0].tableData;
    }
    // Fallback: parse contentHtml if tableData is missing but contentHtml has JSON
    else if (VisaApplicationCentreAddress[0]?.contentHtml) {
      try {
        const rawHtml = VisaApplicationCentreAddress[0].contentHtml.replace(/<[^>]*>?/gm, '');
        // Check if it looks like JSON before parsing to avoid syntax errors on normal text
        if (rawHtml.trim().startsWith('{') || rawHtml.trim().startsWith('[')) {
          centreAddressTableData = JSON.parse(rawHtml);
        }
      } catch (e) {
        console.warn("Could not parse address table data", e);
      }
    }
  }

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full md:h-[800px] min-h-[800px] overflow-hidden">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Serbia Work Permit Visa"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full">
            {/* Left - Hero Text */}
            <div className="text-white">
              {descriptionLines.map((line, index) => (
                <p key={index} className={index === 0 ? "text-4xl    font-bold leading-tight mb-4" : index == 1 ? "text-4xl font-bold uppercase text-[#FF1033] mb-2" : "text-xl text-gray-300 mb-2"}>
                  {index === 0 ? (
                    <>
                      Work in Serbia: Secure Your D-Type Visa with
                    </>
                  ) : line
                  }
                </p>
              ))}
            </div>

            {/* Right - Contact Form with dark transparent bg */}
            {fields.length > 0 && (
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" onSubmit={handleSubmit}>
                  {fields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => {
                      const fieldType = field.type || field.fieldType;

                      // Logic for "Preferred Center" - Conditional Radio
                      if (field.name === 'preferred_center') {
                        const selectedCountry = formValues['country'];
                        if (!selectedCountry) return null; // Don't show if no country selected

                        // Filter options based on connectId
                        const relevantOptions = field.options?.filter(opt =>
                          opt.connectId?.toLowerCase() === selectedCountry.toLowerCase()
                        );

                        if (!relevantOptions || relevantOptions.length === 0) return null; // Don't show if no matching centers

                        return (
                          <div key={field._id || index} className="col-span-1 md:col-span-2 mt-2">
                            <label className="text-white text-base font-semibold block mb-3">
                              {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                            </label>
                            <div className="space-y-4">
                              {relevantOptions.map((opt, i) => (
                                <label key={i} className="flex items-center gap-4 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded-full border border-white flex items-center justify-center transition-all ${formValues[field.name] === (opt.value || opt.label) ? 'bg-white' : 'bg-transparent'
                                    }`}>
                                    {formValues[field.name] === (opt.value || opt.label) && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                    )}
                                  </div>
                                  <input
                                    type="radio"
                                    name={field.name}
                                    value={opt.value || opt.label}
                                    checked={formValues[field.name] === (opt.value || opt.label)}
                                    onChange={handleInputChange}
                                    className="hidden"
                                    required={field.required}
                                  />
                                  <span className="text-white text-sm md:text-base font-medium">{opt.label || opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Standard Fields
                      const isFullWidth = ['textarea', 'checkbox'].includes(fieldType) || field.type === 'checkbox';
                      const wrapperClass = isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1";

                      if (fieldType === 'select' || fieldType === 'dropdown') {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <select
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer text-sm"
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
                              {field.options?.map((opt, optIdx) => (
                                <option key={opt._id || optIdx} value={opt.value || opt}>
                                  {opt.label || opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      } else if (fieldType === 'textarea') {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <textarea
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm min-h-[100px]"
                              required={field.required}
                            />
                          </div>
                        );
                      } else if (fieldType === 'checkbox') {
                        return (
                          <div key={field._id || index} className={`${wrapperClass} flex items-center gap-4 mt-2`}>
                            <div className="relative flex items-start">
                              <input
                                type="checkbox"
                                name={field.name}
                                checked={formValues[field.name] || false}
                                onChange={handleInputChange}
                                id={`field-${index}`}
                                className="peer sr-only"
                                required={field.required}
                              />
                              <div className={`w-5 h-5 rounded transition-colors flex items-center justify-center mt-1.5  sm ${formValues[field.name] ? 'bg-[#FF1033]' : 'bg-white'}`}>
                                <Check
                                  className={`w-3.5 h-3.5 text-white font-bold transition-opacity duration-200 ${formValues[field.name] ? 'opacity-100' : 'opacity-0'}`}
                                  strokeWidth={4}
                                />
                              </div>
                              <label htmlFor={`field-${index}`} className="ml-2 text-white text-xs md:text-sm leading-relaxed cursor-pointer select-none">
                                {field.label || field.placeholder}
                              </label>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div key={field._id || index} className={wrapperClass}>
                            <input
                              type={fieldType === 'number' ? 'tel' : fieldType}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className="w-full px-4 py-3 bg-white border-0 rounded text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                              required={field.required}
                            />
                          </div>
                        );
                      }
                    })}
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
                  <div className="col-span-1 md:col-span-2">
                    {submitStatus && (
                      <div className={`flex items-center gap-4 p-3 rounded mb-4 ${submitStatus === 'success' ? 'bg-green-500/20' : 'bg-[#FF1033]/20'}`}>
                        {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                        <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>{submitMessage}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-fit py-3 px-5 rounded-full font-medium text-base capitalize transition-all duration-300  bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-70 flex items-center justify-center gap-4"
                    >
                      {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Get Started'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHAT IS SERBIA D-TYPE VISA ===== */}
      {whatIsSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {whatIsSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {item.contentHtml}
                  </p>
                </div>
                <div className="flex justify-center">
                  {item.images?.length > 0 ? (
                    item.images.map(p => <img
                      src={getImageUrl(p)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-2xl  xl"
                      style={{ maxHeight: '400px' }}
                    />)
                  ) : item.image &&
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="max-w-full h-auto rounded-2xl  xl"
                    style={{ maxHeight: '400px' }}
                  />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== WHO CAN APPLY / DOCUMENTS / FEES ===== */}
      {whoCanApplySection.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {whoCanApplySection.map((item, index) => {
              // Check if this is a table-like content (has tabs)
              const isTable = item.contentHtml?.includes('\t');

              // Special layout for "Who Can Apply?"
              if (item.title === 'Who Can Apply?') {
                return (
                  <div key={item._id || index} className="mb-16 last:mb-0 text-center">
                    <h2 className="text-4xl md:text-4xl  font-bold text-[#333333] mb-4">
                      {item.title}
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-6" ></div>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-4xl mx-auto">
                      {item.contentHtml}
                    </p>
                  </div>
                );
              }

              return (
                <div key={item._id || index} className="mb-16 last:mb-0">
                  <div className={`grid lg:grid-cols-2 gap-12 place-items-center `}>
                    <div className={`${index % 2 != 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
                        {item.title}
                      </h2>
                      <div className="w-20 h-1 mb-6" ></div>

                      {isTable || item.title.includes('Checklist') ? (
                        // Render as table
                        <div className="bg-white rounded-xl  md overflow-hidden border border-gray-200">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-r border-gray-200 last:border-r-0">Document</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Who Provides</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {item.contentHtml?.split('\r\n').filter(line => line.trim()).map((row, rowIdx) => {
                                // If the first row in data matches our hardcoded header, skip it
                                if (rowIdx === 0 && (row.toLowerCase().includes('document') || row.toLowerCase().includes('provides'))) return null;

                                const cells = row.split('\t');
                                return (
                                  <tr key={rowIdx} className="hover:bg-gray-50 transition-colors even:bg-gray-50">
                                    {cells.map((cell, cellIdx) => (
                                      <td key={cellIdx} className={`px-6 py-4 text-sm text-gray-700 ${cellIdx === 0 ? 'border-r border-gray-200' : ''}`}>
                                        {cell.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        // Render as paragraph
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {item.contentHtml}
                        </p>
                      )}
                    </div>

                    <div className={`flex justify-center ${index % 2 != 0 ? 'lg:order-2' : 'lg:order-1'
                      }`}>
                      {item.images?.length > 0 ? (
                        item.images.map(p => <img
                          key={p}
                          src={getImageUrl(p)}
                          alt={item.title}
                          className="max-w-full h-auto rounded-2xl  xl"

                        />
                        )
                      ) :
                        item.image && <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="max-w-full h-auto rounded-2xl  xl"

                        />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE DU GLOBAL ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl font-bold text-white mb-3">
                Why Choose DU GLOBAL?
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {whyChooseSection.map((item, index) => {
                const IconComponent = whyChooseIcons[index % whyChooseIcons.length];
                return (
                  <div key={item._id || index} className="text-center bg-white rounded-[2rem] p-10 relative overflow-hidden   hover:translate-y-[-5px] transition-all duration-300">
                    {/* Red Corner Accent */}
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#FF1033] transform translate-x-1/2 -translate-y-1/2 rotate-45" />

                    <div className="mb-6 relative z-10 flex justify-center mt-4">
                      <IconComponent className="w-16 h-16 text-[#FF1033]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#333333] mb-4 relative z-10">{item.title}</h3>
                    <p className="text-[#333333] leading-relaxed relative z-10 text-base">{item.contentHtml?.trim()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== GET STARTED TODAY ===== */}


      {/* ===== FAQ SECTION ===== */}
      {faqs.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-4xl  font-bold leading-tight mb-6">
                Any questions? <br />
                We got you.
              </h2>
              <p className="text-gray-500 max-w-md mb-6">
                Find answers to common questions about Serbia Work Permit Visa process, requirements, and timelines.
              </p>

            </div>

            {/* RIGHT FAQ LIST */}
            <div className="divide-y">
              {faqs.map((faq, index) => (
                <div key={faq._id || index} className="py-6">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>
                    <span className="text-2xl text-gray-500">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <p className="mt-4 text-gray-500 max-w-xl">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {
        VisaApplicationCentreAddress.length > 0 && centreAddressTableData && (
          <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-20 gap-12 items-start">
              {/* LEFT CONTENT */}
              <div>
                <h2 className="text-4xl md:text-4xl text-center font-bold leading-tight mb-6 text-[#333333]">
                  {VisaApplicationCentreAddress[0]?.title || "Visa Application Centre Addresses"}
                </h2>
                <div className="w-20 h-1 mx-auto mb-6" ></div>
              </div>
              <div className="bg-white   border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full border-collapse text-nowrap">
                    <thead>
                      <tr>
                        {centreAddressTableData.headers?.map((header, idx) => (
                          <th key={idx} className="px-6 py-4 text-left text-sm font-bold text-white border border-white bg-[#FF1033] whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {centreAddressTableData.rows?.map((row, rowIdx) => (
                        <tr key={rowIdx} className="bg-white hover:bg-gray-50 transition-colors even:bg-gray-50">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-6 py-4 text-sm text-gray-800 border border-gray-200 align-top">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </section>
        )
      }
      {getStartedSection.length > 0 && (
        <section id="connectwithus" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-4">
            {/* Left - Get Started Today */}
            <div className="relative h-full rounded-3xl overflow-hidden group">
              <img
                src={getStartedSection[0]?.images.length > 0
                  ? getImageUrl(getStartedSection[0].images[0])
                  : 'https://images.unsplash.com/photo-1549488497-69b59747d79b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} // Fallback to Serbia-like image
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Default Black Gradient Overlay - Fades out on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/60 transition-opacity duration-500 group-hover:opacity-0" />

              {/* Red Overlay on Hover - Fades in */}
              <div className="absolute inset-0 bg-[#FF1033]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />

              <div className="relative z-10 p-4 md:p-6 flex flex-col h-full text-white">
                <div>
                  <h2 className="text-4xl md:text-4xl font-semibold mb-3">
                    {getStartedSection[0]?.title || 'Get Started Today!'}
                  </h2>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-0">
                    {getStartedSection[0]?.contentHtml?.replace(/<[^>]*>?/gm, '').split('Note:')[0] || 'Ready to take the next step? Simply fill out our online contact form or call our hotline for a free eligibility assessment.'}
                  </p>
                </div>

                {/* Try to extract note from content or just show a default one if it matches the context */}
                <div className="text-gray-300 text-sm md:text-base mt-3">
                  <span className="font-bold text-white">Note:</span> A decisive role in whether you need a visa to stay in Serbia for up to 180 days is played by the visa regime of the country you are coming from, as well as the purpose of your stay.
                </div>
              </div>
            </div>

            {/* Right - Connect with us */}
            <div className="relative h-full rounded-3xl overflow-hidden bg-[#0A0505] p-4 md:p-6 flex flex-col justify-center">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">Connect with us</h3>
                <div className="w-16 h-1 mb-10" ></div>

                <div className="mb-8">
                  <h4 className="text-2xl md:text-3xl font-semibold text-white mb-2">Karan Khurana</h4>
                  <p className="text-white text-lg">Deputy General Manager-Global Access</p>
                </div>

                <div className="space-y-4">
                  <a
                    href="mailto:karan@dudigitalglobal.com"
                    className="flex items-center gap-4 group transition-colors"
                  >
                    {/* <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF1033] transition-colors">
                      <Mail className="w-5 h-5 text-white" />
                    </div> */}

                    <span className="text-[#FF1033] group-hover:text-white transition-colors font-medium text-lg">
                      <span className="text-white font-bold mr-2">📧 Email –</span>
                      karan@dudigitalglobal.com
                    </span>
                  </a>
                  <a
                    href="tel:+919910987275"
                    className="flex items-center gap-4 group transition-colors"
                  >
                    {/* <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF1033] transition-colors">
                      <Phone className="w-5 h-5 text-white" />
                    </div> */}

                    <span className="text-[#FF1033] group-hover:text-white transition-colors font-medium text-lg">
                      <span className="text-white font-bold mr-2">📞 Mobile –</span>
                      +91 99109 87275
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Serbiaworkpermitvisa;
