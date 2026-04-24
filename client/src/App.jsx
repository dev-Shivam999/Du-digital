import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import OurOffices from './components/common/OurOffices';
import Copyright from './components/common/Copyright'
import ScrollToTop from './components/common/ScrollToTop'
import LoadingState from './components/reusable/LoadingState'

import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ContactUs from './pages/ContactUs'
import BecomePartner from './pages/BecomePartner'
import InvestorRelation from './pages/InvestorRelation'
import AboutUs from './pages/AboutUs'
import VideoGallery from './pages/VideoGallery'
import Careers from './pages/Careers'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import NewsAndMedia from './pages/NewsAndMedia'
import Blogs from './pages/blogs'
import SingleBlog from './pages/SingleBlog'
import { Swifttravels } from './pages/Swifttravels'
import TermsAndConditions from './pages/TermsAndConditions'
import TenantVerification from './pages/TenantVerification'
import IndianEvisa from './pages/IndianEvisa'
import Globalrecruitmentservices from './pages/Globalrecruitmentservices'
import OurCapabilities from './pages/OurCapabilities'
import Magazine from './pages/Magazine'
import Policy2 from './pages/CookiePolicy2'
import ForGovernmentEmbassies from './pages/ForGovernmentEmbassies'
import Duverify from './pages/Duverify'
import Companysetup from './pages/Companysetup'
import GreeceWorkVisa from './pages/Greeceworkvisa'
import Digitalarrivalcards from './pages/Digitalarrivalcards'
import Dubai5yeartouristvisa from './pages/Dubai5yeartouristvisa'
import Southkoreavisaforindians from './pages/Southkoreavisaforindians'
import Malaysiavisaforndians from './pages/Malaysiavisaforndians'
import Moroccovisa from './pages/Moroccovisa'
import Serbiaworkpermitvisa from './pages/Serbiaworkpermitvisa'
import Australiatouristvisa from './pages/Australiatouristvisa'
import BangladeshVac from './pages/Bangladeshvac'
import Applyforanyvisa from './pages/Applyforanyvisa'
import Japantouristvisaforindians from './pages/Japantouristvisaforindians'
import Egyptvisaforindians from './pages/Egyptvisaforindians'
import Lebanon from './pages/Lebanon'
import BangladeshVisasForUaeSingapore from './pages/Bangladeshvisasforuaesingapore'
import Vipclearanceatmalaysiaairport from './pages/Vipclearanceatmalaysiaairport'
import Georgiaevisa from './pages/Georgiaevisa'

const App = () => {
        return (
                <div>
                        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:text-[#FF1033] focus:px-4 focus:py-2 focus:rounded focus:font-semibold">
                                Skip to main content
                        </a>
                        <ScrollToTop />
                        <Navbar />
                <main id="main-content">
                        <Suspense fallback={<LoadingState message="Loading..." fullScreen />}>
                                <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/b2b-partner-program" element={<BecomePartner />} />
                                        <Route path="/about-us" element={<AboutUs />} />
                                        <Route path="/contact-us" element={<ContactUs />} />
                                        <Route path="/embassy-government-partners" element={<ForGovernmentEmbassies />} />
                                        <Route path="/tenant-and-domestic-help-verification" element={<TenantVerification />} />
                                        <Route path="/india-evisa" element={<IndianEvisa />} />
                                        <Route path="/global-recruitment-services" element={<Globalrecruitmentservices />} />
                                        <Route path="/investor-relation" element={<InvestorRelation />} />
                                        <Route path="/investor-relation/:slug" element={<InvestorRelation />} />
                                        <Route path="/news-and-media" element={<NewsAndMedia />} />
                                        <Route path="/events" element={<Events />} />
                                        <Route path="/events/:slug" element={<EventDetail />} />
                                        <Route path="/careers" element={<Careers />} />
                                        <Route path="/video-gallery" element={<VideoGallery />} />
                                        <Route path="/blogs" element={<Blogs />} />
                                        <Route path="/blog/:slug" element={<SingleBlog />} />
                                        <Route path="/swifttravels" element={<Swifttravels />} />
                                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                                        <Route path="/duverify" element={<Duverify />} />
                                        <Route path="/our-capabilities" element={<OurCapabilities />} />
                                        <Route path="/greece-work-visa" element={<GreeceWorkVisa />} />
                                        <Route path="/digital-arrival-cards" element={<Digitalarrivalcards />} />
                                        <Route path="/dubai-5year-tourist-visa" element={<Dubai5yeartouristvisa />} />
                                        <Route path="/south-korea-visa-for-indians" element={<Southkoreavisaforindians />} />
                                        <Route path="/morocco-visa" element={<Moroccovisa />} />
                                        <Route path="/serbia-work-permit-visa" element={<Serbiaworkpermitvisa />} />
                                        <Route path="/australia-tourist-visa" element={<Australiatouristvisa />} />
                                        <Route path="/malaysia-visa-for-indians" element={<Malaysiavisaforndians />} />
                                        <Route path="/company-setup-in-the-uae" element={<Companysetup />} />
                                        <Route path="/apply-for-any-visa" element={<Applyforanyvisa />} />
                                        <Route path="/japan-tourist-visa-for-indians" element={<Japantouristvisaforindians />} />
                                        <Route path="/egypt-visa-for-indians" element={<Egyptvisaforindians />} />
                                        <Route path="/tnh-magazine" element={<Magazine />} />
                                        <Route path="/bangladesh-vac" element={<BangladeshVac />} />
                                        <Route path="/bangladesh-visas-for-uae-singapore" element={<BangladeshVisasForUaeSingapore />} />
                                        <Route path="/vip-clearance-at-malaysia-airport" element={<Vipclearanceatmalaysiaairport />} />
                                        <Route path="/georgia-evisa" element={<Georgiaevisa />} />
                                        <Route path="/lebanon" element={<Lebanon />} />
                                        <Route path="/cookie-policy" element={<Policy2 />} />
                                        <Route path="*" element={<NotFound />} />
                                </Routes>
                        </Suspense>
                </main>
                        <Footer />
                        <OurOffices />
                        <Copyright />
                </div>
        );
}

export default App