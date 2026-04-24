import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog, createBlog, updateBlog } from "../services/api";
import { PageHeader, Button, FormGroup, Input } from "../components/UI";
import { useToast, ToastContainer } from "../components/Toast";
import { Save, X, Eye, Image, Tag, User, FileText, ArrowLeft } from "lucide-react";
import TipTapEditor from "./editor";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const editorRef = useRef(null);

  const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${BackendImagesURL}/api${imagePath}`;
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
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const data = await getBlog(id);
      setFormData({
        title: data.title || "",
        content: data.content || "",
        featuredImage: data.featuredImage || "",
        category: data.category || "",
        tags: data.tags || "",
        authorName: data.author?.name || "DU Digital Global",
      });
      if (data.featuredImage) setFeaturedPreview(getImageUrl(data.featuredImage));
    } catch (error) {
      showError("Failed to load blog details");
      navigate("/blogs");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFeaturedImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    (file);
    setFeaturedPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return showError("Title is required");
    if (!formData.content.trim()) return showError("Content is required");

    setLoading(true);

    // Step 1: upload all base64 inline images → get HTML with real server URLs
    let finalContent = formData.content;
    try {
      if (editorRef.current?.uploadAndGetHTML) {
        finalContent = await editorRef.current.uploadAndGetHTML();
      }
    } catch (err) {
      console.error('Inline image upload error:', err);
      // Strip any remaining base64 to avoid Multer field size error
      finalContent = finalContent.replace(/src="data:image\/[^"]+"/g, 'src=""');
    }

    // Step 2: build FormData with clean HTML (no base64)
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", finalContent);
    submitData.append("category", formData.category);
    submitData.append("tags", formData.tags);
    submitData.append("author[name]", formData.authorName);

    if (featuredImageFile) {
      submitData.append("featuredImage", featuredImageFile);
    } else if (formData.featuredImage && !formData.featuredImage.startsWith('blob:')) {
      submitData.append("featuredImage", formData.featuredImage);
    }

    try {
      if (isEditMode) {
        await updateBlog(id, submitData);
        showSuccess("Blog updated successfully!");
      } else {
        await createBlog(submitData);
        showSuccess("Blog created successfully!");
      }
      setTimeout(() => navigate("/blogs"), 800);
    } catch (error) {
      showError("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div className="spinner" />
        <span>Loading blog...</span>
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
            <Button variant="secondary" onClick={() => navigate("/blogs")}>
              <ArrowLeft size={16} />
              Back to Blogs
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit}>
        {/* Top row — meta fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Left — Basic Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0 d-flex align-items-center gap-2">
                <FileText size={18} /> Basic Information
              </h3>
            </div>
            <div className="card-body">
              <FormGroup label="Title *">
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title..."
                  required
                />
              </FormGroup>
              <FormGroup label="Category">
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Visa, Business, Travel"
                />
              </FormGroup>
              <FormGroup label="Tags / Short Description">
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Short description or comma-separated tags"
                />
              </FormGroup>
              <FormGroup label="Author Name">
                <Input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Author name"
                />
              </FormGroup>
            </div>
          </div>

          {/* Right — Featured Image */}
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0 d-flex align-items-center gap-2">
                <Image size={18} /> Featured Image
              </h3>
            </div>
            <div className="card-body">
              <FormGroup label="Upload Image">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFeaturedImage}
                />
              </FormGroup>
              <FormGroup label="Or paste image URL">
                <Input
                  type="text"
                  value={formData.featuredImage.startsWith('blob:') ? '' : formData.featuredImage}
                  onChange={(e) => {
                    setFormData({ ...formData, featuredImage: e.target.value });
                    setFeaturedPreview(e.target.value);
                    setFeaturedImageFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
              {featuredPreview && (
                <img
                  src={featuredPreview}
                  alt="Preview"
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 8 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <h3 className="mb-0">Content *</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <TipTapEditor
              ref={editorRef}
              value={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Start writing your blog content..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="d-flex justify-content-end gap-3" style={{ marginBottom: 32 }}>
          <Button type="button" variant="secondary" onClick={() => navigate("/blogs")}>
            <X size={16} /> Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !formData.title || !formData.content}
          >
            <Save size={16} />
            {loading ? "Saving..." : isEditMode ? "Update Blog" : "Publish Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
