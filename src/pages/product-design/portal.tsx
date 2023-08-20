import {
  Box,
  Decal,
  OrbitControls,
  useSurfaceSampler,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

function Playground() {
  const decalRef = useRef<Mesh | null>(null);
  const texture = useTexture(`/assets/react_thumb.png`);

  useFrame(() => {
    // decalRef.current?.translateY(0.001);
  });

  return (
    <>
      <OrbitControls enableDamping enablePan enableRotate enableZoom />
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial color="blue" />

        <Decal debug position={[0, 0, 1]} map={texture} ref={decalRef}></Decal>
      </mesh>
    </>
  );
}

export default function PortalPage() {
  return (
    <Canvas className="!w-screen !h-screen">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Playground />
    </Canvas>
  );
}
