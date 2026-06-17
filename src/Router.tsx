import { Routes, Route } from 'react-router-dom';
import App from './App';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import WeeklyOffersAdmin from './admin/pages/WeeklyOffersAdmin';
import FlightsAdmin from './admin/pages/FlightsAdmin';
import HotelsNationalAdmin from './admin/pages/HotelsNationalAdmin';
import HotelsIntlAdmin from './admin/pages/HotelsIntlAdmin';
import PackagesAdmin from './admin/pages/PackagesAdmin';
import DestinationsAdmin from './admin/pages/DestinationsAdmin';
import GalleryAdmin from './admin/pages/GalleryAdmin';
import TestimonialsAdmin from './admin/pages/TestimonialsAdmin';
import FaqsAdmin from './admin/pages/FaqsAdmin';
import TeamAdmin from './admin/pages/TeamAdmin';
import ServicesAdmin from './admin/pages/ServicesAdmin';
import SiteConfigAdmin from './admin/pages/SiteConfigAdmin';
import PromosAdmin from './admin/pages/PromosAdmin';
import SeedData from './admin/pages/SeedData';
import ProtectedRoute from './admin/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="weekly-offers" element={<WeeklyOffersAdmin />} />
        <Route path="flights" element={<FlightsAdmin />} />
        <Route path="hotels-national" element={<HotelsNationalAdmin />} />
        <Route path="hotels-intl" element={<HotelsIntlAdmin />} />
        <Route path="packages" element={<PackagesAdmin />} />
        <Route path="destinations" element={<DestinationsAdmin />} />
        <Route path="promos" element={<PromosAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="faqs" element={<FaqsAdmin />} />
        <Route path="team" element={<TeamAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="site-config" element={<SiteConfigAdmin />} />
        <Route path="seed" element={<SeedData />} />
      </Route>
    </Routes>
  );
}
