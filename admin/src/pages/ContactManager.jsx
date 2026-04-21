import { useState, useEffect } from 'react';
import { getContentSections, createContentSection, updateContentSection, deleteContentSection, getForms } from '../services/api';

const LAYOUT_OPTIONS = [
    { value: 'LEFT_TEXT_RIGHT_IMAGE', label: 'Text Left, Image Right' },
    { value: 'RIGHT_TEXT_LEFT_IMAGE', label: 'Image Left, Text Right' }
];

const ContentSectionManager = () => {
    const [sections, setSections] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState('');
    const [formData, setFormData] = useState({
        formId: '',
        sectionKey: '',
        title: '',
        contentHtml: '',
        images: [],
        badgeText: '',
        badgeBackground: '#007bff',
        layout: 'LEFT_TEXT_RIGHT_IMAGE',
        isActive: true
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchSections();
    }, []);

    useEffect(() => {
        fetchSections();
    }, [selectedFormId]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await getContentSections(selectedFormId);
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
            alert('Failed to fetch content sections');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.formId) {
            alert('Please select a form');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('formId', formData.formId);
            data.append('sectionKey', formData.sectionKey);
            data.append('title', formData.title);
            data.append('contentHtml', formData.contentHtml);
            data.append('layout', formData.layout);
            data.append('isActive', formData.isActive);
            
            if (formData.badgeText) {
                data.append('badge[text]', formData.badgeText);
                data.append('badge[background]', formData.badgeBackground);
            }
            
            // Handle multiple images
            const existingImages = [];
            formData.images.forEach((img) => {
                if (img instanceof File) {
                    data.append('images', img);
                } else if (typeof img === 'string' && img) {
                    existingImages.push(img);
                }
            });
            // Send existing image URLs separately
            existingImages.forEach((url) => {
                data.append('existingImages', url);
            });

            if (editingId) {
                await updateContentSection(editingId, data);
                alert('Content section updated successfully');
            } else {
                await createContentSection(data);
                alert('Content section created successfully');
            }
            fetchSections();
            resetForm();
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Failed to save content section');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this content section?')) return;
        try {
            await deleteContentSection(id);
            alert('Content section deleted successfully');
            fetchSections();
        } catch (error) {
            console.error('Error deleting section:', error);
            alert('Failed to delete content section');
        }
    };

    const handleEdit = (section) => {
        const sectionImages = section.images || (section.image ? [section.image] : []);
        setFormData({
            formId: section.formId?._id || section.formId,
            sectionKey: section.sectionKey,
            title: section.title,
            contentHtml: section.contentHtml,
            images: sectionImages,
            badgeText: section.badge?.text || '',
            badgeBackground: section.badge?.background || '#007bff',
            layout: section.layout,
            isActive: section.isActive
        });
        setImagePreviews(sectionImages);
        setEditingId(section._id);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;
        
        const currentCount = formData.images.length;
        const remainingSlots = 4 - currentCount;
        
        if (remainingSlots <= 0) {
            alert('Maximum 4 images allowed.');
            return;
        }
        
        // Take only as many files as we have slots for
        const filesToAdd = files.slice(0, remainingSlots);
        
        if (files.length > remainingSlots) {
            alert(`Only ${remainingSlots} more image(s) can be added. Adding first ${remainingSlots}.`);
        }
        
        const newImages = [...formData.images, ...filesToAdd];
        const newPreviews = [...imagePreviews, ...filesToAdd.map(f => URL.createObjectURL(f))];
        
        setFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
        // Reset file input to allow selecting same file again or one-by-one selection
        setFileInputKey(prev => prev + 1);
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);
    };

    const resetForm = () => {
        setFormData({
            formId: selectedFormId || '',
            sectionKey: '',
            title: '',
            contentHtml: '',
            images: [],
            badgeText: '',
            badgeBackground: '#007bff',
            layout: 'LEFT_TEXT_RIGHT_IMAGE',
            isActive: true
        });
        setImagePreviews([]);
        setFileInputKey(prev => prev + 1);
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        resetForm();
        setFormData(prev => ({ ...prev, formId: selectedFormId || '' }));
        setShowModal(true);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '0.9rem'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginRight: '0.5rem'
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Content Sections</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add Section
                </button>
            </div>

            {/* Filter by Form */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>Filter by Form:</label>
                <select
                    value={selectedFormId}
                    onChange={(e) => setSelectedFormId(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', minWidth: '250px' }}
                >
                    <option value="">All Forms</option>
                    {forms.map((form) => (
                        <option key={form._id} value={form._id}>{form.name}</option>
                    ))}
                </select>
            </div>

            {/* Sections Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {sections.map((section) => (
                    <div key={section._id} style={{ 
                        border: '1px solid #dee2e6', 
                        borderRadius: '12px', 
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* Image Preview */}
                        <div style={{ position: 'relative', height: '180px', backgroundColor: '#f0f0f0' }}>
                            {(section.images && section.images.length > 0) || section.image ? (
                                <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
                                    {(section.images || [section.image]).filter(Boolean).slice(0, 4).map((img, idx) => (
                                        <img 
                                            key={idx}
                                            src={`${import.meta.env.VITE_API_BASE_URL.replace("/api","")}${img}`} 
                                            alt={`${section.title} ${idx + 1}`}
                                            style={{ 
                                                flex: 1, 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                borderRight: idx < (section.images || [section.image]).length - 1 ? '2px solid white' : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ 
                                    width: '100%', height: '100%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    No Images
                                </div>
                            )}
                            {section.badge?.text && (
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    backgroundColor: section.badge.background || '#007bff',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {section.badge.text}
                                </span>
                            )}
                            <span style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: section.isActive ? '#28a745' : '#dc3545',
                                color: 'white',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.75rem'
                            }}>
                                {section.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        {/* Content */}
                        <div style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ 
                                    backgroundColor: '#e9ecef', 
                                    padding: '0.15rem 0.5rem', 
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    color: '#666'
                                }}>
                                    {section.sectionKey}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {section.formId?.name || 'N/A'}
                                </span>
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#333' }}>
                                {section.title}
                            </h4>
                            <p style={{ 
                                margin: '0 0 0.75rem', 
                                color: '#666', 
                                fontSize: '0.85rem', 
                                lineHeight: '1.4',
                                maxHeight: '60px',
                                overflow: 'hidden'
                            }}>
                                {section.contentHtml.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </p>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                borderTop: '1px solid #eee',
                                paddingTop: '0.75rem',
                                marginTop: '0.5rem'
                            }}>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                                    Layout: {section.layout === 'LEFT_TEXT_RIGHT_IMAGE' ? '← Text | Image →' : '← Image | Text →'}
                                </span>
                                <div>
                                    <button
                                        onClick={() => handleEdit(section)}
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000', padding: '0.35rem 0.75rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(section._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.35rem 0.75rem', marginRight: 0 }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {sections.length === 0 && (
                    <div style={{ 
                        gridColumn: '1 / -1',
                        padding: '3rem', 
                        textAlign: 'center', 
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        No content sections found. Click "Add Section" to create one.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        padding: '2rem', 
                        borderRadius: '8px', 
                        width: '90%', 
                        maxWidth: '800px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto' 
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Content Section' : 'Add Content Section'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Form *</label>
                                    <select
                                        value={formData.formId}
                                        onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
                                        style={inputStyle}
                                        required
                                    >
                                        <option value="">Select a Form</option>
                                        {forms.map((form) => (
                                            <option key={form._id} value={form._id}>{form.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Section Key *</label>
                                    <input
                                        type="text"
                                        value={formData.sectionKey}
                                        onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value })}
                                        style={inputStyle}
                                        required
                                        placeholder="e.g., explore-india"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="Section title"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content (HTML) *</label>
                                <textarea
                                    value={formData.contentHtml}
                                    onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '150px', fontFamily: 'monospace' }}
                                    required
                                    placeholder="<p>Your content here...</p>"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Images (Max 4) - {formData.images.length}/4 selected
                                </label>
                                <input
                                    key={fileInputKey}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={inputStyle}
                                    disabled={formData.images.length >= 4}
                                />
                                
                                {imagePreviews.length > 0 && (
                                    <div style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: 'repeat(4, 1fr)', 
                                        gap: '0.5rem', 
                                        marginTop: '0.5rem' 
                                    }}>
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img 
                                                    src={preview} 
                                                    alt={`Preview ${idx + 1}`} 
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '80px', 
                                                        objectFit: 'cover', 
                                                        borderRadius: '4px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Layout</label>
                                    <select
                                        value={formData.layout}
                                        onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                                        style={inputStyle}
                                    >
                                        {LAYOUT_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Badge Text</label>
                                    <input
                                        type="text"
                                        value={formData.badgeText}
                                        onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Optional badge text"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Badge Color</label>
                                    <input
                                        type="color"
                                        value={formData.badgeBackground}
                                        onChange={(e) => setFormData({ ...formData, badgeBackground: e.target.value })}
                                        style={{ ...inputStyle, height: '38px', padding: '2px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span style={{ fontWeight: 'bold' }}>Active</span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
                                >
                                    {loading ? 'Saving...' : (editingId ? 'Update Section' : 'Create Section')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentSectionManager;
