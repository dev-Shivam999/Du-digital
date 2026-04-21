import { useState, useEffect } from 'react';
import { getTravelPackages, createTravelPackage, updateTravelPackage, deleteTravelPackage } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api';

const TravelPackageManager = () => {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startingPrice: '',
        isActive: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await getTravelPackages();
            setPackages(data);
        } catch (error) {
            console.error('Error fetching travel packages:', error);
            alert('Failed to fetch travel packages');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('startingPrice', formData.startingPrice);
            data.append('isActive', formData.isActive);
            if (imageFile) {
                data.append('bannerImage', imageFile);
            }

            if (editingId) {
                await updateTravelPackage(editingId, data);
                alert('Travel package updated successfully');
            } else {
                await createTravelPackage(data);
                alert('Travel package added successfully');
            }
            fetchPackages();
            resetForm();
        } catch (error) {
            console.error('Error saving travel package:', error);
            alert('Failed to save travel package');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this travel package?')) return;
        try {
            await deleteTravelPackage(id);
            alert('Travel package deleted successfully');
            fetchPackages();
        } catch (error) {
            console.error('Error deleting travel package:', error);
            alert('Failed to delete travel package');
        }
    };

    const handleEdit = (pkg) => {
        setFormData({
            title: pkg.title || '',
            description: pkg.description || '',
            startingPrice: pkg.startingPrice || '',
            isActive: pkg.isActive !== undefined ? pkg.isActive : true
        });
        setEditingId(pkg._id);
        setImagePreview(pkg.bannerImage ? `${API_BASE_URL}${pkg.bannerImage}` : '');
        setImageFile(null);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', startingPrice: '', isActive: true });
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
        setShowModal(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem'
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
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Travel Package Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white', padding: '0.75rem 1.5rem' }}
                >
                    + Add New Package
                </button>
            </div>

            {/* Grid View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {packages.map((pkg) => (
                    <div key={pkg._id} style={{
                        border: '1px solid #eee',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'white'
                    }}>
                        <div style={{ position: 'relative', height: '180px', backgroundColor: '#f0f0f0' }}>
                            {pkg.bannerImage ? (
                                <img
                                    src={`${API_BASE_URL}${pkg.bannerImage}`}
                                    alt={pkg.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    No Image
                                </div>
                            )}
                            <span style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                backgroundColor: pkg.isActive ? '#28a745' : '#dc3545',
                                color: 'white'
                            }}>
                                {pkg.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#333' }}>{pkg.title}</h3>
                            {pkg.startingPrice && (
                                <p style={{ color: '#007bff', fontWeight: 'bold', margin: '0 0 0.5rem' }}>
                                    Starting from {pkg.startingPrice}
                                </p>
                            )}
                            {pkg.description && (
                                <p style={{
                                    color: '#666', fontSize: '0.9rem', margin: '0 0 1rem',
                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                    {pkg.description.split('\n').join('<br/>')}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(pkg)}
                                    style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000', flex: 1 }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(pkg._id)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', flex: 1 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {packages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <p>No travel packages found. Click "Add New Package" to create one.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{editingId ? 'Edit Package' : 'Add New Package'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <span>Note for title-Days</span>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="Enter package title"
                                />
                            </div>
                            <div>
                                <span>Note for line brake user \n</span>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '100px' }}
                                    placeholder="Enter package description"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Starting Price</label>
                                <input
                                    type="text"
                                    value={formData.startingPrice}
                                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                                    style={inputStyle}
                                    placeholder="e.g., $999 or ₹75,000"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={inputStyle}
                                />
                                {imagePreview && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        style={{ marginRight: '0.5rem', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: 'bold' }}>Active</span>
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white', padding: '0.75rem 1.5rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white', padding: '0.75rem 1.5rem' }}
                                >
                                    {loading ? 'Saving...' : 'Save Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelPackageManager;
