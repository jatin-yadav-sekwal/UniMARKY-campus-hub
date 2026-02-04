import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LandingPage } from '@/features/landing/LandingPage';
import { AuthPage } from '@/features/auth/AuthPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MarketplacePage } from '@/features/marketplace/MarketplacePage';
import { ListItemPage } from '@/features/marketplace/ListItemPage';
import { MarketplaceItemPage } from '@/features/marketplace/MarketplaceItemPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { UnimediaPage } from '@/features/campus/pages/UnimediaPage';
import { LostFoundPage } from '@/features/campus/pages/LostFoundPage';
import { ReportItemPage } from '@/features/lostfound/ReportItemPage';
import { LostFoundItemPage } from '@/features/lostfound/LostFoundItemPage';
import { AnnouncementsPage } from '@/features/campus/pages/AnnouncementsPage';
import { FoodPage } from '@/features/lifestyle/pages/FoodPage';
import { RestaurantPage } from '@/features/lifestyle/pages/RestaurantPage';
import { MenuItemPage } from '@/features/lifestyle/pages/MenuItemPage';
import { HousingPage } from '@/features/lifestyle/pages/HousingPage';
import { AccommodationPage } from '@/features/lifestyle/pages/AccommodationPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { ErrorPage } from '@/components/layout/ErrorPage';
import './index.css'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<ProtectedRoute requireOnboarding={false} />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Protected Dashboard Routes - Require Onboarding */}
            <Route element={<ProtectedRoute requireOnboarding={true} />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/marketplace" element={<MarketplacePage />} />
                    <Route path="/marketplace/list" element={<ListItemPage />} />
                    <Route path="/marketplace/:id" element={<MarketplaceItemPage />} />
                    <Route path="/unimedia" element={<UnimediaPage />} />
                    <Route path="/lost-found" element={<LostFoundPage />} />
                    <Route path="/lost-found/report" element={<ReportItemPage />} />
                    <Route path="/lost-found/:id" element={<LostFoundItemPage />} />
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                    <Route path="/food" element={<FoodPage />} />
                    <Route path="/food/:id" element={<RestaurantPage />} />
                    <Route path="/food/menu/:id" element={<MenuItemPage />} />
                    <Route path="/housing" element={<HousingPage />} />
                    <Route path="/housing/:id" element={<AccommodationPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
}
