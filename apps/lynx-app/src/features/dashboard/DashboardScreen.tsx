import { useState, useEffect, useCallback } from '@lynx-js/react'
import { useAuth } from '../../lib/auth'
import { useNavigation } from '../../lib/navigation'
import { api } from '../../lib/api'
import { MainLayout } from '../../components/layout'
import { Card, CardTitle, CardBody, Badge, showToast } from '../../components/ui'

import '../../styles/tokens.css'
import '../../styles/components.css'

interface DashboardStats {
    totalListings?: number
    totalPosts?: number
    totalLostFound?: number
}

const FEATURES = [
    { key: 'marketplace', label: 'Marketplace', emoji: '🛒', desc: 'Buy & sell items', screen: 'marketplace' },
    { key: 'lostfound', label: 'Lost & Found', emoji: '🔍', desc: 'Find lost items', screen: 'lost-found' },
    { key: 'unimedia', label: 'Unimedia', emoji: '📱', desc: 'Campus social feed', screen: 'unimedia' },
    { key: 'food', label: 'Food', emoji: '🍔', desc: 'Restaurants & menus', screen: 'food' },
    { key: 'housing', label: 'Housing', emoji: '🏠', desc: 'PGs & hostels', screen: 'housing' },
    { key: 'study', label: 'Study Materials', emoji: '📚', desc: 'Notes & papers', screen: 'study' },
    { key: 'announcements', label: 'Announcements', emoji: '📢', desc: 'University updates', screen: 'announcements' },
] as const

export function DashboardScreen() {
    const { profile } = useAuth()
    const { navigate } = useNavigation()
    const [stats, setStats] = useState<DashboardStats>({})

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await api.get('/dashboard')
                setStats(data)
            } catch {
                // Stats are optional — fail silently
            }
        }
        fetchStats()
    }, [])

    return (
        <MainLayout title="UniMARKY">
            {/* Welcome */}
            <view className="animate-fade-in" style={{ marginBottom: 20 }}>
                <text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                }}>
                    Welcome back{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}! 👋
                </text>
                <text style={{
                    fontSize: 14,
                    color: 'var(--text-muted)',
                    marginTop: 4,
                }}>
                    {profile?.universityName || 'Your campus hub'}
                </text>
            </view>

            {/* Quick Stats */}
            <view style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <view style={{ flex: 1 }}>
                    <Card>
                        <CardBody>
                            <text style={{ fontSize: 24, fontWeight: '700', color: 'var(--brand-orange)' }}>
                                {stats.totalListings ?? '—'}
                            </text>
                            <text style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                Listings
                            </text>
                        </CardBody>
                    </Card>
                </view>
                <view style={{ flex: 1 }}>
                    <Card>
                        <CardBody>
                            <text style={{ fontSize: 24, fontWeight: '700', color: 'var(--info)' }}>
                                {stats.totalPosts ?? '—'}
                            </text>
                            <text style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                Posts
                            </text>
                        </CardBody>
                    </Card>
                </view>
                <view style={{ flex: 1 }}>
                    <Card>
                        <CardBody>
                            <text style={{ fontSize: 24, fontWeight: '700', color: 'var(--success)' }}>
                                {stats.totalLostFound ?? '—'}
                            </text>
                            <text style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                Reports
                            </text>
                        </CardBody>
                    </Card>
                </view>
            </view>

            {/* Feature Grid */}
            <text style={{ fontSize: 18, fontWeight: '600', color: 'var(--text-primary)', marginBottom: 12 }}>
                Explore
            </text>
            <view style={{ gap: 12 }}>
                {FEATURES.map((feature) => (
                    <Card
                        key={feature.key}
                        className="animate-slide-up"
                        onTap={() => navigate(feature.screen as any)}
                    >
                        <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <text style={{ fontSize: 28, marginRight: 12 }}>{feature.emoji}</text>
                            <view style={{ flex: 1 }}>
                                <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>
                                    {feature.label}
                                </text>
                                <text style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                                    {feature.desc}
                                </text>
                            </view>
                            <text style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</text>
                        </view>
                    </Card>
                ))}
            </view>

            {/* Role access */}
            {(profile?.role === 'superuser' || profile?.role === 'userX') && (
                <view style={{ marginTop: 20 }}>
                    <Card onTap={() => navigate(profile?.role === 'userX' ? 'admin' : 'superuser')}>
                        <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <text style={{ fontSize: 28, marginRight: 12 }}>⚡</text>
                            <view style={{ flex: 1 }}>
                                <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--brand-orange)' }}>
                                    {profile?.role === 'userX' ? 'Admin Dashboard' : 'Superuser Panel'}
                                </text>
                            </view>
                            <Badge variant="warning">{profile?.role}</Badge>
                        </view>
                    </Card>
                </view>
            )}
        </MainLayout>
    )
}
