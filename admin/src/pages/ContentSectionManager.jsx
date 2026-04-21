import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentSections, createContentSection, deleteContentSection, getForms } from '../services/api';

const ContentSectionManager = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Quick add form state
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddData, setQuickAddData] = useState({
        formId: '',
        sectionKey: '',
        title: ''
    });

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

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        if (!quickAddData.formId || !quickAddData.sectionKey || !quickAddData.title) {
            alert('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('formId', quickAddData.formId);
            data.append('sectionKey', quickAddData.sectionKey);
            data.append('title', quickAddData.title);
            data.append('contentHtml', '');
            data.append('layout', 'LEFT_TEXT_RIGHT_IMAGE');
            data.append('isActive', 'true');

            await createContentSection(data);
            alert('Content section created! You can now edit it to add more details.');
            fetchSections();
            setQuickAddData({ formId: selectedFormId || '', sectionKey: '', title: '' });
            setShowQuickAdd(false);
        } catch (error) {
            console.error('Error creating section:', error);
            alert('Failed to create content section');
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

    const openQuickAdd = () => {
        setQuickAddData({ formId: selectedFormId || '', sectionKey: '', title: '' });
        setShowQuickAdd(true);
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
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={openQuickAdd}
                        style={{ ...buttonStyle, backgroundColor: '#17a2b8', color: 'white' }}
                    >
                        ⚡ Quick Add
                    </button>
                    <button
                        onClick={() => navigate('/content-sections/new')}
                        style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                    >
                        + Add Section
                    </button>
                </div>
            </div>

            {/* Quick Add Inline Form */}
            {showQuickAdd && (
                <div style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1.25rem', 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: '8px',
                    border: '1px solid #90caf9'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, color: '#1565c0' }}>⚡ Quick Add Section</h4>
                        <button
                            type="button"
                            onClick={() => setShowQuickAdd(false)}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                fontSize: '1.5rem', 
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={handleQuickAdd}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Form *</label>
                                <select
                                    value={quickAddData.formId}
                                    onChange={(e) => setQuickAddData({ ...quickAddData, formId: e.target.value })}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Select Form</option>
                                    {forms.map((form) => (
                                        <option key={form._id} value={form._id}>{form.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Section Key *</label>
                                <input
                                    type="text"
                                    value={quickAddData.sectionKey}
                                    onChange={(e) => setQuickAddData({ ...quickAddData, sectionKey: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="e.g., hero-section"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Title *</label>
                                <input
                                    type="text"
                                    value={quickAddData.title}
                                    onChange={(e) => setQuickAddData({ ...quickAddData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="Section title"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white', marginRight: 0 }}
                            >
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                            Creates a section with just title and key. Edit it later to add content, images, and YouTube videos.
                        </p>
                    </form>
                </div>
            )}

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

            {/* Sections Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    backgroundColor: 'white', 
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', width: '50px' }}>#</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', width: '120px' }}>Form</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6', width: '140px' }}>Section Key</th>
                            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Title</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', width: '80px' }}>Media</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', width: '70px' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6', width: '140px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section, index) => (
                            <tr key={section._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '0.75rem 1rem', color: '#666', verticalAlign: 'middle' }}>{index + 1}</td>
                                <td style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                                    <span style={{ 
                                        backgroundColor: '#e9ecef', 
                                        padding: '0.2rem 0.4rem', 
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        display: 'inline-block',
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {section.formId?.name || 'N/A'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', verticalAlign: 'middle' }}>
                                    <code style={{ 
                                        backgroundColor: '#f8f9fa', 
                                        padding: '0.2rem 0.4rem', 
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        display: 'inline-block',
                                        maxWidth: '120px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {section.sectionKey}
                                    </code>
                                </td>
                                <td style={{ 
                                    padding: '0.75rem 1rem', 
                                    fontWeight: '500', 
                                    verticalAlign: 'middle',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {section.title}
                                    {section.badge?.text && (
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            backgroundColor: section.badge.background || '#007bff',
                                            color: 'white',
                                            padding: '0.1rem 0.3rem',
                                            borderRadius: '3px',
                                            fontSize: '0.65rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {section.badge.text}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <div style={{ display: 'flex', gap: '0.15rem', justifyContent: 'center' }}>
                                        {section.images && section.images.length > 0 && (
                                            <span title={`${section.images.length} image(s)`} style={{ fontSize: '0.9rem' }}>🖼️</span>
                                        )}
                                        {section.youtubeUrl && (
                                            <span title="Has YouTube video" style={{ fontSize: '0.9rem' }}>▶️</span>
                                        )}
                                        {section.tableData?.headers?.length > 0 && (
                                            <span title="Has table data" style={{ fontSize: '0.9rem' }}>📊</span>
                                        )}
                                        {(!section.images || section.images.length === 0) && !section.youtubeUrl && !section.tableData?.headers?.length && (
                                            <span style={{ color: '#999', fontSize: '0.75rem' }}>-</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <span style={{ 
                                        backgroundColor: section.isActive ? '#d4edda' : '#f8d7da',
                                        color: section.isActive ? '#155724' : '#721c24',
                                        padding: '0.2rem 0.4rem', 
                                        borderRadius: '10px',
                                        fontSize: '0.75rem'
                                    }}>
                                        {section.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                    <button
                                        onClick={() => navigate(`/content-sections/edit/${section._id}`)}
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(section._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: 0 }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sections.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                    No content sections found. Use "Quick Add" or "Add Section" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stats */}
            <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                display: 'flex',
                gap: '2rem',
                fontSize: '0.9rem',
                color: '#666'
            }}>
                <span>Total Sections: <strong>{sections.length}</strong></span>
                <span>Active: <strong>{sections.filter(s => s.isActive).length}</strong></span>
                <span>With Images: <strong>{sections.filter(s => s.images && s.images.length > 0).length}</strong></span>
                <span>With YouTube: <strong>{sections.filter(s => s.youtubeUrl).length}</strong></span>
            </div>
        </div>
    );
};

export default ContentSectionManager;
