import { Component, lazy, Suspense, useEffect, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const ShaderGradientLayer = lazy(() => import("./ShaderGradientLayer"));

class ShaderErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the CSS gradient; a missing WebGL context must never blank the page.
    console.warn("UniMARKY gradient fallback:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * Viewport-fixed decorative background. It never contributes layout height:
 * `fixed inset-0` plus `pointer-events-none`, below all interactive content.
 *
 * Structure:
 *  1. CSS fallback (always painted first, also used for reduced motion)
 *  2. Lazy WebGL shader on top
 *  3. Soft colour washes for the remaining palette entries
 *  4. Gradient mask that fades to pure white by the bottom of the viewport
 */
export function GradientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [showShader, setShowShader] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowShader(false);
      return;
    }

    const timer = window.setTimeout(() => setShowShader(true), 140);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden bg-white"
    >
      <div className="um-gradient-mask absolute inset-0">
        <div className="um-gradient-fallback absolute inset-0" />

        {showShader ? (
          <div className="absolute inset-0">
            <ShaderErrorBoundary>
              <Suspense fallback={null}>
                <ShaderGradientLayer />
              </Suspense>
            </ShaderErrorBoundary>
          </div>
        ) : null}

        <div className="um-gradient-wash absolute inset-0" />
        <div className="absolute inset-0 bg-white/10" />
      </div>
    </div>
  );
}
