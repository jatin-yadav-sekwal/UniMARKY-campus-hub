import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function MainLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="flex h-screen overflow-hidden pt-20"> {/* pt-20 to verify navbar offset */}
                {/* Fixed Sidebar */}
                <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40 top-20 border-r bg-background">
                    <Sidebar />
                </aside>

                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto md:ml-64 p-6 pb-24">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
