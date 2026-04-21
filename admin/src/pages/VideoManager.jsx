import { useState, useEffect } from 'react';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../services/api';

const VideoManager = () => {
    const [videos, setVideos] = useState([]);
    const [formData, setFormData] = useState({ title: '', videoUrl: '', category: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const data = await getVideos();
            setVideos(data);
        } catch (error) {
            console.error('Error fetching videos:', error);
            alert('Failed to fetch videos');
        }
    };

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateVideo(editingId, formData);
                alert('Video updated successfully');
            } else {
                await createVideo(formData);
                alert('Video added successfully');
            }
            fetchVideos();
            resetForm();
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            await deleteVideo(id);
            alert('Video deleted successfully');
            fetchVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video');
        }
    };

    const handleEdit = (video) => {
        setFormData({
            title: video.title,
            videoUrl: video.videoUrl,
            category: video.category,
            description: video.description
        });
        setEditingId(video._id);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ title: '', videoUrl: '', category: '', description: '' });
        setEditingId(null);
        setShowModal(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginRight: '0.5rem'
    };

    const videoId = extractVideoId(formData.videoUrl);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333' }}>Video Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                    + Add New Video
                </button>
            </div>

            {/* List View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {videos.map((video) => {
                    const vidId = extractVideoId(video.videoUrl);
                    return (
                        <div key={video._id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                                {vidId ? (
                                    <iframe
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        src={`https://www.youtube.com/embed/${vidId}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        No Preview
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{video.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{video.category}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleEdit(video)}
                                        style={{ ...buttonStyle, backgroundColor: '#ffc107', color: '#000' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Video' : 'Add New Video'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Video URL (YouTube)</label>
                                <input
                                    type="url"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    style={inputStyle}
                                    required
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            {videoId && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Preview:</p>
                                    <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                                        <iframe
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title="Preview"
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Brand & Corporate Films">Brand & Corporate Films</option>
                                    <option value="Business & Company Formation">Business & Company Formation</option>
                                    <option value="Travel, Visa & Destination Updates">Travel, Visa & Destination Updates</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '100px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
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
                                    {loading ? 'Saving...' : 'Save Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoManager;
