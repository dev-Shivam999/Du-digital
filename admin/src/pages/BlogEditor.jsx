import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { getBlog, createBlog, updateBlog } from "../services/api";
import { PageHeader, Button, FormGroup, Input } from "../components/UI";
import { useToast, ToastContainer } from "../components/Toast";
import { Save, X, Eye, Image, Tag, User, FileText } from "lucide-react";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Handle /api/ paths - use BackendURL directly
    if (imagePath.startsWith('/api/')) {
      return `${BackendImagesURL}${imagePath}`;
    }
    // Handle /uploads/ paths
    if (imagePath.startsWith('/uploads/')) {
      return `${BackendImagesURL}/api${imagePath}`;
    }
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: "",
    authorName: "DU Digital Global",
  });
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchBlogDetails();
    }
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const data = await getBlog(id);
      setFormData({
        title: data.title,
        content: data.content,
        featuredImage: data.featuredImage || "",
        category: data.category || "",
        tags: data.tags ? data.tags : "",
        authorName: data.author?.name || "DU Digital Global",
      });
    } catch (error) {
      console.error("Error fetching blog details:", error);
      showError("Failed to load blog details");
      navigate("/blogs");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("category", formData.category);
    submitData.append("author[name]", formData.authorName);

    submitData.append("tags", formData.tags);

    // Handle Image
    if (featuredImageFile) {
      submitData.append("featuredImage", featuredImageFile);
    } else {
      submitData.append("featuredImage", formData.featuredImage);
    }

    try {
      if (isEditMode) {
        await updateBlog(id, submitData);
        showSuccess("Blog updated successfully");
      } else {
        await createBlog(submitData);
        showSuccess("Blog created successfully");
      }
      navigate("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      showError("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading blog details...
      </div>
    );
  }

  if (preview) {
    return (
      <div className="w-full">
        <PageHeader
          title="Blog Preview"
          description="Preview how your blog will look"
          actions={
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setPreview(false)}>
                <X size={16} />
                Close Preview
              </Button>
            </div>
          }
        />

        <div className="card">
          <div className="card-body">
            {formData.featuredImage && (
              <img
                src={getImageUrl(formData.featuredImage)}
                alt={formData.title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              />
            )}
            <h1 className="mb-3">{formData.title || "Untitled Blog"}</h1>
            <div className="d-flex align-items-center gap-3 mb-4 text-muted">
              <div className="d-flex align-items-center gap-1">
                <User size={16} />
                <span>{formData.authorName}</span>
              </div>
              {formData.category && (
                <div className="d-flex align-items-center gap-1">
                  <Tag size={16} />
                  <span>{formData.category}</span>
                </div>
              )}
            </div>
            <div className="blog-content " data-color-mode="light">
              <MDEditor.Markdown source={formData.content} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <PageHeader
        title={isEditMode ? "Edit Blog" : "Create New Blog"}
        description="Write and publish engaging content for your audience"
        actions={
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPreview(true)}
              disabled={!formData.title && !formData.content}>
              <Eye size={16} />
              Preview
            </Button>
            <Button variant="secondary" onClick={() => navigate("/blogs")}>
              <X size={16} />
              Cancel
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0 d-flex align-items-center gap-2">
                <FileText size={20} />
                Basic Information
              </h3>
            </div>
            <div className="card-body">
              <FormGroup label="Title" required>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter blog title..."
                  required
                />
              </FormGroup>

              <FormGroup label="Category">
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Visa, Business, Technology"
                />
              </FormGroup>

              <FormGroup label="Short Title">
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </FormGroup>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="mb-0 d-flex align-items-center gap-2">
                <Image size={20} />
                Media & Author
              </h3>
            </div>
            <div className="card-body">
              <FormGroup label="Featured Image URL">
                <Input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                <div className="mt-2">
                  <label className="form-label small text-muted">
                    Or Upload Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFeaturedImageFile(e.target.files[0]);
                        // Optional: Create object URL for preview
                        setFormData({
                          ...formData,
                          featuredImage: URL.createObjectURL(e.target.files[0]),
                        });
                      }
                    }}
                  />
                </div>
                {formData.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "0.375rem",
                        border: "1px solid #e2e8f0",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </FormGroup>

              <FormGroup label="Author Name">
                <Input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                  placeholder="Author name"
                />
              </FormGroup>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3 className="mb-0">Content (Markdown)</h3>
            <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
              Use Markdown syntax to format your content. You can add headings,
              lists, links, images, and more.
            </p>
          </div>
          <div className="card-body">
            <div className="markdown-editor-container">
              <MDEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value || "" })
                }
                height={400}
                preview="edit"
                hideToolbar={false}
                visibleDragBar={false}
                data-color-mode="light"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/blogs")}>
            <X size={16} />
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!formData.title || !formData.content}>
            <Save size={16} />
            {loading ? "Saving..." : isEditMode ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
