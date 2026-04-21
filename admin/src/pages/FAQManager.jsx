import { useState, useEffect } from 'react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ, getForms } from '../services/api';

const FAQManager = () => {
    const [faqs, setFAQs] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState('');
    const [formData, setFormData] = useState({
        formId: '',
        question: '',
        answer: '',
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchFAQs();
    }, []);

    useEffect(() => {
        fetchFAQs();
    }, [selectedFormId]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchFAQs = async () => {
        try {
            const data = await getFAQs(selectedFormId);
            setFAQs(data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            alert('Failed to fetch FAQs');
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
            if (editingId) {
                await updateFAQ(editingId, formData);
                alert('FAQ updated successfully');
            } else {
                await createFAQ(formData);
                alert('FAQ created successfully');
            }
            fetchFAQs();
            resetForm();
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Failed to save FAQ');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await deleteFAQ(id);
            alert('FAQ deleted successfully');
            fetchFAQs();
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete FAQ');
        }
    };

    const handleEdit = (faq) => {
        setFormData({
            formId: faq.formId?._id || faq.formId,
            question: faq.question,
            answer: faq.answer,
            isActive: faq.isActive
        });
        setEditingId(faq._id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            formId: selectedFormId || '',
            question: '',
            answer: '',
            isActive: true
        });
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        setFormData({
            formId: selectedFormId || '',
            question: '',
            answer: '',
            isActive: true
        });
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
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>FAQ Management</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add FAQ
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

            {/* FAQs List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, index) => (
                    <div key={faq._id} style={{ 
                        border: '1px solid #dee2e6', 
                        borderRadius: '8px', 
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            padding: '1rem', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            backgroundColor: faq.isActive ? '#f8f9fa' : '#fff3cd'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ 
                                        backgroundColor: '#007bff', 
                                        color: 'white', 
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        Q{index + 1}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {faq.formId?.name || 'N/A'}
                                    </span>
                                    {!faq.isActive && (
                                        <span style={{ 
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            padding: '0.15rem 0.5rem', 
                                            borderRadius: '10px',
                                            fontSize: '0.75rem'
                                        }}>
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#333' }}>
                                    {faq.question}
                                </h4>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    {faq.answer}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                <button
                                    onClick={() => handleEdit(faq)}
                                    style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000', marginRight: 0 }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(faq._id)}
                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', marginRight: 0 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {faqs.length === 0 && (
                    <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center', 
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        No FAQs found. Click "Add FAQ" to create one.
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
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
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
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Question *</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="e.g., How long does it take to process?"
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Answer *</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '120px' }}
                                    required
                                    placeholder="Enter the answer (can include HTML for formatting)"
                                />
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
                                    {loading ? 'Saving...' : (editingId ? 'Update FAQ' : 'Create FAQ')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQManager;
