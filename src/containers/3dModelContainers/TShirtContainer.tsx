import MetaContext from "@/contexts/MetaContext";
import { useFrame, useLoader } from "@react-three/fiber";
import { useContext } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function TShirtContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { value } = useContext(MetaContext);
  const glbBody = useLoader(GLTFLoader, "/3d/tshirt/tshirt.glb");

  useFrame(() => {
    // decalRef.current?.translateY(0.001);
  });

  const { nodes: bodyNodes, materials: bodyMaterials } = glbBody;

  return (
    <>
      <group>
        <mesh
          key="tshirt"
          castShadow
          receiveShadow
          // @ts-ignore
          geometry={bodyNodes["tshirt"].geometry}
          material={bodyMaterials["tshirt"]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="#d2d2d2" />
          {children}
        </mesh>
      </group>
    </>
  );
}
