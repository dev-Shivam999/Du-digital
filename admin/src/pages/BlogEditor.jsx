import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog, createBlog, updateBlog } from "../services/api";
import { PageHeader, Button, FormGroup, Input } from "../components/UI";
import { useToast, ToastContainer } from "../components/Toast";
import { Save, X, Image, FileText, ArrowLeft } from "lucide-react";
import TipTapEditor from "./editor";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const editorRef = useRef(null);
  const isDirty = useRef(false);   // true when user has unsaved changes
  const isSaved = useRef(false);   // true after successful submit

  const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) return `${BackendImagesURL}/api${imagePath}`;
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: "",
    authorName: "DU Digital Global",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
  });
  const slugManuallyEdited = useRef(false);

  // Helper: generate slug from title (mirrors backend logic)
  const toSlug = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s_-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'seo-title' | 'seo-desc'
  const [slugFocused, setSlugFocused] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) fetchBlogDetails();
  }, [id]);

  // ── Warn before tab close / refresh if there are unsaved changes ────────────
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty.current || isSaved.current) return;
      e.preventDefault();
      e.returnValue = ''; // triggers browser's native "Leave site?" dialog
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── Warn on React Router navigation (back button, sidebar links) ────────────
  useEffect(() => {
    if (!isDirty.current || isSaved.current) return;
    // Mark dirty so the effect re-runs when formData changes
  }, [formData]);

  const fetchBlogDetails = async () => {
    try {
      const data = await getBlog(id);
      slugManuallyEdited.current = true; // treat existing slug as manually set
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        content: data.content || "",
        featuredImage: data.featuredImage || "",
        category: data.category || "",
        tags: data.tags || "",
        authorName: data.author?.name || "DU Digital Global",
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        focusKeyword: data.focusKeyword || "",
      });
      if (data.featuredImage) setFeaturedPreview(getImageUrl(data.featuredImage));
    } catch (error) {
      showError("Failed to load blog details");
      navigate("/blogs");
    } finally {
      setInitialLoading(false);
    }
  };

  // Mark dirty on any field change
  const markDirty = () => { isDirty.current = true; };

  // Safe navigate — warns if unsaved changes
  const safeNavigate = (path) => {
    if (isDirty.current && !isSaved.current) {
      const ok = window.confirm('You have unsaved changes. Leave without saving?');
      if (!ok) return;
    }
    navigate(path);
  };

  const handleFeaturedImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    markDirty();
    setFeaturedImageFile(file);
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
    if (formData.slug.trim()) submitData.append("slug", toSlug(formData.slug));
    submitData.append("content", finalContent);
    submitData.append("category", formData.category);
    submitData.append("tags", formData.tags);
    submitData.append("author[name]", formData.authorName);
    submitData.append("seoTitle", formData.seoTitle);
    submitData.append("seoDescription", formData.seoDescription);
    submitData.append("focusKeyword", formData.focusKeyword);

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
      isSaved.current = true;   // clear dirty flag — safe to navigate
      isDirty.current = false;
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
            <Button variant="secondary" onClick={() => safeNavigate("/blogs")}>
              <ArrowLeft size={16} />
              Back to Blogs
            </Button>
          </div>
        }
      />

      {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid #e5e7eb' }}>
        {[
          { key: 'content', label: '1. Content' },
          { key: 'seo-title', label: '2. SEO Title' },
          { key: 'seo-desc', label: '3. SEO Description' },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #FF1033' : '2px solid transparent',
              background: 'none',
              fontWeight: activeTab === tab.key ? 700 : 400,
              color: activeTab === tab.key ? '#FF1033' : '#6b7280',
              cursor: 'pointer',
              fontSize: 14,
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Tab 1: Content ─────────────────────────────────────────────── */}
        {activeTab === 'content' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Basic Info */}
              <div className="card">
                <div className="card-header">
                  <h3 className="mb-0 d-flex align-items-center gap-2"><FileText size={18} /> Basic Information</h3>
                </div>
                <div className="card-body">
                  <FormGroup label="Title *">
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => {
                        markDirty();
                        const newTitle = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: newTitle,
                          // Auto-fill slug only if user hasn't manually edited it
                          slug: slugManuallyEdited.current ? prev.slug : toSlug(newTitle),
                        }));
                      }}
                      placeholder="Enter blog title..."
                      required
                    />
                  </FormGroup>
                  <FormGroup label="Slug (URL)">
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 12, color: '#9ca3af', pointerEvents: 'none', whiteSpace: 'nowrap'
                      }}>
                        /blog/
                      </div>
                      <Input
                        type="text"
                        value={formData.slug}
                        onFocus={() => setSlugFocused(true)}
                        onBlur={() => { setSlugFocused(false); setFormData((p) => ({ ...p, slug: toSlug(p.slug) })); }}
                        onChange={(e) => {
                          markDirty();
                          slugManuallyEdited.current = true;
                          setFormData((p) => ({ ...p, slug: e.target.value }));
                        }}
                        placeholder="auto-generated-from-title"
                        style={{ paddingLeft: 44 }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>
                      Shown in URL: <code style={{ background: '#f3f4f6', padding: '1px 4px', borderRadius: 3 }}>dudigitalglobal.com/blog/{formData.slug || 'your-blog-slug'}</code>
                    </div>
                  </FormGroup>
                  <FormGroup label="Category">
                    <Input type="text" value={formData.category} onChange={(e) => { markDirty(); setFormData({ ...formData, category: e.target.value }); }} placeholder="e.g. Visa, Business, Travel" />
                  </FormGroup>
                  <FormGroup label="Tags / Short Description">
                    <Input type="text" value={formData.tags} onChange={(e) => { markDirty(); setFormData({ ...formData, tags: e.target.value }); }} placeholder="Short description or comma-separated tags" />
                  </FormGroup>
                  <FormGroup label="Author Name">
                    <Input type="text" value={formData.authorName} onChange={(e) => { markDirty(); setFormData({ ...formData, authorName: e.target.value }); }} placeholder="Author name" />
                  </FormGroup>
                </div>
              </div>

              {/* Featured Image */}
              <div className="card">
                <div className="card-header">
                  <h3 className="mb-0 d-flex align-items-center gap-2"><Image size={18} /> Featured Image</h3>
                </div>
                <div className="card-body">
                  <FormGroup label="Upload Image">
                    <input type="file" className="form-control" accept="image/*" onChange={handleFeaturedImage} />
                  </FormGroup>
                  <FormGroup label="Or paste image URL">
                    <Input
                      type="text"
                      value={formData.featuredImage.startsWith('blob:') ? '' : formData.featuredImage}
                      onChange={(e) => { markDirty(); setFormData({ ...formData, featuredImage: e.target.value }); setFeaturedPreview(e.target.value); setFeaturedImageFile(null); }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </FormGroup>
                  {featuredPreview && (
                    <img src={featuredPreview} alt="Preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 8 }} onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><h3 className="mb-0">Content *</h3></div>
              <div className="card-body" style={{ padding: 0 }}>
                <TipTapEditor
                  ref={editorRef}
                  value={formData.content}
                  onChange={(html) => { markDirty(); setFormData((prev) => ({ ...prev, content: html })); }}
                  placeholder="Start writing your blog content..."
                />
              </div>
            </div>
          </>
        )}

        {/* ── Tab 2: SEO Title ───────────────────────────────────────────── */}
        {activeTab === 'seo-title' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h3 className="mb-0">SEO Title</h3>
              <p className="text-muted mb-0" style={{ fontSize: 13, marginTop: 4 }}>
                The title shown in Google search results. Ideal length: 50–60 characters.
              </p>
            </div>
            <div className="card-body">
              <FormGroup label="SEO Title">
                <Input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => { markDirty(); setFormData({ ...formData, seoTitle: e.target.value }); }}
                  placeholder={formData.title || "Enter SEO title..."}
                  maxLength={70}
                />
                <div style={{ fontSize: 12, color: formData.seoTitle.length > 60 ? '#dc2626' : '#6b7280', marginTop: 4 }}>
                  {formData.seoTitle.length}/60 characters {formData.seoTitle.length > 60 ? '— too long' : ''}
                </div>
              </FormGroup>
              <FormGroup label="Focus Keyword">
                <Input
                  type="text"
                  value={formData.focusKeyword}
                  onChange={(e) => { markDirty(); setFormData({ ...formData, focusKeyword: e.target.value }); }}
                  placeholder="e.g. India e-Visa, Dubai company setup"
                />
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  The main keyword this blog targets. Used for SEO analysis.
                </p>
              </FormGroup>

              {/* Google preview */}
              <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>GOOGLE PREVIEW</p>
                <div style={{ fontSize: 18, color: '#1a0dab', marginBottom: 2 }}>
                  {formData.seoTitle || formData.title || 'Blog Title'}
                </div>
                <div style={{ fontSize: 13, color: '#006621' }}>dudigitalglobal.com › blog › {formData.slug || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'blog-slug'}</div>
                <div style={{ fontSize: 13, color: '#545454', marginTop: 4 }}>
                  {formData.seoDescription || formData.tags || 'Meta description will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: SEO Description ─────────────────────────────────────── */}
        {activeTab === 'seo-desc' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <h3 className="mb-0">SEO Description</h3>
              <p className="text-muted mb-0" style={{ fontSize: 13, marginTop: 4 }}>
                The description shown below the title in Google results. Ideal: 150–160 characters.
              </p>
            </div>
            <div className="card-body">
              <FormGroup label="Meta Description">
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => { markDirty(); setFormData({ ...formData, seoDescription: e.target.value }); }}
                  placeholder="Write a compelling description that makes users want to click..."
                  maxLength={200}
                  rows={4}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
                <div style={{ fontSize: 12, color: formData.seoDescription.length > 160 ? '#dc2626' : '#6b7280', marginTop: 4 }}>
                  {formData.seoDescription.length}/160 characters {formData.seoDescription.length > 160 ? '— too long' : ''}
                </div>
              </FormGroup>

              {/* Google preview */}
              <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 600 }}>GOOGLE PREVIEW</p>
                <div style={{ fontSize: 18, color: '#1a0dab', marginBottom: 2 }}>
                  {formData.seoTitle || formData.title || 'Blog Title'}
                </div>
                <div style={{ fontSize: 13, color: '#006621' }}>dudigitalglobal.com › blog › {formData.slug || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'blog-slug'}</div>
                <div style={{ fontSize: 13, color: '#545454', marginTop: 4 }}>
                  {formData.seoDescription || 'Meta description will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Submit */}
        <div className="d-flex justify-content-end gap-3" style={{ marginBottom: 32 }}>
          <Button type="button" variant="secondary" onClick={() => safeNavigate("/blogs")}>
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
