import { Link } from "react-router-dom";
import { m } from "motion/react";
import { Compass } from "lucide-react";
import { PublicShell } from "@/features/public/PublicShell";

export function ErrorPage() {
    return (
        <PublicShell>
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="page-head"
            >
                <div>
                    <p className="section-label">
                        <span>404</span>/ Not found
                    </p>
                    <h1 className="page-title">
                        This page went <span>missing.</span>
                    </h1>
                    <p className="page-lead">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>

                <Link to="/" className="button button-primary">
                    <Compass size={15} /> Back to home
                </Link>
            </m.div>
        </PublicShell>
    );
}
