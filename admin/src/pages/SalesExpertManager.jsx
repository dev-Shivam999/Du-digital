
import { useState, useEffect } from 'react';
import { 
    getSalesExperts, addSalesExpert, updateSalesExpert, deleteSalesExpert,
    getLocations 
} from '../services/api';
import { Trash2, Edit, User, MapPin } from 'lucide-react';

const SalesExpertManager = () => {
    const [experts, setExperts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        designation: '',
        region: '',
        phone: '',
        officeLocationId: '',
        isActive: true
    });
    
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchExperts();
        fetchLocations();
    }, []);

    const fetchExperts = async () => {
        try {
            setLoading(true);
            const response = await getSalesExperts();
            // Backend returns { message, data }
            setExperts(response.data || []);
        } catch (error) {
            console.error("Error fetching experts", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const data = await getLocations();
            setLocations(data || []);
        } catch (error) {
            console.error("Error fetching locations", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Remove password if empty or not needed for update (handled by backend usually)
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                
                await updateSalesExpert(editingId, updateData);
                alert("Sales Expert Updated!");
            } else {
                await addSalesExpert(formData);
                alert("Sales Expert Added!");
            }
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                designation: '',
                region: '',
                phone: '',
                officeLocationId: '',
                isActive: true
            });
            setEditingId(null);
            fetchExperts();
        } catch (error) {
            console.error("Error saving expert", error);
            alert("Error saving Sales Expert");
        }
    };

    const handleEdit = (expert) => {
        setFormData({
            name: expert.name,
            email: expert.email || '',
            password: '', // Don't show password
            designation: expert.designation || '',
            region: expert.region,
            phone: expert.phone,
            officeLocationId: expert.officeLocationId?._id || expert.officeLocationId || '',
            isActive: expert.isActive
        });
        setEditingId(expert._id);
        // Scroll to top or form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this Sales Expert?")) return;
        try {
            await deleteSalesExpert(id);
            fetchExperts();
        } catch (error) {
            console.error("Error deleting expert", error);
            alert("Error deleting Sales Expert");
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            designation: '',
            region: '',
            phone: '',
            officeLocationId: '',
            isActive: true
        });
        setEditingId(null);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Sales Expert Management</h1>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Form Section */}
                <div style={{ flex: 1, minWidth: '300px', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
                    <h3>{editingId ? 'Edit Sales Expert' : 'Add New Sales Expert'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Name*</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email*</label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        {!editingId && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Password*</label>
                                <input 
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Designation</label>
                            <input 
                                value={formData.designation}
                                onChange={e => setFormData({...formData, designation: e.target.value})}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Region*</label>
                            <input 
                                required
                                value={formData.region}
                                onChange={e => setFormData({...formData, region: e.target.value})}
                                placeholder="e.g. North India"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Phone*</label>
                            <input 
                                required
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Office Location</label>
                            <select 
                                value={formData.officeLocationId}
                                onChange={e => setFormData({...formData, officeLocationId: e.target.value})}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="">Select Office (Optional)</option>
                                {locations.map(loc => (
                                    <option key={loc._id} value={loc._id}>
                                        {loc.officeName} - {loc.address?.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ flex: 1, padding: '10px', background: editingId ? '#ffc107' : '#28a745', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {editingId ? 'Update Expert' : 'Add Expert'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <h3>Sales Experts List</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {experts.map(expert => (
                                <div key={expert._id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#f0f2f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={20} color="#555" />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{expert.name}</h4>
                                                <small style={{ color: '#777' }}>{expert.designation}</small>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button onClick={() => handleEdit(expert)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }} title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(expert._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '10px 0', borderTop: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                                        <div style={{ marginBottom: '5px' }}>
                                            <strong>Region:</strong> {expert.region}
                                        </div>
                                        <div style={{ marginBottom: '5px' }}>
                                            <strong>Phone:</strong> {expert.phone}
                                        </div>
                                        {expert.officeLocationId && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555', marginTop: '8px' }}>
                                                <MapPin size={14} />
                                                <span>{expert.officeLocationId.officeName} ({expert.officeLocationId.address?.city})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {experts.length === 0 && (
                                <p style={{ color: '#888', fontStyle: 'italic' }}>No sales experts found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesExpertManager;
