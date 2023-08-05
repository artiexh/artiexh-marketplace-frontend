import { CanvasComponent } from "@/components/Canvas/Canvas";
import { Overlay } from "@/components/Overlay/Overlay";
import { extend, createRoot, events } from "@react-three/fiber";
import * as THREE from "three";

extend(THREE);

const page = (
  typeof document != "undefined" ? document?.getElementById("example") : null
) as any;

// createRoot(page).render(
//   <>
//     <CanvasComponent />
//     <Overlay />
//   </>
// );

export default function ExamplePage() {
  return (
    <>
      <div id="example">
        <CanvasComponent />
        <Overlay />
      </div>
    </>
  );
}
