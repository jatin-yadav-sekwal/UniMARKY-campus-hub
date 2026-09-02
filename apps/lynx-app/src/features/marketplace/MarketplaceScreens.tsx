import { useState, useEffect, useCallback } from '@lynx-js/react'
import { api } from '../../lib/api'
import { useNavigation } from '../../lib/navigation'
import { MainLayout } from '../../components/layout'
import { Card, CardBody, Badge, Button, Input, Tabs, showToast } from '../../components/ui'

import '../../styles/tokens.css'
import '../../styles/components.css'

interface MarketplaceItem {
    id: string
    title: string
    description: string
    price: string
    category: string
    condition: string
    imageUrl: string | null
    isNegotiable: boolean
    sellerName?: string
    createdAt: string
}

const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'books', label: 'Books' },
    { key: 'clothing', label: 'Clothing' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'other', label: 'Other' },
]

export function MarketplaceScreen() {
    const { navigate } = useNavigation()
    const [items, setItems] = useState<MarketplaceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('all')

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true)
            const url = category === 'all' ? '/marketplace' : `/marketplace?category=${category}`
            const data = await api.get(url)
            setItems(Array.isArray(data) ? data : data.items || [])
        } catch (err: any) {
            showToast('Failed to load items', 'error')
        } finally {
            setLoading(false)
        }
    }, [category])

    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    return (
        <MainLayout
            title="Marketplace"
            rightAction={
                <view bindtap={() => navigate('marketplace-create')}>
                    <text style={{ fontSize: 24, color: 'var(--brand-orange)' }}>+</text>
                </view>
            }
        >
            {/* Category Tabs */}
            <view style={{ marginBottom: 16 }}>
                <view style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {CATEGORIES.map((cat) => (
                        <view
                            key={cat.key}
                            style={{
                                paddingLeft: 12,
                                paddingRight: 12,
                                paddingTop: 6,
                                paddingBottom: 6,
                                borderRadius: 20,
                                backgroundColor: category === cat.key ? 'var(--brand-orange)' : 'var(--bg-elevated)',
                                borderWidth: 1,
                                borderColor: category === cat.key ? 'var(--brand-orange)' : 'var(--border-default)',
                            }}
                            bindtap={() => setCategory(cat.key)}
                        >
                            <text style={{
                                fontSize: 13,
                                fontWeight: category === cat.key ? '600' : '400',
                                color: category === cat.key ? 'var(--text-primary)' : 'var(--text-muted)',
                            }}>
                                {cat.label}
                            </text>
                        </view>
                    ))}
                </view>
            </view>

            {/* Items List */}
            {loading ? (
                <view style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading items...</text>
                </view>
            ) : items.length === 0 ? (
                <view style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                    <text style={{ fontSize: 40, marginBottom: 12 }}>🛒</text>
                    <text style={{ color: 'var(--text-muted)', fontSize: 15 }}>No items found</text>
                    <view style={{ marginTop: 16 }}>
                        <Button size="sm" onTap={() => navigate('marketplace-create')}>
                            List an item
                        </Button>
                    </view>
                </view>
            ) : (
                <view style={{ gap: 12 }}>
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            className="animate-slide-up"
                            onTap={() => navigate('marketplace-item', { id: item.id })}
                        >
                            <view style={{ flexDirection: 'row' }}>
                                {item.imageUrl && (
                                    <image
                                        src={item.imageUrl}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 8,
                                            marginRight: 12,
                                        }}
                                    />
                                )}
                                <view style={{ flex: 1 }}>
                                    <text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                    }}>
                                        {item.title}
                                    </text>
                                    <text style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: 'var(--brand-orange)',
                                        marginTop: 4,
                                    }}>
                                        ₹{item.price}
                                    </text>
                                    <view style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                                        {item.category && <Badge>{item.category}</Badge>}
                                        {item.condition && <Badge variant="info">{item.condition}</Badge>}
                                        {item.isNegotiable && <Badge variant="success">Negotiable</Badge>}
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
// MARKETPLACE ITEM DETAIL
// =============================================
export function MarketplaceItemScreen() {
    const { params, goBack } = useNavigation()
    const [item, setItem] = useState<MarketplaceItem | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            try {
                const data = await api.get(`/marketplace/${params.id}`)
                setItem(data)
            } catch {
                showToast('Failed to load item', 'error')
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetch()
    }, [params.id])

    if (loading || !item) {
        return (
            <MainLayout title="Item Details" showBack showBottomNav={false}>
                <view style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <text style={{ color: 'var(--text-muted)' }}>Loading...</text>
                </view>
            </MainLayout>
        )
    }

    return (
        <MainLayout title={item.title} showBack showBottomNav={false}>
            {/* Image */}
            {item.imageUrl && (
                <image
                    src={item.imageUrl}
                    style={{
                        width: '100%',
                        height: 250,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                />
            )}

            {/* Price */}
            <text style={{
                fontSize: 28,
                fontWeight: '700',
                color: 'var(--brand-orange)',
            }}>
                ₹{item.price}
            </text>

            {/* Title */}
            <text style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginTop: 8,
            }}>
                {item.title}
            </text>

            {/* Badges */}
            <view style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {item.category && <Badge>{item.category}</Badge>}
                {item.condition && <Badge variant="info">{item.condition}</Badge>}
                {item.isNegotiable && <Badge variant="success">Negotiable</Badge>}
            </view>

            {/* Description */}
            {item.description && (
                <view style={{ marginTop: 16 }}>
                    <text style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: '22px' }}>
                        {item.description}
                    </text>
                </view>
            )}

            {/* Seller Info */}
            {item.sellerName && (
                <Card className="mt-4">
                    <view style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <text style={{ fontSize: 18, marginRight: 10 }}>👤</text>
                        <view>
                            <text style={{ fontSize: 14, color: 'var(--text-muted)' }}>Listed by</text>
                            <text style={{ fontSize: 15, fontWeight: '600', color: 'var(--text-primary)' }}>
                                {item.sellerName}
                            </text>
                        </view>
                    </view>
                </Card>
            )}

            {/* Contact Button */}
            <view style={{ marginTop: 24 }}>
                <Button onTap={() => showToast('Contact feature coming soon', 'info')}>
                    Contact Seller
                </Button>
            </view>
        </MainLayout>
    )
}

// =============================================
// CREATE LISTING
// =============================================
export function ListItemScreen() {
    const { goBack } = useNavigation()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback(async () => {
        'background only'
        if (!title || !price) {
            showToast('Title and price are required', 'error')
            return
        }

        try {
            setLoading(true)
            await api.post('/marketplace', {
                title,
                description,
                price: parseFloat(price),
                category,
                condition,
            })
            showToast('Item listed successfully!', 'success')
            goBack()
        } catch (err: any) {
            showToast(err.message || 'Failed to create listing', 'error')
        } finally {
            setLoading(false)
        }
    }, [title, description, price, category, condition, goBack])

    return (
        <MainLayout title="List an Item" showBack showBottomNav={false}>
            <view style={{ gap: 16 }}>
                <Input label="Title" placeholder="What are you selling?" value={title} onInput={setTitle} />
                <Input label="Description" placeholder="Describe your item..." value={description} onInput={setDescription} />
                <Input label="Price (₹)" placeholder="0" value={price} onInput={setPrice} type="number" />
                <Input label="Category" placeholder="e.g., Electronics, Books" value={category} onInput={setCategory} />
                <Input label="Condition" placeholder="e.g., Like New, Good, Fair" value={condition} onInput={setCondition} />

                <view style={{ marginTop: 8 }}>
                    <Button onTap={handleSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'List Item'}
                    </Button>
                </view>
            </view>
        </MainLayout>
    )
}
