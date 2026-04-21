import { useState, useEffect } from 'react';
import { getFormEmployeesAddresses, createFormEmployeesAddress, updateFormEmployeesAddress, deleteFormEmployeesAddress, getForms } from '../services/api';

const FormEmployeesAddressManager = () => {
    const [addresses, setAddresses] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormSlug, setSelectedFormSlug] = useState('');
    const [formData, setFormData] = useState({
        FormSlug: '',
        Location: '',
        email: '',
        phone: '',
        officeName: 'Main Office',
        Open: 'Monday',
        Close: 'Friday',
        Address: '',
        color: '#007bff'
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchAddresses();
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [selectedFormSlug]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const data = await getFormEmployeesAddresses(selectedFormSlug);
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            alert('Failed to fetch Office addresses');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.FormSlug) {
            alert('Please select a form');
            return;
        }
        if (!formData.Location || !formData.email || !formData.Address || !formData.color) {
            alert('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            if (editingId) {
                await updateFormEmployeesAddress(editingId, formData);
                alert('Address updated successfully');
            } else {
                await createFormEmployeesAddress(formData);
                alert('Address created successfully');
            }
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await deleteFormEmployeesAddress(id);
            alert('Address deleted successfully');
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            FormSlug: item.FormSlug,
            Location: item.Location,
            email: item.email,
            phone: item.phone || '',
            officeName: item.officeName || 'Main Office',
            Open: item.Open || 'Monday',
            Close: item.Close || 'Friday',
            Address: item.Address,
            color: item.color || '#007bff'
        });
        setEditingId(item._id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            FormSlug: '',
            Location: '',
            email: '',
            phone: '',
            officeName: 'Main Office',
            Open: 'Monday',
            Close: 'Friday',
            Address: '',
            color: '#007bff'
        });
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        resetForm();
        // Pre-select form if filter is active
        if (selectedFormSlug) {
            setFormData(prev => ({ ...prev, FormSlug: selectedFormSlug }));
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
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Office Addresses</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add Address
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

            {/* Addresses Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {addresses.map((item) => (
                    <div key={item._id} style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* Color Header */}
                        <div style={{ 
                            height: '8px', 
                            backgroundColor: item.color || '#007bff'
                        }} />
                        
                        {/* Content */}
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>
                                    {item.Location}
                                </h4>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: item.color || '#007bff',
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </div>

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
                                    Form: {item.form?.name || getFormName(item.FormSlug)}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#6c757d',
                                    fontStyle: 'italic'
                                }}>
                                    ({item.FormSlug})
                                </span>
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>🏢</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>{item.officeName || 'Main Office'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>🕐</span>
                                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{item.Open || 'Monday'} - {item.Close || 'Friday'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>📧</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333' }}>{item.email}</span>
                                </div>
                                {item.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>📞</span>
                                        <span style={{ fontSize: '0.9rem', color: '#333' }}>{item.phone}</span>
                                    </div>
                                )}
                            </div>

                            <p style={{ 
                                margin: '0.75rem 0', 
                                color: '#666', 
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                📍 {item.Address}
                            </p>

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
                {addresses.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        padding: '3rem',
                        textAlign: 'center',
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        No addresses found. Click "Add Address" to create one.
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
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Address' : 'Add Address'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Form (Slug) *</label>
                                <select
                                    value={formData.FormSlug}
                                    onChange={(e) => setFormData({ ...formData, FormSlug: e.target.value })}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select a Form</option>
                                    {forms.map((form) => (
                                        <option key={form._id} value={form.slug}>{form.name} ({form.slug})</option>
                                    ))}
                                </select>
                                <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                                    Address will be linked to this form via its slug
                                </small>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location *</label>
                                <input
                                    type="text"
                                    value={formData.Location}
                                    onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="e.g., Head Office, Mumbai Branch"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={inputStyle}
                                        required
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={inputStyle}
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Office Name</label>
                                <input
                                    type="text"
                                    value={formData.officeName}
                                    onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Main Office"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Open (Day)</label>
                                    <input
                                        type="text"
                                        value={formData.Open}
                                        onChange={(e) => setFormData({ ...formData, Open: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Monday"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Close (Day)</label>
                                    <input
                                        type="text"
                                        value={formData.Close}
                                        onChange={(e) => setFormData({ ...formData, Close: e.target.value })}
                                        style={inputStyle}
                                        placeholder="Friday"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Address *</label>
                                <textarea
                                    value={formData.Address}
                                    onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '80px' }}
                                    required
                                    placeholder="Full address..."
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Color *</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        style={{ width: '60px', height: '40px', padding: '2px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        style={{ ...inputStyle, width: '120px' }}
                                        placeholder="#007bff"
                                    />
                                </div>
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

export default FormEmployeesAddressManager;
