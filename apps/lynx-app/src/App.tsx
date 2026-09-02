import { useEffect } from '@lynx-js/react'



import './styles/tokens.css'
import './styles/components.css'

import { AuthProvider, useAuth } from './lib/auth'
import { NavigationProvider, useNavigation } from './lib/navigation'
import { ToastProvider } from './components/ui'

// Feature screens
import { AuthScreen } from './features/auth/AuthScreen'
import { DashboardScreen } from './features/dashboard/DashboardScreen'
import { ProfileScreen } from './features/profile/ProfileScreen'
import { MarketplaceScreen, MarketplaceItemScreen, ListItemScreen } from './features/marketplace/MarketplaceScreens'
import {
  UnimediaScreen,
  FoodScreen,
  HousingScreen,
  StudyScreen,
  LostFoundScreen,
  OnboardingScreen,
  AnnouncementsScreen,
} from './features/screens'

function ScreenRouter() {
  const { screen } = useNavigation()
  const { user, profile, loading } = useAuth()
  const { reset } = useNavigation()

  // Auth-based navigation
  useEffect(() => {
    if (loading) return

    if (!user) {
      reset('auth')
    } else if (user && profile && !profile.onboardingCompleted) {
      reset('onboarding')
    } else if (user && profile?.onboardingCompleted && screen === 'auth') {
      reset('dashboard')
    }
  }, [user, profile, loading, screen, reset])

  if (loading) {
    return (
      <view className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <text style={{ fontSize: 32, fontWeight: '700', color: 'var(--brand-orange)' }}>
          UniMARKY
        </text>
        <text style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
          Loading...
        </text>
      </view>
    )
  }

  // Screen registry
  switch (screen) {
    case 'auth':
      return <AuthScreen />
    case 'onboarding':
      return <OnboardingScreen />
    case 'dashboard':
      return <DashboardScreen />
    case 'profile':
      return <ProfileScreen />
    case 'marketplace':
      return <MarketplaceScreen />
    case 'marketplace-item':
      return <MarketplaceItemScreen />
    case 'marketplace-create':
      return <ListItemScreen />
    case 'unimedia':
      return <UnimediaScreen />
    case 'lost-found':
      return <LostFoundScreen />
    case 'food':
      return <FoodScreen />
    case 'housing':
      return <HousingScreen />
    case 'study':
      return <StudyScreen />
    case 'announcements':
      return <AnnouncementsScreen />
    default:
      return <DashboardScreen />
  }
}

export function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ToastProvider>
          <ScreenRouter />
        </ToastProvider>
      </AuthProvider>
    </NavigationProvider>
  )
}
