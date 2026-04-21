import { useState, useEffect, useCallback } from "react";
import { Check, MapPin, Clock, Wallet, Calendar, CheckCircle, XCircle, Loader2, Circle, Square } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import SEO from "../components/reusable/SEO";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Japantouristvisaforindians = () => {
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
      const response = await fetch(`${BackendURL}/api/forms/slug/japan-tourist-visa-for-indians`);
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

  const renderDocumentContent = useCallback((description) => {
    if (!description) return null;

    // Split by newlines and filter out completely empty lines, but keep lines with just spaces (though usually we want content)
    // Actually, we need to preserve leading spaces to determine level.
    const lines = description.split('\n').filter(line => line.trim().length > 0);

    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          // Count leading spaces
          const leadingSpaces = line.search(/\S|$/);
          const content = line.trim();

          let level = 0;
          if (leadingSpaces >= 6) level = 3;
          else if (leadingSpaces >= 3) level = 2;
          else if (leadingSpaces >= 2) level = 1;

          return (
            <div
              key={index}
              className={`flex items-start gap-4 ${level === 0 ? '' :
                level === 1 ? 'ml-6' :
                  level === 2 ? 'ml-12' :
                    'ml-18'
                }`}
            >
              <div className="mt-1 shrink-0">
                {level === 0 ? (
                  <div className="bg-[#FF1033] rounded-full p-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : level === 1 ? (
                  <Circle className="w-4 h-4 text-[#FF1033] rounded-full" strokeWidth={10} />
                ) : level === 2 ? (
                  <div className="bg-[#FF1033] rounded p-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <Circle className="w-3 h-3 text-[#FF1033] rounded-full" strokeWidth={10} />
                )}
              </div>
              <span className={`text-gray-700 leading-relaxed ${level === 0 ? 'font-medium' : ''}`}>
                {content}
              </span>
            </div>
          );
        })}
      </div>
    );
  }, []);

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
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/japan-tourist-visa-for-indians`, {
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
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number || formValues.Phone|| '' }),
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

  if (loading) return <LoadingState message="Loading Japan Tourist Visa..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const {
    description,
    fields = [],
    faqs = [],
    documents = [],
    contentSections = {},
    formImages = []
  } = formData || {};

  // Get content sections by API keys
  const introSection = contentSections['What Should Indians Know Before Visiting Japan?'] || [];
  const travelTipsSection = contentSections['Essential Travel Tips for Indian Tourists Visiting Japan'] || [];
  const destinationsSection = contentSections['Top Tourist Destinations in Japan for Indian Travelers'] || [];
  const mustVisitSection = contentSections['Must-Visit Destinations for Indian Travelers'] || [];
  const visaFeesSection = contentSections['Japan Tourist Visa Fees, Validity & Processing Time for Indian Citizens'] || [];

  // Parse visa fees details
  const parseVisaFees = (contentHtml) => {
    if (!contentHtml) return null;
    const lines = contentHtml.split('\n').filter(l => l.trim());
    const details = {};
    lines.forEach(line => {
      if (line.includes('Processing time:')) details.processingTime = line.split(':')[1]?.trim();
      if (line.includes('Stay period:')) details.stayPeriod = line.split(':')[1]?.trim();
      if (line.includes('Entry:')) details.entry = line.split(':')[1]?.trim();
      if (line.includes('Fees:')) details.fees = line.split(':')[1]?.trim();
    });
    return details;
  };



  return (
    <div className="bg-white  ">
   <SEO />
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full lg:h-[800px] min-h-[800px]">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Japan Tourist Visa"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div id="enquire-now" className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full place-items-center">
            {/* Left - Hero Text */}
            <div className="text-white">
              <p className="text-3xl md:text-4xl    font-bold mb-2">Apply for</p>
              <h1 className="text-3xl md:text-4xl   font-bold leading-tight mb-6">
                <span>Japan <br /> Tourist Visa</span>
              </h1>
              {/* <p className="text-gray-300 text-lg">
                {description}
              </p> */}
            </div>

            {/* Right - Application Form */}
            {fields.length > 0 && (
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-4 md:p-8  2xl">
                {/* <h2 className="text-white text-xl font-semibold mb-6 text-center">
                  Let our expert guide you through the Japan Visa process
                </h2> */}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {(() => {
                    const textFields = fields.filter(f => ['text', 'email', 'number'].includes(f.type));
                    const selectFields = fields.filter(f => f.type === 'select' || f.type === 'dropdown');

                    const checkboxFields = fields.filter(f => f.type === 'checkbox');
                    const radioFields = fields.filter(f => f.type === 'radio');
                    const textarea = fields.filter(f => f.type === "textarea");
                    const baseInputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none";
                    const labelClass = "text-white text-sm font-medium";

                    return (
                      <>
                        {/* Text fields */}
                        {textFields.map((field, index) => (
                          <input
                            key={field._id || `text-${index}`}
                            type={field.type === 'number' ? 'tel' : field.type}
                            name={field.name}
                            value={formValues[field.name] || ''}
                            onChange={handleInputChange}
                            placeholder={field.placeholder || field.label}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                            required={field.required}
                          />
                        ))}

                        {/* Select fields - 2 columns */}
                        {selectFields.length > 0 && (
                          <div className="grid md:grid-cols-1 gap-4">
                            {selectFields.map((field, index) => (
                              <select
                                key={field._id || index}
                                name={field.name}
                                value={formValues[field.name] || ''}
                                onChange={handleInputChange}
                                className="flex-1 w-full px-4 py-3 bg-white border-0 rounded text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer text-sm"
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

                        {/* Remaining select (Interest) */}
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
                        {radioFields.map((field, index) => <div key={index} className="space-y-4">
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

                        {/* Checkboxes */}
                        {checkboxFields.map((field, index) => (
                          <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formValues[field.name] || false}
                              onChange={handleInputChange}
                              className="mt-1 w-4 h-4 accent-red-600 rounded shrink-0"
                            />
                            <span className="text-sm">{field.label}</span>
                          </label>
                        ))}
                      </>
                    );
                  })()}
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
                  {/* Submit Status Message */}
                  {submitStatus && (
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${submitStatus === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-[#FF1033]/20 border border-red-500/50'}`}>
                      {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                      <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>{submitMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-4 rounded-full font-bold text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] uppercase disabled:opacity-70 flex items-center justify-center gap-4"
                  >
                    {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Apply Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== WHAT SHOULD INDIANS KNOW SECTION ===== */}
      {introSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {introSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-[#333333] text-base leading-relaxed whitespace-pre-line">
                    {item.contentHtml}
                  </p>
                </div>
                {item?.images?.[0] ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                    {item.badge?.text && (
                      <div
                        className="absolute -top-4 -right-10 px-4 py-2 flex flex-col items-center rounded-lg text-white font-bold  "
                        style={{ backgroundColor: item.badge.background || '#FF1033' }}
                      >
                        {/* {item.badge.text}  */}
                        {/* Happy Customers */}
                        <span>{item.badge.text.split("+")[0]}+</span>
                        <span>{item.badge.text.split("+")[1]}</span>
                      </div>
                    )}
                  </div>
                ) : item.image && <div className="relative">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="rounded-xl   w-full"
                  />
                  {item.badge?.text && (
                    <div
                      className="absolute -bottom-4 -right-4 px-4 py-2 flex flex-col items-center rounded-lg text-white font-bold  "
                      style={{ backgroundColor: item.badge.background || '#FF1033' }}
                    >
                      <span>{item.badge.text.split("+")[0]}+</span>
                      <span>{item.badge.text.split("+")[1]}</span>
                    </div>
                  )}
                </div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ESSENTIAL TRAVEL TIPS SECTION ===== */}
      {travelTipsSection.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {travelTipsSection.map((item, index) => (
              <div key={item._id || index}>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black leading-relaxed mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mx-auto" ></div>
                </div>
                <div className="space-y-4">
                  {item.contentHtml?.split(/\r?\n\r?\n/).filter(p => p.trim()).map((paragraph, pIdx) => {
                    const [title, ...rest] = paragraph.split(':');
                    if (rest.length > 0) {
                      return (
                        <div key={pIdx} className="flex gap-4">
                          {/* <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(227,30,36,0.1)' }}>
                            <Check className="w-5 h-5" style={{ color: '#FF1033' }} />
                          </div> */}
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{title.trim()}:</h4>
                            <p className="text-gray-900 text-base leading-relaxed">{rest.join(':').trim()}</p>
                          </div>
                        </div>
                      );
                    }
                    return <p key={pIdx} className="text-gray-900 text-base leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== TOP TOURIST DESTINATIONS SECTION ===== */}
      {(destinationsSection.length > 0 || formImages.length > 0) && (
        <section className="py-16" style={{ backgroundColor: '##FAFAFA' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-4">
                {destinationsSection[0]?.title || 'Top Tourist Destinations'}
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            {/* Image Gallery from formImages */}
            {formImages.length > 0 && (
              <div className={`grid ${formImages.length === 1 ? 'grid-cols-1' : formImages.length === 2 ? 'grid-cols-2' : 'md:grid-cols-3'} gap-4 mb-10`}>
                {formImages[0]?.images?.map((img, imgIdx) => (
                  <div key={imgIdx} className="overflow-hidden rounded-xl">
                    <img
                      src={getImageUrl(img)}
                      alt={`Destination ${imgIdx + 1}`}
                      className="w-full h-48 lg:h-80 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Destination descriptions */}
            {destinationsSection[0]?.contentHtml && (
              <div className="space-y-4">
                {destinationsSection[0].contentHtml.split(/\r?\n\r?\n/).filter(p => p.trim()).map((paragraph, pIdx) => {
                  const [title, ...rest] = paragraph.split(':');
                  if (rest.length > 0 && title.trim().length < 30) {
                    return (
                      <div key={pIdx}>
                        <h4 className="font-bold text-gray-900 mb-2" style={{ color: '#000000' }}>{title.trim()}:</h4>
                        <p className="text-gray-900 text-base md:text-lg leading-relaxed">{rest.join(':').trim()}</p>
                      </div>
                    );
                  }
                  return <p key={pIdx} className="text-gray-900 text-base md:text-lg leading-relaxed">{paragraph}</p>;
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== MUST VISIT DESTINATIONS ===== */}
      {mustVisitSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {mustVisitSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">

                <div className={item.images?.[0] ? "order-1 lg:order-1" : ""}>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <div className="space-y-4">
                    {item.contentHtml?.split('\n\n').filter(p => p.trim()).map((paragraph, pIdx) => {
                      const [title, ...rest] = paragraph.split(':');
                      if (rest.length > 0 && title.trim().length < 40) {
                        return (
                          <div key={pIdx}>
                            <h4 className="font-bold text-gray-900 mb-1">{title.trim()}:</h4>
                            <p className="text-gray-900  text-base leading-relaxed">{rest.join(':').trim()}</p>
                          </div>
                        );
                      }
                      return <p key={pIdx} className="text-gray-900 text-base leading-relaxed">{paragraph}</p>;
                    })}
                  </div>
                </div>
                {item.images?.[0] && (
                  <div className="order-2 lg:order-2">
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== VISA FEES SECTION ===== */}
      {visaFeesSection.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                {visaFeesSection[0]?.title || 'Visa Fees & Processing Time'}
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            {visaFeesSection.map((item, index) => {
              const details = parseVisaFees(item.contentHtml);
              return (
                <div key={item._id || index}>
                  <div className="max-w-2xl mx-auto bg-white rounded-xl   p-4 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      30/60 Days Tourist Visa
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-8 h-8" style={{ color: '#FF1033' }} />
                        <div>
                          <p className="text-sm text-gray-500">Processing Time</p>
                          <p className="font-bold text-gray-900">{details?.processingTime || '10 working days'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-8 h-8" style={{ color: '#FF1033' }} />
                        <div>
                          <p className="text-sm text-gray-500">Stay Period</p>
                          <p className="font-bold text-gray-900">{details?.stayPeriod || '30 days'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <MapPin className="w-8 h-8" style={{ color: '#FF1033' }} />
                        <div>
                          <p className="text-sm text-gray-500">Entry Type</p>
                          <p className="font-bold text-gray-900">{details?.entry || 'Single/Multiple'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Wallet className="w-8 h-8" style={{ color: '#FF1033' }} />
                        <div>
                          <p className="text-sm text-gray-500">Visa Fees</p>
                          <p className="font-bold text-xl" style={{ color: '#FF1033' }}>{details?.fees || 'INR 4,200/-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Cta #enquire-now */}
                  <a
                    href="#enquire-now"
                    className="block w-fit mx-auto px-8 py-4 mt-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]"
                  >
                    Apply for Any Visa
                  </a>

                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== DOCUMENTS SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl  font-semibold text-gray-900 mb-4">Documents for Indian Citizens: 30/60 Day Japan Tourist Visa</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            {documents.map((doc, docIndex) => (
              <div key={doc._id || docIndex} className="">
                {/* <h3 className="text-xl font-bold text-gray-900 mb-6">{doc.title}</h3> */}
                <div className="max-w-4xl mx-auto mt-2">
                  {renderDocumentContent(doc.description)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                Yet bed any for assistance indulgence unpleasing. Not thoughts all
                exercise blessing. Indulgence way everything joy alteration
                boisterous the attachment.
              </p>


            </div>

            {/* RIGHT FAQ LIST */}
            <div className="divide-y">
              {faqs.map((faq, index) => (

                <div key={index} className="py-6">
                  <button

                    onClick={() => setOpenFaq(index)}


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
    </div>
  );
};

export default Japantouristvisaforindians;