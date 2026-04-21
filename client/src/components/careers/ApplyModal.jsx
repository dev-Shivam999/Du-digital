import { useEffect, useState } from "react";
import CountryPhoneInput from "../become-partner/CountryPhoneInput";
import { SubmitCv } from "../../redux/slices/careersSlice";
import { useDispatch, useSelector } from "react-redux";

const ApplyModal = ({ open, job, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: null,
        resume: null,
    });
    const [errors, setErrors] = useState({});
    const { loading, error, success2 } = useSelector((state) => state.careers);
    const dispatch = useDispatch();
      useEffect(() => {
        if (success2) {
            onClose();
        }
    }, [success2]);
    if (!open) return null;

    const validate = () => {
        const newErrors = {};

        // Name: required, min 2 chars, letters & spaces only
        if (!formData.name || formData.name.trim().length < 2) {
            newErrors.name = "Please enter a valid name (at least 2 characters).";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
            newErrors.name = "Name should contain only letters and spaces.";
        }

        // Email: required, valid format
        if (!formData.email || formData.email.trim() === "") {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Phone: required, exactly 10 digits
        const phoneNumber = formData.phone?.phoneNumber || "";
        const digits = phoneNumber.replace(/\D/g, "");
        if (!digits) {
            newErrors.phone = "Phone number is required.";
        } else if (digits.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        // Resume: required, only pdf/doc/docx
        if (!formData.resume) {
            newErrors.resume = "Please upload your resume.";
        } else {
            const allowedExts = ["pdf", "doc", "docx"];
            const ext = formData.resume.name.split(".").pop().toLowerCase();
            if (!allowedExts.includes(ext)) {
                newErrors.resume = "Only PDF, DOC, and DOCX files are allowed.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const data = {
            jobId: job?._id,
            jobTitle: job?.title,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            resume: formData.resume,
        };

        dispatch(SubmitCv(data));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white w-[440px] rounded-2xl p-6 relative ">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Heading */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Apply Now
                </h3>

                {/* Job Info */}
                {job && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                            {job.location} · {job.jobType}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="apply-name" className="block mb-2 text-sm font-medium text-gray-900">
                            Full Name <span className="text-[#FF1033]">*</span>
                        </label>
                        <input
                            id="apply-name"
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                            }}
                            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="apply-email" className="block mb-2 text-sm font-medium text-gray-900">
                            Email <span className="text-[#FF1033]">*</span>
                        </label>
                        <input
                            id="apply-email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                            }}
                            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Phone <span className="text-[#FF1033]">*</span>
                        </label>
                        <CountryPhoneInput
                            onChange={(phoneData) => {
                                setFormData({ ...formData, phone: phoneData });
                                if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                            }}
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Upload Resume */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Upload Your Resume (Only pdf and doc files are allowed) <span className="text-[#FF1033]">*</span>
                        </label>
                        <label htmlFor="resume-upload" className="block cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-red-500 transition ${errors.resume ? "border-red-500" : "border-gray-300"}`}>
                                <p className="text-sm text-gray-600">
                                    Upload Resume <span className="text-[#FF1033]">(PDF / DOC)</span>
                                </p>

                                {formData.resume && (
                                    <p className="mt-2 text-xs text-gray-800 font-medium">
                                        {formData.resume.name}
                                    </p>
                                )}
                            </div>

                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="sr-only"
                                onChange={(e) => {
                                    setFormData({ ...formData, resume: e.target.files[0] });
                                    if (errors.resume) setErrors(prev => ({ ...prev, resume: "" }));
                                }}
                            />
                        </label>
                        {errors.resume && <p className="text-xs text-red-500 mt-1">{errors.resume}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#FF1033] hover:bg-[#511313] ${success2 ? "bg-[#28a745]" : ""} hover:text-[#FF1033] text-[#FFFDF5] py-3 rounded-full text-sm font-bold transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Submitting..." : error ? "Try Again" : "Cv Submited"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;

