import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, MapPin, Phone, Mail } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

// Static country flag images
const COUNTRY_FLAGS = {
  thailand: "https://flagcdn.com/w80/th.png",
  malaysia: "https://flagcdn.com/w80/my.png",
  indonesia: "https://flagcdn.com/w80/id.png",
  singapore: "https://flagcdn.com/w80/sg.png",
  southKorea: "https://flagcdn.com/w80/kr.png",
  taiwan: "https://flagcdn.com/w80/tw.png"
};

// Static images for sections
const STATIC_IMAGES = {
  hero: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  travelReady: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  whyChoose: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

const Digitalarrivalcards = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/digital-arrival-cards`);
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

  if (loading) return <LoadingState message="Loading Digital Arrival Cards..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { name, description, documents = [], faqs = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const travelReadySection = contentSections['Travel Ready with DU GLOBAL'] || [];
  const whyChooseSection = contentSections['Why Choose DU GLOBAL'] || [];

  // Parse description for hero text
  const descriptionParts = description?.split('\r\n\r\n').filter(line => line.trim()) || [];

  // Form steps
  const formSteps = [
    { number: 1, label: "Where are you going?" },
    { number: 2, label: "Personal Details" },
    { number: 3, label: "Travelling Details" },
    { number: 4, label: "Submit and Pay" }
  ];

  // Countries list
  const countries = [
    { value: "thailand", label: "Thailand", flag: COUNTRY_FLAGS.thailand },
    { value: "malaysia", label: "Malaysia", flag: COUNTRY_FLAGS.malaysia },
    { value: "indonesia", label: "Indonesia", flag: COUNTRY_FLAGS.indonesia },
    { value: "singapore", label: "Singapore", flag: COUNTRY_FLAGS.singapore },
    { value: "south-korea", label: "South Korea", flag: COUNTRY_FLAGS.southKorea },
    { value: "taiwan", label: "Taiwan", flag: COUNTRY_FLAGS.taiwan }
  ];

  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[800px] overflow-hidden">
        <img
          src={getImageUrl(formData?.image) || STATIC_IMAGES.hero}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-24 min-h-[70vh] flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl  font-bold text-white leading-tight mb-6">
              One Platform for All Your Mandatory Digital Arrival Cards
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              Thailand, Malaysia, Indonesia, Singapore, South Korea & Taiwan
            </p>
            <p className="text-xl text-white font-semibold mb-8">
              It's mandatory for all travellers to apply before flying.
            </p>
            <a
              href="#apply-form"
              className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]  "
            >
              Start Your Application
            </a>
          </div>
        </div>
      </section>

      {/* ===== MULTI-STEP FORM SECTION ===== */}
      <section id="apply-form" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 md:px-20">
          <div
            className="bg-white rounded-2xl p-8  "
            style={{ border: '3px solid #C00C02' }}
          >
            {/* Step Progress */}
            <div className="flex items-center justify-between mb-10">
              {formSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${currentStep === step.number
                        ? 'text-white'
                        : currentStep > step.number
                          ? 'text-white'
                          : 'text-gray-600 border-2 border-gray-300'
                        }`}
                      style={{
                        backgroundColor: currentStep >= step.number ? '#C00C02' : 'transparent'
                      }}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center whitespace-nowrap ${currentStep === step.number ? 'font-semibold' : ''
                        }`}
                      style={{ color: currentStep === step.number ? '#C00C02' : '#6b7280' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < formSteps.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2 mt-[-20px]"
                      style={{
                        backgroundColor: currentStep > step.number ? '#C00C02' : '#d1d5db'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form Content - Step 1 */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Where are you going? <span className="text-[#FF1033]">*</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number <span className="text-[#FF1033]">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center gap-4 px-3 py-3 border border-gray-300 border-r-0 rounded-l-lg bg-gray-50">
                      <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 h-4 object-cover" />
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
                className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                Save and Continue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRAVEL READY SECTION ===== */}
      {travelReadySection.length > 0 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#C00C02' }}>
          {/* Large watermark text */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white/10 text-[80px] md:text-[120px] font-bold whitespace-nowrap pointer-events-none">
            TRAVEL READY
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {travelReadySection.map((item, index) => (
              <div key={item._id || index} className="grid md:grid-cols-2 gap-12 items-center place-items-center">
                <div className="flex justify-center">
                  <img
                    src={item.image ? getImageUrl(item.image) : STATIC_IMAGES.travelReady}
                    alt={item.title}
                    className="max-w-full h-auto rounded-2xl  2xl"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                <div className="text-white">
                  <h2 className="text-4xl md:text-4xl font-bold mb-6">
                    {item.title}
                  </h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {item.contentHtml?.replace(/\r?\n/g, ' ').trim()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== DOCUMENTS REQUIRED SECTION ===== */}
      {documents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-3">
                Documents Required
              </h2>
              <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#C00C02' }}></div>
            </div>

            {/* Document Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {documents.map((doc, index) => {
                const number = String(index + 1).padStart(2, '0');
                return (
                  <div
                    key={doc._id || index}
                    className="bg-white rounded-xl p-6  md relative overflow-hidden min-h-[150px]"
                    style={{ border: '2px solid #C00C02' }}
                  >
                    {/* Large number */}
                    <div
                      className="text-4xl font-bold mb-4"
                      style={{ color: '#C00C02' }}
                    >
                      {number}
                    </div>
                    <p className="text-gray-700 font-medium">
                      {doc.description?.replace(/\n/g, ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE SECTION ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#C00C02' }}>
          {/* Large watermark text */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white/10 text-[80px] md:text-[120px] font-bold whitespace-nowrap pointer-events-none">
            WHY CHOOSE
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {whyChooseSection.map((item, index) => (
              <div key={item._id || index} className="grid md:grid-cols-2 gap-12 items-center place-items-center">
                <div className="text-white">
                  <h2 className="text-4xl md:text-4xl font-bold mb-6">
                    {item.title}
                  </h2>
                  <ul className="space-y-4">
                    {item.contentHtml?.split('\r\n').filter(line => line.trim()).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div
                          className="w-6 h-6 rounded bg-white flex items-center justify-center shrink-0 mt-0.5"
                        >
                          <Check className="w-4 h-4" style={{ color: '#C00C02' }} strokeWidth={3} />
                        </div>
                        <span className="text-white/95 text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img
                    src={item.image ? getImageUrl(item.image) : STATIC_IMAGES.whyChoose}
                    alt={item.title}
                    className="max-w-full h-auto rounded-2xl  2xl"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== SUPPORTED COUNTRIES SECTION ===== */}


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

export default Digitalarrivalcards;