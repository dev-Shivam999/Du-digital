import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addBlog, editBlog, loadBlogById, loadBlogs, resetStatus } from "../store/blogSlice"; // Added resetStatus
import { fetchBlogCategories } from "../api/api";
import { Save, ArrowLeft, Image as ImageIcon, X, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { upload } from "@imagekit/react";
// import RichTextEditor from "../components/RichTextEditor"; // Saved for future use
import TipTapEditor from "../components/TipTapEditor";

const BlogForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const { selectedBlog, loading, success, error, list } = useSelector((state) => state.blogs)


    // console.log("selected blog", selectedBlog);
    // console.log("loadBlogs", list);
    const length = list.length;
    console.log("length", length);






    // Initial State Structure matching Blog Schema
    const initialState = {
        name: "",
        categoryName: "",
        id: `${length + 1}`,
        outerHeading: "",
        innerHeading: "",
        description: "",
        shortDescription: "",
        outerImage: "",
        innerImage: "",
        tags: [],
        status: true,
        readMoreText: "Explore More",
        // NEW: Table of Contents
        tableOfContents: [],
        // NEW: Call to Action
        callToAction: {
            title: "",
            description: "",
            buttonText: "",
            buttonUrl: ""
        },
        seo: {
            title: "",
            description: "",
            keywords: [],
            canonical: "",
            openGraph: {
                title: "",
                description: "",
                url: "",
                type: "article",
                images: [{ url: "", width: 1200, height: 630, alt: "" }]
            }
        }
    };

    const [formData, setFormData] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("general");
    const [tagInput, setTagInput] = useState("");
    const [uploading, setUploading] = useState(false);

    // Fetch Categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchBlogCategories();
                const cats = res.data || res || [];
                if (Array.isArray(cats)) {
                    setCategories(cats);
                } else if (cats.categories && Array.isArray(cats.categories)) {
                    setCategories(cats.categories);
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        loadCategories();
    }, []);

    // Load Blog Data for Edit & Reset Status on Mount
    useEffect(() => {
        // Reset status when component mounts to prevent auto-redirect loop
        dispatch(resetStatus());

        if (isEditMode) {
            dispatch(loadBlogById(id));
        } else {
            setFormData(initialState);
        }
    }, [id, isEditMode, dispatch]);

    // Populate Form with Selected Blog Data
    useEffect(() => {
        if (isEditMode && selectedBlog) {
            // Deep merge logic to ensure nested objects (like seo.openGraph) are not lost if partially missing in DB
            setFormData(prev => ({
                ...initialState,
                ...selectedBlog,
                seo: {
                    ...initialState.seo,
                    ...(selectedBlog.seo || {}),
                    openGraph: {
                        ...initialState.seo.openGraph,
                        ...(selectedBlog.seo?.openGraph || {}),
                        images: (selectedBlog.seo?.openGraph?.images?.length > 0)
                            ? selectedBlog.seo.openGraph.images
                            : initialState.seo.openGraph.images
                    }
                }
            }));
        }
    }, [selectedBlog, isEditMode]);


    // Handle Success Redirect
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/blogs");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);


    // Form Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSeoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            seo: { ...prev.seo, [name]: value }
        }));
    };

    const handleSeoOgChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                openGraph: { ...prev.seo.openGraph, [name]: value }
            }
        }));
    };

    // Specific handler for OG Image URL (first item in array)
    const handleSeoOgImageChange = (e) => {
        const { value } = e.target;
        setFormData(prev => {
            const currentImages = [...prev.seo.openGraph.images];
            currentImages[0] = { ...currentImages[0], url: value };

            return {
                ...prev,
                seo: {
                    ...prev.seo,
                    openGraph: {
                        ...prev.seo.openGraph,
                        images: currentImages
                    }
                }
            };
        });
    };


    const handleTagAdd = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    // File Upload Handler (Reusing logic logic)
    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Get Auth signature from backend
            const baseurl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001"; // Fallback
            const authRes = await fetch(`${baseurl}/api/upload/auth`);
            const auth = await authRes.json();

            // Upload to ImageKit
            const uploadRes = await upload({
                file,
                fileName: file.name,
                useUniqueFileName: true,
                folder: "/blogs", // Organized folder
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                publicKey: auth.publicKey,
            });

            // Update State
            setFormData(prev => ({ ...prev, [field]: uploadRes.url }));
            toast.success("Image uploaded successfully!");

        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    // TOC Handlers
    const handleGenerateTOC = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(formData.description, 'text/html');
        const headings = doc.querySelectorAll('h2');
        console.log(headings);

        const toc = Array.from(headings).map(h => h.textContent.trim());

        if (toc.length === 0) {
            toast.error('No h2 headings found! Add headings using the editor toolbar.');
            return;
        }

        setFormData(prev => ({
            ...prev,
            tableOfContents: toc
        }));

        toast.success(`Generated ${toc.length} TOC items!`);
    };

    const handleAddTOCItem = () => {
        const item = prompt('Enter TOC heading:');
        if (item && item.trim()) {
            setFormData(prev => ({
                ...prev,
                tableOfContents: [...prev.tableOfContents, item.trim()]
            }));
        }
    };

    const handleRemoveTOCItem = (index) => {
        setFormData(prev => ({
            ...prev,
            tableOfContents: prev.tableOfContents.filter((_, i) => i !== index)
        }));
    };

    const handleUpdateTOCItem = (index, newValue) => {
        setFormData(prev => {
            const updated = [...prev.tableOfContents];
            updated[index] = newValue;
            return { ...prev, tableOfContents: updated };
        });
    };

    // CTA Handlers
    const handleCTAChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            callToAction: {
                ...prev.callToAction,
                [name]: value
            }
        }));
    };

    const handleResetCTA = () => {
        setFormData(prev => ({
            ...prev,
            callToAction: {
                title: "Let's Discuss Your Project",
                description: "Our experts help identify and integrate the ideal software solution for your needs with precision and expertise.",
                buttonText: "Book A Free Consultation",
                buttonUrl: "https://calendly.com/contact-metablocktech/30min"
            }
        }));
        toast.success('CTA reset to default!');
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.name || !formData.categoryName) {
            toast.error("Please fill required fields (Name, Category)");
            return;
        }

        // Get latest content from TipTap before submit (synchronous)
        if (editorRef.current && editorRef.current.save) {
            const editorContent = editorRef.current.save();
            if (editorContent) {
                formData.description = editorContent;
            }
        }

        const payload = { ...formData };

        // Debug: Check description format
        console.log('🚀 Submitting blog with description:', payload.description?.substring(0, 200));
        console.log('📊 Description type:', typeof payload.description);
        console.log('📏 Description length:', payload.description?.length);

        // Find category ID mapping if needed (Backend often needs ID too)
        const selectedCat = categories.find(c => c.name === formData.categoryName);
        if (selectedCat) {
            payload.categoryId = selectedCat._id;
            payload.categoryName = selectedCat.name; // Ensure consistent name
        }

        if (isEditMode) {
            dispatch(editBlog({ id, blogData: payload }));
        } else {
            dispatch(addBlog(payload));
        }
    }; // end handleSubmit

    return (
        <div className="flex flex-col gap-6 bg-white rounded-xl p-4 md:p-8 shadow-sm min-h-[calc(100vh-120px)] animate-fadeIn max-w-5xl mx-auto">
            <Toaster position="bottom-right" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/blogs")} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Blog" : "Create New Blog"}</h1>
                        <p className="text-sm text-gray-500">Fill in the details below to {isEditMode ? "update" : "publish"} your blog post.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || uploading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : <><Save size={18} /> {isEditMode ? "Update" : "Publish"}</>}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {['general', 'content', 'seo', 'media'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-2 text-sm font-medium capitalize transition-all border-b-2 ${activeTab === tab
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab} Details
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Blog Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                    placeholder="e.g., The Future of Blockchain technology"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
                                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.status ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                                            {formData.status && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === true}
                                            onChange={() => setFormData(prev => ({ ...prev, status: true }))}
                                            className="hidden"
                                        />
                                        <span className={`font-medium ${formData.status ? 'text-indigo-700' : 'text-gray-600 group-hover:text-gray-800'}`}>Published</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!formData.status ? 'border-amber-500 bg-amber-500' : 'border-gray-400'}`}>
                                            {!formData.status && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === false}
                                            onChange={() => setFormData(prev => ({ ...prev, status: false }))}
                                            className="hidden"
                                        />
                                        <span className={`font-medium ${!formData.status ? 'text-amber-700' : 'text-gray-600 group-hover:text-gray-800'}`}>Draft</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Tags</label>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map((tag, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg shadow-sm">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="text-indigo-400 hover:text-indigo-900 rounded-full p-0.5 hover:bg-indigo-50 transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagAdd}
                                        className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
                                        placeholder="Type tag & press Enter..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Short Description</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 resize-y"
                                placeholder="Write a brief, catchy summary for the blog card..."
                            />
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Outer Heading (H1)</label>
                                <input
                                    type="text"
                                    name="outerHeading"
                                    value={formData.outerHeading}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Main heading displayed on listing"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Inner Heading (H2)</label>
                                <input
                                    type="text"
                                    name="innerHeading"
                                    value={formData.innerHeading}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Heading inside the blog post"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Main Content</label>
                            <p className="text-xs text-gray-500 mb-3">
                                💡 Use the toolbar to format content. Click 🖼 to upload images via ImageKit!
                            </p>
                            <TipTapEditor
                                ref={editorRef}
                                value={formData.description}
                                onChange={(content) => {
                                    setFormData(prev => ({ ...prev, description: content }));
                                }}
                                placeholder="Start writing your blog content..."
                            />
                        </div>
                    </div>
                )}

                {/* Advanced Tab - TOC & CTA */}
                {activeTab === 'advanced' && (
                    <div className="grid grid-cols-1 gap-8 animate-fadeIn">
                        {/* Table of Contents Section */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    📑 Table of Contents
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleGenerateTOC}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium flex items-center gap-2"
                                >
                                    🤖 Auto-Generate from H2
                                </button>
                            </div>

                            {/* TOC Items List */}
                            <div className="space-y-2 mb-4">
                                {formData.tableOfContents.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                        <p className="text-sm">No TOC items yet. Add manually or auto-generate from your content!</p>
                                    </div>
                                ) : (
                                    formData.tableOfContents.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 group">
                                            <span className="text-gray-500 font-mono text-sm w-8">
                                                {index + 1}.
                                            </span>
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => handleUpdateTOCItem(index, e.target.value)}
                                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTOCItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Item Button */}
                            <button
                                type="button"
                                onClick={handleAddTOCItem}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add TOC Item Manually
                            </button>

                            {/* Info */}
                            <p className="text-xs text-gray-500 mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                💡 <strong>Tip:</strong> Use H2 headings in your content for best results. The auto-generate button will extract all H2 headings.
                            </p>
                        </div>

                        {/* Call to Action Section */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    📞 Call to Action
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleResetCTA}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                                >
                                    Reset to Default
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CTA Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.callToAction?.title || ""}
                                        onChange={handleCTAChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Let's Discuss Your Project"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CTA Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.callToAction?.description || ""}
                                        onChange={handleCTAChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                                        placeholder="Our experts help identify and integrate the ideal software solution..."
                                    />
                                </div>

                                {/* Button Text & URL */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Button Text
                                        </label>
                                        <input
                                            type="text"
                                            name="buttonText"
                                            value={formData.callToAction?.buttonText || ""}
                                            onChange={handleCTAChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Book A Free Consultation"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Button URL
                                        </label>
                                        <input
                                            type="url"
                                            name="buttonUrl"
                                            value={formData.callToAction?.buttonUrl || ""}
                                            onChange={handleCTAChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="https://calendly.com/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {formData.callToAction?.title && (
                                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                    <p className="text-xs text-gray-500 mb-3 font-semibold">Preview:</p>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                                        {formData.callToAction.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {formData.callToAction.description}
                                    </p>
                                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                        {formData.callToAction.buttonText || "Click Here"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">SEO Title (Meta Title)</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.seo?.title || ""}
                                    onChange={handleSeoChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Optimized title for search engines"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">SEO Description (Meta Description)</label>
                                <textarea
                                    name="description"
                                    value={formData.seo?.description || ""}
                                    onChange={handleSeoChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Brief summary for search results"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Canonical URL</label>
                                <input
                                    type="text"
                                    name="canonical"
                                    value={formData.seo?.canonical || ""}
                                    onChange={handleSeoChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="https://example.com/blog/..."
                                />
                            </div>

                            {/* Open Graph Section */}
                            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
                                <h3 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                                    Open Graph (Social Media)
                                </h3>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">OG Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.seo?.openGraph?.title || ""}
                                    onChange={handleSeoOgChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Title for social media sharing"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">OG Description</label>
                                <textarea
                                    name="description"
                                    value={formData.seo?.openGraph?.description || ""}
                                    onChange={handleSeoOgChange}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Description for social cards"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">OG URL</label>
                                <input
                                    type="text"
                                    name="url"
                                    value={formData.seo?.openGraph?.url || ""}
                                    onChange={handleSeoOgChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="URL of the object"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-gray-800 mb-2">OG Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.seo?.openGraph?.images?.[0]?.url || ""}
                                    onChange={handleSeoOgImageChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="/assets/image.jpg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        {/* Outer Image */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
                            <label className="block text-sm font-semibold text-gray-800 mb-4 text-center">Thumbnail Image (Outer)</label>

                            {formData.outerImage ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden group shadow-md bg-white">
                                    <img src={formData.outerImage} alt="Outer" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 shadow-lg transform transition-transform hover:scale-105">
                                            Change Image
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'outerImage')} accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ImageIcon size={32} />
                                    </div>
                                    <div className="text-center">
                                        <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-bold text-lg">
                                            Click to Upload
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'outerImage')} accept="image/*" />
                                        </label>
                                        <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inner Image */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
                            <label className="block text-sm font-semibold text-gray-800 mb-4 text-center">Header Image (Inner)</label>

                            {formData.innerImage ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden group shadow-md bg-white">
                                    <img src={formData.innerImage} alt="Inner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 shadow-lg transform transition-transform hover:scale-105">
                                            Change Image
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'innerImage')} accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ImageIcon size={32} />
                                    </div>
                                    <div className="text-center">
                                        <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-bold text-lg">
                                            Click to Upload
                                            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'innerImage')} accept="image/*" />
                                        </label>
                                        <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};


export default BlogForm;
