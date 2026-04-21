import { useState, useEffect } from "react";
import { Check, ChevronDown, MapPin, Phone, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const BangladeshVac = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [activeImage, setActiveImage] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/bangladesh-vac`);
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
      const response = await fetch(`${BackendURL}/api/form-submissions/slug/bangladesh-vac`, {
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

  if (loading) return <LoadingState message="Loading Bangladesh VAC..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const {
    description,
    fields = [],
    faqs = [],
    documents = [],
    contentSections = {},
    formImages = [],
    formEmployeesAddresses = []
  } = formData || {};

  // Get sections by API keys
  const heroSection = contentSections['heroSecction'] || [];
  const collaborationSection = contentSections['EXCLUSIVE COLLABORATION with SONALI BANK – BANGLADESH LARGEST BANK'] || [];

  return (
    <div className="bg-white  ">

      {/* ===== HERO BANNER ===== */}
      <section className="relative w-full py-20 h-[800px] flex items-center">
        <img
          src={formData?.image ? getImageUrl(formData.image) : ''}
          alt="Bangladesh VAC"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 flex items-center justify-center w-full">
          <h1 className="text-4xl lg:text-5xl   font-bold text-white text-center">
            Bangladesh VAC
          </h1>
        </div>
      </section>

      {/* ===== HERO CONTENT SECTION ===== */}
      {heroSection.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {heroSection.map((item, index) => (
              <div key={item._id || index}>
                <p className="text-black leading-relaxed text-lg whitespace-pre-line">
                  {item.contentHtml}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== DYNAMIC FORM SECTION (only if fields exist) ===== */}
      {fields.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Apply Now</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="bg-white rounded-xl p-8  ">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {(() => {
                  const textFields = fields.filter(f => ['text', 'email', 'number'].includes(f.type));
                  const dateFields = fields.filter(f => f.type === 'date');
                  const selectFields = fields.filter(f => f.type === 'select' || f.type === 'dropdown');
                  const checkboxFields = fields.filter(f => f.type === 'checkbox');

                  const radioFields = fields.filter(f => f.type === 'radio');
                  const textarea = fields.filter(f => f.type === "textarea")
                  const textFieldPairs = [];
                  for (let i = 0; i < textFields.length; i += 2) {
                    textFieldPairs.push(textFields.slice(i, i + 2));
                  }

                  return (
                    <>
                      {textFieldPairs.map((pair, pairIndex) => (
                        <div key={pairIndex} className={`grid gap-4 ${pair.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                          {pair.map((field, index) => (
                            <input
                              key={field._id || `text-${pairIndex}-${index}`}
                              type={field.type === 'number' ? 'tel' : field.type}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              placeholder={field.placeholder || field.label}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                              required={field.required}
                            />
                          ))}
                        </div>
                      ))}

                      {selectFields.length > 0 && (
                        <div className={`grid gap-4 ${selectFields.length >= 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                          {selectFields.map((field, index) => (
                            <select
                              key={field._id || `select-${index}`}
                              name={field.name}
                              value={formValues[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                              required={field.required}
                            >
                              <option value="">{field.placeholder || field.label}</option>
                              {field.options?.map((opt, optIdx) => (
                                <option key={opt._id || optIdx} value={opt.value || opt}>
                                  {opt.label || opt}
                                </option>
                              ))}
                            </select>
                          ))}
                        </div>
                      )}

                      {dateFields.map((field, index) => (
                        <input
                          key={field._id || `date-${index}`}
                          type="date"
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                          required={field.required}
                        />
                      ))}
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

                      {checkboxFields.map((field, index) => (
                        <label key={field._id || `checkbox-${index}`} className="flex items-start gap-4 text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={formValues[field.name] || false}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 accent-red-600 rounded"
                          />
                          <span>{field.label}</span>
                        </label>
                      ))}
                    </>
                  );
                })()}
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

                {/* Submit Status Message */}
                {submitStatus && (
                  <div className={`flex items-center gap-4 p-3 rounded ${submitStatus === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {submitStatus === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-[#FF1033]" />}
                    <p className={`text-sm ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>{submitMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3 rounded-full font-bold text-base transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] uppercase disabled:opacity-70 flex items-center justify-center gap-4"
                >
                  {submitLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ===== COLLABORATION SECTION ===== */}
      {collaborationSection.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            {collaborationSection.map((item, index) => (
              <div key={item._id || index}>
                <h2 className="text-2xl md:text-2xl font-bold text-black mb-6 text-left">
                  {item.title}
                </h2>
                {/* <div className="w-20 h-1 mx-auto mb-8"></div> */}
                <p className="text-black leading-relaxed text-lg whitespace-pre-line text-left mx-auto">
                  {item.contentHtml}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== IMAGE GALLERY SECTION ===== */}

      {formImages.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-20">

            {formImages.map((gallery, galleryIndex) => (
              <div key={gallery._id || galleryIndex} className="mb-12 last:mb-0">

                {/* Title at top */}
                <div

                  className="overflow-hidden w-[60%] lg:w-[70%] mx-auto rounded-lg  md group cursor-pointer"
                >
                  <img
                    src={getImageUrl(gallery.images[0])}
                    alt={`${gallery.title} -1`}
                    className="w-full h-[50vh] lg:h-[70vh] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h2 className="text-xl md:text-xl font-bold text-black my-4 text-center">
                  {gallery.title}
                </h2>

                {/* Red underline */}
                <div className="w-20 h-1 mx-auto mb-8"></div>

                {/* Image Grid - 3 columns with hover effect */}
                <div className="grid md:grid-cols-2 gap-4">
                  {gallery.images.slice(1)?.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="overflow-hidden rounded-lg  md group cursor-pointer"
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${gallery.title} - ${imgIndex + 2}`}
                        className="w-full h-56 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ===== LOCATION CARDS SECTION ===== */}
      {formEmployeesAddresses.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-4xl font-semibold text-black mb-3">Bangladesh Visa Application Centre in India</h2>
              {/* <div className="w-20 h-1 mx-auto" ></div> */}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formEmployeesAddresses.map((location, index) => (
                <div
                  key={location._id || index}
                  className="rounded-xl p-6 text-white  "
                  style={{ backgroundColor: location.color || '#3E861C' }}
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-4">
                    <MapPin className="w-6 h-6" />
                    {location.Location}
                  </h3>

                  <div className="space-y-4 text-white">
                    <p className="whitespace-pre-line text-base leading-relaxed">
                      {location.Address}
                    </p>

                    <div className="flex items-center gap-4">
                      <Mail className="w-4 h-4 shrink-0" />
                      <a href={`mailto:${location.email}`} className="hover:underline text-base">
                        {location.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-4">
                      <Phone className="w-4 h-4 shrink-0" />
                      <a href={`tel:${location.phone}`} className="hover:underline text-base">
                        {location.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== DOCUMENTS SECTION (only if documents exist) ===== */}
      {documents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Documents Required</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc._id || index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: '#FF1033' }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
              <div className="w-20 h-1 mx-auto" ></div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
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

export default BangladeshVac;