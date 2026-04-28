import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Images,
  Upload,
  X,
  Eye,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import {
  PageHeader,
  Button,
  FormGroup,
  Input,
  EmptyState,
} from "../components/UI";
import { useToast, ToastContainer } from "../components/Toast";
import {
  EventLoadingCard,
  FormLoadingOverlay,
  SkeletonForm,
} from "../components/LoadingStates";
import axios from "axios";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: "",
    location: "",
    description: "",
    image: null,
  });
  const slugManuallyEdited = useRef(false);

  // Helper: mirrors backend generateSlug logic
  const toSlug = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // [NEW] Batch selection state
  const [previews, setPreviews] = useState([]);         // [NEW] Preview state
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  // [NEW] Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);
  const ApiUrl = import.meta.env.VITE_API_BASE_URL

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/events`);
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      showError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    if (formData.slug.trim()) data.append("slug", toSlug(formData.slug));
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (selectedEvent) {
        // Edit mode
        await axios.put(
          `${ApiUrl}/events/${selectedEvent._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showSuccess("Event updated successfully");
      } else {
        // Create mode
        await axios.post(`${ApiUrl}/events`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("Event created successfully");
      }
      fetchEvents();
      resetForm();
      setIsEventModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      showError(`Failed to ${selectedEvent ? "update" : "create"} event`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`))
      return;

    try {
      await axios.delete(`${ApiUrl}/events/${eventId}`);
      showSuccess("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      showError("Failed to delete event");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      date: "",
      location: "",
      description: "",
      image: null,
    });
    slugManuallyEdited.current = false;
    setImagePreview(null);
    setSelectedEvent(null);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    slugManuallyEdited.current = true; // treat existing slug as manually set
    setFormData({
      title: event.title,
      slug: event.slug || "",
      date: event.date ? event.date.split("T")[0] : "",
      location: event.location || "",
      description: event.description || "",
      image: null,
    });
    if (event.imageUrl) {
      setImagePreview(`${ApiUrl}${event.imageUrl.replace("/api", "")}`);
    } else {
      setImagePreview(null);
    }
    setIsEventModalOpen(true);
  };

  const openGalleryManager = async (event) => {
    setSelectedEvent(event);
    setIsGalleryModalOpen(true);
    fetchGalleryImages(event._id);
  };

  const fetchGalleryImages = async (eventId) => {
    try {
      const response = await axios.get(
        `${ApiUrl}/events/${eventId}/images`
      );
      setGalleryImages(response.data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      showError("Failed to load gallery images");
    }
  };

  // [NEW] Handle file selection for batch upload
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // [NEW] Remove file from pending batch
  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index]); // Cleanup
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // [MODIFIED] Batch upload function
  const handleBatchUpload = async () => {
    if (selectedFiles.length === 0) return;

    const data = new FormData();
    selectedFiles.forEach((file) => {
      data.append("images", file);
    });

    setUploading(true);
    try {
      await axios.post(
        `${ApiUrl}/events/${selectedEvent._id}/images`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showSuccess(`${selectedFiles.length} image(s) uploaded successfully`);

      // Cleanup and refresh
      setSelectedFiles([]);
      setPreviews([]);
      fetchGalleryImages(selectedEvent._id);
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      showError("Failed to upload images");
    }
    finally {
      setUploading(false);
    }
  };

  // [NEW] Delete uploaded gallery image
  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm("Delete this image from the gallery?")) return;

    try {
      await axios.delete(`${ApiUrl}/events/images/${imageId}`);
      showSuccess("Image deleted successfully");
      fetchGalleryImages(selectedEvent._id);
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      showError("Failed to delete image");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Event Manager" description="Loading events..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventLoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="Event Manager"
        description="Create and manage events with image galleries"
        stats={[
          { label: `${events.length} Total Events`, variant: "bg-primary" },
        ]}
        actions={
          <Button
            onClick={() => {
              resetForm();
              setIsEventModalOpen(true);
            }}>
            <Plus size={16} />
            Add Event
          </Button>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Start by creating your first event to engage your audience."
          action={
            <Button
              onClick={() => {
                resetForm();
                setIsEventModalOpen(true);
              }}>
              <Plus size={16} />
              Create Your First Event
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="card card-hover">
              <div className="card-body">
                {event.imageUrl && (
                  <div className="image-upload-preview has-image mb-3">
                    <img
                      src={`${ApiUrl}${event.imageUrl.replace("/api", "")}`}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="image-upload-overlay">
                      <div className="image-upload-actions">
                        <button onClick={() => openGalleryManager(event)}>
                          <Images size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <h3
                  className="mb-2"
                  style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {event.title}
                </h3>

                <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                  <Clock size={14} />
                  <span style={{ fontSize: "0.875rem" }}>
                    {formatDate(event.date)}
                  </span>
                </div>

                {event.location && (
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                    <MapPin size={14} />
                    <span style={{ fontSize: "0.875rem" }}>
                      {event.location}
                    </span>
                  </div>
                )}

                {event.description && (
                  <p
                    className="text-muted mb-3"
                    style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openGalleryManager(event)}>
                    <Images size={14} />
                    Gallery ({event.galleryCount || 0})
                  </Button>

                  <div className="action-buttons">
                    <button
                      className="action-btn btn-edit"
                      title="Edit event"
                      onClick={() => handleEdit(event)}>
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => handleDelete(event._id, event.title)}
                      title="Delete event">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {isEventModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2>{selectedEvent ? "Edit Event" : "Add New Event"}</h2>
              <button
                className="modal-close"
                onClick={() => setIsEventModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-section">
              {saving && <FormLoadingOverlay message="Creating event..." />}

              <div className="modal-body">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Event Title" required>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: newTitle,
                          slug: slugManuallyEdited.current ? prev.slug : toSlug(newTitle),
                        }));
                      }}
                      placeholder="Enter event title..."
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Event Date" required>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Location">
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event location..."
                  />
                </FormGroup>

                <FormGroup label="Slug (URL)">
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 12, color: '#9ca3af', pointerEvents: 'none', whiteSpace: 'nowrap'
                    }}>
                      /events/
                    </div>
                    <Input
                      type="text"
                      value={formData.slug}
                      onBlur={() => setFormData((p) => ({ ...p, slug: toSlug(p.slug) }))}
                      onChange={(e) => {
                        slugManuallyEdited.current = true;
                        setFormData((p) => ({ ...p, slug: e.target.value }));
                      }}
                      placeholder="auto-generated-from-title"
                      style={{ paddingLeft: 60 }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>
                    Shown in URL: <code style={{ background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}>dudigitalglobal.com/events/{formData.slug || 'event-slug'}</code>
                  </div>
                </FormGroup>

                <FormGroup label="Description">
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Event description..."
                    rows={4}
                  />
                </FormGroup>

                <FormGroup label="Thumbnail Image">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                    accept="image/*"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEventModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={!formData.title || !formData.date}>
                  {selectedEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Manager Modal */}
      {isGalleryModalOpen && selectedEvent && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "900px", maxHeight: "80vh" }}>
            <div className="modal-header">
              <h2>Gallery: {selectedEvent.title}</h2>
              <button
                className="modal-close"
                onClick={() => setIsGalleryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto" }}>
              <div className="mb-4">
                <div className="mb-4">
                  <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
                    <h4 className="font-semibold mb-3">Add New Images</h4>

                    {/* File Selection */}
                    <div className="mb-4">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        id="event-gallery-upload"
                        className="hidden" // Assuming you have a hidden class or style={{display: 'none'}}
                        style={{ display: 'none' }}
                        accept="image/*"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="event-gallery-upload"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          color: '#475569',
                          fontWeight: '500',
                          fontSize: '0.875rem'
                        }}
                      >
                        <Plus size={16} /> Choose Images
                      </label>
                      <span className="ml-3 text-sm text-gray-500" style={{ marginLeft: '12px' }}>
                        {selectedFiles.length} file(s) selected
                      </span>
                    </div>

                    {/* Previews Grid */}
                    {previews.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Pending Uploads:</p>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {previews.map((preview, index) => (
                            <div key={index} className="relative group" style={{ position: 'relative', height: '80px', borderRadius: '0.375rem', overflow: 'hidden' }}>
                              <img
                                src={preview}
                                alt="preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <button
                                onClick={() => handleRemoveFile(index)}
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                  background: 'rgba(0,0,0,0.6)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Action */}
                    <Button
                      onClick={handleBatchUpload}
                      disabled={uploading || selectedFiles.length === 0}
                      loading={uploading}
                    >
                      <Upload size={16} />
                      {uploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Images`}
                    </Button>
                  </div>
                </div>
              </div>

              {galleryImages.length === 0 ? (
                <EmptyState
                  icon={Images}
                  title="No images uploaded"
                  description="Upload images to create a gallery for this event."
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img._id} className="card card-hover bg-white border border-gray-200">
                      <div className="card-body p-2">
                        <div style={{ position: 'relative', width: '100%', height: '120px' }} className="group">
                          <img
                            src={`${ApiUrl}${img.fileUrl.replace("/api", "")}`}
                            alt="Gallery"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "0.375rem",
                            }}
                          />
                          <button
                            onClick={() => handleDeleteGalleryImage(img._id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 10
                            }}
                            title="Delete Image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
