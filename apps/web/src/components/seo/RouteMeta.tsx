import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'UniMARKY';
const SITE_URL = import.meta.env.VITE_WEB_URL || 'https://unimarky.runs-on.dev';
const DEFAULT_DESCRIPTION =
    'UniMARKY is the digital campus for verified students: communities, marketplace, study resources, accommodation and campus food in one place.';

const PUBLIC_PAGES: Record<string, { title: string; description: string }> = {
    '/': {
        title: 'UniMARKY | Campus Marketplace & Student Communities',
        description:
            'Buy and sell on campus, join student communities, find notes, stays and food — one verified student account for your university.',
    },
    '/about': {
        title: 'About UniMARKY — One Account for Campus Life',
        description:
            'Why UniMARKY exists: a verified student account for campus marketplace, communities, study material, accommodation and food.',
    },
    '/contact': {
        title: 'Contact UniMARKY',
        description:
            'Get in touch with the UniMARKY team for help, feedback or partnership questions.',
    },
    '/terms': {
        title: 'Terms | UniMARKY',
        description: 'The terms that govern using UniMARKY and its campus services.',
    },
    '/privacy': {
        title: 'Privacy | UniMARKY',
        description: 'How UniMARKY handles account data, listings and community activity.',
    },
};

const PRIVATE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/marketplace': 'Marketplace',
    '/communities': 'Communities',
    '/study': 'Study',
    '/housing': 'Accommodation',
    '/food': 'Food',
    '/lost-found': 'Lost & Found',
    '/profile': 'Profile',
    '/onboarding': 'Set up your profile',
    '/request-role': 'Request a role',
    '/superuser': 'My listings',
    '/admin': 'Admin',
    '/auth': 'Sign in',
    '/forgot-password': 'Reset password',
    '/reset-password': 'Choose a new password',
};

function upsertMeta(name: string, content: string, property = false) {
    const attr = property ? 'property' : 'name';
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function privateTitle(pathname: string) {
    const key = Object.keys(PRIVATE_TITLES).find(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    return key ? PRIVATE_TITLES[key] : 'Workspace';
}

/**
 * Per-route document metadata for the SPA. Public pages are indexable; every
 * workspace/auth route is noindex and gets no canonical.
 */
export function RouteMeta() {
    const { pathname } = useLocation();

    useEffect(() => {
        const isPrivate = Boolean(
            Object.keys(PRIVATE_TITLES).some(
                (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
            )
        );
        const publicPage = PUBLIC_PAGES[pathname];
        const title = isPrivate
            ? `${privateTitle(pathname)} | ${SITE_NAME}`
            : publicPage?.title ?? `${SITE_NAME} | Everything. University.`;
        const description = isPrivate
            ? 'Your UniMARKY student workspace.'
            : publicPage?.description ?? DEFAULT_DESCRIPTION;
        const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

        document.title = title;
        upsertMeta('description', description);
        upsertMeta('robots', isPrivate ? 'noindex, nofollow' : 'index, follow');
        upsertMeta('og:title', title, true);
        upsertMeta('og:description', description, true);
        upsertMeta('og:type', 'website', true);
        upsertMeta('og:url', url, true);
        upsertMeta('og:image', `${SITE_URL}/og-image.png`, true);
        upsertMeta('twitter:card', 'summary_large_image');
        upsertMeta('twitter:title', title);
        upsertMeta('twitter:description', description);
        upsertMeta('twitter:image', `${SITE_URL}/og-image.png`);

        let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (isPrivate) {
            canonical?.remove();
            return;
        }
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }, [pathname]);

    return null;
}
