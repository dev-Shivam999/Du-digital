import { useState, useEffect } from 'react';
import { getDocuments, createDocument, updateDocument, deleteDocument, getForms } from '../services/api';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState('');
    const [formData, setFormData] = useState({
        formId: '',
        title: '',
        description: '',
        applicableFor: '',
        isMandatory: true,
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchForms();
        fetchDocuments();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [selectedFormId]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const data = await getDocuments(selectedFormId);
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            alert('Failed to fetch documents');
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
                await updateDocument(editingId, formData);
                alert('Document updated successfully');
            } else {
                await createDocument(formData);
                alert('Document created successfully');
            }
            fetchDocuments();
            resetForm();
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document requirement?')) return;
        try {
            await deleteDocument(id);
            alert('Document deleted successfully');
            fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
    };

    const handleEdit = (doc) => {
        setFormData({
            formId: doc.formId?._id || doc.formId,
            title: doc.title,
            description: doc.description || '',
            applicableFor: doc.applicableFor || '',
            isMandatory: doc.isMandatory,
            isActive: doc.isActive
        });
        setEditingId(doc._id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            formId: selectedFormId || '',
            title: '',
            description: '',
            applicableFor: '',
            isMandatory: true,
            isActive: true
        });
        setEditingId(null);
        setShowModal(false);
    };

    const openCreateModal = () => {
        setFormData({
            formId: selectedFormId || '',
            title: '',
            description: '',
            applicableFor: '',
            isMandatory: true,
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
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Document Requirements</h2>
                <button
                    onClick={openCreateModal}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add Document
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

            {/* Documents Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Title</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Form</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Applicable For</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Mandatory</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '500' }}>{doc.title}</div>
                                    {doc.description && (
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{doc.description}</div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', color: '#666' }}>{doc.formId?.name || 'N/A'}</td>
                                <td style={{ padding: '1rem', color: '#666' }}>{doc.applicableFor || '-'}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{ 
                                        backgroundColor: doc.isMandatory ? '#fff3cd' : '#e9ecef',
                                        color: doc.isMandatory ? '#856404' : '#6c757d',
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '12px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {doc.isMandatory ? 'Required' : 'Optional'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{ 
                                        backgroundColor: doc.isActive ? '#d4edda' : '#f8d7da',
                                        color: doc.isActive ? '#155724' : '#721c24',
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '12px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {doc.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleEdit(doc)}
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {documents.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    No document requirements found. Click "Add Document" to create one.
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
                        maxWidth: '600px', 
                        maxHeight: '90vh', 
                        overflowY: 'auto' 
                    }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Document' : 'Add Document Requirement'}</h3>
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
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="e.g., Passport Bio Page"
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '80px' }}
                                    placeholder="e.g., Clear scanned copy of passport bio page"
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Applicable For</label>
                                <input
                                    type="text"
                                    value={formData.applicableFor}
                                    onChange={(e) => setFormData({ ...formData, applicableFor: e.target.value })}
                                    style={inputStyle}
                                    placeholder="e.g., Tourist eVisa, Business eVisa"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isMandatory}
                                        onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                                    />
                                    <span style={{ fontWeight: 'bold' }}>Mandatory</span>
                                </label>
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

export default DocumentManager;
