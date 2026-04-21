import { useState, useEffect } from 'react';
import { getTravelInquiries } from '../services/api';
import { Mail, Phone, Users, Calendar, Plane } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://ec2-13-203-217-17.ap-south-1.compute.amazonaws.com/api';

const TravelInquiryManager = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const data = await getTravelInquiries();
            setInquiries(data);
        } catch (error) {
            console.error('Error fetching travel inquiries:', error);
            alert('Failed to fetch travel inquiries');
        } finally {
            setLoading(false);
        }
    };

    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.mobileNumber?.includes(searchTerm) ||
        inquiry.packageId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                Loading Travel Inquiries...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>
                    <Plane style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Travel Inquiries
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '600'
                    }}>
                        Total: {inquiries.length}
                    </span>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search by name, email, phone, or package..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '0.75rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                />
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
                                <th style={thStyle}>Customer</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Package</th>
                                <th style={thStyle}>Travel Date</th>
                                <th style={thStyle}>Travelers</th>
                                <th style={thStyle}>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInquiries.map((inquiry) => (
                                <tr key={inquiry._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '600', color: '#333' }}>{inquiry.name}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Mail size={14} color="#666" /> {inquiry.email}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Phone size={14} color="#666" /> {inquiry.mobileNumber}
                                            </span>
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
                                            fontSize: '0.875rem'
                                        }}>
                                            {inquiry.packageId?.title || 'N/A'}
                                        </div>
                                        {inquiry.packageId?.startingPrice && (
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                                From {inquiry.packageId.startingPrice}
                                            </div>
                                        )}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={14} color="#1976d2" />
                                            <span style={{ fontWeight: '500' }}>{inquiry.travelDate}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={14} color="#666" />
                                            <span>
                                                {inquiry.adult} Adult{inquiry.adult > 1 ? 's' : ''}
                                                {inquiry.child > 0 && `, ${inquiry.child} Child`}
                                                {inquiry.infant > 0 && `, ${inquiry.infant} Infant`}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ color: '#666', fontSize: '0.875rem' }}>
                                            {formatDate(inquiry.createdAt)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredInquiries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                        {searchTerm ? 'No matching inquiries found.' : 'No travel inquiries yet.'}
                    </div>
                )}
            </div>
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

export default TravelInquiryManager;
