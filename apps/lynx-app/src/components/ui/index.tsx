import { useState, useCallback } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import '../../styles/tokens.css'
import '../../styles/components.css'

// =============================================
// BUTTON
// =============================================
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    onTap?: () => void
    icon?: string
    className?: string
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onTap,
    icon,
    className = '',
}: ButtonProps) {
    const sizeClass = `btn-${size}`
    const variantClass = `btn-${variant}`
    const textClass = `btn-${variant}-text`
    const disabledClass = disabled ? 'btn-disabled' : ''

    const handleTap = useCallback(() => {
        if (!disabled && onTap) onTap()
    }, [disabled, onTap])

    return (
        <view
            className={`btn ${sizeClass} ${variantClass} ${disabledClass} ${className}`}
            bindtap={handleTap}
        >
            {icon && <image src={icon} className="btn-icon" />}
            <text className={textClass}>{children}</text>
        </view>
    )
}

// =============================================
// INPUT
// =============================================
interface InputProps {
    label?: string
    placeholder?: string
    value?: string
    onInput?: (value: string) => void
    error?: string
    type?: 'text' | 'password' | 'number'
    multiline?: boolean
}

export function Input({
    label,
    placeholder,
    value,
    onInput,
    error,
}: InputProps) {
    const [focused, setFocused] = useState(false)
    const fieldClass = `input-field ${focused ? 'input-field-focus' : ''} ${error ? 'input-error' : ''}`

    return (
        <view className="input-wrapper">
            {label && <text className="input-label">{label}</text>}
            <input
                className={fieldClass}
                placeholder={placeholder}
                bindinput={(e: any) => onInput?.(e.detail?.value ?? '')}
                bindfocus={() => setFocused(true)}
                bindblur={() => setFocused(false)}
            />
            {error && <text className="input-error-text">{error}</text>}
        </view>
    )
}

// =============================================
// CARD
// =============================================
interface CardProps {
    children: ReactNode
    className?: string
    onTap?: () => void
}

export function Card({ children, className = '', onTap }: CardProps) {
    return (
        <view className={`card ${className}`} bindtap={onTap}>
            {children}
        </view>
    )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <view className={`card-header ${className}`}>{children}</view>
}

export function CardTitle({ children }: { children: ReactNode }) {
    return <text className="card-title">{children}</text>
}

export function CardBody({ children }: { children: ReactNode }) {
    return <view className="card-body">{children}</view>
}

export function CardFooter({ children }: { children: ReactNode }) {
    return <view className="card-footer">{children}</view>
}

// =============================================
// BADGE
// =============================================
type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info'

interface BadgeProps {
    children: ReactNode
    variant?: BadgeVariant
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
    return (
        <view className={`badge badge-${variant}`}>
            <text className={`badge-text badge-text-${variant}`}>{children}</text>
        </view>
    )
}

// =============================================
// AVATAR
// =============================================
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
    src?: string
    fallback?: string
    size?: AvatarSize
}

export function Avatar({ src, fallback = '?', size = 'md' }: AvatarProps) {
    return (
        <view className={`avatar avatar-${size}`}>
            {src ? (
                <image src={src} className="avatar-image" />
            ) : (
                <text className="avatar-fallback">{fallback}</text>
            )}
        </view>
    )
}

// =============================================
// MODAL
// =============================================
interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
    actions?: ReactNode
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
    if (!open) return null

    return (
        <view className="modal-overlay animate-fade-in" bindtap={onClose}>
            <view className="modal-content animate-slide-up" catchtap={() => { }}>
                {title && <text className="modal-title">{title}</text>}
                <view className="modal-body">{children}</view>
                {actions && <view className="modal-actions">{actions}</view>}
            </view>
        </view>
    )
}

// =============================================
// TABS
// =============================================
interface Tab {
    key: string
    label: string
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (key: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <view className="tabs-container">
            {tabs.map((tab) => (
                <view
                    key={tab.key}
                    className={`tab-item ${activeTab === tab.key ? 'tab-item-active' : ''}`}
                    bindtap={() => onTabChange(tab.key)}
                >
                    <text
                        className={`tab-text ${activeTab === tab.key ? 'tab-text-active' : ''}`}
                    >
                        {tab.label}
                    </text>
                </view>
            ))}
        </view>
    )
}

// =============================================
// LIST ITEM
// =============================================
interface ListItemProps {
    title: string
    subtitle?: string
    icon?: string
    actionIcon?: string
    onTap?: () => void
}

export function ListItem({ title, subtitle, icon, actionIcon, onTap }: ListItemProps) {
    return (
        <view className="list-item" bindtap={onTap}>
            {icon && <image src={icon} className="list-item-icon" />}
            <view className="list-item-content">
                <text className="list-item-title">{title}</text>
                {subtitle && <text className="list-item-subtitle">{subtitle}</text>}
            </view>
            {actionIcon && <image src={actionIcon} className="list-item-action" />}
        </view>
    )
}

// =============================================
// TOAST (context-based)
// =============================================
type ToastType = 'success' | 'error' | 'info'

interface ToastData {
    message: string
    type: ToastType
    id: number
}

let toastId = 0
let toastSetter: ((t: ToastData | null | ((prev: ToastData | null) => ToastData | null)) => void) | null = null

export function showToast(message: string, type: ToastType = 'info') {
    if (toastSetter) {
        const id = ++toastId
        toastSetter({ message, type, id })
        setTimeout(() => {
            toastSetter?.((current) => (current?.id === id ? null : current))
        }, 3000)
    }
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null)
    toastSetter = setToast

    return (
        <view style={{ flex: 1 }}>
            {children}
            {toast && (
                <view className="toast-container animate-slide-down">
                    <view className={`toast toast-${toast.type}`}>
                        <text className={`toast-text badge-text-${toast.type}`}>{toast.message}</text>
                    </view>
                </view>
            )}
        </view>
    )
}
