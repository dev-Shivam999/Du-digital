import { useEffect, useState } from "react";
import { getStats, getContactStats, getPartnerStats, getTravelInquiryStats, getFormSubmissionStats, getTodayFormSubmissions } from "../services/api";
import {
  FileText,
  Folder,
  Building,
  MapPin,
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
  Plane,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [mainStats, contactStats, partnerStats, travelInquiryStats, formSubmissionStats, todayFormSubmissions] = await Promise.all([
          getStats(),
          getContactStats(),
          getPartnerStats(),
          getTravelInquiryStats(),
          getFormSubmissionStats(),
          getTodayFormSubmissions(),
        ]);

        // Merge stats
        setStats({
          ...mainStats,
          contacts: contactStats,
          partners: partnerStats,
          travelInquiries: travelInquiryStats,
          formSubmissions: formSubmissionStats,
          todayFormSubmissions: todayFormSubmissions,
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading Dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h3 className="text-danger">Error loading dashboard data</h3>
          <p className="text-muted">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Inquiries",
      count: stats.contacts?.today || 0,
      icon: <MessageSquare size={24} />,
      color: "#8b5cf6",
      trend: "+12%",
      description: "New inquiries today",
    },
    {
      title: "Total Inquiries",
      count: stats.contacts?.total || 0,
      icon: <MessageSquare size={24} />,
      color: "#3b82f6",
      trend: "+8%",
      description: "All time inquiries",
    },
    {
      title: "Partner Requests",
      count: stats.partners?.total || 0,
      icon: <Users size={24} />,
      color: "#10b981",
      trend: "+15%",
      description: "Partnership applications",
    },
    {
      title: "Today's Travel Inquiries",
      count: stats.travelInquiries?.today || 0,
      icon: <Plane size={24} />,
      color: "#6366f1",
      trend: "+10%",
      description: "Travel package inquiries today",
    },
    {
      title: "Today's Form Submissions",
      count: stats.formSubmissions?.today || 0,
      icon: <FileText size={24} />,
      color: "#ec4899",
      trend: "+5%",
      description: "Form submissions received today",
    },
    {
      title: "New Form Submissions",
      count: stats.formSubmissions?.byStatus?.new || 0,
      icon: <MessageSquare size={24} />,
      color: "#f59e0b",
      trend: "+3%",
      description: "Unread form submissions",
    },
    {
      title: "Investor Reports",
      count: stats.counts?.reports || 0,
      icon: <FileText size={24} />,
      color: "#f59e0b",
      trend: "+5%",
      description: "Published reports",
    },
    {
      title: "Office Locations",
      count: stats.counts?.locations || 0,
      icon: <MapPin size={24} />,
      color: "#ef4444",
      trend: "0%",
      description: "Active locations",
    },
    {
      title: "Categories",
      count: stats.counts?.categories || 0,
      icon: <Folder size={24} />,
      color: "#06b6d4",
      trend: "+2%",
      description: "Content categories",
    },
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="mb-2">Welcome back, Admin</h1>
        <p className="text-muted">
          Here's what's happening with your admin panel today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 mb-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}>
                  {card.icon}
                </div>
                <div className="d-flex align-items-center gap-1 text-success">
                  <TrendingUp size={16} />
                  <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                    {card.trend}
                  </span>
                </div>
              </div>
              <h3
                className="mb-1"
                style={{ fontSize: "2rem", fontWeight: "700" }}>
                {card.count.toLocaleString()}
              </h3>
              <p
                className="text-muted mb-1"
                style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                {card.title}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Reports */}
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="mb-0">Recent Investor Reports</h3>
              <Activity size={20} className="text-muted" />
            </div>
          </div>
          <div className="card-body">
            {stats.recentReports && stats.recentReports.length === 0 ? (
              <div className="text-center text-muted">
                <FileText size={48} className="mb-3" style={{ opacity: 0.3 }} />
                <p>No reports uploaded yet</p>
                <Link
                  to="/investor-relations"
                  className="btn btn-primary btn-sm">
                  Upload First Report
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentReports?.slice(0, 5).map((report) => (
                        <tr key={report._id}>
                          <td style={{ fontWeight: "500" }}>{report.title}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}>
                              {report.categoryId?.name || "N/A"}
                            </span>
                          </td>
                          <td className="text-muted">
                            <div className="d-flex align-items-center gap-1">
                              <Clock size={14} />
                              {new Date(
                                report.uploadedDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer">
                  <Link
                    to="/investor-relations"
                    className="d-flex align-items-center gap-2 text-primary"
                    style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                    View All Reports <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="d-grid gap-3">
              <Link to="/investor-relations" className="quick-action-card">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#dbeafe",
                      color: "#3b82f6",
                    }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4
                      className="mb-1"
                      style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                      Upload New Report
                    </h4>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.75rem" }}>
                      Add investor documents
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </Link>

              <Link to="/offices" className="quick-action-card">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#dcfce7",
                      color: "#10b981",
                    }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4
                      className="mb-1"
                      style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                      Add Office Location
                    </h4>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.75rem" }}>
                      Manage office locations
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </Link>

              <Link to="/blogs" className="quick-action-card">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
                    }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4
                      className="mb-1"
                      style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                      Create New Blog
                    </h4>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.75rem" }}>
                      Write and publish content
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </Link>

              <Link to="/contacts" className="quick-action-card">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      backgroundColor: "#fce7f3",
                      color: "#ec4899",
                    }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4
                      className="mb-1"
                      style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                      Review Inquiries
                    </h4>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.75rem" }}>
                      Check customer messages
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
