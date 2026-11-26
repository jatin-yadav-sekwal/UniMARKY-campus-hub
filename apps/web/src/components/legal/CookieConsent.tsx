import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'unimarky.cookie-consent.v1';
const OPEN_EVENT = 'um:open-cookie-consent';

type Choice = 'accepted' | 'declined';

export function openCookieConsent() {
    window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * First-visit storage notice. It never blocks the app: essential storage
 * (Supabase session) keeps working, and declining only records the choice.
 */
export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
        } catch {
            setVisible(true);
        }

        const open = () => setVisible(true);
        window.addEventListener(OPEN_EVENT, open);
        return () => window.removeEventListener(OPEN_EVENT, open);
    }, []);

    const choose = (choice: Choice) => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ choice, date: new Date().toISOString() })
            );
        } catch {
            // Storage may be blocked; still dismiss for this visit.
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <section
            className="cookie-banner"
            role="dialog"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-description"
        >
            <div>
                <p className="cookie-eyebrow">Privacy / Storage</p>
                <h2 id="cookie-title">A note about cookies</h2>
                <p id="cookie-description">
                    UniMARKY uses essential cookies and local storage to keep you signed in and
                    remember this choice. We do not use advertising or analytics trackers. Read the{' '}
                    <Link to="/privacy">privacy policy</Link>.
                </p>
            </div>
            <div className="cookie-actions">
                <button
                    type="button"
                    className="cookie-btn secondary"
                    onClick={() => choose('declined')}
                >
                    Decline optional
                </button>
                <button
                    type="button"
                    className="cookie-btn primary"
                    onClick={() => choose('accepted')}
                >
                    Accept
                </button>
            </div>
        </section>
    );
}
