import { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";
import {
  PageHeader,
  StatCard,
  Badge,
  Button,
  Input,
  FormGroup,
} from "../components/UI";
import { SkeletonTable } from "../components/LoadingStates";

const ApplicantManager = () => {
  const [applicants, setApplicants] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCareers();
    fetchApplicants();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [selectedCareer]);

  const fetchCareers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/careers`);
      setCareers(response.data);
    } catch (error) {
      console.error("Error fetching careers:", error);
    }
  };

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/employees`;
      if (selectedCareer) {
        url += `?careerId=${selectedCareer}`;
      }
      const response = await axios.get(url);
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.career &&
        applicant.career.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getJobStats = () => {
    const totalApplicants = applicants.length;
    const uniqueJobs = new Set(
      applicants.map((a) => a.career?._id).filter(Boolean)
    ).size;
    const recentApplicants = applicants.filter((a) => {
      const applicationDate = new Date(a.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return applicationDate >= weekAgo;
    }).length;

    return { totalApplicants, uniqueJobs, recentApplicants };
  };

  const { totalApplicants, uniqueJobs, recentApplicants } = getJobStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPhoneForTel = (phone) => {
    if (!phone) return "";

    if (typeof phone === "object" && phone !== null) {
      const phoneNumber =
        phone.phoneNumber ||
        phone.fullNumber ||
        phone.number ||
        phone.phone ||
        phone.mobile ||
        phone.tel;
      return phoneNumber ? String(phoneNumber).replace(/\D/g, "") : "";
    }

    if (typeof phone === "string") {
      return phone.replace(/\D/g, "");
    }

    if (typeof phone === "number") {
      return String(phone).replace(/\D/g, "");
    }

    return "";
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    // Handle JSON object phone data
    if (typeof phone === "object" && phone !== null) {
      // Try different possible keys for phone number
      const phoneNumber =
        phone.phoneNumber ||
        phone.fullNumber ||
        phone.number ||
        phone.phone ||
        phone.mobile ||
        phone.tel;

      if (phoneNumber) {
        // Clean and format the phone number
        const cleaned = String(phoneNumber).replace(/\D/g, "");
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(
            3,
            6
          )}-${cleaned.slice(6)}`;
        }
        if (cleaned.length === 11 && cleaned.startsWith("1")) {
          // Handle US numbers with country code
          const withoutCountry = cleaned.slice(1);
          return `(${withoutCountry.slice(0, 3)}) ${withoutCountry.slice(
            3,
            6
          )}-${withoutCountry.slice(6)}`;
        }
        return String(phoneNumber);
      }

      // If it's an object but no recognizable phone field, return N/A
      return "N/A";
    }

    // Handle string phone data
    if (typeof phone === "string") {
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
          6
        )}`;
      }
      if (cleaned.length === 11 && cleaned.startsWith("1")) {
        const withoutCountry = cleaned.slice(1);
        return `(${withoutCountry.slice(0, 3)}) ${withoutCountry.slice(
          3,
          6
        )}-${withoutCountry.slice(6)}`;
      }
      return phone;
    }

    // Handle number type
    if (typeof phone === "number") {
      const phoneStr = String(phone);
      const cleaned = phoneStr.replace(/\D/g, "");
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
          6
        )}`;
      }
      return phoneStr;
    }

    return "N/A";
  };

  const openApplicantModal = (applicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplicant(null);
  };

  if (loading) {
    return (
      <div className="page-content">
        <PageHeader
          title="Job Applicants"
          description="Manage and review job applications"
        />
        <SkeletonTable rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <PageHeader
        title="Job Applicants"
        description="Manage and review job applications"
        stats={[
          { label: `${totalApplicants} Total`, variant: "bg-primary" },
          { label: `${recentApplicants} This Week`, variant: "bg-success" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Applicants"
          count={totalApplicants}
          icon={Users}
          color="var(--primary-500)"
          description="All time applications"
        />
        <StatCard
          title="Active Job Positions"
          count={uniqueJobs}
          icon={Briefcase}
          color="var(--success-500)"
          description="Positions with applications"
        />
        <StatCard
          title="Recent Applications"
          count={recentApplicants}
          icon={Clock}
          color="var(--warning-500)"
          description="Last 7 days"
        />
      </div>

      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="d-flex gap-4 align-items-end">
            <FormGroup label="Search Applicants" className="flex-1">
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
                <Input
                  type="text"
                  placeholder="Search by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "44px" }}
                />
              </div>
            </FormGroup>
            <FormGroup label="Filter by Job">
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
                  value={selectedCareer}
                  onChange={(e) => setSelectedCareer(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: "44px" }}>
                  <option value="">All Positions</option>
                  {careers.map((career) => (
                    <option key={career._id} value={career._id}>
                      {career.title}
                    </option>
                  ))}
                </select>
              </div>
            </FormGroup>
          </div>
        </div>
      </div>

      {/* Applicants Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">Job Applications</h3>
          <p className="text-muted mb-0">
            {filteredApplicants.length} applicant
            {filteredApplicants.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {filteredApplicants.length === 0 ? (
            <div className="text-center" style={{ padding: "3rem" }}>
              <Users
                size={48}
                className="text-muted mb-3"
                style={{ opacity: 0.3 }}
              />
              <h3 className="text-muted">No applicants found</h3>
              <p className="text-muted">
                {searchTerm || selectedCareer
                  ? "Try adjusting your search or filter criteria"
                  : "No job applications have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-0">
              {filteredApplicants.map((applicant, index) => (
                <div
                  key={applicant._id}
                  className="applicant-card"
                  style={{
                    padding: "1.5rem",
                    borderBottom:
                      index < filteredApplicants.length - 1
                        ? "1px solid var(--gray-200)"
                        : "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => openApplicantModal(applicant)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--gray-50)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}>
                  <div className="d-flex align-items-center justify-content-between">
                    {/* Left Section - Applicant Info */}
                    <div className="d-flex align-items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          backgroundColor: "var(--primary-100)",
                          color: "var(--primary-600)",
                          fontWeight: "600",
                          fontSize: "1.25rem",
                          flexShrink: 0,
                        }}>
                        {applicant.fullName.charAt(0).toUpperCase()}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <h4
                            className="mb-0"
                            style={{
                              fontWeight: "600",
                              color: "var(--gray-800)",
                            }}>
                            {applicant.fullName}
                          </h4>
                          {applicant.career ? (
                            <Badge variant="primary" size="sm">
                              {applicant.career.title}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" size="sm">
                              General Application
                            </Badge>
                          )}
                        </div>

                        {/* Contact Info Row */}
                        <div className="d-flex align-items-center gap-6 mb-2">
                          <div className="d-flex align-items-center gap-2 contact-info-item">
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "var(--primary-50)",
                                color: "var(--primary-600)",
                              }}>
                              <Mail size={12} />
                            </div>
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "var(--gray-600)",
                              }}>
                              {applicant.email}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2 contact-info-item">
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "var(--success-50)",
                                color: "var(--success-600)",
                              }}>
                              <Phone size={12} />
                            </div>
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "var(--gray-600)",
                                fontFamily: "monospace",
                                fontWeight: "500",
                              }}>
                              {formatPhone(applicant.phone)}
                            </span>
                          </div>
                        </div>

                        {/* Application Date */}
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              backgroundColor: "var(--gray-100)",
                              color: "var(--gray-500)",
                            }}>
                            <Calendar size={12} />
                          </div>
                          <span
                            style={{
                              fontSize: "0.875rem",
                              color: "var(--gray-500)",
                            }}>
                            Applied on {formatDate(applicant.createdAt)} at{" "}
                            {new Date(applicant.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Resume & Actions */}
                    <div className="d-flex align-items-center gap-4">
                      {/* Resume Status */}
                      <div className="d-flex align-items-center gap-2">
                        {applicant.CVlink ? (
                          <>
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                backgroundColor: "var(--success-50)",
                                color: "var(--success-600)",
                              }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  color: "var(--gray-800)",
                                }}>
                                Resume Available
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--success-600)",
                                }}>
                                Ready to download
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                backgroundColor: "var(--gray-100)",
                                color: "var(--gray-400)",
                              }}>
                              <FileText size={18} />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  color: "var(--gray-600)",
                                }}>
                                No Resume
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--gray-500)",
                                }}>
                                Not provided
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="action-btn btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            openApplicantModal(applicant);
                          }}
                          title="View Details"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "var(--primary-50)",
                            color: "var(--primary-600)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor =
                              "var(--primary-100)";
                            e.target.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor =
                              "var(--primary-50)";
                            e.target.style.transform = "scale(1)";
                          }}>
                          <Eye size={18} />
                        </button>
                        {applicant.CVlink && (
                          <a
                            href={`${import.meta.env.VITE_BACKEND_IMAGES_URL}/api${applicant.CVlink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-flex align-items-center justify-content-center"
                            onClick={(e) => e.stopPropagation()}
                            title="Download Resume"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              backgroundColor: "var(--success-50)",
                              color: "var(--success-600)",
                              textDecoration: "none",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                "var(--success-100)";
                              e.target.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor =
                                "var(--success-50)";
                              e.target.style.transform = "scale(1)";
                            }}>
                            <Download size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applicant Details Modal */}
      {showModal && selectedApplicant && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Applicant Details</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-600)",
                    fontWeight: "600",
                    fontSize: "1.5rem",
                  }}>
                  {selectedApplicant.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="mb-1">{selectedApplicant.fullName}</h3>
                  <p className="text-muted mb-0">
                    Applied on {formatDate(selectedApplicant.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="form-label">Position Applied For</label>
                  <div>
                    {selectedApplicant.career ? (
                      <Badge variant="primary">
                        {selectedApplicant.career.title}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">General Application</Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "var(--primary-50)",
                        color: "var(--primary-600)",
                      }}>
                      <Mail size={16} />
                    </div>
                    <a
                      href={`mailto:${selectedApplicant.email}`}
                      className="text-primary"
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                      {selectedApplicant.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: "var(--success-50)",
                        color: "var(--success-600)",
                      }}>
                      <Phone size={16} />
                    </div>
                    <a
                      href={`tel:${getPhoneForTel(selectedApplicant.phone)}`}
                      className="text-primary"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        fontFamily: "monospace",
                      }}>
                      {formatPhone(selectedApplicant.phone)}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="form-label">Resume/CV</label>
                  {selectedApplicant.CVlink ? (
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor: "var(--success-50)",
                          color: "var(--success-600)",
                        }}>
                        <FileText size={16} />
                      </div>
                      <a
                        href={`${import.meta.env.VITE_BACKEND_IMAGES_URL}/api${selectedApplicant.CVlink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary d-flex align-items-center gap-2"
                        style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                        <Download size={14} />
                        Download Resume
                      </a>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center"
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
                        No resume uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              {selectedApplicant.CVlink && (
                <Button
                  variant="primary"
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_BACKEND_IMAGES_URL}/api${selectedApplicant.CVlink}`,
                      "_blank"
                    )
                  }>
                  <Download size={16} />
                  Download Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantManager;
