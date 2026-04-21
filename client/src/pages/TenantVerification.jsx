import { useState, useEffect } from "react";
import { Shield, Wallet, Clock, Lock, Check, X, FileText, Award, ThumbsUp, Users, Plus, Minus, ArrowRight, CheckCircle, XCircle, Phone, Share2, Target, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import SEO from "../components/reusable/SEO";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

// Default icons for dynamic content
const defaultIcons = [Shield, Wallet, Clock, Lock, FileText, Award, ThumbsUp, Users];
const benefitIcons = [Target, CheckCircle, Phone, Share2];
const noPlainUrl = 'https://tenant.duverify.com/admins/sign_up?bundle_code=premium'
// Pricing features for comparison table (from original site)
const pricingFeatures = [
  "Identity verification",
  "Criminal Record Check",
  "Bank Statement / Income Verification",
  "ITR Check",
  "Interpol Match"
];

const TenantVerification = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [plain, setPlain] = useState(null)
  const [policeVerification, setPoliceVerification] = useState("");
  const [formValues, setFormValues] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const handleSubmit = async (e) => {

    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch(`${BackendURL}/api/form-submissions/slug/tenant-and-domestic-help-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      const res = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your application has been submitted successfully. Our team will contact you shortly.');
        setFormValues({});
      } else {
        setSubmitStatus('error');
        setSubmitMessage(res.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitLoading(false);
      setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
    }
  };
  const proceed = async () => {
    if (submitLoading) return;

    if (!policeVerification) {
      setSubmitStatus('error');
      setSubmitMessage('Please select whether Police Verification is required or not.');
      setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
      return;
    }

    if (policeVerification === "no") {
      return window.open(noPlainUrl, '_blank');
    } else {
      const formFields = formData?.fields || [];

      // Validate required fields
      const missingFields = formFields.filter(f => {
        if (!f.required) return false;
        const val = formValues[f.name];
        if (f.type === 'checkbox') return !val;
        return !val || (typeof val === 'string' && val.trim() === '');
      });

      if (missingFields.length > 0) {
        setSubmitStatus('error');
        const fieldLabels = missingFields.map(f => f.label || f.name).join(', ');
        setSubmitMessage(`Please fill required fields: ${fieldLabels}`);
        setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
        document.getElementById('plan-form-container')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Validate field formats (e.g., 10-digit mobile number, email)
      const invalidFields = formFields.filter(f => {
        const val = formValues[f.name];
        if (!val || val === '' || f.type === 'checkbox') return false;

        const type = (f.type || f.fieldType || '').toLowerCase();
        const fieldName = (f.name || '').toLowerCase();
        const label = (f.label || '').toLowerCase();

        // 10-digit Mobile number validation
        if (type === 'number' || type === 'tel' || fieldName.includes('mobile') || fieldName.includes('phone') || label.includes('mobile') || label.includes('phone') || label.includes('contact')) {
          const digits = typeof val === 'string' ? val.replace(/\D/g, '') : String(val);
          return digits.length !== 10;
        }

        // Email validation
        if (type === 'email' || fieldName.includes('email') || label.includes('email')) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(val);
        }

        return false;
      });

      if (invalidFields.length > 0) {
        setSubmitStatus('error');
        const firstInvalid = invalidFields[0];
        const firstType = (firstInvalid.type || firstInvalid.fieldType || '').toLowerCase();
        const firstName = (firstInvalid.name || '').toLowerCase();
        const isEmail = firstType === 'email' || firstName.includes('email');

        setSubmitMessage(isEmail ?
          `Please enter a valid email address for: ${firstInvalid.label || firstInvalid.name}` :
          `Please enter a valid 10-digit number for: ${firstInvalid.label || firstInvalid.name}`
        );

        setTimeout(() => { setSubmitStatus(null); setSubmitMessage(''); }, 5000);
        document.getElementById('plan-form-container')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      await handleSubmit();
      window.open(noPlainUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/tenant-and-domestic-help-verification`);
      if (!response.ok) throw new Error("Failed to fetch form data");
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath.replace("/api", "")}`;
  };

  if (loading) return <LoadingState message="Loading verification details..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { name, description, pricingPlans = [], faqs = [], fields = [], contentSections = {} } = formData || {};

  // Get sections by exact API keys
  const whyChooseSection = contentSections['Why Choose DuVerify Platform?'] || [];
  const benefitsSection = contentSections['Key Benefits'] || [];
  const howItWorksSection = contentSections['How It Works?'] || [];
  const deliverablesSection = contentSections['Deliverables'] || [];

  // Parse description for hero
  const descParts = description?.split('\n') || [];
  const heroTitle = descParts[0] || name || 'Tenant Verification';
  const heroSubtitle = descParts[1] || '';

  // Static services list with red checkmarks
  const services = ["Tenants", "Domestic Helps", "Driver", "Nanny"];

  // Plan colors matching original site exactly
  const planColors = [
    { bg: '#0E652E', name: 'Basic' },    // Forest Green
    { bg: '#003366', name: 'Standard' }, // Dark Navy Blue  
    { bg: '#7D0000', name: 'Premium' }   // Deep Burgundy Red
  ];

  const getPlanColor = (index, planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('basic') || name.includes('pricing')) return planColors[0];
    if (name.includes('standard')) return planColors[1];
    if (name.includes('premium')) return planColors[2];
    return planColors[index % 3];
  };

  // Feature availability by plan
  const getFeatureAvailability = (planName, featureIndex) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('basic') || name.includes('pricing')) return featureIndex <= 1;
    if (name.includes('standard')) return featureIndex <= 2;
    return true;
  };

  // Static benefits data (fallback)
  const staticBenefits = [
    { icon: Target, title: "Peace of Mind", desc: "Ensure tenants, drivers, maids, and nannies are thoroughly verified." },
    { icon: CheckCircle, title: "Fast & Accurate", desc: "Results delivered within 4–6 hours for timely decisions." },
    { icon: Phone, title: "Reliable Support", desc: "Our team ensures you're supported at every step." },
    { icon: Share2, title: "Easy Sharing", desc: "Share verification reports instantly with others." }
  ];

  return (
    <div className="bg-white  ">
   <SEO />
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full sm:h-[800px] min-h-[800px] overflow-hidden">
        {/* Background Image */}
        <img
          src={getImageUrl(formData?.image) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80'}
          alt="Tenant Verification Hero"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {/* Dark Gradient Overlay */}

        <div className="absolute inset-0 bg-[#000000a3] transition-opacity duration-500 group-hover:opacity-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 min-h-[90vh] flex items-center">
          <div className="max-w-3xl text-white">

            {/* Heading */}
            <h1 className="text-4xl    font-bold leading-tight mb-6">
              Comprehensive Verification for <br />
              Tenants, Drivers, Maids, and <br />
              Nannies by{' '}
              <span className="inline-flex items-center align-middle ml-2">
                <img
                  src="/DU-Verify-logo.png"
                  alt="DU Verify"
                  className="h-10 md:h-12 lg:h-16 object-contain"
                />
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl font-semibold mb-10 text-white">
              Secure your Home & Loved Ones with Instant Background Verification
            </p>

            {/* CTA */}
            <button onClick={() => {
              setTimeout(() => {
                document.getElementById('plan-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
              className="px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]  xl cursor-pointer"
            >
              Get Started Today – Verify Now
            </button>

          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE DUVERIFY SECTION ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {whyChooseSection.map((item, index) => (
              <div
                key={item._id || index}
                className="grid lg:grid-cols-2 gap-16 items-center"
              >
                {/* LEFT CONTENT */}
                <div>
                  <h2 className="text-4xl md:text-4xl  font-bold text-gray-900 leading-tight mb-6">
                    Why Choose{' '}
                    <span >DuVerify</span> Platform?
                  </h2>

                  <p className="text-xl font-semibold md:font-bold text-gray-800 mb-6">
                    Protect your home and family with our tenant, maid, nanny and
                    driver background screening
                  </p>

                  <div
                    className="text-gray-800 text-base leading-relaxed max-w-xl mb-0 md:text-lg"
                    dangerouslySetInnerHTML={{
                      __html: item.contentHtml?.replace(/\r\n/g, '<br/>'),
                    }}
                  />

                  {/* SERVICES LIST */}
                  <div className="flex flex-wrap gap-x-4 gap-y-3 mt-0">
                    {services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-4 border-r border-[#FF1033] pr-5 last:border-r-0">
                        <span className="text-[#FF1033] text-lg font-bold">✓</span>
                        <span className="text-gray-800 font-semibold">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex justify-center">
                  {item?.images?.length > 0 ? (
                    item.images.map(p => <img
                      src={getImageUrl(p)}
                      alt={item.title}
                      className="max-w-full h-auto rounded-xl  "
                      style={{ maxHeight: '400px' }}
                    />)
                  ) : item.image && <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="max-w-full h-auto rounded-xl  "
                    style={{ maxHeight: '400px' }}
                  />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ===== KEY BENEFITS SECTION ===== */}
      <section className="py-24 pt-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-20">

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-4xl  font-bold text-gray-900 mb-4">
              Key Benefits
            </h2>
            <div className="w-20 h-[2px] mx-auto " />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {(benefitsSection.length > 0 ? benefitsSection : staticBenefits).map(
              (benefit, index) => {
                const IconComponent = benefitIcons[index % benefitIcons.length];
                const isApiData = !!benefit._id;

                return (
                  <div
                    key={benefit._id || index}
                    className="bg-white text-center rounded-3xl p-10  transition-all duration-300"
                  >
                    {/* Icon */}
                    <div className="mb-8 flex  mx-auto justify-center">
                      {isApiData && benefit.image ? (
                        // <img
                        //   src={getImageUrl(benefit.image)}
                        //   alt={benefit.title}
                        //   className="w-14 h-14 object-contain"
                        // />
                        <IconComponent
                          className="w-14 h-14 text-[#FF1033]"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <IconComponent
                          className="w-14 h-14 text-[#FF1033]"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-base">
                      {isApiData ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: benefit.contentHtml,
                          }}
                        />
                      ) : (
                        benefit.desc
                      )}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>


      {/* ===== PRICING PLANS - COMPARISON TABLE ===== */}
      {pricingPlans.length > 0 && (
        <section className="py-24 pt-10 bg-white" id="price_table">
          <div className="max-w-7xl mx-auto px-6 md:px-20">

            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-4xl  font-bold text-gray-900">
                Pricing Plans
              </h2>
              <div className="w-20 h-[2px]  mx-auto mt-4 mb-6" />
              <p className="text-lg text-gray-700 font-medium">
                Flexible pricing for hassle-free Tenant, Maid, Nanny & Driver verification
              </p>
            </div>

            {/* Table Wrapper */}
            <div className="hidden md:block bg-white rounded-3xl  [0_15px_40px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden mt-16">

              <table className="w-full border-collapse">
                {/* Header */}
                <thead>
                  <tr>
                    <th className="w-[36%]"></th>
                    {pricingPlans.map((plan, index) => {
                      const color = getPlanColor(index, plan.planName);
                      return (
                        <th key={plan._id || index} className="py-6 text-center">
                          <span
                            className="inline-block px-10 py-3 rounded-xl text-white font-bold text-xl"
                            style={{ backgroundColor: color.bg }}
                          >
                            {plan.planName}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {pricingFeatures.map((feature, fIndex) => (
                    <tr
                      key={fIndex}
                      className="border-t border-gray-200"
                    >
                      <td className="py-5 px-8 text-gray-800 font-medium">
                        {feature}
                      </td>

                      {pricingPlans.map((plan, pIndex) => {
                        const isAvailable = getFeatureAvailability(
                          plan.planName,
                          fIndex
                        );

                        return (
                          <td
                            key={plan._id || pIndex}
                            className="py-5 text-center"
                          >
                            {isAvailable ? (
                              <Check className="w-7 h-7 text-green-500 mx-auto" strokeWidth={3} />
                            ) : (
                              <X className="w-7 h-7 text-[#FF1033] mx-auto" strokeWidth={3} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Price Row */}
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td className="py-8 px-8 font-bold text-gray-800">
                      Price / Verification*
                    </td>

                    {pricingPlans.map((plan, index) => {
                      const exactPrices = {
                        basic: 599,
                        standard: 999,
                        premium: 1199,
                      };

                      const planName = plan.planName.toLowerCase();
                      let price = plan.price;

                      if (planName.includes('basic')) price = exactPrices.basic;
                      if (planName.includes('standard')) price = exactPrices.standard;
                      if (planName.includes('premium')) price = exactPrices.premium;

                      return (
                        <td
                          key={plan._id || index}
                          className="py-8 text-center"
                        >
                          <span className="text-3xl font-extrabold text-gray-900">
                            ₹ {price}
                          </span>
                          <span className="text-lg font-semibold text-gray-700">
                            {' '} / Verification*
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Button Row */}
                  <tr className="bg-gray-50">
                    <td></td>
                    {pricingPlans.map((plan, index) => {
                      const color = getPlanColor(index, plan.planName);
                      return (
                        <td key={plan._id || index} className="py-8 text-center">
                          <button
                            className="w-[80%] py-4 rounded-full font-bold text-white text-lg   hover:opacity-90 transition"
                            style={{ backgroundColor: color.bg }} onClick={() => setPlain(plan.planName)}
                          >
                            Choose Plan
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>

            </div>
            {/* ===== MOBILE PRICING CARDS ===== */}
            <div className="block md:hidden space-y-8 mt-16">
              {pricingPlans.map((plan, index) => {
                const color = getPlanColor(index, plan.planName);

                // Exact pricing fallback
                const exactPrices = {
                  basic: 599,
                  standard: 999,
                  premium: 1199,
                };

                const planName = plan.planName.toLowerCase();
                let price = plan.price;
                if (planName.includes('basic')) price = exactPrices.basic;
                if (planName.includes('standard')) price = exactPrices.standard;
                if (planName.includes('premium')) price = exactPrices.premium;

                return (
                  <div
                    key={plan._id || index}
                    className="bg-white rounded-3xl  xl border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      className="py-6 text-center text-white font-extrabold text-2xl"
                      style={{ backgroundColor: color.bg }}
                    >
                      {plan.planName}
                    </div>

                    {/* Price */}
                    <div className="text-center py-6">
                      <span className="text-4xl font-extrabold text-gray-900">
                        ₹ {price}
                      </span>
                      <span className="text-lg font-semibold text-gray-700">
                        {' '} / Verification*
                      </span>
                    </div>

                    {/* Features */}
                    <div className="px-6 pb-6 space-y-4">
                      {pricingFeatures.map((feature, fIndex) => {
                        const isAvailable = getFeatureAvailability(
                          plan.planName,
                          fIndex
                        );

                        return (
                          <div
                            key={fIndex}
                            className="flex items-center justify-between border-b border-gray-100 pb-3"
                          >
                            <span className="text-gray-700 font-medium text-sm">
                              {feature}
                            </span>
                            {isAvailable ? (
                              <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
                            ) : (
                              <X className="w-6 h-6 text-[#FF1033]" strokeWidth={3} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-8">
                      <button
                        className="w-full py-4 rounded-full text-white font-bold text-lg   transition hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: color.bg }}
                        onClick={() => {
                          setPlain(plan.planName);
                          setTimeout(() => {
                            document.getElementById('plan-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                      >
                        Choose Plan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div id="plan-form-container" className="mt-12">
              {plain && (
                <div className="plan-card bg-white rounded-3xl  xl p-6 md:p-10 border border-gray-200">
                  <div className="form-row flex flex-col md:flex-row gap-6 mb-8">
                    {/* Selected Plan */}
                    <div className="form-group flex-1 ">
                      <label className="block text-gray-800 font-bold mb-2">
                        Selected Plan <span className="required text-[#FF1033]">*</span>
                      </label>
                      <select
                        value={plain}
                        onChange={(e) => setPlain(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        {pricingPlans.map((plan, index) => (
                          <option key={index} value={plan.planName}>
                            {plan.planName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Police Verification */}
                    <div className="form-group flex-1 ">
                      <label className="block text-gray-800 font-bold mb-2">
                        Police Verification Required? <span className="required text-[#FF1033]">*</span>
                      </label>

                      <div className="toggle-group flex gap-4">
                        <button
                          className={`flex-1 px-6 py-3 rounded-lg font-semibold border transition-all ${policeVerification === "yes"
                            ? " text-[#FF1033]"
                            : " text-black"
                            }`}
                          onClick={() => setPoliceVerification("yes")}
                          type="button"
                        >
                          Yes
                        </button>
                        <button
                          className={`flex-1 px-6 py-3 rounded-lg font-semibold border transition-all ${policeVerification === "no"
                            ? " text-[#FF1033]"
                            : " text-black"
                            }`}
                          onClick={() => setPoliceVerification("no")}
                          type="button"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  {policeVerification == "yes" && fields.length > 0 && (
                    <form className="flex sm:flex-nowrap flex-wrap w-full gap-4" >
                      {fields.filter(f => f.type !== 'checkbox').map((field, index) => {
                        const fieldType = field.type || field.fieldType;

                        if (fieldType === 'select' || fieldType === 'dropdown') {
                          return (
                            <select
                              key={field._id || index}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-500 transition-all outline-none appearance-none cursor-pointer text-sm"
                              required={field.required}
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.25em 1.25em',
                                paddingRight: '2.5rem'
                              }}
                            >
                              <option value="">{field.placeholder || field.label}</option>
                              {field.options?.map((opt, optIdx) => (
                                <option key={opt._id || optIdx} value={opt.value || opt}>
                                  {opt.label || opt}
                                </option>
                              ))}
                            </select>
                          );
                        } else if (fieldType === 'textarea') {
                          return (
                            <textarea
                              key={field._id || index}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className="flex-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm min-h-[100px]"
                              required={field.required}
                            />
                          );
                        } else if (fieldType == "redio") {
                          return (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <label className="text-gray-800 text-sm font-bold block">
                                {field.label} {field.required && <span className="text-[#FF1033]">*</span>}
                              </label>
                              <div className="flex flex-wrap gap-4">
                                {field.options?.map((opt, i) => (
                                  <label key={i} className="flex items-center gap-4 text-gray-700 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={field.name}
                                      value={opt.value || opt.label || opt}
                                      checked={formValues[field.name] === (opt.value || opt.label || opt)}
                                      onChange={handleInputChange}
                                      className="w-5 h-5 accent-red-600"
                                      required={field.required}
                                    />
                                    <span className="text-sm font-medium">{opt.label || opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <input
                              key={field._id || index}
                              type={fieldType === 'number' ? 'tel' : fieldType}
                              name={field.name}

                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all outline-none text-sm"
                              required={field.required}
                            />
                          );
                        }
                      })}

                      {/* Checkbox fields */}
                      <div className="space-y-4 mt-2">
                        {fields.filter(f => f.type === 'checkbox').map((field, index) => (
                          <label key={field._id || index} className="flex items-start gap-4 text-gray-700 text-sm cursor-pointer hover:text-gray-900">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formValues[field.name] || false}
                              onChange={handleInputChange}
                              className="mt-1 w-5 h-5 accent-red-600 rounded shrink-0"
                            />
                            <span className="leading-tight">{field.label}</span>
                          </label>
                        ))}
                      </div>

                    </form>
                  )}

                  {/* Submit Status Message */}
                  {submitStatus && (
                    <div className={`mt-6 flex items-center gap-4 p-4 rounded-lg border ${submitStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                      <p className="text-sm font-medium">{submitMessage}</p>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                      disabled={submitLoading}
                      className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-white hover:bg-[#D90022]   mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 cursor-pointer"
                      onClick={() => proceed()}
                    >
                      {submitLoading ? <><Loader2 className="w-6 h-6 animate-spin" /> Submitting...</> : 'Wait, I just need verification (No Form)'}
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Footer Note */}
            <p className="text-center text-gray-400 text-sm mt-8">
              *Government Fee: Additional charges may apply. T&C Apply
            </p>
          </div>
        </section>
      )}


      {/* ===== HOW IT WORKS SECTION ===== */}

      {howItWorksSection.length > 0 && (
        <section className="py-24" style={{ backgroundColor: '#111111' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-4xl  font-bold text-white">
                How It Works?
              </h2>
              <div className="w-20 h-[2px]  mx-auto my-4" />
              {howItWorksSection[0]?.badge?.text && (
                <p className="text-lg md:text-xl lg:text-2xl text-gray-100 font-medium">{howItWorksSection[0].badge.text}</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left Side - Title and Steps */}
              <div>
                {/* Steps Card */}
                <div className="bg-white rounded-2xl p-8  xl overflow-y-auto no-scrollbar h-[400px]">
                  {howItWorksSection.map((item, index) => {
                    const steps = item.contentHtml?.split(/\r?\n/).filter(line => line.trim()) || [];
                    return (
                      <div key={item._id || index} className="space-y-4">
                        {steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex gap-5 items-center">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 text-[#FF1033] border-2 border-[#FF1033]"
                            >
                              {stepIdx + 1}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-[#333333] text-lg font-bold">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="flex justify-center">
                {howItWorksSection[0]?.image ? (
                  <img
                    src={getImageUrl(howItWorksSection[0].image)}
                    alt="Verification Process"
                    className="max-w-full h-auto rounded-2xl  2xl"
                    style={{ maxHeight: '500px' }}
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-12  2xl">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">VERIFIED</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}



      {/* ===== DELIVERABLES SECTION ===== */}
      {deliverablesSection.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl   font-bold text-black">Deliverables</h2>
              <div className="w-24 h-1 mx-auto mt-4"></div>
              {deliverablesSection[0]?.badge?.text && (
                <p className="text-[#333333] text-lg font-bold mt-4">{deliverablesSection[0].badge.text}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {deliverablesSection.map((item, index) => (

                <div
                  key={item._id || index}
                  className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                >
                  {/* Background Image */}
                  {item?.images?.length > 0 ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${getImageUrl(item.images[0])})` }}
                    />
                  ) : item.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
                    />
                  )}

                  {/* Dark Overlay (default) */}
                  <div className="absolute inset-0 bg-[#000000e5] transition-opacity duration-500 group-hover:opacity-0" />

                  {/* Red Overlay (hover) */}
                  <div className="absolute inset-0 bg-[#FF1033]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-white px-6 text-center z-10">
                    <h3 className="text-2xl font-bold uppercase tracking-wide mb-3 transition-transform duration-500 group-hover:-translate-y-1">
                      {item.title}
                    </h3>

                    <p
                      className="text-white text-base leading-relaxed opacity-90 max-w-xs"
                      dangerouslySetInnerHTML={{ __html: item.contentHtml }}
                    />
                  </div>
                </div>

              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ SECTION - RED ACCORDION STYLE (matching original) ===== */}
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
              {faqs.map((item, index) => (
                <div key={index} className="py-6">
                  <button

                    onClick={() => toggleFaq(index)}


                    className="w-full flex justify-between items-center text-left"
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

      )}

    </div>

  );
};

export default TenantVerification;






{/* ===== HOW IT WORKS SECTION  With HARD CODED DATA===== */ }
// {howItWorksSection.length > 0 && (
//   <section className="py-28 bg-black">
//     <div className="max-w-7xl mx-auto px-6">

//       {/* Heading */}
//       <div className="text-center mb-16">
//          <h2 className="text-4xl   font-extrabold text-white">
//           How It Works?
//         </h2>
//         <div className="w-20 h-[2px] bg-[#FF1033] mx-auto my-4" />
//         <p className="text-lg text-gray-300 font-medium">
//           4 streamlined verification steps
//         </p>
//       </div>

//       {/* Content */}
//       <div className="grid md:grid-cols-2 gap-14 items-center">

//         {/* LEFT – STEPS */}
//         <div className="bg-white rounded-3xl  [0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">

//           {[
//             {
//               title: 'Choose your preferred package and complete the payment.',
//             },
//             {
//               title:
//                 'Submit the details and documents via our secure portal.',
//             },
//             {
//               title:
//                 'Our system conducts a comprehensive background check, including:',
//               list: [
//                 'Identity Verification',
//                 'Criminal Records Check',
//                 'Bank Statement / Income Verification',
//                 'ITR Check',
//                 'Interpol Reference Checks',
//               ],
//             },
//             {
//               title:
//                 'Receive a detailed report with a verification score and recommendation.',
//             },
//           ].map((step, index) => (
//             <div
//               key={index}
//               className={`flex gap-6 px-8 py-6 ${index !== 3 ? 'border-b border-gray-200' : ''
//                 }`}
//             >
//               {/* Step Number */}
//               <div className="flex-shrink-0">
//                 <div className="w-12 h-12 rounded-full border-2 border-[#FF1033] flex items-center justify-center text-[#FF1033] text-xl font-bold">
//                   {index + 1}
//                 </div>
//               </div>

//               {/* Step Content */}
//               <div>
//                 <p className="text-gray-900 font-semibold text-lg mb-2">
//                   {step.title}
//                 </p>

//                 {step.list && (
//                   <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
//                     {step.list.map((item, i) => (
//                       <li key={i}>{item}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* RIGHT – IMAGE */}
//         <div className="flex justify-center">
//           <div className="rounded-3xl overflow-hidden  [0_20px_60px_rgba(0,0,0,0.6)]">
//             <img
//               src={
//                 howItWorksSection[0]?.image
//                   ? getImageUrl(howItWorksSection[0].image)
//                   : 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0'
//               }
//               alt="Verification Process"
//               className="w-full max-w-lg object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// )}
