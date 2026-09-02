import type { ReactNode } from '@lynx-js/react'
import { useNavigation } from '../../lib/navigation'

import '../../styles/tokens.css'
import '../../styles/components.css'

// =============================================
// APP HEADER
// =============================================
interface AppHeaderProps {
    title: string
    showBack?: boolean
    rightAction?: ReactNode
}

export function AppHeader({ title, showBack = false, rightAction }: AppHeaderProps) {
    const { goBack, canGoBack } = useNavigation()

    return (
        <view className="app-header">
            {showBack && canGoBack ? (
                <view className="app-header-back" bindtap={goBack}>
                    <text style={{ color: 'var(--text-primary)', fontSize: 20 }}>←</text>
                </view>
            ) : (
                <view style={{ width: 24 }} />
            )}
            <text className="app-header-title">{title}</text>
            {rightAction || <view style={{ width: 24 }} />}
        </view>
    )
}

// =============================================
// BOTTOM NAV
// =============================================
interface BottomNavTab {
    key: string
    label: string
    screen: string
}

const TABS: BottomNavTab[] = [
    { key: 'dashboard', label: '🏠 Home', screen: 'dashboard' },
    { key: 'marketplace', label: '🛒 Market', screen: 'marketplace' },
    { key: 'unimedia', label: '📱 Social', screen: 'unimedia' },
    { key: 'food', label: '🍔 Food', screen: 'food' },
    { key: 'profile', label: '👤 Profile', screen: 'profile' },
]

export function BottomNav() {
    const { screen, navigate } = useNavigation()

    return (
        <view className="bottom-nav">
            {TABS.map((tab) => {
                const isActive = screen === tab.screen || screen.startsWith(tab.screen)
                return (
                    <view
                        key={tab.key}
                        className="bottom-nav-item"
                        bindtap={() => navigate(tab.screen as any)}
                    >
                        <text
                            className={isActive ? 'bottom-nav-label-active' : 'bottom-nav-label'}
                            style={{ fontSize: 20 }}
                        >
                            {tab.label.split(' ')[0]}
                        </text>
                        <text
                            className={isActive ? 'bottom-nav-label-active' : 'bottom-nav-label'}
                        >
                            {tab.label.split(' ')[1]}
                        </text>
                    </view>
                )
            })}
        </view>
    )
}

// =============================================
// MAIN LAYOUT (screen wrapper with header + bottom nav)
// =============================================
interface MainLayoutProps {
    title: string
    showBack?: boolean
    showBottomNav?: boolean
    children: ReactNode
    rightAction?: ReactNode
}

export function MainLayout({
    title,
    showBack = false,
    showBottomNav = true,
    children,
    rightAction,
}: MainLayoutProps) {
    return (
        <view className="screen">
            <AppHeader title={title} showBack={showBack} rightAction={rightAction} />
            <view className="screen-content">{children}</view>
            {showBottomNav && <BottomNav />}
        </view>
    )
}
