import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import InvestorRelations from "./pages/InvestorRelations";
import OfficeManager from "./pages/OfficeManager";
import ContactManager from "./pages/ContactManager";
import PartnerManager from "./pages/PartnerManager";
import GalleryManager from "./pages/GalleryManager";
import NewsManager from "./pages/NewsManager";
import EventManager from "./pages/EventManager";
import CareerManager from "./pages/CareerManager";
import ApplicantManager from "./pages/ApplicantManager";
import SalesExpertManager from "./pages/SalesExpertManager";
import VideoManager from "./pages/VideoManager";
import BlogManager from "./pages/BlogManager";
import BlogEditor from "./pages/BlogEditor";
import TeamMemberManager from "./pages/TeamMemberManager";
import UserManager from "./pages/UserManager";
import TravelPackageManager from "./pages/TravelPackageManager";
import TravelInquiryManager from "./pages/TravelInquiryManager";
import FormManager from "./pages/FormManager";
import DocumentManager from "./pages/DocumentManager";
import FAQManager from "./pages/FAQManager";
import ContentSectionManager from "./pages/ContentSectionManager";
import ContentSectionEditor from "./pages/ContentSectionEditor";
import PricingPlanManager from "./pages/PricingPlanManager";
import FormImageManager from "./pages/FormImageManager";
import FormEmployeesAddressManager from "./pages/FormEmployeesAddressManager";
import FormSubmissionManager from "./pages/FormSubmissionManager";
import Dashboard from "./pages/Dashboard";
import "./components/Layout.css";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./features/auth/authSlice";
import { useEffect } from "react";
import TipTapEditor from "./pages/editor";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile());
    }
  }, [user, dispatch]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
      window.location.href = "/login";
      return null;
  }
  
  return children;
};

const RoleBasedRedirect = ({ children }) => {
    const { user } = useAuth();
    const permissions = useSelector((state) => state.auth.permissions);
    const location = useLocation();

    if (location.pathname === "/" && user && user.role !== 'admin') {
        if (user.role === 'sales') return <Navigate to="/contacts" replace />;
        if (user.role === 'hr') return <Navigate to="/team-members" replace />;
        
        if (permissions?.includes('manage_contacts')) return <Navigate to="/contacts" replace />;
        if (permissions?.includes('manage_team')) return <Navigate to="/team-members" replace />;
    }
    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
              <RequireAuth>
                  <RoleBasedRedirect>
                    <Layout />
                  </RoleBasedRedirect>
              </RequireAuth>
          }>
          <Route index element={<Dashboard />} />
          <Route path="investor-relations" element={<InvestorRelations />} />
          <Route path="offices" element={<OfficeManager />} />
          <Route path="contacts" element={<ContactManager />} />
          <Route path="partners" element={<PartnerManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="events" element={<EventManager />} />
          <Route path="careers" element={<CareerManager />} />
          <Route path="applicants" element={<ApplicantManager />} />
          <Route path="sales-experts" element={<SalesExpertManager />} />
          <Route path="videos" element={<VideoManager />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="team-members" element={<TeamMemberManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="travel-packages" element={<TravelPackageManager />} />
          <Route path="travel-inquiries" element={<TravelInquiryManager />} />
          <Route path="forms" element={<FormManager />} />
          <Route path="documents" element={<DocumentManager />} />
          <Route path="faqs" element={<FAQManager />} />
          <Route path="content-sections" element={<ContentSectionManager />} />
          <Route path="content-sections/new" element={<ContentSectionEditor />} />
          <Route path="content-sections/edit/:id" element={<ContentSectionEditor />} />
          <Route path="pricing-plans" element={<PricingPlanManager />} />
          <Route path="form-images" element={<FormImageManager />} />
          <Route path="form-employees-addresses" element={<FormEmployeesAddressManager />} />
          <Route path="form-submissions" element={<FormSubmissionManager />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
