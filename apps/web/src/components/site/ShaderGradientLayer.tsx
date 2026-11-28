import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

/**
 * Lazy WebGL gradient in the brand's warm palette. `animate="off"` keeps it
 * still: the editorial layout is calm and a static shader avoids continuous
 * GPU work. The CSS atmosphere remains underneath as the fallback.
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
        color1="#f6a02c"
        color2="#f472b6"
        color3="#8b5cf6"
        uAmplitude={0.75}
        uDensity={1.05}
        uFrequency={3.8}
        uSpeed={0.05}
        uStrength={1.8}
        brightness={1.05}
        cAzimuthAngle={180}
        cPolarAngle={90}
        cDistance={3.6}
        cameraZoom={1}
        positionX={-0.6}
        positionY={0.1}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={16}
        grain="off"
        lightType="3d"
        envPreset="city"
        reflection={0.08}
      />
    </ShaderGradientCanvas>
  );
}
