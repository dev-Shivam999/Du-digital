import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Building2,
  MessageSquare,
  Users,
  Images,
  Newspaper,
  Calendar,
  Briefcase,
  UserCheck,
  Play,
  PenTool,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Plane,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Define required permissions for each route. 
  // If requiredPermission is undefined, everyone sees it (or just check for generic 'admin' access).
  // Admin role sees everything.
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, requiredPermission: "view_dashboard" },
    { name: "Content Management", type: "section" },
    { name: "Blogs", href: "/blogs", icon: PenTool, requiredPermission: "manage_blogs" },
    { name: "News", href: "/news", icon: Newspaper, requiredPermission: "manage_news" },
    { name: "Events", href: "/events", icon: Calendar, requiredPermission: "manage_events" },
    { name: "Gallery", href: "/gallery", icon: Images, requiredPermission: "manage_gallery" },
    { name: "Videos", href: "/videos", icon: Play, requiredPermission: "manage_videos" },
    { name: "Travel Packages", href: "/travel-packages", icon: Plane, requiredPermission: "manage_travel" },
    // { name: "Travel Inquiries", href: "/travel-inquiries", icon: MessageSquare, requiredPermission: "manage_travel" },
    { name: "Business Management", type: "section" },
    { name: "Investor Relations", href: "/investor-relations", icon: FileText, requiredPermission: "manage_investors" },
    { name: "Offices", href: "/offices", icon: Building2, requiredPermission: "manage_offices" },
    { name: "Partners", href: "/partners", icon: Users, requiredPermission: "manage_partners" },
    { name: "Careers", href: "/careers", icon: Briefcase, requiredPermission: "manage_careers" },
    { name: "Team Management", type: "section" },
    { name: "Team Members", href: "/team-members", icon: UserCheck, requiredPermission: "manage_team" },
    { name: "Sales Experts", href: "/sales-experts", icon: Users, requiredPermission: "manage_sales" },
    { name: "Communication", type: "section" },
    // { name: "Form Submissions", href: "/form-submissions", icon: MessageSquare, requiredPermission: "manage_forms" },
    // { name: "Inquiries", href: "/contacts", icon: MessageSquare, requiredPermission: "manage_contacts" },
    { name: "Applicants", href: "/applicants", icon: UserCheck, requiredPermission: "manage_applicants" },
    { name: "System", type: "section" },
    // { name: "User Management", href: "/users", icon: UserCheck, requiredPermission: "manage_users" }, // Handled by admin check in backend usually, but for UI hiding
    { name: "Pages", href: "/forms", icon: FileText, requiredPermission: "manage_forms" },
    { name: "Documents", href: "/documents", icon: FileText, requiredPermission: "manage_documents" },
    { name: "FAQs", href: "/faqs", icon: MessageSquare, requiredPermission: "manage_faqs" },
    { name: "Content Sections", href: "/content-sections", icon: FileText, requiredPermission: "manage_content" },
    { name: "Pricing Plans", href: "/pricing-plans", icon: FileText, requiredPermission: "manage_pricing" },
    { name: "Page Images", href: "/form-images", icon: Images, requiredPermission: "manage_forms" },
    { name: "Office Address Page", href: "/form-employees-addresses", icon: Users, requiredPermission: "manage_forms" },
  ];

  const hasAccess = (item) => {
      if (item.type === "section") return true; 
      if (!item.requiredPermission) return true; // Public/Common items
      if (user?.role === 'admin') return true;
      // Special case for Dashboard if we don't want to explicitely add 'view_dashboard' to every admin user object, 
      // but rely on the role check above. However, for others to NOT see it, the permission check is good.
      return user?.permissions?.includes(item.requiredPermission);
  };

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}>
        <div className="sidebar-header">
          <div className="logo">
        
            {!sidebarOpen ? <Menu  onClick={() => setSidebarOpen(!sidebarOpen)} size={20} />:<>
           <h2>DU Digital</h2>
            <span>Admin Panel</span>
          </>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen && <X size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item, index) => {
             if (!hasAccess(item)) return null;

            if (item.type === "section") {
                // Determine if we should show section header: only if there are visible children
                 // This is a simplified check; for perfect UI we might want to hide empty sections
              return (
                <div key={index} className="nav-section">
                  <span className="nav-section-title">{item.name}</span>
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                className={`nav-item ${
                  isActive(item.href) ? "nav-item-active" : ""
                }`}>
                <Icon size={20} />
                <span className="nav-item-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <h1 className="page-title">
              {navigation.find((item) => item.href && isActive(item.href))
                ?.name || "Dashboard"}
            </h1>
          </div>

          <div className="header-right">
            <button className="header-btn">
              <Bell size={20} />
            </button>
            <button className="header-btn">
              <Settings size={20} />
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button className="logout-btn" onClick={logout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
