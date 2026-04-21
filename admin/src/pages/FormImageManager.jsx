import { useState, useEffect } from 'react';
import { getFormImages, createFormImage, updateFormImage, deleteFormImage, getForms } from '../services/api';

const FormImageManager = () => {
    const [formImages, setFormImages] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormSlug, setSelectedFormSlug] = useState('');
    const [formData, setFormData] = useState({
        formId: '',
        title: '',
        images: [],
        isActive: true
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchFormImages();
    }, []);

    useEffect(() => {
        fetchFormImages();
    }, [selectedFormSlug]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchFormImages = async () => {
        try {
            const data = await getFormImages(selectedFormSlug);
            setFormImages(data);
        } catch (error) {
            console.error('Error fetching form images:', error);
            alert('Failed to fetch Page images');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.formId) {
            alert('Please select a form');
            return;
        }
        if (!formData.title) {
            alert('Please enter a title');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('formId', formData.formId);
            data.append('title', formData.title);
            data.append('isActive', formData.isActive);

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
                await updateFormImage(editingId, data);
                alert('Page image updated successfully');
            } else {
                await createFormImage(data);
                alert('Page image created successfully');
            }
            fetchFormImages();
            resetForm();
        } catch (error) {
            console.error('Error saving form image:', error);
            alert('Failed to save Page image');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Page image entry?')) return;
        try {
            await deleteFormImage(id);
            alert('Page image deleted successfully');
            fetchFormImages();
        } catch (error) {
            console.error('Error deleting form image:', error);
            alert('Failed to delete Page image');
        }
    };

    const handleEdit = (item) => {
        const itemImages = item.images || [];
        setFormData({
            formId: item.formId,
            title: item.title,
            images: itemImages,
            isActive: item.isActive
        });
        setImagePreviews(itemImages);
        setEditingId(item._id);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;

        const currentCount = formData.images.length;
        const remainingSlots = 10 - currentCount;

        if (remainingSlots <= 0) {
            alert('Maximum 10 images allowed.');
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
        // Reset file input to allow selecting same file again
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
            formId: '',
            title: '',
            images: [],
            isActive: true
        });
        setImagePreviews([]);
        setFileInputKey(prev => prev + 1);
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        resetForm();
        // Pre-select form if filter is active
        const selectedForm = forms.find(f => f.slug === selectedFormSlug);
        if (selectedForm) {
            setFormData(prev => ({ ...prev, formId: selectedForm.slug }));
        }
        setShowModal(true);
    };

    const getFormName = (slug) => {
        const form = forms.find(f => f.slug === slug);
        return form?.name || slug;
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
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Page Images</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add Page Image
                </button>
            </div>

            {/* Filter by Form */}
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '1rem' }}>Filter by Form:</label>
                <select
                    value={selectedFormSlug}
                    onChange={(e) => setSelectedFormSlug(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', minWidth: '250px' }}
                >
                    <option value="">All Forms</option>
                    {forms.map((form) => (
                        <option key={form._id} value={form.slug}>{form.name}</option>
                    ))}
                </select>
            </div>

            {/* Form Images Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {formImages.map((item) => (
                    <div key={item._id} style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* Image Gallery Preview */}
                        <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
                            {item.images && item.images.length > 0 ? (
                                <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
                                    {item.images.slice(0, 4).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${img}`}
                                            alt={`${item.title} ${idx + 1}`}
                                            style={{
                                                flex: 1,
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRight: idx < Math.min(item.images.length, 4) - 1 ? '2px solid white' : 'none'
                                            }}
                                        />
                                    ))}
                                    {item.images.length > 4 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem'
                                        }}>
                                            +{item.images.length - 4} more
                                        </div>
                                    )}
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
                            <span style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: item.isActive ? '#28a745' : '#dc3545',
                                color: 'white',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.75rem'
                            }}>
                                {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {item.images && item.images.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem'
                                }}>
                                    {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#333' }}>
                                {item.title}
                            </h4>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.75rem'
                            }}>
                                <span style={{
                                    backgroundColor: '#e9ecef',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: '#495057'
                                }}>
                                    Form: {item.form?.name || getFormName(item.formId)}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#6c757d',
                                    fontStyle: 'italic'
                                }}>
                                    ({item.formId})
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                borderTop: '1px solid #eee',
                                paddingTop: '0.75rem',
                                marginTop: '0.5rem'
                            }}>
                                <button
                                    onClick={() => handleEdit(item)}
                                    style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000', padding: '0.35rem 0.75rem' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.35rem 0.75rem', marginRight: 0 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {formImages.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        padding: '3rem',
                        textAlign: 'center',
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        No form images found. Click "Add Form Image" to create one.
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
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Form Image' : 'Add Form Image'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Form (Slug) *</label>
                                <select
                                    value={formData.formId}
                                    onChange={(e) => setFormData({ ...formData, formId: e.target.value })}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select a Form</option>
                                    {forms.map((form) => (
                                        <option key={form._id} value={form.slug}>{form.name} ({form.slug})</option>
                                    ))}
                                </select>
                                <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                                    Images will be linked to this form via its slug
                                </small>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="Image gallery title"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Images (Max 10) - {formData.images.length}/10 selected
                                </label>
                                <input
                                    key={fileInputKey}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={inputStyle}
                                    disabled={formData.images.length >= 10}
                                />

                                {imagePreviews.length > 0 && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '0.5rem',
                                        marginTop: '0.5rem'
                                    }}>
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img
                                                    src={preview.startsWith('blob:') ? preview : `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${preview}`}
                                                    alt={`Preview ${idx + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '70px',
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
                                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormImageManager;
