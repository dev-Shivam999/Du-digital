import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../services/api";
import {
  PageHeader,
  EmptyState,
  Button,
  LoadingSpinner,
} from "../components/UI";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const limit = 10;

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs(page, limit);
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };


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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteBlog(id);
      alert("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
  ];

  if (loading) {
    return <LoadingSpinner text="Loading blogs..." />;
  }

  return (
    <div>
      <PageHeader
        title="Blog Management"
        description="Create, edit, and manage your blog content"
        stats={[
          { label: `${blogs.length} Total Blogs`, variant: "bg-primary" },
        ]}
        actions={
          <Link to="/blogs/new" className="btn btn-primary">
            <Plus size={16} />
            Create New Blog
          </Link>
        }
      />

      {/* Search and Filter Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex gap-3 align-items-center">
            <div className="d-flex align-items-center gap-2 flex-1">
              <Search size={20} className="text-muted" />
              <input
                type="text"
                className="form-control"
                placeholder="Search blogs by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: "none", boxShadow: "none" }}
              />
            </div>
            {categories.length > 0 && (
              <div className="d-flex align-items-center gap-2">
                <Filter size={20} className="text-muted" />
                <select
                  className="form-control"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ minWidth: "150px" }}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No blogs found"
          description={
            searchTerm || selectedCategory
              ? "No blogs match your current filters. Try adjusting your search criteria."
              : "Start creating engaging content for your audience."
          }
          action={
            <Link to="/blogs/new" className="btn btn-primary">
              <Plus size={16} />
              Create Your First Blog
            </Link>
          }
        />
      ) : (
        <>
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 gap-4 mb-4">
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="card">
                <div className="card-body">
                  <div className="d-flex gap-4">
                    {/* Featured Image */}
                    <div className="flex-shrink-0">
                      {blog.featuredImage ? (
                        <img
                          src={getImageUrl(blog.featuredImage)}
                          alt={blog.title}
                          style={{
                            width: "120px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                            border: "1px solid #e2e8f0",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
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
                          <FileText size={24} className="text-muted" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3
                          className="mb-1"
                          style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                          {blog.title}
                        </h3>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/blogs/edit/${blog._id}`}
                            className="btn btn-sm btn-secondary"
                            title="Edit blog">
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id, blog.title)}
                            className="btn btn-sm btn-danger"
                            title="Delete blog">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-4 mb-2 text-muted">
                        <div className="d-flex align-items-center gap-1">
                          <User size={14} />
                          <span style={{ fontSize: "0.875rem" }}>
                            {blog.author?.name || "Unknown Author"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={14} />
                          <span style={{ fontSize: "0.875rem" }}>
                            {formatDate(blog.publishedAt)}
                          </span>
                        </div>
                        {blog.category && (
                          <div className="d-flex align-items-center gap-1">
                            <Tag size={14} />
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                fontSize: "0.75rem",
                              }}>
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>
                        {truncateText(
                          blog.content?.replace(/<[^>]*>/g, ""),
                          150
                        )}
                      </p>

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="d-flex gap-1 mt-2">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#e0f2fe",
                              color: "#0369a1",
                              fontSize: "0.75rem",
                            }}>
                            {blog.tags}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Showing page {page} of {totalPages}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}>
                      <ChevronLeft size={16} />
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}>
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogManager;
