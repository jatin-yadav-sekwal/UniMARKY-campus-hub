import { useState, useCallback, createContext, useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

// =============================================
// Navigation — State-based router for Lynx
// =============================================

export type ScreenName =
    | 'auth'
    | 'onboarding'
    | 'dashboard'
    | 'marketplace'
    | 'marketplace-item'
    | 'marketplace-create'
    | 'marketplace-edit'
    | 'marketplace-my'
    | 'lost-found'
    | 'lost-found-item'
    | 'lost-found-report'
    | 'lost-found-edit'
    | 'lost-found-my'
    | 'unimedia'
    | 'unimedia-post'
    | 'unimedia-my'
    | 'food'
    | 'restaurant'
    | 'menu-item'
    | 'housing'
    | 'accommodation'
    | 'study'
    | 'profile'
    | 'announcements'
    | 'superuser'
    | 'admin'
    | 'request-role'
    | 'about'
    | 'contact'
    | 'terms'
    | 'privacy'

interface NavigationState {
    screen: ScreenName
    params: Record<string, string>
    history: Array<{ screen: ScreenName; params: Record<string, string> }>
}

interface NavigationContextType {
    screen: ScreenName
    params: Record<string, string>
    navigate: (screen: ScreenName, params?: Record<string, string>) => void
    goBack: () => void
    canGoBack: boolean
    reset: (screen: ScreenName) => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function useNavigation(): NavigationContextType {
    const ctx = useContext(NavigationContext)
    if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
    return ctx
}

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<NavigationState>({
        screen: 'auth',
        params: {},
        history: [],
    })

    const navigate = useCallback((screen: ScreenName, params: Record<string, string> = {}) => {
        'background only'
        setState((prev) => ({
            screen,
            params,
            history: [...prev.history, { screen: prev.screen, params: prev.params }],
        }))
    }, [])

    const goBack = useCallback(() => {
        'background only'
        setState((prev) => {
            if (prev.history.length === 0) return prev
            const prevEntry = prev.history[prev.history.length - 1]
            return {
                screen: prevEntry.screen,
                params: prevEntry.params,
                history: prev.history.slice(0, -1),
            }
        })
    }, [])

    const reset = useCallback((screen: ScreenName) => {
        'background only'
        setState({ screen, params: {}, history: [] })
    }, [])

    return (
        <NavigationContext.Provider
            value={{
                screen: state.screen,
                params: state.params,
                navigate,
                goBack,
                canGoBack: state.history.length > 0,
                reset,
            }}
        >
            {children}
        </NavigationContext.Provider>
    )
}
