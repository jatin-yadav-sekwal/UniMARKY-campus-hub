import type { ReactNode } from "react";
import { SiteFooter } from "@/features/landing/SiteFooter";
import { SiteNavigation } from "@/features/landing/SiteNavigation";
import "@/features/landing/landing.css";
import "./public.css";

/**
 * Public shell for the marketing pages (About, Contact, Terms, Privacy).
 * It reuses the landing page's navigation and footer so the whole public
 * site reads as one system; only the body is page-specific.
 */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="um-landing um-public">
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere-diffusion" />
        <div className="atmosphere-fade" />
      </div>

      <div className="um-landing-content">
        <SiteNavigation />

        <main className="main-shell" id="top">
          <div className="page-rules" aria-hidden="true">
            <i />
            <i />
          </div>

          <div className="main-content um-editorial um-public-body">{children}</div>

          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
