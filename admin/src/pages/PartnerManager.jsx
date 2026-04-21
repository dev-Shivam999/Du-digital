import { useState, useEffect } from 'react';
import { getPartnerRequests, updatePartnerStatus } from '../services/api';
import { Users, CheckCircle, XCircle, Building, Filter, Upload, X } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { PageHeader, Button, LoadingSpinner, FormGroup } from "../components/UI";

const PartnerManager = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Modal State
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [completeFiles, setCompleteFiles] = useState({ logo: null, userImage: null, country:"",date:"" });
    const [completing, setCompleting] = useState(false);

    const { user } = useAuth();

    // Check permissions
    const canManagePartners = user?.role === 'admin' || user?.permissions?.includes('manage_partners');

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Client-side filtering as per previous plan
            const data = await getPartnerRequests();
            
            if (statusFilter !== 'All') {
                setRequests(data.filter(r => r.status === statusFilter));
            } else {
                setRequests(data);
            }
        } catch (error) {
            console.error("Error fetching partner requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (newStatus === 'Complete') {
            setSelectedRequestId(id);
            setCompleteFiles({ logo: null, userImage: null });
            setShowCompleteModal(true);
            return;
        }

        if (!window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) return;

        try {
            const updated = await updatePartnerStatus(id, { status: newStatus });
            setRequests(requests.map(r => r._id === id ? updated : r));
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const handleCompleteSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRequestId) return;
        
        setCompleting(true);
        try {
            const formData = new FormData();
            formData.append('status', 'Complete');
            if (completeFiles.logo) formData.append('logo', completeFiles.logo);
            if (completeFiles.userImage) formData.append('userImage', completeFiles.userImage);
            if (completeFiles.country) formData.append('country', completeFiles.country);
            if (completeFiles.date) formData.append('date', completeFiles.date);

            const updated = await updatePartnerStatus(selectedRequestId, formData);
            setRequests(requests.map(r => r._id === selectedRequestId ? updated : r));
            setShowCompleteModal(false);
        } catch (error) {
            console.error("Error completing request", error);
            alert("Failed to complete request");
        } finally {
            setCompleting(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'Pending': 'warning',
            'On Process': 'info',
            'Complete': 'success',
            'Rejected': 'danger'
        };
        const color = colors[status] || 'secondary';
        return <span className={`badge bg-${color}`}>{status}</span>;
    };

    return (
        <div>
           <PageHeader 
                title="Partner Program Requests" 
                description="Manage incoming partner inquiries and track their status"
            />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex gap-2 flex-wrap">
                        {['All', 'Pending', 'On Process', 'Complete', 'Rejected'].map(status => (
                            <button 
                                key={status}
                                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-light'}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="row">
                    {requests.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            No requests found for this filter.
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req._id} className="col-12 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="d-flex gap-3">
                                                <div className="avatar-md bg-light-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                                                    <Users size={24} />
                                                </div>
                                                <div>
                                                    <h5 className="mb-1 d-flex align-items-center gap-2">
                                                        {req.fullName}
                                                        <StatusBadge status={req.status} />
                                                    </h5>
                                                    <div className="text-muted small mb-2 d-flex gap-3">
                                                        <span>{req.email}</span>
                                                        <span>•</span>
                                                        <span>{new Date(req.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    
                                                    {req.businessName && (
                                                        <div className="mb-2 d-flex align-items-center gap-2 text-dark">
                                                            <Building size={16} className="text-muted" />
                                                            <strong>{req.businessName}</strong>
                                                        </div>
                                                    )}

                                                    <div className="row g-2 text-sm mt-2">
                                                        <div className="col-md-auto">
                                                            <span className="text-muted">Phone:</span> {req.phone || 'N/A'}
                                                        </div>
                                                        <div className="col-md-auto border-start ps-3">
                                                            <span className="text-muted">City:</span> {req.city || 'N/A'}
                                                        </div>
                                                        <div className="col-md-auto border-start ps-3">
                                                            <span className="text-muted">Looking For:</span> {req.lookingFor || 'N/A'}
                                                        </div>
                                                        <div className="col-md-auto border-start ps-3 d-flex align-items-center gap-1">
                                                            <span className="text-muted">Msg:</span> 
                                                            {req.isMsg ? <CheckCircle size={14} className="text-success"/> : <XCircle size={14} className="text-danger"/>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {canManagePartners && (
                                                <div className="d-flex flex-column gap-2">
                                                    {(req.status === 'Pending' || req.status === 'On Process') && (
                                                        <div className="btn-group">
                                                            <button 
                                                                className="btn btn-sm btn-outline-info"
                                                                title="Mark as On Process"
                                                                onClick={() => handleStatusUpdate(req._id, 'On Process')}
                                                                disabled={req.status === 'On Process'}
                                                            >
                                                                Process
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-success"
                                                                title="Mark as Complete"
                                                                onClick={() => handleStatusUpdate(req._id, 'Complete')}
                                                            >
                                                                Complete
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Reject"
                                                                onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    {['Complete', 'Rejected'].includes(req.status) && (
                                                        <button 
                                                            className="btn btn-sm btn-light text-muted"
                                                            onClick={() => handleStatusUpdate(req._id, 'Pending')}
                                                        >
                                                            Re-open
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{width: '500px'}}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Complete Partner Request</h4>
                            <button className="btn btn-link p-0 text-muted" onClick={() => setShowCompleteModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-4">
                                This will create a new official Partner record. Please upload the necessary images.
                            </p>
                            <form onSubmit={handleCompleteSubmit}>
                                <FormGroup label="Flag">
                                    <input 
                                        type="file" 
                                        className="form-control"
                                        accept="image/*"
                                        onChange={e => setCompleteFiles({...completeFiles, logo: e.target.files[0]})}
                                    />
                                </FormGroup>
                                <FormGroup label="User/Profile Image">
                                    <input 
                                        type="file" 
                                        className="form-control"
                                        accept="image/*"
                                        onChange={e => setCompleteFiles({...completeFiles, userImage: e.target.files[0]})}
                                    />
                                </FormGroup>
                                <FormGroup label="country">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        onChange={e => setCompleteFiles({ ...completeFiles, country: e.target.value})}
                                    />
                                </FormGroup>
                                <FormGroup label="Date">
                                    <input 
                                        type="date" 
                                        className="form-control"
                                        onChange={e => setCompleteFiles({...completeFiles, date: e.target.value})}
                                    />
                                </FormGroup>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button variant="secondary" onClick={() => setShowCompleteModal(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button disabled={completing} type="submit" variant="success">
                                        {completing ? "Completing..." : "Confirm & Create Partner"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerManager;
