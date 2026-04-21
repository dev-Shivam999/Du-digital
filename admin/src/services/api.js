import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api';

const API_URL_INVESTOR = `${API_BASE_URL}/investor`;
const API_URL_OFFICE = `${API_BASE_URL}/office`;
const API_URL_CONTACT = `${API_BASE_URL}/contact`;
const API_URL_PARTNER = `${API_BASE_URL}/partner`;
const API_URL_GALLERY = `${API_BASE_URL}/gallery`;

const API_URL_AUTH = `${API_BASE_URL}/auth`;

// Add auth token to requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Auth ---
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL_AUTH}/login`, { email, password });
    return response.data;
};


// --- User Management ---
const API_URL_USERS = `${API_BASE_URL}/users`;

export const getUsers = async () => {
    const response = await axios.get(API_URL_USERS);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(API_URL_USERS, userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL_USERS}/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL_USERS}/${id}`);
    return response.data;
};

// --- Investor Relations ---
export const getStats = async () => {
    const response = await axios.get(`${API_URL_INVESTOR}/stats`);
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL_INVESTOR}/categories`);
    return response.data;
};

export const createCategory = async (data) => {
    const response = await axios.post(`${API_URL_INVESTOR}/categories`, data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await axios.put(`${API_URL_INVESTOR}/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL_INVESTOR}/categories/${id}`);
    return response.data;
};

export const createReport = async (formData) => {
    const response = await axios.post(`${API_URL_INVESTOR}/report`, formData);
    return response.data;
};

export const getReportsByCategory = async (slug, isAdmin = true) => {
    const response = await axios.get(`${API_URL_INVESTOR}/category/${slug}?isAdmin=${isAdmin}`);
    return response.data;
};

export const deleteReport = async (id) => {
    const response = await axios.delete(`${API_URL_INVESTOR}/report/${id}`);
    return response.data;
};

export const updateReport = async (id, formData) => {
    const response = await axios.put(`${API_URL_INVESTOR}/report/${id}`, formData);
    return response.data;
};

// --- Office Locations ---

export const getOfficeTypes = async () => {
    const response = await axios.get(`${API_URL_OFFICE}/types`);
    return response.data;
};

export const createOfficeType = async (data) => {
    const response = await axios.post(`${API_URL_OFFICE}/types`, data);
    return response.data;
};

export const deleteOfficeType = async (id) => {
    const response = await axios.delete(`${API_URL_OFFICE}/types/${id}`);
    return response.data;
};

export const getLocations = async (typeId = '') => {
    // Use grouped endpoint to get full address data (public endpoint)
    const response = await axios.get(`${API_URL_OFFICE}/locations/grouped`, { skipAuth: true });

    // Flatten the grouped response into a single array
    const { india = [], international = [] } = response.data;
    const allLocations = [...india, ...international];

    // Filter by typeId if provided (client-side filtering since we're using the grouped endpoint)
    if (typeId) {
        return allLocations.filter(loc =>
            (loc.officeTypeId?._id === typeId) || (loc.officeTypeId === typeId)
        );
    }

    return allLocations;
};

export const createLocation = async (data) => {
    const response = await axios.post(`${API_URL_OFFICE}/locations`, data);
    return response.data;
};

export const updateLocation = async (id, data) => {
    const response = await axios.put(`${API_URL_OFFICE}/locations/${id}`, data);
    return response.data;
};

export const deleteLocation = async (id) => {
    const response = await axios.delete(`${API_URL_OFFICE}/locations/${id}`);
    return response.data;
};

// --- Contact Inquiries ---

export const getInquiries = async () => {
    const response = await axios.get(`${API_URL_CONTACT}`);
    return response.data;
};

export const getContactStats = async () => {
    const response = await axios.get(`${API_URL_CONTACT}/stats`);
    return response.data;
};

// --- Partner Program ---

export const getPartnerRequests = async () => {
    const response = await axios.get(`${API_URL_PARTNER}`);
    return response.data;
};

export const getPartnerStats = async () => {
    const response = await axios.get(`${API_URL_PARTNER}/stats`);
    return response.data;
};

export const updatePartnerStatus = async (id, data) => {
    const response = await axios.put(`${API_URL_PARTNER}/${id}`, data);
    return response.data;
};

// --- Gallery ---

export const getImages = async () => {
    const response = await axios.get(`${API_URL_GALLERY}`);
    return response.data;
};

export const uploadImage = async (formData) => {
    const response = await axios.post(`${API_URL_GALLERY}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteImage = async (id) => {
    const response = await axios.delete(`${API_URL_GALLERY}/${id}`);
    return response.data;
};

// --- Sales Experts ---
const API_URL_SALES_EXPERTS = `${API_BASE_URL}/sales-experts`;

export const getSalesExperts = async () => {
    const response = await axios.get(API_URL_SALES_EXPERTS);
    return response.data;
};

export const addSalesExpert = async (data) => {
    const response = await axios.post(API_URL_SALES_EXPERTS, data);
    return response.data;
};

export const updateSalesExpert = async (id, data) => {
    const response = await axios.put(`${API_URL_SALES_EXPERTS}/${id}`, data);
    return response.data;
};

export const deleteSalesExpert = async (id) => {
    const response = await axios.delete(`${API_URL_SALES_EXPERTS}/${id}`);
    return response.data;
};

// --- Videos ---
const API_URL_VIDEOS = `${API_BASE_URL}/videos`;

export const getVideos = async () => {
    const response = await axios.get(API_URL_VIDEOS);
    return response.data;
};

export const createVideo = async (data) => {
    const response = await axios.post(API_URL_VIDEOS, data);
    return response.data;
};

export const updateVideo = async (id, data) => {
    const response = await axios.put(`${API_URL_VIDEOS}/${id}`, data);
    return response.data;
};

export const deleteVideo = async (id) => {
    const response = await axios.delete(`${API_URL_VIDEOS}/${id}`);
    return response.data;
};

// --- Blogs ---
const API_URL_BLOGS = `${API_BASE_URL}/blogs`;

export const getBlogs = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL_BLOGS}?page=${page}&limit=${limit}`);
    return response.data;
};

export const getBlog = async (id) => {
    const response = await axios.get(`${API_URL_BLOGS}/${id}`);
    return response.data;
};

export const createBlog = async (data) => {
    const response = await axios.post(API_URL_BLOGS, data);
    return response.data;
};

export const updateBlog = async (id, data) => {
    const response = await axios.put(`${API_URL_BLOGS}/${id}`, data);
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await axios.delete(`${API_URL_BLOGS}/${id}`);
    return response.data;
};

// --- Team Members ---
const API_URL_TEAM = `${API_BASE_URL}/team-members`;

export const getTeamMembers = async (groupBy = '') => {
    const response = await axios.get(`${API_URL_TEAM}${groupBy ? `?groupBy=${groupBy}` : ''}`);
    return response.data;
};

export const createTeamMember = async (data) => {
    const response = await axios.post(API_URL_TEAM, data);
    return response.data;
};

export const updateTeamMember = async (id, data) => {
    const response = await axios.put(`${API_URL_TEAM}/${id}`, data);
    return response.data;
};

export const deleteTeamMember = async (id) => {
    const response = await axios.delete(`${API_URL_TEAM}/${id}`);
    return response.data;
};

// --- Travel Packages ---
const API_URL_TRAVEL = `${API_BASE_URL}/travel-packages`;

export const getTravelPackages = async () => {
    const response = await axios.get(API_URL_TRAVEL);
    return response.data;
};

export const createTravelPackage = async (formData) => {
    const response = await axios.post(API_URL_TRAVEL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateTravelPackage = async (id, formData) => {
    const response = await axios.put(`${API_URL_TRAVEL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteTravelPackage = async (id) => {
    const response = await axios.delete(`${API_URL_TRAVEL}/${id}`);
    return response.data;
};

// --- Travel Inquiries ---
const API_URL_TRAVEL_INQUIRY = `${API_BASE_URL}/travel-inquiries`;

export const getTravelInquiries = async () => {
    const response = await axios.get(API_URL_TRAVEL_INQUIRY);
    return response.data;
};

export const getTravelInquiryStats = async () => {
    const response = await axios.get(`${API_URL_TRAVEL_INQUIRY}/stats`);
    return response.data;
};

// --- Forms ---
const API_URL_FORMS = `${API_BASE_URL}/forms`;

export const getForms = async () => {
    const response = await axios.get(API_URL_FORMS);
    return response.data;
};

export const getFormById = async (id) => {
    const response = await axios.get(`${API_URL_FORMS}/${id}`);
    return response.data;
};

export const createForm = async (formData) => {
    const response = await axios.post(API_URL_FORMS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateForm = async (id, formData) => {
    const response = await axios.put(`${API_URL_FORMS}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteForm = async (id) => {
    const response = await axios.delete(`${API_URL_FORMS}/${id}`);
    return response.data;
};

// --- Documents ---
const API_URL_DOCUMENTS = `${API_BASE_URL}/documents`;

export const getDocuments = async (formId = '') => {
    const response = await axios.get(`${API_URL_DOCUMENTS}${formId ? `?formId=${formId}` : ''}`);
    return response.data;
};

export const getDocumentById = async (id) => {
    const response = await axios.get(`${API_URL_DOCUMENTS}/${id}`);
    return response.data;
};

export const createDocument = async (data) => {
    const response = await axios.post(API_URL_DOCUMENTS, data);
    return response.data;
};

export const updateDocument = async (id, data) => {
    const response = await axios.put(`${API_URL_DOCUMENTS}/${id}`, data);
    return response.data;
};

export const deleteDocument = async (id) => {
    const response = await axios.delete(`${API_URL_DOCUMENTS}/${id}`);
    return response.data;
};

// --- FAQs ---
const API_URL_FAQS = `${API_BASE_URL}/faqs`;

export const getFAQs = async (formId = '') => {
    const response = await axios.get(`${API_URL_FAQS}${formId ? `?formId=${formId}` : ''}`);
    return response.data;
};

export const getFAQById = async (id) => {
    const response = await axios.get(`${API_URL_FAQS}/${id}`);
    return response.data;
};

export const createFAQ = async (data) => {
    const response = await axios.post(API_URL_FAQS, data);
    return response.data;
};

export const updateFAQ = async (id, data) => {
    const response = await axios.put(`${API_URL_FAQS}/${id}`, data);
    return response.data;
};

export const deleteFAQ = async (id) => {
    const response = await axios.delete(`${API_URL_FAQS}/${id}`);
    return response.data;
};

// --- Content Sections ---
const API_URL_CONTENT_SECTIONS = `${API_BASE_URL}/content-sections`;

export const getContentSections = async (formId = '') => {
    const response = await axios.get(`${API_URL_CONTENT_SECTIONS}${formId ? `?formId=${formId}` : ''}`);
    return response.data;
};

export const getContentSectionById = async (id) => {
    const response = await axios.get(`${API_URL_CONTENT_SECTIONS}/${id}`);
    return response.data;
};

export const createContentSection = async (formData) => {
    const response = await axios.post(API_URL_CONTENT_SECTIONS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateContentSection = async (id, formData) => {
    const response = await axios.put(`${API_URL_CONTENT_SECTIONS}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteContentSection = async (id) => {
    const response = await axios.delete(`${API_URL_CONTENT_SECTIONS}/${id}`);
    return response.data;
};

// --- Pricing Plans ---
const API_URL_PRICING_PLANS = `${API_BASE_URL}/pricing-plans`;

export const getPricingPlans = async (formId = '') => {
    const response = await axios.get(`${API_URL_PRICING_PLANS}${formId ? `?formId=${formId}` : ''}`);
    return response.data;
};

export const getPricingPlanById = async (id) => {
    const response = await axios.get(`${API_URL_PRICING_PLANS}/${id}`);
    return response.data;
};

export const createPricingPlan = async (data) => {
    const response = await axios.post(API_URL_PRICING_PLANS, data);
    return response.data;
};

export const updatePricingPlan = async (id, data) => {
    const response = await axios.put(`${API_URL_PRICING_PLANS}/${id}`, data);
    return response.data;
};

export const deletePricingPlan = async (id) => {
    const response = await axios.delete(`${API_URL_PRICING_PLANS}/${id}`);
    return response.data;
};

// --- Form Images ---
const API_URL_FORM_IMAGES = `${API_BASE_URL}/form-images`;

export const getFormImages = async (formId = '') => {
    const response = await axios.get(`${API_URL_FORM_IMAGES}${formId ? `?formId=${formId}` : ''}`);
    return response.data;
};

export const getFormImageById = async (id) => {
    const response = await axios.get(`${API_URL_FORM_IMAGES}/${id}`);
    return response.data;
};

export const getFormImagesBySlug = async (slug) => {
    const response = await axios.get(`${API_URL_FORM_IMAGES}/by-slug/${slug}`);
    return response.data;
};

export const createFormImage = async (formData) => {
    const response = await axios.post(API_URL_FORM_IMAGES, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateFormImage = async (id, formData) => {
    const response = await axios.put(`${API_URL_FORM_IMAGES}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteFormImage = async (id) => {
    const response = await axios.delete(`${API_URL_FORM_IMAGES}/${id}`);
    return response.data;
};

// --- Form Employees Addresses ---
const API_URL_FORM_EMPLOYEES_ADDRESSES = `${API_BASE_URL}/form-employees-addresses`;

export const getFormEmployeesAddresses = async (FormSlug = '') => {
    const response = await axios.get(`${API_URL_FORM_EMPLOYEES_ADDRESSES}${FormSlug ? `?FormSlug=${FormSlug}` : ''}`);
    return response.data;
};

export const getFormEmployeesAddressById = async (id) => {
    const response = await axios.get(`${API_URL_FORM_EMPLOYEES_ADDRESSES}/${id}`);
    return response.data;
};

export const getFormEmployeesAddressesBySlug = async (slug) => {
    const response = await axios.get(`${API_URL_FORM_EMPLOYEES_ADDRESSES}/by-slug/${slug}`);
    return response.data;
};

export const createFormEmployeesAddress = async (data) => {
    const response = await axios.post(API_URL_FORM_EMPLOYEES_ADDRESSES, data);
    return response.data;
};

export const updateFormEmployeesAddress = async (id, data) => {
    const response = await axios.put(`${API_URL_FORM_EMPLOYEES_ADDRESSES}/${id}`, data);
    return response.data;
};

export const deleteFormEmployeesAddress = async (id) => {
    const response = await axios.delete(`${API_URL_FORM_EMPLOYEES_ADDRESSES}/${id}`);
    return response.data;
};

// --- Form Submissions ---
const API_URL_FORM_SUBMISSIONS = `${API_BASE_URL}/form-submissions`;

export const getFormSubmissionStats = async () => {
    const response = await axios.get(`${API_URL_FORM_SUBMISSIONS}/stats`);
    return response.data;
};

export const getTodayFormSubmissions = async () => {
    const response = await axios.get(`${API_URL_FORM_SUBMISSIONS}/today`);
    return response.data;
};
