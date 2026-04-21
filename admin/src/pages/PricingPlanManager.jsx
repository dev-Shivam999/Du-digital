import { useState, useEffect } from 'react';
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan, getForms } from '../services/api';

const PricingPlanManager = () => {
    const [plans, setPlans] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState('');
    const [formData, setFormData] = useState({
        formId: '',
        planName: '',
        description: '',
        price: '',
        features: [''],
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchPlans();
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [selectedFormId]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchPlans = async () => {
        try {
            const data = await getPricingPlans(selectedFormId);
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            alert('Failed to fetch pricing plans');
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
            const dataToSend = {
                ...formData,
                features: formData.features.filter(f => f.trim() !== '')
            };
            
            if (editingId) {
                await updatePricingPlan(editingId, dataToSend);
                alert('Pricing plan updated successfully');
            } else {
                await createPricingPlan(dataToSend);
                alert('Pricing plan created successfully');
            }
            fetchPlans();
            resetForm();
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Failed to save pricing plan');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this pricing plan?')) return;
        try {
            await deletePricingPlan(id);
            alert('Pricing plan deleted successfully');
            fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete pricing plan');
        }
    };

    const handleEdit = (plan) => {
        setFormData({
            formId: plan.formId?._id || plan.formId,
            planName: plan.planName,
            description: plan.description || '',
            price: plan.price,
            features: plan.features?.length > 0 ? plan.features : [''],
            isActive: plan.isActive
        });
        setEditingId(plan._id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            formId: selectedFormId || '',
            planName: '',
            description: '',
            price: '',
            features: [''],
            isActive: true
        });
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        resetForm();
        setFormData(prev => ({ ...prev, formId: selectedFormId || '' }));
        setShowModal(true);
    };

    // Feature management
    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const updateFeature = (index, value) => {
        const updated = [...formData.features];
        updated[index] = value;
        setFormData({ ...formData, features: updated });
    };

    const removeFeature = (index) => {
        const updated = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: updated.length > 0 ? updated : [''] });
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
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Pricing Plans</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add Plan
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

            {/* Plans Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {plans.map((plan) => (
                    <div key={plan._id} style={{ 
                        border: '2px solid',
                        borderColor: plan.isActive ? '#007bff' : '#dee2e6',
                        borderRadius: '12px', 
                        backgroundColor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{ 
                            padding: '1.5rem', 
                            textAlign: 'center',
                            backgroundColor: plan.isActive ? '#007bff' : '#6c757d',
                            color: 'white'
                        }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem' }}>{plan.planName}</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{plan.price}</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
                                {plan.formId?.name || 'N/A'}
                            </div>
                        </div>
                        
                        {/* Description */}
                        {plan.description && (
                            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{plan.description}</p>
                            </div>
                        )}
                        
                        {/* Features */}
                        <div style={{ padding: '1rem', flex: 1 }}>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {plan.features?.map((feature, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem', color: '#333' }}>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Actions */}
                        <div style={{ 
                            padding: '1rem', 
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <button
                                onClick={() => handleEdit(plan)}
                                style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(plan._id)}
                                style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', marginRight: 0 }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {plans.length === 0 && (
                    <div style={{ 
                        gridColumn: '1 / -1',
                        padding: '3rem', 
                        textAlign: 'center', 
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        No pricing plans found. Click "Add Plan" to create one.
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
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</h3>
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
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Plan Name *</label>
                                    <input
                                        type="text"
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                        style={inputStyle}
                                        required
                                        placeholder="e.g., Standard, Premium"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price *</label>
                                <input
                                    type="text"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="e.g., ₹1499 or $99/month"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '60px' }}
                                    placeholder="Brief description of this plan"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontWeight: 'bold' }}>Features</label>
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    >
                                        + Add Feature
                                    </button>
                                </div>
                                {formData.features.map((feature, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(idx, e.target.value)}
                                            style={{ ...inputStyle, flex: 1 }}
                                            placeholder={`Feature ${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.25rem 0.5rem', marginRight: 0 }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
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
                                    {loading ? 'Saving...' : (editingId ? 'Update Plan' : 'Create Plan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingPlanManager;
