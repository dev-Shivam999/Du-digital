import { useState, useEffect } from 'react';
import { getForms, getFormById, createForm, updateForm, deleteForm } from '../services/api';

const FIELD_TYPES = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Select (Dropdown)' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Buttons' }
];

const FormManager = () => {
    const [forms, setForms] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        isActive: true,
        fields: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
            alert('Failed to fetch Pages Data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create FormData for multipart upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('slug', formData.slug);
            submitData.append('description', formData.description);
            submitData.append('isActive', formData.isActive);
            submitData.append('fields', JSON.stringify(formData.fields));

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (editingId) {
                await updateForm(editingId, submitData);
                alert('Form updated successfully');
            } else {
                await createForm(submitData);
                alert('Form created successfully');
            }
            fetchForms();
            resetForm();
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save form');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this form? All fields will also be deleted.')) return;
        try {
            await deleteForm(id);
            alert('Form deleted successfully');
            fetchForms();
        } catch (error) {
            console.error('Error deleting form:', error);
            alert('Failed to delete form');
        }
    };

    const handleEdit = async (formId) => {
        try {
            const data = await getFormById(formId);
            setFormData({
                name: data.name,
                slug: data.slug || '',
                description: data.description || '',
                image: data.image || '',
                isActive: data.isActive,
                fields: data.fields || []
            });
            setImagePreview(data.image ? `${import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api'}${data.image}` : '');
            setImageFile(null);
            setEditingId(formId);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching form:', error);
            alert('Failed to load form');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            image: '',
            isActive: true,
            fields: []
        });
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
        setShowModal(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Field management functions
    const addField = () => {
        const newField = {
            label: '',
            name: '',
            type: 'text',
            placeholder: '',
            required: false,
            options: [],
            isActive: true,
            parentField: null,
            order: formData.fields.length
        };
        setFormData({ ...formData, fields: [...formData.fields, newField] });
    };

    const updateField = (index, key, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[index] = { ...updatedFields[index], [key]: value };

        // Auto-generate field name from label
        if (key === 'label') {
            updatedFields[index].name = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }

        setFormData({ ...formData, fields: updatedFields });
    };

    const removeField = (index) => {
        const updatedFields = formData.fields.filter((_, i) => i !== index);
        // Update order
        updatedFields.forEach((field, i) => field.order = i);
        setFormData({ ...formData, fields: updatedFields });
    };

    const moveField = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= formData.fields.length) return;

        const updatedFields = [...formData.fields];
        [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
        updatedFields.forEach((field, i) => field.order = i);
        setFormData({ ...formData, fields: updatedFields });
    };

    // Option management for select/radio fields
    const addOption = (fieldIndex) => {
        const updatedFields = [...formData.fields];
        if (!updatedFields[fieldIndex].options) {
            updatedFields[fieldIndex].options = [];
        }
        updatedFields[fieldIndex].options.push({
            id: Date.now().toString(), // Simple unique ID generation
            label: '',
            value: '',
            connectId: ''
        });
        setFormData({ ...formData, fields: updatedFields });
    };

    const updateOption = (fieldIndex, optionIndex, key, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[fieldIndex].options[optionIndex][key] = value;

        // Auto-generate value from label
        if (key === 'label') {
            updatedFields[fieldIndex].options[optionIndex].value = value.toLowerCase().replace(/\s+/g, '_');
        }

        setFormData({ ...formData, fields: updatedFields });
    };

    const removeOption = (fieldIndex, optionIndex) => {
        const updatedFields = [...formData.fields];
        updatedFields[fieldIndex].options = updatedFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
        setFormData({ ...formData, fields: updatedFields });
    };

    // Helper to get potential parent fields (select/radio fields that are NOT this field)
    const getPotentialParents = (currentFieldIndex) => {
        return formData.fields.filter((f, i) =>
            i !== currentFieldIndex &&
            (f.type === 'select' || f.type === 'dropdown' || f.type === 'radio') &&
            f.name // Parent must have a name
        );
    };

    // Helper to get options from the selected parent field
    const getParentOptions = (parentFieldName) => {
        const parent = formData.fields.find(f => f.name === parentFieldName);
        return parent ? parent.options : [];
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
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Page Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Create New Page
                </button>
            </div>

            {/* Forms Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Image</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Slug</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Fields</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form) => (
                            <tr key={form._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '1rem' }}>
                                    {form.image ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api'}${form.image}`}
                                            alt={form.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            backgroundColor: '#e9ecef',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#666',
                                            fontSize: '0.75rem'
                                        }}>
                                            No img
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>{form.name}</td>
                                <td style={{ padding: '1rem', color: '#666' }}>{form.slug}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        backgroundColor: '#e9ecef',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {form.fieldCount || 0} fields
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        backgroundColor: form.isActive ? '#d4edda' : '#f8d7da',
                                        color: form.isActive ? '#155724' : '#721c24',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {form.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleEdit(form._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(form._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {forms.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    No forms found. Click "Create New Form" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                        maxWidth: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Form' : 'Create New Form'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Form Details */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Page Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            name: e.target.value,
                                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                                        })}
                                        style={inputStyle}
                                        required
                                        placeholder="e.g., Contact Form"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        style={inputStyle}
                                        placeholder="contact-form"
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '60px' }}
                                        placeholder="Optional description for this form"
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Page Image</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                style={{ ...inputStyle, padding: '0.35rem' }}
                                            />
                                            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                                                Upload an image for this Page (optional)
                                            </p>
                                        </div>
                                        {imagePreview && (
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                border: '1px solid #ddd'
                                            }}>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span style={{ fontWeight: 'bold' }}>Active</span>
                                    </label>
                                </div>
                            </div>

                            {/* Fields Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0 }}>Form Fields</h4>
                                    <button
                                        type="button"
                                        onClick={addField}
                                        style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
                                    >
                                        + Add Field
                                    </button>
                                </div>

                                {formData.fields.length === 0 ? (
                                    <div style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        color: '#666'
                                    }}>
                                        No fields added yet. Click "Add Field" to start building your form.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {formData.fields.map((field, index) => (
                                            <div key={index} style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                backgroundColor: '#fff'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#666' }}>Field #{index + 1}</span>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveField(index, -1)}
                                                            disabled={index === 0}
                                                            style={{ ...buttonStyle, backgroundColor: '#e9ecef', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveField(index, 1)}
                                                            disabled={index === formData.fields.length - 1}
                                                            style={{ ...buttonStyle, backgroundColor: '#e9ecef', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeField(index)}
                                                            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.25rem 0.5rem' }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Label *</label>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateField(index, 'label', e.target.value)}
                                                            style={inputStyle}
                                                            required
                                                            placeholder="Full Name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Name (API)</label>
                                                        <input
                                                            type="text"
                                                            value={field.name}
                                                            onChange={(e) => updateField(index, 'name', e.target.value)}
                                                            style={{ ...inputStyle, backgroundColor: '#f8f9fa' }}
                                                            placeholder="full_name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Type *</label>
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) => updateField(index, 'type', e.target.value)}
                                                            style={inputStyle}
                                                        >
                                                            {FIELD_TYPES.map(t => (
                                                                <option key={t.value} value={t.value}>{t.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Placeholder</label>
                                                        <input
                                                            type="text"
                                                            value={field.placeholder || ''}
                                                            onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                                                            style={inputStyle}
                                                            placeholder="Enter your name..."
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem' }}>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                            />
                                                            <span style={{ fontSize: '0.85rem' }}>Required</span>
                                                        </label>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={field.isActive}
                                                                onChange={(e) => updateField(index, 'isActive', e.target.checked)}
                                                            />
                                                            <span style={{ fontSize: '0.85rem' }}>Active</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Parent Field Selection for Cascading Dropdowns */}
                                                {(field.type === 'select' || field.type === 'dropdown') && (
                                                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                                                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                            Parent Field (Optional - for dependent dropdowns)
                                                        </label>
                                                        <select
                                                            value={field.parentField || ''}
                                                            onChange={(e) => updateField(index, 'parentField', e.target.value)}
                                                            style={{ ...inputStyle, width: '100%' }}
                                                        >
                                                            <option value="">-- Independent Dropdown --</option>
                                                            {getPotentialParents(index).map((p, pIdx) => (
                                                                <option key={pIdx} value={p.name}>
                                                                    {p.label} ({p.name})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#666' }}>
                                                            Select a field that this dropdown depends on (e.g., Select "Country" for a "State" dropdown).
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Options for select/radio types */}
                                                {(field.type === 'select' || field.type === 'radio') && (
                                                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Options</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => addOption(index)}
                                                                style={{ ...buttonStyle, backgroundColor: '#17a2b8', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                            >
                                                                + Add Option
                                                            </button>
                                                        </div>
                                                        {field.options?.map((option, optIdx) => (
                                                            <div key={optIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                <input
                                                                    type="text"
                                                                    value={option.label}
                                                                    onChange={(e) => updateOption(index, optIdx, 'label', e.target.value)}
                                                                    style={{ ...inputStyle, flex: 1 }}
                                                                    placeholder="Option Label"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={option.value}
                                                                    onChange={(e) => updateOption(index, optIdx, 'value', e.target.value)}
                                                                    style={{ ...inputStyle, flex: 1, backgroundColor: '#fff' }}
                                                                    placeholder="option_value"
                                                                />

                                                                {/* Connect to Parent Option */}
                                                                {field.parentField && (
                                                                    <select
                                                                        value={option.connectId || ''}
                                                                        onChange={(e) => updateOption(index, optIdx, 'connectId', e.target.value)}
                                                                        style={{ ...inputStyle, flex: 1, backgroundColor: '#fff3cd' }}
                                                                    >
                                                                        <option value="">-- Connect to {field.parentField} --</option>
                                                                        {getParentOptions(field.parentField)?.map((pOpt, poIdx) => (
                                                                            <option key={poIdx} value={pOpt.id || pOpt.value}>
                                                                                {pOpt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOption(index, optIdx)}
                                                                    style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.25rem 0.5rem' }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {(!field.options || field.options.length === 0) && (
                                                            <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                                                                No options added. Click "Add Option" to add choices.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modal Actions */}
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
                                    {loading ? 'Saving...' : (editingId ? 'Update Form' : 'Create Form')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormManager;
