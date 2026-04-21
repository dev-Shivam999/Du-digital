import { useState, useEffect, useRef } from 'react';

const ReportForm = ({ categoryId, onUploadSuccess, editingReport, onCancelEdit }) => {
    const [title, setTitle] = useState('');
    const [financialYear, setFinancialYear] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
const [email,setEmail]=useState('');
    // Populate form when editing
    useEffect(() => {
        if (editingReport) {
            setTitle(editingReport.title || '');
            setFinancialYear(editingReport.financialYear || '');
            setEmail(editingReport.email || '');
            setFile(null);
        } else {
            setTitle('');
            setFinancialYear('');
            setEmail('');
            setFile(null);
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [editingReport]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form submit triggered", {
            title,
            financialYear,
            file,
            categoryId,
            editingReport
        });

        // For new reports, file is required. For editing, it's optional.
        if (!editingReport && !file) {
            alert("Please select a PDF file.");
            return;
        }
        if (!categoryId) {
            alert("Please select a category.");
            return;
        }
        if (!title.trim()) {
            alert("Please enter a title.");
            return;
        }

        const formData = new FormData();
        formData.append('categoryId', categoryId);
        formData.append('title', title);
        formData.append('financialYear', financialYear);
        formData.append('email', email);
        if (file) {
            formData.append('pdf', file);
        }

        console.log("Sending formData with file:", formData);

        setLoading(true);
        try {
            await onUploadSuccess(formData, editingReport?._id);
            console.log("Upload successful");
            // Reset form after successful submission
            setTitle('');
            setFinancialYear('');
            setFile(null);
            setEmail('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setFinancialYear('');
        setEmail('');
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile || null);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>{editingReport ? 'Edit Report' : 'Upload New Report'}</h3>
            <div>
                <label>Title: <span style={{ color: 'red' }}>*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            <div>
                <label> Year:</label>
                <input
                    type="text"
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            <div>
                <label>
                    PDF File: {!editingReport && <span style={{ color: 'red' }}>*</span>}
                    {editingReport && <span style={{ color: '#666', fontSize: '0.9em' }}> (Optional - leave empty to keep existing)</span>}
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    type="submit"
                    disabled={loading || !title.trim() || (!editingReport && !file)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: (loading || !title.trim() || (!editingReport && !file)) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || !title.trim() || (!editingReport && !file)) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? (editingReport ? 'Updating...' : 'Uploading...') : (editingReport ? 'Update Report' : 'Upload Report')}
                </button>
                {editingReport && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReportForm;
