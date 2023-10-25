import MetaContext from "@/contexts/MetaContext";
import { useLoader } from "@react-three/fiber";
import { useContext } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ToteBagContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { value } = useContext(MetaContext);
  const glbtTote = useLoader(GLTFLoader, "/3d/tote-bag/tote.glb");

  const { nodes: bodyNodes, materials: bodyMaterials } = glbtTote;

  return (
    <>
      <group>
        <mesh
          key="tote_strap"
          castShadow
          receiveShadow
          //@ts-ignore
          geometry={bodyNodes["tote_strap"].geometry}
          material={bodyMaterials["tote_strap"]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={value.palette.strap} />
        </mesh>
        <mesh
          key="embroidery_line"
          castShadow
          receiveShadow
          //@ts-ignore
          geometry={bodyNodes["embroidery_line"].geometry}
          material={bodyMaterials["embroidery_line"]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={value.palette.embroideryLine} />
        </mesh>
        <mesh
          key="tote_body"
          castShadow
          receiveShadow
          //@ts-ignore
          geometry={bodyNodes["tote_bag"].geometry}
          material={bodyMaterials["tote_bag"]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={value.palette.body} />
          {children}
        </mesh>
      </group>
    </>
  );
}
