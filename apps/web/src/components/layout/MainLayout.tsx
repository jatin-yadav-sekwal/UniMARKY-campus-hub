import { Outlet } from 'react-router-dom';
import { Atmosphere } from '@/components/site/Atmosphere';
import { Sidebar } from './Sidebar';
import '@/features/landing/landing.css';

export function MainLayout() {
    return (
        <div className="um-landing um-app">
            <Atmosphere withShader={false} />

            <div className="um-landing-content">
                <Sidebar />

                <main className="main-shell" id="top">
                    <div className="page-rules" aria-hidden="true">
                        <i />
                        <i />
                    </div>

                    <div className="main-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
