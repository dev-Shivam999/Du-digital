import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/api";
import { PageHeader, Button, LoadingSpinner, FormGroup, Input } from "../components/UI";
import { Plus, Edit3, Trash2, X, Save, User, Shield, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { user: currentUser } = useAuth();
    
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        permissions: [],
        receivePartnerNotifications: false
    });

    const [error, setError] = useState("");

    const availablePermissions = [
        "manage_blogs", "manage_news", "manage_events", "manage_gallery", 
        "manage_videos", "manage_investors", "manage_offices", "manage_partners", 
        "manage_careers", "manage_team", "manage_sales", "manage_contacts", 
        "manage_applicants"
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "user", permissions: [], receivePartnerNotifications: false });
        setShowModal(true);
        setError("");
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "", // User can leave blank if not changing
            role: user.role,
            permissions: user.permissions || [],
            receivePartnerNotifications: user.receivePartnerNotifications || false
        });
        setShowModal(true);
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            if (editingUser) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password
                
                const updatedUser = await updateUser(editingUser._id, updateData);
                setUsers(users.map(u => u._id === editingUser._id ? updatedUser : u));
            } else {
                const newUser = await createUser(formData);
                setUsers([...users, newUser]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error saving user:", error);
            setError(error.response?.data?.message || "Failed to save user");
        }
    };

    const togglePermission = (perm) => {
        if (formData.permissions.includes(perm)) {
            setFormData({...formData, permissions: formData.permissions.filter(p => p !== perm)});
        } else {
            setFormData({...formData, permissions: [...formData.permissions, perm]});
        }
    };

    const toggleAllPermissions = () => {
        if (formData.permissions.length === availablePermissions.length) {
            setFormData({...formData, permissions: []});
        } else {
            setFormData({...formData, permissions: [...availablePermissions]});
        }
    };

    if (loading) return <LoadingSpinner text="Loading users..." />;

    return (
        <div>
            <PageHeader 
                title="User Management" 
                description="Manage admin users, roles, and permissions"
                actions={
                    <Button variant="primary" onClick={handleCreate}>
                        <Plus size={16} /> Add User
                    </Button>
                }
            />

            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Permissions</th>
                                    <th>Notified</th>
                                    <th style={{width: '120px'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="avatar-sm bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{u.name}</div>
                                                    <div className="small text-muted">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {u.role === 'admin' ? 
                                                <span className="text-muted"><Shield size={14} className="me-1"/>Full Access</span> : 
                                                <span className="small text-muted">{u.permissions?.length || 0} permissions</span>
                                            }
                                        </td>
                                        <td className="text-center">
                                            {u.receivePartnerNotifications && <span title="Receives Partner Emails"><Check size={16} className="text-success" /></span>}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-light" onClick={() => handleEdit(u)} disabled={u._id === currentUser?._id}>
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="btn btn-sm btn-danger-soft" onClick={() => handleDelete(u._id)} disabled={u._id === currentUser?._id}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Modal */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{width: '600px', maxHeight: '90vh', overflowY: 'auto'}}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">{editingUser ? "Edit User" : "Add New User"}</h3>
                            <button className="btn btn-link p-0 text-muted" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormGroup label="Name" required>
                                            <Input 
                                                value={formData.name} 
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup label="Email" required>
                                            <Input 
                                                type="email"
                                                value={formData.email} 
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup label="Password" required={!editingUser}>
                                            <Input 
                                                type="password"
                                                value={formData.password} 
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                placeholder={editingUser ? "Leave blank to keep current" : ""}
                                                required={!editingUser}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup label="Role" required>
                                            <select 
                                                className="form-control"
                                                value={formData.role} 
                                                onChange={e => setFormData({...formData, role: e.target.value})}
                                            >
                                                <option value="user">User</option>
                                                <option value="hr">HR</option>
                                                <option value="sales">Sales</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </FormGroup>
                                    </div>
                                </div>

                                {formData.role !== 'admin' && (
                                    <div className="mt-3">
                                        <label className="form-label d-flex justify-content-between align-items-center">
                                            Permissions
                                            <button type="button" className="btn btn-sm btn-link p-0" onClick={toggleAllPermissions}>
                                                {formData.permissions.length === availablePermissions.length ? "Deselect All" : "Select All"}
                                            </button>
                                        </label>
                                        <div className="border rounded p-3 bg-light" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                            <div className="grid grid-cols-2 gap-2">
                                                {availablePermissions.map(perm => (
                                                    <label key={perm} className="d-flex align-items-center gap-2 small cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={formData.permissions.includes(perm)}
                                                            onChange={() => togglePermission(perm)}
                                                        />
                                                        {perm.replace('manage_', '').replace('_', ' ').toUpperCase()}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3 form-check">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input"
                                        id="notifyCheck"
                                        checked={formData.receivePartnerNotifications}
                                        onChange={e => setFormData({...formData, receivePartnerNotifications: e.target.checked})}
                                    />
                                    <label className="form-check-label" htmlFor="notifyCheck">
                                        Receive Partner Inquiry Notifications
                                    </label>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                                        Cancel
                                    </Button>
                                    <Button disabled={loading} type="submit">
                                        {loading ? "Saving..." : "Save User"}
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

export default UserManager;
