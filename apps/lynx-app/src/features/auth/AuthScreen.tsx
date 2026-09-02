import { useState, useCallback } from '@lynx-js/react'
import { useAuth } from '../../lib/auth'
import { useNavigation } from '../../lib/navigation'
import { Button, Input, showToast } from '../../components/ui'

import '../../styles/tokens.css'
import '../../styles/components.css'

export function AuthScreen() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, signUp, loading, error } = useAuth()
    const { reset } = useNavigation()

    const handleSubmit = useCallback(async () => {
        'background only'
        if (!email || !password) {
            showToast('Please fill in all fields', 'error')
            return
        }

        try {
            if (mode === 'login') {
                await signIn(email, password)
            } else {
                await signUp(email, password)
            }
            // Navigation handled by App.tsx based on auth state
        } catch (err: any) {
            showToast(err.message || 'Authentication failed', 'error')
        }
    }, [mode, email, password, signIn, signUp])

    return (
        <view className="screen">
            <view style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
                {/* Logo / Brand */}
                <view style={{ alignItems: 'center', marginBottom: 40 }}>
                    <text style={{
                        fontSize: 36,
                        fontWeight: '700',
                        color: 'var(--brand-orange)',
                    }}>
                        UniMARKY
                    </text>
                    <text style={{
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        marginTop: 8,
                    }}>
                        Your campus, connected
                    </text>
                </view>

                {/* Tabs */}
                <view className="tabs-container" style={{ marginBottom: 24 }}>
                    <view
                        className={`tab-item ${mode === 'login' ? 'tab-item-active' : ''}`}
                        bindtap={() => setMode('login')}
                    >
                        <text className={`tab-text ${mode === 'login' ? 'tab-text-active' : ''}`}>
                            Sign In
                        </text>
                    </view>
                    <view
                        className={`tab-item ${mode === 'signup' ? 'tab-item-active' : ''}`}
                        bindtap={() => setMode('signup')}
                    >
                        <text className={`tab-text ${mode === 'signup' ? 'tab-text-active' : ''}`}>
                            Sign Up
                        </text>
                    </view>
                </view>

                {/* Form */}
                <view style={{ gap: 16 }}>
                    <Input
                        label="Email"
                        placeholder="you@university.edu"
                        value={email}
                        onInput={setEmail}
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onInput={setPassword}
                        type="password"
                    />
                </view>

                {error && (
                    <text style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>
                        {error}
                    </text>
                )}

                <view style={{ marginTop: 24 }}>
                    <Button onTap={handleSubmit} disabled={loading}>
                        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </view>

                {/* Divider */}
                <view style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 24,
                    marginBottom: 24,
                }}>
                    <view style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
                    <text style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 12, marginRight: 12 }}>
                        OR
                    </text>
                    <view style={{ flex: 1, height: 1, backgroundColor: 'var(--border-default)' }} />
                </view>

                {/* Google Auth */}
                <Button variant="secondary" onTap={() => {
                    showToast('Google OAuth requires deep link setup', 'info')
                }}>
                    Continue with Google
                </Button>
            </view>
        </view>
    )
}
