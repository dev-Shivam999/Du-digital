import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Building,
  Clock,
  X,
  Users,
  FileText,
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
  CareerLoadingCard,
  FormLoadingOverlay,
} from "../components/LoadingStates";
import axios from "axios";

const CareerManager = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    department: "",
    experience: "",
    jobType: "",
    description: "",
    responsibilities: "",
    qualifications: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/careers`);
      setCareers(response.data);
    } catch (error) {
      console.error("Error fetching careers:", error);
      showError("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...formData,
      responsibilities: formData.responsibilities
        .split("\n")
        .filter((line) => line.trim() !== ""),
      qualifications: formData.qualifications
        .split("\n")
        .filter((line) => line.trim() !== ""),
    };

    try {
      if (editingCareer) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/careers/${editingCareer._id}`, data);
        showSuccess("Job posting updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/careers`, data);
        showSuccess("Job posting created successfully");
      }
      fetchCareers();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving career:", error);
      showError(editingCareer ? "Failed to update job posting" : "Failed to create job posting");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/careers/${id}`);
      showSuccess("Job posting deleted successfully");
      fetchCareers();
    } catch (error) {
      console.error("Error deleting career:", error);
      showError("Failed to delete job posting");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      department: "",
      experience: "",
      jobType: "",
      description: "",
      responsibilities: "",
      qualifications: "",
    });
    setEditingCareer(null);
  };

  const handleEdit = (job) => {
    setEditingCareer(job);
    setFormData({
      title: job.title || "",
      location: job.location || "",
      department: job.department || "",
      experience: job.experience || "",
      jobType: job.jobType || "",
      description: job.description || "",
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities.join("\n")
        : job.responsibilities || "",
      qualifications: Array.isArray(job.qualifications)
        ? job.qualifications.join("\n")
        : job.qualifications || "",
    });
    setIsModalOpen(true);
  };

  const getJobTypeColor = (jobType) => {
    switch (jobType?.toLowerCase()) {
      case "full time":
        return { bg: "#dcfce7", color: "#16a34a" };
      case "part time":
        return { bg: "#fef3c7", color: "#d97706" };
      case "contract":
        return { bg: "#dbeafe", color: "#2563eb" };
      case "internship":
        return { bg: "#fce7f3", color: "#ec4899" };
      default:
        return { bg: "#f1f5f9", color: "#64748b" };
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Career & Vacancy Manager"
          description="Loading job postings..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CareerLoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <PageHeader
        title="Career & Vacancy Manager"
        description="Manage job postings and career opportunities"
        stats={[
          {
            label: `${careers.length} Active Positions`,
            variant: "bg-primary",
          },
        ]}
        actions={
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}>
            <Plus size={16} />
            Add Job Post
          </Button>
        }
      />

      {careers.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings found"
          description="Start by creating your first job posting to attract talented candidates."
          action={
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}>
              <Plus size={16} />
              Create Your First Job Post
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((job) => {
            const jobTypeStyle = getJobTypeColor(job.jobType);
            return (
              <div key={job._id} className="card card-hover">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-1">
                      <h3
                        className="mb-2"
                        style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                        {job.title}
                      </h3>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: jobTypeStyle.bg,
                            color: jobTypeStyle.color,
                            fontSize: "0.75rem",
                          }}>
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="action-btn btn-edit"
                        onClick={() => handleEdit(job)}
                        title="Edit job posting">
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(job._id, job.title)}
                        title="Delete job posting">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {job.department && (
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Building size={14} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {job.department}
                        </span>
                      </div>
                    )}
                    {job.location && (
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <MapPin size={14} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {job.location}
                        </span>
                      </div>
                    )}
                    {job.experience && (
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Clock size={14} />
                        <span style={{ fontSize: "0.875rem" }}>
                          {job.experience}
                        </span>
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <p
                      className="text-muted mb-3"
                      style={{ fontSize: "0.875rem", lineHeight: "1.5" }}>
                      {job.description.length > 100
                        ? `${job.description.substring(0, 100)}...`
                        : job.description}
                    </p>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      {job.responsibilities &&
                        job.responsibilities.length > 0 && (
                          <span
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}>
                            {job.responsibilities.length} responsibilities
                          </span>
                        )}
                      {job.qualifications && job.qualifications.length > 0 && (
                        <span
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}>
                          {job.qualifications.length} qualifications
                        </span>
                      )}
                    </div>
                    <span className="status-indicator status-active">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "800px", maxHeight: "90vh" }}>
            <div className="modal-header">
              <h2>{editingCareer ? "Edit Job Vacancy" : "Add Job Vacancy"}</h2>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-section">
              {saving && (
                <FormLoadingOverlay message={editingCareer ? "Updating job posting..." : "Creating job posting..."} />
              )}

              <div className="modal-body" style={{ overflowY: "auto" }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Job Title" required>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </FormGroup>

                  <FormGroup label="Location">
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai, Remote"
                    />
                  </FormGroup>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormGroup label="Department">
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Engineering, Marketing"
                    />
                  </FormGroup>

                  <FormGroup label="Experience Required">
                    <Input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 3-5 years, Entry Level"
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Job Type">
                  <select
                    className="form-control"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}>
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </FormGroup>

                <FormGroup label="Job Description">
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the role and what the candidate will be doing..."
                    rows={4}
                  />
                </FormGroup>

                <FormGroup label="Responsibilities (One per line)">
                  <textarea
                    className="form-control"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    placeholder="- Develop and maintain web applications&#10;- Collaborate with cross-functional teams&#10;- Write clean, maintainable code"
                    rows={6}
                  />
                  <small className="text-muted">
                    Enter each responsibility on a new line. You can use bullet
                    points or dashes.
                  </small>
                </FormGroup>

                <FormGroup label="Qualifications (One per line)">
                  <textarea
                    className="form-control"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    placeholder="- Bachelor's degree in Computer Science&#10;- 3+ years of React experience&#10;- Strong problem-solving skills"
                    rows={6}
                  />
                  <small className="text-muted">
                    Enter each qualification on a new line. You can use bullet
                    points or dashes.
                  </small>
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
                  disabled={!formData.title}>
                  {editingCareer ? "Update Job Post" : "Create Job Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerManager;
