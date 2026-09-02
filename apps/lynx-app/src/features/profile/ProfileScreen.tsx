import { useState, useEffect, useCallback } from '@lynx-js/react'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { useNavigation } from '../../lib/navigation'
import { MainLayout } from '../../components/layout'
import { Card, CardBody, Badge, Button, Avatar, showToast } from '../../components/ui'

import '../../styles/tokens.css'
import '../../styles/components.css'

interface ProfileData {
    id: string
    fullName: string
    universityName: string
    department: string
    class: string
    mobileNumber: string
    role: string
    isVerified: boolean
    onboardingCompleted: boolean
    idCardUrl?: string
}

export function ProfileScreen() {
    const { user, profile, signOut } = useAuth()
    const { navigate } = useNavigation()

    const handleSignOut = useCallback(async () => {
        'background only'
        await signOut()
    }, [signOut])

    if (!profile) {
        return (
            <MainLayout title="Profile">
                <view style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading profile...</text>
                </view>
            </MainLayout>
        )
    }

    return (
        <MainLayout title="Profile">
            {/* Header Card */}
            <Card className="animate-fade-in">
                <view style={{ alignItems: 'center', padding: 8 }}>
                    <Avatar
                        fallback={profile.fullName?.charAt(0) || '?'}
                        size="xl"
                    />
                    <text style={{
                        fontSize: 22,
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginTop: 12,
                    }}>
                        {profile.fullName || 'Anonymous'}
                    </text>
                    <text style={{
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        marginTop: 4,
                    }}>
                        {user?.email}
                    </text>
                    <view style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                        <Badge variant={profile.isVerified ? 'success' : 'warning'}>
                            {profile.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <Badge variant="info">{profile.role}</Badge>
                    </view>
                </view>
            </Card>

            {/* Info */}
            <view style={{ marginTop: 16, gap: 12 }}>
                <Card>
                    <CardBody>
                        <ProfileRow label="University" value={profile.universityName || '—'} />
                        <ProfileRow label="Department" value={profile.department || '—'} />
                        <ProfileRow label="Class" value={profile.class || '—'} />
                        <ProfileRow label="Mobile" value={profile.mobileNumber || '—'} />
                    </CardBody>
                </Card>

                {/* Actions */}
                <Card onTap={() => navigate('request-role')}>
                    <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <text style={{ fontSize: 20, marginRight: 12 }}>⬆️</text>
                        <text style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)' }}>
                            Request Role Upgrade
                        </text>
                        <text style={{ color: 'var(--text-muted)' }}>→</text>
                    </view>
                </Card>

                <Card onTap={() => navigate('marketplace-my')}>
                    <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <text style={{ fontSize: 20, marginRight: 12 }}>🛒</text>
                        <text style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)' }}>
                            My Marketplace Listings
                        </text>
                        <text style={{ color: 'var(--text-muted)' }}>→</text>
                    </view>
                </Card>

                <Card onTap={() => navigate('lost-found-my')}>
                    <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <text style={{ fontSize: 20, marginRight: 12 }}>🔍</text>
                        <text style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)' }}>
                            My Lost & Found Reports
                        </text>
                        <text style={{ color: 'var(--text-muted)' }}>→</text>
                    </view>
                </Card>

                <Card onTap={() => navigate('unimedia-my')}>
                    <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <text style={{ fontSize: 20, marginRight: 12 }}>📱</text>
                        <text style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)' }}>
                            My Content
                        </text>
                        <text style={{ color: 'var(--text-muted)' }}>→</text>
                    </view>
                </Card>

                <view style={{ marginTop: 8 }}>
                    <Button variant="danger" onTap={handleSignOut}>
                        Sign Out
                    </Button>
                </view>
            </view>
        </MainLayout>
    )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
    return (
        <view style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'var(--border-subtle)',
        }}>
            <text style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</text>
            <text style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: '500' }}>{value}</text>
        </view>
    )
}
