import { useState, useEffect } from "react";
import {
  getCategories,
  getReportsByCategory,
  createReport,
  updateReport,
  deleteReport,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import ReportForm from "../components/ReportForm";
import { Trash2, FileText, Folder, Edit3, Plus, X } from "lucide-react";

const InvestorRelations = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Category management state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", title: "" });
  const [savingCategory, setSavingCategory] = useState(false);

  // Remove /api from base URL for file access (files are served from root)
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchReports(selectedCategory.slug);
    } else {
      setReports([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchReports = async (slug) => {
    setLoading(true);
    try {
      const data = await getReportsByCategory(slug);
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData, reportId) => {
    try {
      if (reportId) {
        await updateReport(reportId, formData);
        setEditingReport(null);
      } else {
        await createReport(formData);
      }
      if (selectedCategory) {
        fetchReports(selectedCategory.slug);
      }
    } catch (error) {
      console.error("Error saving report:", error);
      throw error;
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await deleteReport(id);
      if (selectedCategory) {
        fetchReports(selectedCategory.slug);
      }
    } catch (error) {
      console.error("Error deleting report", error);
      alert("Failed to delete report");
    }
  };

  // Category handlers
  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, title: category.title || "" });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", title: "" });
    }
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({ name: "", title: "" });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert("Category name is required");
      return;
    }

    setSavingCategory(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryForm);
        // Update selected category if it was the one being edited
        if (selectedCategory?._id === editingCategory._id) {
          setSelectedCategory({ ...selectedCategory, ...categoryForm });
        }
      } else {
        await createCategory(categoryForm);
      }
      fetchCategories();
      closeCategoryModal();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat, e) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat._id);
      if (selectedCategory?._id === cat._id) {
        setSelectedCategory(null);
      }
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleEditCategory = (cat, e) => {
    e.stopPropagation();
    openCategoryModal(cat);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
      {/* Sidebar / Category List */}
      <div
        style={{
          flex: "1",
          minWidth: "280px",
          borderRight: "1px solid #eee",
          paddingRight: "1rem",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0 }}>Categories</h2>
          <button
            type="button"
            onClick={() => openCategoryModal()}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.85rem",
            }}
            title="Add Category">
            <Plus size={16} /> Add
          </button>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {categories.length === 0 ? (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>No categories. Create one to get started.</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background:
                    selectedCategory?._id === cat._id ? "#e6f0ff" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, overflow: "hidden" }}>
                  <Folder size={18} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.name}</span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={(e) => handleEditCategory(cat, e)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#007bff",
                      padding: "4px",
                    }}
                    title="Edit category">
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteCategory(cat, e)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#dc3545",
                      padding: "4px",
                    }}
                    title="Delete category">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: "3" }}>
        {selectedCategory ? (
          <>
            <h1 style={{ marginBottom: "20px" }}>
              {selectedCategory.name} Reports
            </h1>

            <div style={{ marginBottom: "2rem" }}>
              <ReportForm
                categoryId={selectedCategory._id}
                onUploadSuccess={handleUpload}
                editingReport={editingReport}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            <h2>Existing Reports</h2>
            {loading ? (
              <p>Loading reports...</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {reports.length === 0 ? (
                  <p>No reports found.</p>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report._id}
                      style={{
                        padding: "1rem",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: editingReport?._id === report._id ? "#fff9e6" : "#fff",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}>
                        <FileText size={24} color="#555" />
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            {report.title}
                          </div>
                         {report?.email&& <div>
                            {report.email}
                          </div>}

                          <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            {report.financialYear} •{" "}
                            {new Date(report.uploadedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <a
                          href={`${backendUrl}${report.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "none", color: "#007bff" }}>
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => handleEdit(report)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#007bff",
                            padding: "5px",
                          }}
                          title="Edit report">
                          <Edit3 size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(report._id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#dc3545",
                          }}
                          title="Delete report">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
            <Folder size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <p>Select a category to manage reports, or create a new category.</p>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "400px",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>{editingCategory ? "Edit Category" : "Add Category"}</h3>
              <button
                type="button"
                onClick={closeCategoryModal}
                style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCategorySubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Annual Reports"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>Title (Optional)</label>
                <input
                  type="text"
                  value={categoryForm.title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                  placeholder="Display title for the category"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory || !categoryForm.name.trim()}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: savingCategory || !categoryForm.name.trim() ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingCategory || !categoryForm.name.trim() ? "not-allowed" : "pointer",
                  }}>
                  {savingCategory ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorRelations;
