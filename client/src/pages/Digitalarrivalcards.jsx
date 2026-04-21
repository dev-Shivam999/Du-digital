import { useState, useEffect } from "react";
import { Check, CheckCircle, XCircle, FileText, File, CreditCard } from "lucide-react";
import LoadingState from "../components/reusable/LoadingState";
import ErrorState from "../components/reusable/ErrorState";
import DigitalArrivalForm from "../components/DigitalArrivalCards/DigitalArrivalForm";

const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';

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

  const handleFormSubmit = async (finalData) => {
    setSubmitLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    
    try {
      console.log(finalData);
      
      return

      if (otpSent) {
        const response = await fetch(`${BackendURL}/api/form-submissions/slug/digital-arrival-cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...finalData, otp }),
        });
        const res = await response.json();
        if (res.ok) {
          setSubmitStatus('success');
          setSubmitMessage('Thank you! Your  application has been submitted successfully. Our team will contact you shortly.');
          // Reset form
          // const resetValues = {};
          // formData?.fields?.forEach(field => { resetValues[field.name] = ''; });
          // setfinalData(resetValues);
        } else {

          setSubmitStatus('error');
          setSubmitMessage(res.message || 'Something went wrong. Please try again.');
        }
      } else {

        const data = await fetch(`${BackendURL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: finalData.mobile || finalData.phone || finalData.mobileNumber || finalData.phoneNumber || finalData.number || finalData.Phone|| '' }),
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
      setSubmitMessage(err.message || 'Failed to submit. Please check your connection and try again.');
      throw err; // Re-throw to let child component know if needed
    } finally {
      setSubmitLoading(false);
      // Clear message after delay
      setTimeout(() => {
        if (submitStatus === 'success') {
          setSubmitStatus(null);
          setSubmitMessage('');
        }
      }, 7000);
    }
  };

  if (loading) return <LoadingState message="Loading Digital Arrival Cards..." fullScreen />;
  if (error) return <ErrorState error={error} onRetry={fetchFormData} showHomeButton fullScreen />;

  const { documents = [], faqs = [], contentSections = {} } = formData || {};

  // Get sections by API keys
  const whyChooseSection = contentSections['Why Choose DU GLOBAL'] || [];



  const documentIcons = {
    passport: FileText,
    flight: File,
    hotel: CreditCard
  };


  return (
    <div className="bg-white  ">

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full sm:h-[800px] min-h-[800px]overflow-hidden">
        <img
          src={getImageUrl(formData?.image) || STATIC_IMAGES.hero}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-20 h-full flex items-center">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl  font-bold text-white leading-tight mb-6">
              One Platform for All Your Mandatory Digital Arrival Cards - Thailand, Malaysia, Indonesia, Singapore, South Korea & Taiwan
            </h1>
            {/* <p className="text-3xl md:text-4xl  font-bold text-white mb-4">
              - Thailand, Malaysia, Indonesia, Singapore, South Korea & Taiwan
            </p> */}
            <p className="text-xl text-white font-semibold mb-8">
              It's mandatory for all travellers to apply before flying.
            </p>
            <a
              href="#apply-form"
              className="inline-block px-8 py-4 rounded-full font-bold text-lg text-[#FFFDF5] transition-all duration-300 bg-[#FF1033] hover:bg-[#511313] hover:text-[#FF1033] hover:opacity-90  "
            >
              Start Your Application
            </a>
          </div>
        </div>
      </section>

      {/* ===== TRAVEL READY SECTION - Fixed Background Parallax ===== */}
      <section
        className="relative max-w-6xl mx-auto mx-2 py-20 bg-fixed bg-cover bg-center m-[100px] rounded-[30px] overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay with red geometric lines decoration */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(30,15,20,0.95) 100%)'
          }}
        />

        {/* Red geometric line decoration on right */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M400 0 L800 300 L400 600 M500 100 L800 350 L500 500' fill='none' stroke='%23FF1033' stroke-width='1'/%3E%3Ccircle cx='600' cy='200' r='2' fill='%23FF1033'/%3E%3Ccircle cx='700' cy='400' r='2' fill='%23FF1033'/%3E%3Ccircle cx='500' cy='350' r='1.5' fill='%23FF1033'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: 'cover'
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 text-center">
          <h2 className="text-4xl md:text-4xl  font-bold text-white mb-4">
            Travel Ready with DU GLOBAL
          </h2>
          <p className="text-gray-50 text-lg md:text-xl leading-relaxed">
            Apply your Digital Arrival Card today and fly worry-free to{' '}
            <span className="text-white font-medium">Thailand, Malaysia, Indonesia, Singapore, South Korea, or Taiwan</span>
          </p>
        </div>
      </section>

      {/* ===== MULTI-STEP FORM SECTION ===== */}
      <section id="apply-form" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <h2 className="text-4xl md:text-4xl font-bold text-center text-gray-900 mb-8">Apply for Digital Arrival Card</h2>

          {/* Success/Error Message Display */}
          {submitStatus === 'success' && (
            <div className="mb-8 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center gap-4 text-green-800">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">Success!</p>
                <p>{submitMessage}</p>
              </div>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-4 text-red-800">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p>{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Render the Form Component */}

          <DigitalArrivalForm
            onSubmit={handleFormSubmit}
            sendOpt={setOtp}
            checkopt={otpSent}

            serverError={submitStatus === 'error' ? submitMessage : null}
            loading={submitLoading}
          />



        </div>
      </section>


      {/* ===== DOCUMENTS REQUIRED SECTION ===== */}
      {documents?.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-20">

            {/* Heading */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-4xl  font-bold text-[#333333]">
                Documents Required
              </h2>
              {/* <div className="w-16 h-1 bg-[#C00C02] mx-auto mt-4" /> */}
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {documents.map((doc, index) => {
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={doc._id}
                    className="relative bg-white rounded-2xl p-8 border border-gray-900  sm min-h-[220px]"
                  >
                    {/* Static Icons (UI only) */}
                    <div className="mb-6 text-[#FF1033]">
                      {index === 0 && <FileText className="w-10 h-10" />}
                      {index === 1 && <File className="w-10 h-10" />}
                      {index === 2 && <CreditCard className="w-10 h-10" />}
                    </div>

                    {/* Description */}
                    <h3 className="text-xl font-semibold text-[#333333] leading-snug">
                      {doc.description}
                    </h3>

                    {/* Number */}
                    <div className="absolute top-6 right-6 text-6xl font-bold text-red-200">
                      {number}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE SECTION ===== */}
      {whyChooseSection.length > 0 && (
        <section className="max-w-6xl mx-auto py-10 rounded-lg relative overflow-hidden" style={{ backgroundColor: '#FF1033' }}>
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20">
            {whyChooseSection.map((item, index) => (
              <div key={item._id || index} className="grid md:grid-cols-2 gap-12 items-center place-items-center">
                <div className="flex justify-center">
                  <img
                    src={item.images.length > 0 ? getImageUrl(item.images[0]) : STATIC_IMAGES.whyChoose}
                    alt={item.title}
                    className="max-w-full h-auto rounded-2xl  2xl"
                    style={{ maxHeight: '400px' }}
                  />
                </div>

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
                          <Check className="w-4 h-4" style={{ color: '#FF1033' }} strokeWidth={3} />
                        </div>
                        <span className="text-white/95 text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
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
                    onClick={() => setOpenFaq(index === openFaq ? null : index)}
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