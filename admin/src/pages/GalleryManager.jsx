import { useState, useEffect } from 'react';
import { getImages, uploadImage, deleteImage } from '../services/api';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const data = await getImages();
            setImages(data);
        } catch (error) {
            console.error("Error fetching images", error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            await uploadImage(formData);
            setFile(null);
            fetchImages();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this image?")) return;
        try {
            await deleteImage(id);
            fetchImages();
        } catch (error) {
            alert("Error deleting image");
        }
    };

    

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Gallery Manager</h1>

            {/* Upload Section */}
            <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '2rem', background: '#fff' }}>
                <h3>Add New Image</h3>
                <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center' }}
                    >
                        <Upload size={18} /> {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>

            {/* Preview Slider */}
            {images.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3>Live Preview (Swiper)</h3>
                    <div style={{ height: '400px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000 }}
                            style={{ height: '100%' }}
                        >
                            {images.map(img => (
                                <SwiperSlide key={img._id}>
                                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img 
                                            src={`${import.meta.env.VITE_API_BASE_URL}${img.FileUser}`} 
                                            alt="Gallery" 
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}

            {/* Image Grid */}
            <h3>All Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {images.map(img => (
                    <div key={img._id} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
                        <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${img.FileUser}`} 
                            alt="Gallery" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <button 
                            onClick={() => handleDelete(img._id)}
                            style={{ 
                                position: 'absolute', 
                                top: '5px', 
                                right: '5px', 
                                background: 'rgba(255,0,0,0.8)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '30px', 
                                height: '30px', 
                                cursor: 'pointer',
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryManager;
