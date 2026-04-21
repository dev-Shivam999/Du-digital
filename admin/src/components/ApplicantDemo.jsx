import React from "react";
import {
  Users,
  Calendar,
  Mail,
  Phone,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Briefcase,
  Clock,
  User,
} from "lucide-react";

// Demo component to showcase the enhanced applicant UI features
const ApplicantDemo = () => {
  const demoApplicants = [
    {
      _id: "1",
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "7852008477",
      createdAt: new Date().toISOString(),
      career: { title: "Software Engineer", _id: "1" },
      CVlink: "/uploads/resume1.pdf",
    },
    {
      _id: "2",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "5551234567",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      career: { title: "UI/UX Designer", _id: "2" },
      CVlink: "/uploads/resume2.pdf",
    },
    {
      _id: "3",
      fullName: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "4449876543",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      career: null,
      CVlink: null,
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  };

  return (
    <div className="page-content">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="mb-2">Job Applicants - Enhanced UI Demo</h1>
          <p className="text-muted">
            Modern, responsive design with improved user experience
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary">3 Total</span>
          <span className="badge bg-success">2 This Week</span>
        </div>
      </div>

      {/* Stats Cards Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 stats-grid">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-500)",
                }}>
                <Users size={24} />
              </div>
            </div>
            <h3
              className="mb-1"
              style={{ fontSize: "2rem", fontWeight: "700" }}>
              3
            </h3>
            <p
              className="text-muted mb-1"
              style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Total Applicants
            </p>
            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
              All time applications
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--success-50)",
                  color: "var(--success-500)",
                }}>
                <Briefcase size={24} />
              </div>
            </div>
            <h3
              className="mb-1"
              style={{ fontSize: "2rem", fontWeight: "700" }}>
              2
            </h3>
            <p
              className="text-muted mb-1"
              style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Active Positions
            </p>
            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
              Positions with applications
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--warning-50)",
                  color: "var(--warning-500)",
                }}>
                <Clock size={24} />
              </div>
            </div>
            <h3
              className="mb-1"
              style={{ fontSize: "2rem", fontWeight: "700" }}>
              2
            </h3>
            <p
              className="text-muted mb-1"
              style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              Recent Applications
            </p>
            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
              Last 7 days
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Demo */}
      <div className="card mb-6 filter-section">
        <div className="card-body">
          <div className="d-flex gap-4 align-items-end">
            <div className="flex-1">
              <label className="form-label">Search Applicants</label>
              <div style={{ position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--gray-400)",
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or job title..."
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Filter by Job</label>
              <div style={{ position: "relative", minWidth: "200px" }}>
                <Filter
                  size={20}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--gray-400)",
                  }}
                />
                <select
                  className="form-control"
                  style={{ paddingLeft: "44px" }}>
                  <option value="">All Positions</option>
                  <option value="1">Software Engineer</option>
                  <option value="2">UI/UX Designer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table Demo */}
      <div className="card applicants-table">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table table-enhanced">
              <thead>
                <tr>
                  <th>
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={16} />
                      Applied Date
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center gap-2">
                      <User size={16} />
                      Applicant
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center gap-2">
                      <Briefcase size={16} />
                      Position
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center gap-2">
                      <Mail size={16} />
                      Contact
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={16} />
                      Resume
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoApplicants.map((applicant) => (
                  <tr key={applicant._id} className="applicant-row">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "var(--primary-50)",
                            color: "var(--primary-600)",
                          }}>
                          <Calendar size={16} />
                        </div>
                        <div>
                          <div
                            style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                            {formatDate(applicant.createdAt)}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}>
                            {new Date(applicant.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center applicant-avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "var(--gray-100)",
                            color: "var(--gray-600)",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                          }}>
                          {applicant.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "600",
                              color: "var(--gray-800)",
                            }}>
                            {applicant.fullName}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.875rem" }}>
                            {applicant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {applicant.career ? (
                        <span
                          className="badge bg-primary"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                          }}>
                          {applicant.career.title}
                        </span>
                      ) : (
                        <span
                          className="badge bg-secondary"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.5rem",
                          }}>
                          General Application
                        </span>
                      )}
                    </td>
                    <td>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1 contact-info">
                          <Mail size={14} className="text-muted" />
                          <span style={{ fontSize: "0.875rem" }}>
                            {applicant.email}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 contact-info">
                          <Phone size={14} className="text-muted" />
                          <span
                            style={{ fontSize: "0.875rem" }}
                            className="phone-number">
                            {formatPhone(applicant.phone)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {applicant.CVlink ? (
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center resume-indicator resume-available"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              backgroundColor: "var(--success-50)",
                              color: "var(--success-600)",
                            }}>
                            <FileText size={16} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: "500",
                              }}>
                              Resume Available
                            </div>
                            <div
                              className="d-flex align-items-center gap-1"
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--primary-600)",
                                cursor: "pointer",
                              }}>
                              <Download size={12} />
                              Download
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center resume-indicator"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              backgroundColor: "var(--gray-100)",
                              color: "var(--gray-400)",
                            }}>
                            <FileText size={16} />
                          </div>
                          <span
                            className="text-muted"
                            style={{ fontSize: "0.875rem" }}>
                            No resume
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn btn-view"
                          title="View Details">
                          <Eye size={16} />
                        </button>
                        {applicant.CVlink && (
                          <button
                            className="action-btn btn-edit"
                            title="Download Resume">
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="card mt-6">
        <div className="card-header">
          <h3>Enhanced UI Features</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4>Visual Improvements</h4>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--gray-600)" }}>
                <li>Modern card-based layout with subtle shadows</li>
                <li>Color-coded status indicators and badges</li>
                <li>Professional avatar placeholders</li>
                <li>Enhanced typography and spacing</li>
                <li>Smooth hover animations and transitions</li>
              </ul>
            </div>
            <div>
              <h4>Functionality Enhancements</h4>
              <ul style={{ paddingLeft: "1.5rem", color: "var(--gray-600)" }}>
                <li>Advanced search with real-time filtering</li>
                <li>Statistical overview with key metrics</li>
                <li>Detailed applicant modal with full information</li>
                <li>Improved phone number formatting</li>
                <li>Better resume status visualization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDemo;
