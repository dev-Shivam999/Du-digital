import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountryPhoneInput from "../become-partner/CountryPhoneInput";
import { submitContactForm, clearContactState, dataFill2 } from "../../redux/slices/contactSlice";

const ContactForm = ({ form }) => {
    
  const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const dispatch = useDispatch();
    
      const [otpSent, setOtpSent] = useState(false)
    const { loading, error, success ,successMsg} = useSelector((state) => state.contact);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: null,
        message: "",
        consent: false,
        otp: "",
    });

    useEffect(() => {
        return () => {
            dispatch(clearContactState());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handlePhoneChange = (phoneData) => {
        setFormData(prev => ({ ...prev, phone: phoneData }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearContactState());

        const payload = {
            Last_Name: formData.name,
            Email: formData.email,
            Phone: formData.phone?.fullNumber || "",
            Message: formData.message,
            Remarks: formData.consent,
            otp:formData.otp
        };
if(otpSent){

    
    const result = await dispatch(submitContactForm(payload));
    if (submitContactForm.fulfilled.match(result)) {
        setFormData({
            name: "",
                email: "",
                phone: null,
                message: "",
                consent: false,
                otp:""
            });
        }
    }else{
    
      const data =       await fetch(`${BackendURL}/api/otp/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({mobile:formData.phone?.fullNumber|| ''}),
        });
        const res = await data.json();
       if(res.success){
        dispatch(dataFill2({data:{success:true,error:null,msg:'Thank you! submit the 6 digit otp'}}))
         
          alert('submit the 6 digit otp');
          setOtpSent(true);
       }else{
        dispatch(dataFill2({data:{success:false,error:'invaild number',msg:'invaild number'}}))
       }
        
      }
    
    };

    return (
        <div className="bg-white rounded-2xl  p-2.5 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-3"
                    required
                    aria-label="Name"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-3"
                    required
                    aria-label="Email Address"
                />

                <CountryPhoneInput onChange={handlePhoneChange} />

                <textarea
                    name="message"
                    placeholder="Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-3"
                    aria-label="Message"
                />

                <label className="flex items-start gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1"
                    />
                    By submitting my details, I authorize DU GLOBAL to contact me via
                    Call / SMS / WhatsApp / Email.
                </label>

              {
              otpSent&&(
                <input
                type="text"
                name="otp"
                placeholder="OTP"
                className="w-full border px-4 py-3 rounded-md"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              )
            }

            {/* MESSAGES */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
              {successMsg}
              </div>
            )}


                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full font-bold text-lg transition-all duration-300 bg-[#FF1033] text-[#FFFDF5] hover:bg-[#511313] hover:text-[#FF1033] disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Get in Touch"}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
