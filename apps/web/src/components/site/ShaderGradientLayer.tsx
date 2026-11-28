import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

/**
 * The WebGL gradient. Loaded lazily so the first paint uses the CSS fallback.
 * `animate="off"` keeps it still: the brief asks for no continuous motion.
 */
export default function ShaderGradientLayer() {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0 }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
      powerPreference="low-power"
      lazyLoad={false}
      className="h-full w-full"
    >
      <ShaderGradient
        control="props"
        type="plane"
        animate="off"
        color1="#a78bfa"
        color2="#67e8f9"
        color3="#fb7185"
        uAmplitude={0.8}
        uDensity={1.05}
        uFrequency={4.2}
        uSpeed={0.05}
        uStrength={2.1}
        brightness={1.12}
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
        cameraZoom={1}
        positionX={-0.7}
        positionY={0.15}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={18}
        grain="off"
        lightType="3d"
        envPreset="city"
        reflection={0.1}
      />
    </ShaderGradientCanvas>
  );
}
