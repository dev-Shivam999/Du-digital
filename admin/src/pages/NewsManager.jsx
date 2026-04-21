import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
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
  NewsLoadingCard,
  FormLoadingOverlay,
} from "../components/LoadingStates";
import axios from "axios";

const NewsManager = () => {
  const ApiUrl=import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    datePublished: "",
    description: "",
    link: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/news`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      showError("Failed to load news");
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
    data.append("datePublished", formData.datePublished);
    data.append("description", formData.description);
    data.append("link", formData.link);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingId) {
        await axios.put(`${ApiUrl}/news/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("News updated successfully");
      } else {
        await axios.post(`${ApiUrl}/news`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("News created successfully");
      }
      fetchNews();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving news:", error);
      showError("Failed to save news");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      datePublished: item.datePublished.split("T")[0],
      description: item.description || "",
      link: item.link,
      image: null,
    });
    setImagePreview(
      item.imageUrl ? `http://localhost:5000${item.imageUrl}` : null
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`${ApiUrl}/news/${id}`);
      showSuccess("News deleted successfully");
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      showError("Failed to delete news");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      datePublished: "",
      description: "",
      link: "",
      image: null,
    });
    setEditingId(null);
    setImagePreview(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="News & Media Manager"
          description="Loading news articles..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsLoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="News & Media Manager"
        description="Manage news articles and media content"
        stats={[
          { label: `${news.length} Total Articles`, variant: "bg-primary" },
        ]}
        actions={
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}>
            <Plus size={16} />
            Add News
          </Button>
        }
      />

      {news.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No news articles found"
          description="Start by creating your first news article to keep your audience informed."
          action={
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}>
              <Plus size={16} />
              Create Your First Article
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {news.map((item) => (
            <div key={item._id} className="card card-hover">
              <div className="card-body">
                <div className="d-flex gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={`${ApiUrl}${item.imageUrl}`}
                        alt={item.title}
                        style={{
                          width: "120px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "120px",
                          height: "80px",
                          backgroundColor: "#f1f5f9",
                          borderRadius: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #e2e8f0",
                        }}>
                        <ImageIcon size={24} className="text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3
                        className="mb-1"
                        style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                        {item.title}
                      </h3>
                      <div className="action-buttons">
                        <button
                          className="action-btn btn-view"
                          onClick={() => window.open(item.link, "_blank")}
                          title="View article">
                          <ExternalLink size={14} />
                        </button>
                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEdit(item)}
                          title="Edit article">
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(item._id, item.title)}
                          title="Delete article">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 mb-2 text-muted">
                      <div className="d-flex align-items-center gap-1">
                        <Calendar size={14} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {formatDate(item.datePublished)}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <LinkIcon size={14} />
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                          style={{ fontSize: "0.875rem" }}>
                          View Article
                        </a>
                      </div>
                    </div>

                    {item.description && (
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>
                        {truncateText(item.description, 150)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit News Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h2>{editingId ? "Edit News Article" : "Add News Article"}</h2>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-section">
              {saving && (
                <FormLoadingOverlay
                  message={
                    editingId ? "Updating article..." : "Creating article..."
                  }
                />
              )}

              <div className="modal-body">
                <FormGroup label="Article Title" required>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title..."
                    required
                  />
                </FormGroup>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Publication Date" required>
                    <Input
                      type="date"
                      name="datePublished"
                      value={formData.datePublished}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Article Link" required>
                    <Input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://example.com/article"
                      required
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Description">
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the article..."
                    rows={4}
                  />
                </FormGroup>

                <FormGroup label="Featured Image">
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
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={
                    !formData.title || !formData.datePublished || !formData.link
                  }>
                  {editingId ? "Update Article" : "Create Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
