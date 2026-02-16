import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './index.css'

// Layout components (keep eager — needed immediately)
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorPage } from '@/components/layout/ErrorPage';
import ScrollToTop from '@/components/layout/ScrollToTop';

// Lazy-loaded pages — each gets its own chunk
const LandingPage = lazy(() => import('@/features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = lazy(() => import('@/features/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const OnboardingPage = lazy(() => import('@/features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MarketplacePage = lazy(() => import('@/features/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage })));
const MyMarketplaceListingsPage = lazy(() => import('@/features/marketplace/MyMarketplaceListingsPage').then(m => ({ default: m.MyMarketplaceListingsPage })));
const ListItemPage = lazy(() => import('@/features/marketplace/ListItemPage').then(m => ({ default: m.ListItemPage })));
const MarketplaceItemPage = lazy(() => import('@/features/marketplace/MarketplaceItemPage').then(m => ({ default: m.MarketplaceItemPage })));
const UnimediaPage = lazy(() => import('@/features/campus/pages/UnimediaPage').then(m => ({ default: m.UnimediaPage })));
const MyContentPage = lazy(() => import('@/features/campus/pages/MyContentPage').then(m => ({ default: m.MyContentPage })));
const PostDetailPage = lazy(() => import('@/features/campus/pages/PostDetailPage').then(m => ({ default: m.PostDetailPage })));
const LostFoundPage = lazy(() => import('@/features/campus/pages/LostFoundPage').then(m => ({ default: m.LostFoundPage })));
const MyLostFoundListingsPage = lazy(() => import('@/features/lostfound/MyLostFoundListingsPage').then(m => ({ default: m.MyLostFoundListingsPage })));
const ReportItemPage = lazy(() => import('@/features/lostfound/ReportItemPage').then(m => ({ default: m.ReportItemPage })));
const LostFoundItemPage = lazy(() => import('@/features/lostfound/LostFoundItemPage').then(m => ({ default: m.LostFoundItemPage })));
const AnnouncementsPage = lazy(() => import('@/features/campus/pages/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const FoodPage = lazy(() => import('@/features/lifestyle/pages/FoodPage').then(m => ({ default: m.FoodPage })));
const RestaurantPage = lazy(() => import('@/features/lifestyle/pages/RestaurantPage').then(m => ({ default: m.RestaurantPage })));
const MenuItemPage = lazy(() => import('@/features/lifestyle/pages/MenuItemPage').then(m => ({ default: m.MenuItemPage })));
const HousingPage = lazy(() => import('@/features/lifestyle/pages/HousingPage').then(m => ({ default: m.HousingPage })));
const AccommodationPage = lazy(() => import('@/features/lifestyle/pages/AccommodationPage').then(m => ({ default: m.AccommodationPage })));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const StudyPage = lazy(() => import('@/features/study/StudyPage').then(m => ({ default: m.StudyPage })));
const SuperuserDashboard = lazy(() => import('@/features/superuser/SuperuserDashboard').then(m => ({ default: m.SuperuserDashboard })));
const AddRestaurantPage = lazy(() => import('@/features/superuser/AddRestaurantPage').then(m => ({ default: m.AddRestaurantPage })));
const EditRestaurantPage = lazy(() => import('@/features/superuser/EditRestaurantPage').then(m => ({ default: m.EditRestaurantPage })));
const AddMenuItemPage = lazy(() => import('@/features/superuser/AddMenuItemPage').then(m => ({ default: m.AddMenuItemPage })));
const AddAccommodationPage = lazy(() => import('@/features/superuser/AddAccommodationPage').then(m => ({ default: m.AddAccommodationPage })));
const EditAccommodationPage = lazy(() => import('@/features/superuser/EditAccommodationPage').then(m => ({ default: m.EditAccommodationPage })));
const AddStudyMaterialPage = lazy(() => import('@/features/superuser/AddStudyMaterialPage').then(m => ({ default: m.AddStudyMaterialPage })));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const RequestRolePage = lazy(() => import('@/features/roles/RequestRolePage').then(m => ({ default: m.RequestRolePage })));

// Public pages (no auth)
const AboutPage = lazy(() => import('@/features/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/features/public/ContactPage').then(m => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('@/features/public/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('@/features/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

// Shared loading spinner for Suspense boundaries
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
            </div>
        </div>
    );
}

import { Toaster } from 'sonner';

export default function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Toaster position="top-center" richColors />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Public pages — no auth required */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                <Route element={<ProtectedRoute requireOnboarding={false} />}>
                    <Route path="/onboarding" element={<OnboardingPage />} />
                </Route>

                {/* Protected Dashboard Routes - Require Onboarding */}
                <Route element={<ProtectedRoute requireOnboarding={true} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/marketplace" element={<MarketplacePage />} />
                        <Route path="/marketplace/my-listings" element={<MyMarketplaceListingsPage />} />
                        <Route path="/marketplace/list" element={<ListItemPage />} />
                        <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
                        <Route path="/unimedia" element={<UnimediaPage />} />
                        <Route path="/unimedia/my-content" element={<MyContentPage />} />
                        <Route path="/unimedia/:id" element={<PostDetailPage />} />
                        <Route path="/lost-found" element={<LostFoundPage />} />
                        <Route path="/lost-found/my-listings" element={<MyLostFoundListingsPage />} />
                        <Route path="/lost-found/report" element={<ReportItemPage />} />
                        <Route path="/lost-found/:id" element={<LostFoundItemPage />} />
                        <Route path="/announcements" element={<AnnouncementsPage />} />
                        <Route path="/food" element={<FoodPage />} />
                        <Route path="/food/:id" element={<RestaurantPage />} />
                        <Route path="/food/menu/:id" element={<MenuItemPage />} />
                        <Route path="/housing" element={<HousingPage />} />
                        <Route path="/housing/:id" element={<AccommodationPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/study" element={<StudyPage />} />

                        {/* Role Request */}
                        <Route path="/request-role" element={<RequestRolePage />} />

                        {/* Superuser Routes */}
                        <Route path="/superuser/dashboard" element={<SuperuserDashboard />} />
                        <Route path="/superuser/add-restaurant" element={<AddRestaurantPage />} />
                        <Route path="/superuser/edit-restaurant/:id" element={<EditRestaurantPage />} />
                        <Route path="/superuser/add-menu/:restaurantId" element={<AddMenuItemPage />} />
                        <Route path="/superuser/add-accommodation" element={<AddAccommodationPage />} />
                        <Route path="/superuser/edit-accommodation/:id" element={<EditAccommodationPage />} />
                        <Route path="/superuser/add-study-material" element={<AddStudyMaterialPage />} />

                        {/* Admin Routes (userX) */}
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Suspense>
    );
}
