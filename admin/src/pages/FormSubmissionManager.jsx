import { useState, useEffect } from 'react';
import { Mail, Phone, User, Eye, Trash2, FileText, Clock, CheckCircle, MessageCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api';

const FormSubmissionManager = () => {
    const [submissions, setSubmissions] = useState([]);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForm, setSelectedForm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [stats, setStats] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSubmissions();
        fetchForms();
        fetchStats();
    }, [selectedForm, selectedStatus]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE_URL}/form-submissions?`;
            if (selectedForm) url += `formId=${selectedForm}&`;
            if (selectedStatus) url += `status=${selectedStatus}&`;

            const response = await fetch(url);
            const data = await response.json();
            setSubmissions(data.submissions || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            alert('Failed to fetch form submissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchForms = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/forms`);
            const data = await response.json();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/form-submissions/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/form-submissions/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchSubmissions();
                fetchStats();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const deleteSubmission = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/form-submissions/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchSubmissions();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Failed to delete submission');
        }
    };

    const viewSubmission = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/form-submissions/${id}`);
            const data = await response.json();
            setSelectedSubmission(data);
            setShowModal(true);
            fetchSubmissions(); // Refresh to get updated read status
        } catch (error) {
            console.error('Error fetching submission:', error);
        }
    };

    const filteredSubmissions = submissions.filter(sub =>
        sub.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.userPhone?.includes(searchTerm) ||
        sub.formName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            new: { bg: '#fff3e0', color: '#e65100', icon: Clock },
            read: { bg: '#e3f2fd', color: '#1976d2', icon: Eye },
            responded: { bg: '#e8f5e9', color: '#2e7d32', icon: MessageCircle },
            closed: { bg: '#fce4ec', color: '#c62828', icon: XCircle }
        };
        const style = styles[status] || styles.new;
        const Icon = style.icon;

        return (
            <span style={{
                backgroundColor: style.bg,
                color: style.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: '500',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
            }}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    if (loading && submissions.length === 0) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                Loading Form Submissions...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>
                    <FileText style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Form Submissions
                </h2>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#333' }}>{stats.total}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>Total</div>
                    </div>
                    <div style={{ backgroundColor: '#fff3e0', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e65100' }}>{stats.byStatus?.new || 0}</div>
                        <div style={{ color: '#e65100', fontSize: '0.9rem' }}>New</div>
                    </div>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1976d2' }}>{stats.byStatus?.read || 0}</div>
                        <div style={{ color: '#1976d2', fontSize: '0.9rem' }}>Read</div>
                    </div>
                    <div style={{ backgroundColor: '#e8f5e9', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2e7d32' }}>{stats.byStatus?.responded || 0}</div>
                        <div style={{ color: '#2e7d32', fontSize: '0.9rem' }}>Responded</div>
                    </div>
                    <div style={{ backgroundColor: '#fce4ec', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#c62828' }}>{stats.byStatus?.closed || 0}</div>
                        <div style={{ color: '#c62828', fontSize: '0.9rem' }}>Closed</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '0.75rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
                <select
                    value={selectedForm}
                    onChange={(e) => setSelectedForm(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        minWidth: '200px'
                    }}
                >
                    <option value="">All Forms</option>
                    {forms.map(form => (
                        <option key={form._id} value={form._id}>{form.name}</option>
                    ))}
                </select>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        minWidth: '150px'
                    }}
                >
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Form</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Submitted</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.map((submission) => (
                                <>
                                    <tr
                                        key={submission._id}
                                        style={{
                                            borderBottom: '1px solid #eee',
                                            backgroundColor: submission.status === 'new' ? '#fffde7' : 'white',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setExpandedRow(expandedRow === submission._id ? null : submission._id)}
                                    >
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={16} color="#666" />
                                                <span style={{ fontWeight: '600', color: '#333' }}>
                                                    {submission.userName || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {submission.userEmail && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                        <Mail size={14} color="#666" /> {submission.userEmail}
                                                    </span>
                                                )}
                                                {submission.userPhone && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                        <Phone size={14} color="#666" /> {submission.userPhone}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                display: 'inline-block',
                                                fontWeight: '500',
                                                fontSize: '0.8rem'
                                            }}>
                                                {submission.formName}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            {getStatusBadge(submission.status)}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ color: '#666', fontSize: '0.875rem' }}>
                                                {formatDate(submission.createdAt)}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); viewSubmission(submission._id); }}
                                                    style={{ ...btnStyle, backgroundColor: '#e3f2fd', color: '#1976d2' }}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteSubmission(submission._id); }}
                                                    style={{ ...btnStyle, backgroundColor: '#ffebee', color: '#c62828' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                {expandedRow === submission._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRow === submission._id && (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                                    {Object.entries(submission.submissionData || {}).map(([key, value]) => (
                                                        <div key={key} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '8px' }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                                                                {key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim()}
                                                            </div>
                                                            <div style={{ fontWeight: '600', color: '#333' }}>{String(value) || '-'}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.875rem', color: '#666', marginRight: '0.5rem' }}>Change Status:</span>
                                                    {['new', 'read', 'responded', 'closed'].map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateStatus(submission._id, status)}
                                                            style={{
                                                                padding: '0.35rem 0.75rem',
                                                                border: submission.status === status ? '2px solid #1976d2' : '1px solid #ddd',
                                                                borderRadius: '20px',
                                                                backgroundColor: submission.status === status ? '#e3f2fd' : 'white',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredSubmissions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        {searchTerm || selectedForm || selectedStatus ? 'No matching submissions found.' : 'No form submissions yet.'}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedSubmission && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Submission Details</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Form:</strong> {selectedSubmission.formName}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Status:</strong> {getStatusBadge(selectedSubmission.status)}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Submitted:</strong> {formatDate(selectedSubmission.createdAt)}
                        </div>

                        <h4>Submission Data</h4>
                        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                            {Object.entries(selectedSubmission.submissionData || {}).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ color: '#666', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim()}</span>
                                    <span style={{ fontWeight: '600' }}>{String(value) || '-'}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const thStyle = {
    textAlign: 'left',
    padding: '1rem',
    fontWeight: '600',
    color: '#555',
    fontSize: '0.875rem',
    borderBottom: '2px solid #eee'
};

const tdStyle = {
    padding: '1rem',
    verticalAlign: 'middle'
};

const btnStyle = {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default FormSubmissionManager;
