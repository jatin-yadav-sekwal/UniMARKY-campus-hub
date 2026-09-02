import { useState, useEffect, useCallback, createContext, useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'
import { supabase } from './supabase'
import { api } from './api'

// Types
interface User {
    id: string
    email: string
}

interface Profile {
    id: string
    fullName: string | null
    universityName: string | null
    department: string | null
    class: string | null
    mobileNumber: string | null
    role: 'normal' | 'superuser' | 'userX'
    isVerified: boolean
    onboardingCompleted: boolean
}

interface AuthState {
    user: User | null
    profile: Profile | null
    loading: boolean
    error: string | null
}

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        loading: true,
        error: null,
    })

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const data = await api.get(`/profiles/${userId}`)
            setState((prev) => ({ ...prev, profile: data }))
        } catch (err) {
            console.warn('[Auth] Failed to fetch profile:', err)
        }
    }, [])

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    const user: User = { id: session.user.id, email: session.user.email || '' }
                    setState((prev) => ({ ...prev, user, loading: false }))
                    await fetchProfile(session.user.id)
                } else {
                    setState((prev) => ({ ...prev, loading: false }))
                }
            } catch {
                setState((prev) => ({ ...prev, loading: false }))
            }
        }
        checkSession()
    }, [fetchProfile])

    const signIn = useCallback(async (email: string, password: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            if (data.user) {
                const user: User = { id: data.user.id, email: data.user.email || '' }
                setState((prev) => ({ ...prev, user, loading: false }))
                await fetchProfile(data.user.id)
            }
        } catch (err: any) {
            setState((prev) => ({ ...prev, loading: false, error: err.message || 'Sign in failed' }))
        }
    }, [fetchProfile])

    const signUp = useCallback(async (email: string, password: string) => {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })
            if (error) throw error
            if (data.user) {
                const user: User = { id: data.user.id, email: data.user.email || '' }
                setState((prev) => ({ ...prev, user, loading: false }))
            }
        } catch (err: any) {
            setState((prev) => ({ ...prev, loading: false, error: err.message || 'Sign up failed' }))
        }
    }, [])

    const signOut = useCallback(async () => {
        await supabase.auth.signOut()
        setState({ user: null, profile: null, loading: false, error: null })
    }, [])

    const refreshProfile = useCallback(async () => {
        if (state.user) await fetchProfile(state.user.id)
    }, [state.user, fetchProfile])

    return (
        <AuthContext.Provider
            value={{ ...state, signIn, signUp, signOut, refreshProfile }}
        >
            {children}
        </AuthContext.Provider>
    )
}
