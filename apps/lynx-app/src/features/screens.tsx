import { useState, useEffect, useCallback } from '@lynx-js/react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import { useNavigation } from '../lib/navigation'
import { MainLayout } from '../components/layout'
import { Card, CardBody, Badge, Button, Avatar, Input, showToast } from '../components/ui'

import '../styles/tokens.css'
import '../styles/components.css'

// =============================================
// SOCIAL FEED (Unimedia)
// =============================================
interface Post {
    id: string
    authorId: string
    authorName?: string
    type: 'post' | 'event' | 'announcement'
    title?: string
    content: string
    imageUrl?: string
    likesCount: number
    commentsCount: number
    createdAt: string
}

export function UnimediaScreen() {
    const { navigate } = useNavigation()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get('/social/posts')
                setPosts(Array.isArray(data) ? data : data.posts || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return (
        <MainLayout
            title="Unimedia"
            rightAction={
                <view bindtap={() => navigate('unimedia-my')}>
                    <text style={{ fontSize: 14, color: 'var(--brand-orange)' }}>My Posts</text>
                </view>
            }
        >
            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading feed...</text>
                </view>
            ) : posts.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>📱</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No posts yet</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {posts.map((post) => (
                        <Card
                            key={post.id}
                            className="animate-slide-up"
                            onTap={() => navigate('unimedia-post', { id: post.id })}
                        >
                            <view style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Avatar fallback={post.authorName?.charAt(0) || '?'} size="sm" />
                                <view style={{ marginLeft: 10, flex: 1 }}>
                                    <text style={{ fontSize: 14, fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {post.authorName || 'Anonymous'}
                                    </text>
                                    <text style={{ fontSize: 11, color: 'var(--text-hint)' }}>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </text>
                                </view>
                                <Badge variant={post.type === 'event' ? 'warning' : post.type === 'announcement' ? 'info' : 'default'}>
                                    {post.type}
                                </Badge>
                            </view>

                            {post.title && (
                                <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)', marginBottom: 6 }}>
                                    {post.title}
                                </text>
                            )}
                            <text style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: '20px' }}>
                                {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
                            </text>

                            {post.imageUrl && (
                                <image
                                    src={post.imageUrl}
                                    style={{ width: '100%', height: 180, borderRadius: 8, marginTop: 10 }}
                                />
                            )}

                            <view style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                                <text style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    ❤️ {post.likesCount}
                                </text>
                                <text style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                    💬 {post.commentsCount}
                                </text>
                            </view>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}

// =============================================
// FOOD PAGE
// =============================================
interface Restaurant {
    id: string
    name: string
    cuisine?: string
    rating: string
    priceRange?: string
    imageUrl?: string
    address?: string
    location: string
}

export function FoodScreen() {
    const { navigate } = useNavigation()
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get('/food/restaurants')
                setRestaurants(Array.isArray(data) ? data : data.restaurants || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return (
        <MainLayout title="Food & Restaurants">
            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading restaurants...</text>
                </view>
            ) : restaurants.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>🍔</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No restaurants listed</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {restaurants.map((r) => (
                        <Card
                            key={r.id}
                            className="animate-slide-up"
                            onTap={() => navigate('restaurant', { id: r.id })}
                        >
                            <view style={{ flexDirection: 'row' }}>
                                {r.imageUrl && (
                                    <image
                                        src={r.imageUrl}
                                        style={{ width: 70, height: 70, borderRadius: 8, marginRight: 12 }}
                                    />
                                )}
                                <view style={{ flex: 1 }}>
                                    <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>{r.name}</text>
                                    {r.cuisine && <text style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{r.cuisine}</text>}
                                    <view style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                                        <text style={{ fontSize: 13, color: 'var(--warning)' }}>⭐ {r.rating}</text>
                                        {r.priceRange && <text style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.priceRange}</text>}
                                    </view>
                                </view>
                            </view>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}

// =============================================
// HOUSING PAGE
// =============================================
interface Accommodation {
    id: string
    name: string
    type: string
    address?: string
    rentRange?: string
    rating: string
    amenities?: string
    images?: string
}

export function HousingScreen() {
    const { navigate } = useNavigation()
    const [listings, setListings] = useState<Accommodation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get('/accommodation')
                setListings(Array.isArray(data) ? data : data.listings || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return (
        <MainLayout title="Housing" showBack>
            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading accommodations...</text>
                </view>
            ) : listings.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>🏠</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No accommodations listed</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {listings.map((a) => (
                        <Card
                            key={a.id}
                            className="animate-slide-up"
                            onTap={() => navigate('accommodation', { id: a.id })}
                        >
                            <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <view style={{ flex: 1 }}>
                                    <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>{a.name}</text>
                                    <view style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                                        <Badge variant="info">{a.type}</Badge>
                                        <text style={{ fontSize: 13, color: 'var(--warning)' }}>⭐ {a.rating}</text>
                                    </view>
                                    {a.rentRange && (
                                        <text style={{ fontSize: 15, fontWeight: '600', color: 'var(--brand-orange)', marginTop: 6 }}>
                                            {a.rentRange}/mo
                                        </text>
                                    )}
                                </view>
                            </view>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}

// =============================================
// STUDY MATERIALS
// =============================================
interface StudyMaterial {
    id: string
    department: string
    year: string
    subjectName: string
    category: string
    title: string
    fileUrl?: string
}

export function StudyScreen() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get('/study')
                setMaterials(Array.isArray(data) ? data : data.materials || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return (
        <MainLayout title="Study Materials" showBack>
            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading materials...</text>
                </view>
            ) : materials.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>📚</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No materials available</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {materials.map((m) => (
                        <Card key={m.id}>
                            <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>{m.title}</text>
                            <text style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{m.subjectName}</text>
                            <view style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                <Badge>{m.department}</Badge>
                                <Badge variant="info">{m.year}</Badge>
                                <Badge variant="warning">{m.category.replace('_', ' ')}</Badge>
                            </view>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}

// =============================================
// LOST & FOUND
// =============================================
interface LostFoundItem {
    id: string
    itemName: string
    description?: string
    type: 'lost' | 'found'
    location?: string
    imageUrl?: string
    status: string
    reporterName?: string
    createdAt: string
}

export function LostFoundScreen() {
    const { navigate } = useNavigation()
    const [items, setItems] = useState<LostFoundItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all')

    useEffect(() => {
        async function fetch() {
            try {
                const url = filter === 'all' ? '/lostfound' : `/lostfound?type=${filter}`
                const data = await api.get(url)
                setItems(Array.isArray(data) ? data : data.items || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [filter])

    const filteredItems = items

    return (
        <MainLayout
            title="Lost & Found"
            showBack
            rightAction={
                <view bindtap={() => navigate('lost-found-report')}>
                    <text style={{ fontSize: 24, color: 'var(--brand-orange)' }}>+</text>
                </view>
            }
        >
            {/* Filter */}
            <view style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {(['all', 'lost', 'found'] as const).map((f) => (
                    <view
                        key={f}
                        style={{
                            paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6,
                            borderRadius: 20,
                            backgroundColor: filter === f ? 'var(--brand-orange)' : 'var(--bg-elevated)',
                        }}
                        bindtap={() => setFilter(f)}
                    >
                        <text style={{
                            fontSize: 13,
                            fontWeight: filter === f ? '600' : '400',
                            color: filter === f ? '#fff' : 'var(--text-muted)',
                            textTransform: 'capitalize',
                        }}>
                            {f}
                        </text>
                    </view>
                ))}
            </view>

            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading...</text>
                </view>
            ) : filteredItems.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>🔍</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No items reported</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            className="animate-slide-up"
                            onTap={() => navigate('lost-found-item', { id: item.id })}
                        >
                            <view style={{ flexDirection: 'row' }}>
                                {item.imageUrl && (
                                    <image
                                        src={item.imageUrl}
                                        style={{ width: 70, height: 70, borderRadius: 8, marginRight: 12 }}
                                    />
                                )}
                                <view style={{ flex: 1 }}>
                                    <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>{item.itemName}</text>
                                    {item.location && (
                                        <text style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>📍 {item.location}</text>
                                    )}
                                    <view style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                                        <Badge variant={item.type === 'lost' ? 'danger' : 'success'}>{item.type}</Badge>
                                        <Badge>{item.status}</Badge>
                                    </view>
                                </view>
                            </view>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}

// =============================================
// ONBOARDING
// =============================================
export function OnboardingScreen() {
    const { user, refreshProfile } = useAuth()
    const { reset } = useNavigation()
    const [fullName, setFullName] = useState('')
    const [university, setUniversity] = useState('')
    const [department, setDepartment] = useState('')
    const [classYear, setClassYear] = useState('')
    const [mobile, setMobile] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback(async () => {
        'background only'
        if (!fullName || !university) {
            showToast('Name and university are required', 'error')
            return
        }

        try {
            setLoading(true)
            await api.patch(`/profiles/${user?.id}`, {
                fullName,
                universityName: university,
                department,
                class: classYear,
                mobileNumber: mobile,
                onboardingCompleted: true,
            })
            await refreshProfile()
            showToast('Welcome to UniMARKY! 🎉', 'success')
            reset('dashboard')
        } catch (err: any) {
            showToast(err.message || 'Failed to save profile', 'error')
        } finally {
            setLoading(false)
        }
    }, [fullName, university, department, classYear, mobile, user, refreshProfile, reset])

    return (
        <view className="screen">
            <view style={{ flex: 1, padding: 24 }}>
                <text style={{ fontSize: 28, fontWeight: '700', color: 'var(--text-primary)', marginTop: 40 }}>
                    Complete your profile
                </text>
                <text style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, marginBottom: 28 }}>
                    Tell us about yourself to get started
                </text>

                <view style={{ gap: 16 }}>
                    <Input label="Full Name" placeholder="Your full name" value={fullName} onInput={setFullName} />
                    <Input label="University" placeholder="Your university name" value={university} onInput={setUniversity} />
                    <Input label="Department" placeholder="e.g., Computer Science" value={department} onInput={setDepartment} />
                    <Input label="Class / Year" placeholder="e.g., 3rd Year" value={classYear} onInput={setClassYear} />
                    <Input label="Mobile Number" placeholder="+91 XXXXX XXXXX" value={mobile} onInput={setMobile} />
                </view>

                <view style={{ marginTop: 28 }}>
                    <Button onTap={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Get Started'}
                    </Button>
                </view>
            </view>
        </view>
    )
}

// =============================================
// ANNOUNCEMENTS
// =============================================
interface Announcement {
    id: string
    title: string
    content: string
    createdAt: string
}

export function AnnouncementsScreen() {
    const [items, setItems] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get('/campus/announcements')
                setItems(Array.isArray(data) ? data : data.announcements || [])
            } catch { /* fail silently */ }
            finally { setLoading(false) }
        }
        fetch()
    }, [])

    return (
        <MainLayout title="Announcements" showBack>
            {loading ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading...</text>
                </view>
            ) : items.length === 0 ? (
                <view style={{ alignItems: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40 }}>📢</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 12 }}>No announcements</text>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {items.map((a) => (
                        <Card key={a.id} className="animate-slide-up">
                            <text style={{ fontSize: 16, fontWeight: '600', color: 'var(--text-primary)' }}>{a.title}</text>
                            <text style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, lineHeight: '20px' }}>
                                {a.content}
                            </text>
                            <text style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 8 }}>
                                {new Date(a.createdAt).toLocaleDateString()}
                            </text>
                        </Card>
                    ))}
                </view>
            )}
        </MainLayout>
    )
}
