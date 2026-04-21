import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentSectionById, createContentSection, updateContentSection, getForms } from '../services/api';

const LAYOUT_OPTIONS = [
    { value: 'LEFT_TEXT_RIGHT_IMAGE', label: 'Text Left, Image Right' },
    { value: 'RIGHT_TEXT_LEFT_IMAGE', label: 'Image Left, Text Right' }
];

const ContentSectionEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    
    const [forms, setForms] = useState([]);
    const [formData, setFormData] = useState({
        formId: '',
        sectionKey: '',
        title: '',
        contentHtml: '',
        youtubeUrl: '',
        tableData: { headers: [], rows: [] },
        images: [],
        badgeText: '',
        badgeBackground: '#007bff',
        layout: 'LEFT_TEXT_RIGHT_IMAGE',
        isActive: true
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        fetchForms();
        if (isEditing) {
            fetchSection();
        }
    }, [id]);

    const fetchForms = async () => {
        try {
            const data = await getForms();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchSection = async () => {
        setFetching(true);
        try {
            const section = await getContentSectionById(id);
            const sectionImages = section.images || [];
            setFormData({
                formId: section.formId?._id || section.formId,
                sectionKey: section.sectionKey,
                title: section.title,
                contentHtml: section.contentHtml || '',
                youtubeUrl: section.youtubeUrl || '',
                tableData: section.tableData || { headers: [], rows: [] },
                images: sectionImages,
                badgeText: section.badge?.text || '',
                badgeBackground: section.badge?.background || '#007bff',
                layout: section.layout,
                isActive: section.isActive
            });
            setImagePreviews(sectionImages);
        } catch (error) {
            console.error('Error fetching section:', error);
            alert('Failed to load content section');
            navigate('/content-sections');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.formId) {
            alert('Please select a form');
            return;
        }
        if (!formData.sectionKey || !formData.title) {
            alert('Section Key and Title are required');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('formId', formData.formId);
            data.append('sectionKey', formData.sectionKey);
            data.append('title', formData.title);
            data.append('contentHtml', formData.contentHtml);
            data.append('youtubeUrl', formData.youtubeUrl);
            data.append('layout', formData.layout);
            data.append('isActive', formData.isActive);
            
            if (formData.badgeText) {
                data.append('badge[text]', formData.badgeText);
                data.append('badge[background]', formData.badgeBackground);
            }
            
            // Add tableData as JSON string
            data.append('tableData', JSON.stringify(formData.tableData));
            
            // Handle multiple images
            const existingImages = [];
            formData.images.forEach((img) => {
                if (img instanceof File) {
                    data.append('images', img);
                } else if (typeof img === 'string' && img) {
                    existingImages.push(img);
                }
            });
            existingImages.forEach((url) => {
                data.append('existingImages', url);
            });

            if (isEditing) {
                await updateContentSection(id, data);
                alert('Content section updated successfully');
            } else {
                await createContentSection(data);
                alert('Content section created successfully');
            }
            navigate('/content-sections');
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Failed to save content section');
        } finally {
            setLoading(false);
        }
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
        
        const filesToAdd = files.slice(0, remainingSlots);
        
        if (files.length > remainingSlots) {
            alert(`Only ${remainingSlots} more image(s) can be added.`);
        }
        
        const newImages = [...formData.images, ...filesToAdd];
        const newPreviews = [...imagePreviews, ...filesToAdd.map(f => URL.createObjectURL(f))];
        
        setFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
        setFileInputKey(prev => prev + 1);
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        setImagePreviews(newPreviews);
    };

    const extractYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : url;
    };

    // Table Builder Functions
    const addColumn = () => {
        const newHeaders = [...formData.tableData.headers, `Column ${formData.tableData.headers.length + 1}`];
        const newRows = formData.tableData.rows.map(row => [...row, '']);
        setFormData({ ...formData, tableData: { headers: newHeaders, rows: newRows } });
    };

    const removeColumn = (colIndex) => {
        if (formData.tableData.headers.length <= 1) return;
        const newHeaders = formData.tableData.headers.filter((_, i) => i !== colIndex);
        const newRows = formData.tableData.rows.map(row => row.filter((_, i) => i !== colIndex));
        setFormData({ ...formData, tableData: { headers: newHeaders, rows: newRows } });
    };

    const addRow = () => {
        const emptyRow = formData.tableData.headers.map(() => '');
        const newRows = [...formData.tableData.rows, emptyRow];
        setFormData({ ...formData, tableData: { ...formData.tableData, rows: newRows } });
    };

    const removeRow = (rowIndex) => {
        const newRows = formData.tableData.rows.filter((_, i) => i !== rowIndex);
        setFormData({ ...formData, tableData: { ...formData.tableData, rows: newRows } });
    };

    const updateHeader = (colIndex, value) => {
        const newHeaders = [...formData.tableData.headers];
        newHeaders[colIndex] = value;
        setFormData({ ...formData, tableData: { ...formData.tableData, headers: newHeaders } });
    };

    const updateCell = (rowIndex, colIndex, value) => {
        const newRows = [...formData.tableData.rows];
        newRows[rowIndex] = [...newRows[rowIndex]];
        newRows[rowIndex][colIndex] = value;
        setFormData({ ...formData, tableData: { ...formData.tableData, rows: newRows } });
    };

    const initializeTable = () => {
        setFormData({ 
            ...formData, 
            tableData: { 
                headers: ['Column 1', 'Column 2', 'Column 3'], 
                rows: [['', '', ''], ['', '', '']] 
            } 
        });
    };

    const clearTable = () => {
        setFormData({ ...formData, tableData: { headers: [], rows: [] } });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '0.95rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        color: '#333'
    };

    const buttonStyle = {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '500'
    };

    if (fetching) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    type="button"
                    onClick={() => navigate('/content-sections')}
                    style={{ 
                        ...buttonStyle, 
                        backgroundColor: '#f8f9fa', 
                        color: '#333',
                        padding: '0.5rem 1rem'
                    }}
                >
                    ← Back
                </button>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#333' }}>
                    {isEditing ? 'Edit Content Section' : 'Create Content Section'}
                </h2>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info Card */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#333' }}>
                        Basic Information
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Form *</label>
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
                            <label style={labelStyle}>Section Key *</label>
                            <input
                                type="text"
                                value={formData.sectionKey}
                                onChange={(e) => setFormData({ ...formData, sectionKey: e.target.value })}
                                style={inputStyle}
                                required
                                placeholder="e.g., explore-india, how-it-works"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={labelStyle}>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={inputStyle}
                            required
                            placeholder="Section title"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Layout</label>
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
                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontWeight: '500' }}>Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#333' }}>
                        Content
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Content (HTML)</label>
                        <textarea
                            value={formData.contentHtml}
                            onChange={(e) => setFormData({ ...formData, contentHtml: e.target.value })}
                            style={{ ...inputStyle, minHeight: '200px', fontFamily: 'monospace' }}
                            placeholder="<p>Your content here...</p> (optional if using YouTube)"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>
                            YouTube Video URL
                            <span style={{ fontWeight: '400', color: '#666', marginLeft: '0.5rem' }}>(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            style={inputStyle}
                            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                        />
                        {formData.youtubeUrl && extractYouTubeId(formData.youtubeUrl) && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Preview:</p>
                                <div style={{ 
                                    position: 'relative', 
                                    paddingBottom: '56.25%', 
                                    height: 0, 
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    backgroundColor: '#000'
                                }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${extractYouTubeId(formData.youtubeUrl)}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 'none'
                                        }}
                                        allowFullScreen
                                        title="YouTube Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Images Card */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#333' }}>
                        Images (Max 4)
                    </h3>

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
                            gap: '0.75rem', 
                            marginTop: '1rem' 
                        }}>
                            {imagePreviews.map((preview, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <img 
                                        src={preview.startsWith('blob:') ? preview : `${import.meta.env.VITE_API_BASE_URL}${preview.replace('/api', '')}`}
                                        alt={`Preview ${idx + 1}`} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
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
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
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

                {/* Table Builder Card */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>
                            Data Table (Optional)
                        </h3>
                        {formData.tableData.headers.length === 0 ? (
                            <button
                                type="button"
                                onClick={initializeTable}
                                style={{ 
                                    padding: '0.5rem 1rem', 
                                    backgroundColor: '#17a2b8', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                + Create Table
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={clearTable}
                                style={{ 
                                    padding: '0.5rem 1rem', 
                                    backgroundColor: '#dc3545', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Clear Table
                            </button>
                        )}
                    </div>

                    {formData.tableData.headers.length > 0 && (
                        <>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={addColumn}
                                    style={{ 
                                        padding: '0.4rem 0.75rem', 
                                        backgroundColor: '#28a745', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    + Column
                                </button>
                                <button
                                    type="button"
                                    onClick={addRow}
                                    style={{ 
                                        padding: '0.4rem 0.75rem', 
                                        backgroundColor: '#007bff', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    + Row
                                </button>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            {formData.tableData.headers.map((header, colIndex) => (
                                                <th key={colIndex} style={{ padding: '0.5rem', border: '1px solid #dee2e6', minWidth: '120px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <input
                                                            type="text"
                                                            value={header}
                                                            onChange={(e) => updateHeader(colIndex, e.target.value)}
                                                            style={{ 
                                                                flex: 1, 
                                                                padding: '0.35rem', 
                                                                border: '1px solid #ced4da', 
                                                                borderRadius: '4px',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.85rem'
                                                            }}
                                                            placeholder="Header"
                                                        />
                                                        {formData.tableData.headers.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeColumn(colIndex)}
                                                                style={{ 
                                                                    width: '22px', 
                                                                    height: '22px', 
                                                                    backgroundColor: '#dc3545', 
                                                                    color: 'white', 
                                                                    border: 'none', 
                                                                    borderRadius: '4px', 
                                                                    cursor: 'pointer',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                            <th style={{ padding: '0.5rem', border: '1px solid #dee2e6', width: '50px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.tableData.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, colIndex) => (
                                                    <td key={colIndex} style={{ padding: '0.35rem', border: '1px solid #dee2e6' }}>
                                                        <input
                                                            type="text"
                                                            value={cell}
                                                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                                            style={{ 
                                                                width: '100%', 
                                                                padding: '0.35rem', 
                                                                border: '1px solid #ced4da', 
                                                                borderRadius: '4px',
                                                                fontSize: '0.85rem'
                                                            }}
                                                            placeholder="..."
                                                        />
                                                    </td>
                                                ))}
                                                <td style={{ padding: '0.35rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(rowIndex)}
                                                        style={{ 
                                                            width: '22px', 
                                                            height: '22px', 
                                                            backgroundColor: '#dc3545', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            borderRadius: '4px', 
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                                {formData.tableData.headers.length} columns × {formData.tableData.rows.length} rows
                            </p>
                        </>
                    )}
                </div>

                {/* Badge Card */}
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#333' }}>
                        Badge (Optional)
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Badge Text</label>
                            <input
                                type="text"
                                value={formData.badgeText}
                                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                style={inputStyle}
                                placeholder="e.g., NEW, POPULAR"
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Badge Color</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="color"
                                    value={formData.badgeBackground}
                                    onChange={(e) => setFormData({ ...formData, badgeBackground: e.target.value })}
                                    style={{ width: '50px', height: '42px', padding: '2px', cursor: 'pointer', borderRadius: '6px' }}
                                />
                                <input
                                    type="text"
                                    value={formData.badgeBackground}
                                    onChange={(e) => setFormData({ ...formData, badgeBackground: e.target.value })}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {formData.badgeText && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Preview:</p>
                            <span style={{
                                backgroundColor: formData.badgeBackground,
                                color: 'white',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                            }}>
                                {formData.badgeText}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '1rem',
                    padding: '1rem 0'
                }}>
                    <button
                        type="button"
                        onClick={() => navigate('/content-sections')}
                        style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Section' : 'Create Section')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContentSectionEditor;
