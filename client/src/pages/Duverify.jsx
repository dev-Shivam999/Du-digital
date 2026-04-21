import { useState, useEffect } from "react";
import { Check, CheckCircle, Loader2, Mail, Phone } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import DynamicFormField from "../components/reusable/DynamicFormField";
import SEO from "../components/reusable/SEO";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

const Duverify = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BackendURL}/api/forms/slug/duverify`);
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
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath.replace("/api", "")}`;
    // return `${BackendURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  if (loading) return <LoadingState message="Loading DuVerify..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

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
      const response = await fetch(`${BackendURL}/api/form-submissions/slug/duverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      const res = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your  application has been submitted successfully. Our team will contact you shortly.');
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

  const { name, description, contentSections = {}, fields = {} } = formData || {};

  // Get sections by API keys
  const aboutSection = contentSections['About DuVerify'] || [];
  const whyChooseSection = contentSections['Why Choose DuVerify?'] || [];
  const whatCanDoSection = contentSections['What DuVerify Can Do for You'] || [];
  const partnershipsSection = contentSections['Key Partnerships'] || [];
  const demoSection = contentSections[' Request a Demo Today'] || [];

  return (
    <div className="bg-white  ">
      <SEO />

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full sm:h-[800px] min-h-[800px] overflow-hidden">
        <img
          src={getImageUrl(formData?.image) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}
          alt="DuVerify Hero"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-20 py-32 flex items-center">
          <div className="max-w-3xl text-white">
            {/* <h1 className="text-4xl    font-bold leading-tight mb-6">
              {name || 'DuVerify – Revolutionizing Document Verification for Visa Processes'}
            </h1> */}
            <h1 className="text-4xl    font-bold leading-tight mb-6">
              {name?.startsWith('DuVerify') ? (
                <>
                  <span className="text-[#FF1033]">DuVerify</span>
                  <span className="text-white">{name.slice(8)}</span>
                </>
              ) : (
                <span className="text-white">{name}</span>
              )}
            </h1>


            <p className="text-xl md:text-2xl text-gray-100 mb-10">
              {description || 'Trusted by Governments, Embassies, and Consulates Worldwide'}
            </p>

            <a
              href="#connectwithus"
              className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033]  "
            >
              Connect with Us
            </a>
          </div>
        </div>
      </section>
      {fields && fields.length > 0 && (
        <div id="callback-form" className="bg-white rounded-2xl  2xl p-8 max-w-md w-full ml-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Request a Callback</h3>

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
                theme="light"
              />
            ))}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-4 cursor-pointer bg-[#FF1033] text-white hover:bg-[#2D1F1F] hover:text-[#FF1033] rounded-full font-bold transition-opacity flex justify-center items-center gap-4"
            >
              {submitLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {/* ===== ABOUT DUVERIFY SECTION ===== */}
      {aboutSection.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl  font-bold text-[#333333] mb-3">
                About DuVerify
                {/* <span style={{ color: '#FF1033' }}>DuVerify</span> */}
              </h2>
              <div className="w-16 h-0.75 mx-auto"></div>
            </div>

            {aboutSection.map((item, index) => (
              <div key={item._id || index} className="grid md:grid-cols-2 gap-12 items-center place-items-center">
                <div>
                  <p className="text-[#333333] leading-relaxed text-base md:text-[17px] mb-6">
                    {item.title}
                  </p>

                  {/* Benefits List from contentHtml */}
                  <ul className="space-y-4">
                    {item.contentHtml?.split(/\r?\n/).filter(line => line.trim()).map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-none flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#FF1033' }}>
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          {/* <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} /> */}
                        </div>
                        <span className="text-[#333333] text-base md:text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center">
                  {item?.images?.length > 0 ? item.images.map(p => <img
                    src={getImageUrl(p)}
                    alt="About DuVerify"
                    className=" inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  />) : item.image && <img
                    src={getImageUrl(item.image)}
                    alt="About DuVerify"
                    className=" inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ===== WHY CHOOSE DUVERIFY (IMAGE MATCHED UI) ===== */}
      {whyChooseSection.length > 0 && (
        <section className="py-24 pt-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl  font-bold text-gray-900 mb-4">
                Why Choose DuVerify?
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyChooseSection.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={item._id || index}
                    className={`
                relative rounded-xl p-5 overflow-hidden
                bg-[#fdeeee]
                ${index >= 3 ? "lg:col-span-1" : ""}
              `}
                  >
                    {/* bg image absolute positioned */}
                    {item?.images?.length > 0 ? (
                      <img
                        src={getImageUrl(item.images[0])}
                        alt="Why Choose DuVerify"
                        className="absolute inset-0 w-full h-full opacity-0 object-cover"
                      />
                    ) :
                      <img
                        src={getImageUrl(item.image)}
                        alt="Why Choose DuVerify"
                        className="absolute inset-0 w-full h-full opacity-0 object-cover"
                      />
                    }
                    {/* Decorative watermark */}
                    {/* <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.06] bg-[radial-gradient(circle,_#c60505_1px,_transparent_1px)] bg-[length:10px_10px]" /> */}

                    {/* Number */}
                    <div className="text-6xl font-bold text-[#FF1033] mb-6">
                      {number}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#333333] mb-4">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className="text-[#333333] leading-relaxed text-base md:text-[17px] max-w-[520px]">
                      {item.contentHtml?.replace(/\r?\n/g, " ").trim()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}



      {/* ===== KEY PARTNERSHIPS SECTION - Cards with background images ===== */}
      {partnershipsSection.length > 0 && (
        <section className="relative py-20 bg-gray-900">
          {/* Need bg Image in this section in background */}
          <img src="/assets/du-verify/WhatsApp-Image-2024-09-12-at-11.56.29-4-scaled.jpeg" alt="Key Partnerships" className="absolute inset-0 w-full h-full object-cover" />
          {/* Need dark overlay */}
          <div className="absolute inset-0 bg-black/70"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-4xl  font-bold text-white mb-3">
                Key Partnerships
              </h2>
            </div>

            {/* Partnership Cards - 2 columns with background images */}
            <div className="grid md:grid-cols-2 gap-4">
              {partnershipsSection.map((partnership, index) => (
                <div
                  key={partnership._id || index}
                  className="relative group rounded-lg overflow-hidden border border-white/20 min-h-[280px]"
                >
                  {/* Background Image */}
                  {partnership?.images?.length > 0 && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImageUrl(partnership.images[0])})` }}
                    />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/85" />

                  <div className="absolute inset-0 bg-[#FF1033]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />


                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-3">
                      {partnership.title}
                    </h3>
                    <p className="text-gray-100 text-sm md:text-base lg:text-lg leading-relaxed">
                      {partnership.contentHtml?.replace(/\r?\n/g, ' ').trim()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ===== WHAT DUVERIFY CAN DO FOR YOU ===== */}
      {whatCanDoSection.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">

            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-4xl  font-bold text-black mb-4">
                What DuVerify Can Do For You
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {whatCanDoSection.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={item._id || index}
                    className="
                relative
                bg-white
                border border-gray-800
                rounded-2xl
                p-6
                min-h-[280px]
                overflow-hidden
                flex
                flex-col
              "
                  >
                    {/* Number */}
                    <div className="text-4xl font-bold text-[#FF1033] mb-6">
                      {number}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#333333] mb-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm md:text-[17px] text-[#333333] leading-relaxed">
                      {item.contentHtml?.replace(/\r?\n/g, " ").trim()}
                    </p>

                    {/* Diagonal pink corner */}
                    <div
                      className="absolute bottom-0 right-0 w-24 h-24"
                      style={{
                        background:
                          "linear-gradient(135deg, transparent 50%, rgba(161,0,0,0.12) 50%)",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* ===== CONNECT WITH US / REQUEST A DEMO SECTION - Two column layout ===== */}
      <section id="connectwithus" className="py-4">
        <div className="flex flex-wrap  gap-4 justify-center">
          {/* Left - Request a Demo */}
          <div className="relative group h-[300px] overflow-hidden rounded-2xl  sm:w-[45%]">
            <div
              className="absolute inset-0 bg-cover  bg-center"
              style={{
                backgroundImage: demoSection[0]?.images?.length > 0
                  ? `url(${getImageUrl(demoSection[0].images[0])})`
                  : `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-[#FF1033]/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 p-10 md:p-10 flex flex-col justify-center h-full">
              <h2 className="text-4xl md:text-4xl lg:text-4xl font-semibold text-white mb-4">
                {demoSection[0]?.title || 'Request a Demo Today'}
              </h2>
              <p className="text-gray-100 leading-relaxed">
                {demoSection[0]?.contentHtml?.replace(/\r?\n/g, ' ').trim() || 'Discover how DuVerify can transform your visa and document verification workflows.'}
              </p>
            </div>
          </div>

          {/* Right - Connect with us */}
          <div className="bg-[#050505] h-[300px] md:p-10 rounded-2xl o sm:p-10 sm:w-[45%] flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-2">Connect with us</h3>
            <div className="w-12 h-1 mb-8" style={{ backgroundColor: '#FF1033' }}></div>

            <div className="mb-6">
              <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-1">Dheeraj Shrivastava</h4>
              <p className="text-gray-100">Sr. Executive - Operation</p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:dheeraj@dudigitalglobal.com"
                className="flex items-center gap-4 transition-colors"
                style={{ color: '#FF1033' }}
              >
                {/* <Mail className="w-5 h-5" /> */}
                <span className="w-5 h-5 text-[#FF1033]">
                  📧
                </span>
                <span className="text-white">Email -</span>
                <span className="hover:text-[#333366]">dheeraj@dudigitalglobal.com</span>
              </a>
              <a
                href="tel:+918510809767"
                className="flex items-center gap-4 transition-colors text-[#FF1033]"
              >
                {/* <Phone className="w-5 h-5" /> */}
                <span className="w-5 h-5 text-[#FF1033]">
                  📞
                </span>
                <span className="text-white">Mobile -</span>
                <span className="hover:text-[#333366]">+91-8510809767</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Duverify;




//<h1 className="text-4xl    font-bold leading-tight mb-6">
//  <span className="text-[#FF1033]">DuVerify</span>
//  <span className="text-white">
//    {name
//      ? name.replace(/^DuVerify\s*[-–]?\s*/, ' – ')
//      : ' – Revolutionizing Document Verification for Visa Processes'}
//  </span>
//</h1>