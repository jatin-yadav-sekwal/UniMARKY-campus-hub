import { Component, lazy, Suspense, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";

const ShaderGradientLayer = lazy(() => import("./ShaderGradientLayer"));

class ShaderErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the CSS atmosphere if WebGL is unavailable.
    console.warn("UniMARKY shader fallback:", error.message, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Page atmosphere: CSS gradient first, optional WebGL shader on top.
 * The shader is desktop-only, skipped for reduced motion / data saver, and
 * loaded after first paint so it never blocks the hero.
 */
export function Atmosphere({ withShader = true }: { withShader?: boolean }) {
  const [showShader, setShowShader] = useState(false);

  useEffect(() => {
    if (!withShader) return;
    if (!window.matchMedia("(min-width: 900px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData
    ) {
      return;
    }

    const timer = window.setTimeout(() => setShowShader(true), 600);
    return () => window.clearTimeout(timer);
  }, [withShader]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-diffusion" />
      {showShader ? (
        <div className="atmosphere-shader">
          <ShaderErrorBoundary>
            <Suspense fallback={null}>
              <ShaderGradientLayer />
            </Suspense>
          </ShaderErrorBoundary>
        </div>
      ) : null}
      <div className="atmosphere-fade" />
    </div>
  );
}
