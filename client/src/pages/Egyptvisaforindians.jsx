import { useState, useEffect } from "react";
import { Check, ChevronDown, MapPin, Clock, Wallet, Calendar, Plane, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Egyptvisaforindians = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
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
      const response = await fetch(`${BackendURL}/api/forms/slug/egypt-visa-for-indians`);
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

  if (loading) return <LoadingState message="Loading Egypt Visa..." fullScreen />;
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
  const introSection = contentSections['What Should Indians Know Before Visiting Egypt?'] || [];
  const centersSection = contentSections['Egypt Visa Application Centres for Indians Now in:'] || [];
  const travelTipsSection = contentSections['Essential Travel Tips for Indian Tourists Visiting Egypt'] || [];
  const destinationsSection = contentSections['Top Tourist Destinations in Egypt for Indian Travelers'] || [];
  const cuisineSection = contentSections['Egyptian Cuisine: A Taste Guide for Indian Travelers'] || [];
  const planningSection = contentSections['Are You Planning to Visit Egypt?'] || [];
  const visaOverviewSection = contentSections['Egypt Visa Overview: Types, Processing, Fees, and Validity'] || [];

  // Parse visa details from content
  const parseVisaDetails = (contentHtml) => {
    if (!contentHtml) return { single: {}, multiple: {} };
    const lines = contentHtml.split('\n').filter(l => l.trim());
    const details = { single: {}, multiple: {} };
    let currentType = 'single';

    lines.forEach(line => {
      if (line.toLowerCase().includes('multiple entry')) currentType = 'multiple';
      if (line.toLowerCase().includes('single entry')) currentType = 'single';
      if (line.includes('Processing time:')) details.processingTime = line.split(':')[1]?.trim();
      if (line.includes('Stay period:')) details[currentType].stayPeriod = line.split(':')[1]?.trim();
      if (line.includes('Validity:')) details[currentType].validity = line.split(':')[1]?.trim();
      if (line.includes('Visa Fees:')) details[currentType].fees = line.split(':')[1]?.trim();
      if (line.includes('Services Fees:')) details[currentType].serviceFees = line.split(':')[1]?.trim();
    });
    return details;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // const response = await fetch(`${BackendURL}/api/form-submissions/slug/egypt-visa-for-indians`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formValues),
      // });

      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/egypt-visa-for-indians`, {
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
          body: JSON.stringify({ mobile: formValues.mobile || formValues.phone || formValues.mobileNumber || formValues.phoneNumber || formValues.number ||  formValues.Phone|| '' }),
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
      console.error('Submit error:', err);
    } finally {
      setSubmitLoading(false);
      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
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
      // Strict filtering: Dependent fields must match the parent ID/Value.
      return opt.connectId && (opt.connectId === parentId || opt.connectId === parentOptionValue);
    }) || [];
  };

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full sm:h-[800px] min-h-[800px]">
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 h-[800px] flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center place-items-center w-full">
            {/* Left - Hero Text */}
            <div className="text-white">
              <p className="text-3xl md:text-4xl  font-bold mb-2">Apply For</p>
              <h1 className="text-3xl  md:text-4xl  font-bold leading-tight mb-6">
                Egypt Visa
              </h1>
              {/* <p className="text-gray-300 text-lg">
                Experience the wonders of Egypt with our hassle-free visa service
              </p> */}
            </div>

            {/* Right - Application Form */}
            {fields.length > 0 && (
              <div
                className="rounded-xl p-6 md:p-8"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}
              >
                <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                  {(() => {
                    const textFields = fields.filter(f => ['text', 'email', 'number'].includes(f.type));
                    const selectFields = fields.filter(f => f.type === 'select' || f.type === 'dropdown');
                    const checkboxFields = fields.filter(f => f.type === 'checkbox');
                    const radioFields = fields.filter(f => f.type === 'radio');
                    const textarea = fields.filter(f => f.type === 'textarea');
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
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-base"
                            required={field.required}
                            style={{ height: '45px' }}
                          />
                        ))}

                        {/* Select fields */}
                        {selectFields.length > 0 && (
                          <div className="grid md:grid-cols-2 gap-4">
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

                        {/* Checkboxes */}
                        {checkboxFields.map((field, index) => (
                          <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-white cursor-pointer">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formValues[field.name] || false}
                              onChange={handleInputChange}
                              className="mt-1 w-4 h-4 accent-red-600 rounded shrink-0"
                            />
                            <span className="text-sm leading-relaxed">{field.label}</span>
                          </label>
                        ))}
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
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg ${submitStatus === 'success'
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-[#FF1033]/20 border border-red-500/50'
                        }`}
                    >
                      {submitStatus === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                      <p className={`text-sm ${submitStatus === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                        {submitMessage}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 rounded-full font-medium text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Apply Now'
                    )}
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
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {introSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.contentHtml}
                  </p>
                </div>
                <div className="flex justify-center relative">
                  {item?.images.length > 0 ? (
                    item?.images.map((image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={item.title}
                        className="max-w-full h-auto rounded-2xl  xl"
                      // style={{ maxHeight: '450px' }}
                      />
                    ))
                  ) : (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-2xl  xl"
                      style={{ maxHeight: '450px' }}
                    />
                  )}
                  {
                    item?.badge && (
                      <div className="flex flex-col items-center text-white gap-0 absolute -top-10 -right-10 rounded-lg p-4 " style={{
                        backgroundColor: `${item.badge.background || "#FF1033"}`
                      }}>
                        <span>{item.badge.text.split("+")[0]}+</span>
                        <div>{item.badge.text.split("+")[1]}</div>
                        {/* <span className="font-semibold">{item.badge.text}</span> */}
                      </div>
                    )
                  }
                </div>
                {/* {item?.images?.[0] ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                    {item.badge?.text && (
                      <div
                        className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg text-white font-bold  "
                        style={{ backgroundColor: item.badge.background || '#FF1033' }}
                      >
                        {item.badge.text} Happy Customers
                      </div>
                    )}
                  </div>
                ) : item.images && (
                  <div className="relative">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                    {item.badge?.text && (
                      <div
                        className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg text-white font-bold  "
                        style={{ backgroundColor: item.badge.background || '#FF1033' }}
                      >
                        {item.badge.text} Happy Customers
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== VISA APPLICATION CENTRES ===== */}
      {centersSection.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {centersSection[0]?.title}
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {centersSection[0]?.contentHtml?.split('\n').filter(c => c.trim()).map((city, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 px-6 py-3 bg-white rounded-full  sm border border-gray-200"
                >
                  <MapPin className="w-5 h-5" style={{ color: '#FF1033' }} />
                  <span className="font-medium text-gray-800">{city.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ESSENTIAL TRAVEL TIPS SECTION ===== */}
      {travelTipsSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {travelTipsSection[0]?.title}
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>
            <div className="space-y-4">
              {travelTipsSection[0]?.contentHtml?.split('\n').filter(p => p.trim()).map((paragraph, pIdx) => (
                <div key={pIdx} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(227,30,36,0.1)' }}>
                    <Check className="w-5 h-5" style={{ color: '#FF1033' }} />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{paragraph.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TOP TOURIST DESTINATIONS SECTION ===== */}
      {destinationsSection.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {destinationsSection.map((item, index) => (
              <>
                <div key={item._id || index} className=" gap-12 items-center">
                  <div className="order-2 lg:order-1">
                    <h2 className="text-2xl md:text-3xl text-center font-bold text-gray-900 mb-4">
                      {item.title}
                    </h2>
                    <div className="w-20 h-1 mb-6 mx-auto"></div>

                  </div>

                </div>
                {item?.images?.[0] ? (
                  <div className="order-1 lg:order-2">
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>

                ) : item.image &&
                <div className="order-1 lg:order-2">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="rounded-xl   w-full"
                  />
                </div>}
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.contentHtml}
                </p>
              </>
            ))}
          </div>
        </section>
      )}

      {/* ===== EGYPTIAN CUISINE SECTION ===== */}
      {cuisineSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {cuisineSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.contentHtml}
                  </p>
                </div>
                {item?.images?.[0] ? (
                  <div>
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>
                ) : (item?.image &&
                  <div>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ARE YOU PLANNING SECTION ===== */}
      {planningSection.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#fdf2f4' }}>
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {planningSection.map((item, index) => (
              <div key={item._id || index} className="grid lg:grid-cols-2 gap-12 items-center place-items-center">
                {item?.images?.[0] ? (
                  <div>
                    <img
                      src={getImageUrl(item.images[0])}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>
                ) : (item?.image &&
                  <div>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="rounded-xl   w-full"
                    />
                  </div>)}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h2>
                  <div className="w-20 h-1 mb-6" ></div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.contentHtml}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== VISA OVERVIEW SECTION ===== */}
      {visaOverviewSection.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Egypt Visa Overview: Types, Processing, Fees, and Validity
              </h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visaOverviewSection.map((visa, index) => {
                const details = parseVisaDetails(visa.contentHtml);
                return (
                  <div key={visa._id || index} className="bg-white rounded-xl   overflow-hidden">
                    <div className="py-4 px-6 text-center" >
                      <h3 className=" text-lg font-bold">{visa.title}</h3>
                    </div>
                    <div className="px-6 py-6">
                      <p className="text-sm text-gray-500 mb-4">
                        Processing: <span className="font-semibold text-gray-800">{details.processingTime || '7-9 working days'}</span>
                      </p>

                      {/* Single Entry */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="font-bold text-gray-800 mb-2">Single Entry</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className="text-gray-500">Stay:</span>
                            <span className="font-medium">{details.single.stayPeriod || '30 days'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-500">Validity:</span>
                            <span className="font-medium">{details.single.validity || '60 Days'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-500">Fees:</span>
                            <span className="font-bold" style={{ color: '#FF1033' }}>{details.single.fees || 'INR 2700/-'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Multiple Entry */}
                      <div>
                        <p className="font-bold text-gray-800 mb-2">Multiple Entry</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span className="text-gray-500">Stay:</span>
                            <span className="font-medium">{details.multiple.stayPeriod || '60 days'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-500">Validity:</span>
                            <span className="font-medium">{details.multiple.validity || '90 Days'}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-500">Fees:</span>
                            <span className="font-bold" style={{ color: '#FF1033' }}>{details.multiple.fees || 'INR 5800/-'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== DOCUMENTS SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Documents Required</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-8">
              {documents.map((doc, docIndex) => (
                <div key={doc._id || docIndex} className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{doc.title}</h3>
                  <ul className="space-y-4">
                    {doc.description?.split('\n').filter(line => line.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#FF1033' }} />
                        <span className="text-gray-700">{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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

export default Egyptvisaforindians;