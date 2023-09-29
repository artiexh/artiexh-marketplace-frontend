import DesignItemCard from "@/components/Cards/DesignItemCard/DesignItemCard";
import {
  DesignItem,
  getDesignItemsFromLocalStorage,
} from "@/utils/localStorage/designProduct";
import {
  Button,
  ColorPicker,
  FileButton,
  Group,
  Image,
  SegmentedControl,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Decal, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  IconAdjustmentsAlt,
  IconArrowLeft,
  IconMenu2,
  IconPalette,
  IconPhotoEdit,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function ToteBagContainer() {
  const { value } = useContext(MetaContext);
  const glbBody = useLoader(GLTFLoader, "/3d/tote-bag/tote_body.glb");
  const glbStrap = useLoader(GLTFLoader, "/3d/tote-bag/tote_strap.glb");

  useFrame(() => {
    // decalRef.current?.translateY(0.001);
  });

  const { nodes: bodyNodes, materials: bodyMaterials } = glbBody;
  console.log("🚀 ~ file: portal.tsx:27 ~ Playground ~ bodyNodes:", bodyNodes);
  const { nodes: strapNodes, materials: strapMaterials } = glbStrap;

  return (
    <>
      <OrbitControls enableDamping enablePan enableRotate enableZoom />
      <group>
        <mesh
          key="tote_strap"
          castShadow
          receiveShadow
          geometry={strapNodes["tote_strap"].geometry}
          material={strapMaterials["tote_strap"]}
          position={[0, -25, 0]}
        >
          <meshStandardMaterial color={value.palette.strap} />
        </mesh>
        <mesh
          key="embroidery_line"
          castShadow
          receiveShadow
          geometry={bodyNodes["embroidery_line"].geometry}
          material={bodyMaterials["embroidery_line"]}
          position={[0, -25, 0]}
        >
          <meshStandardMaterial color={value.palette.embroideryLine} />
        </mesh>
        <mesh
          key="tote_body"
          castShadow
          receiveShadow
          geometry={bodyNodes["tote_bag"].geometry}
          material={bodyMaterials["tote_bag"]}
          position={[0, -25, 0]}
        >
          <meshStandardMaterial color={value.palette.body} />
          {value.imagesContext.combination === "FULL_MIDDLE" &&
            value.imagesContext.images[0] && (
              <DecalWithImage
                debug
                position={[0, 20, 1]}
                rotation={[-0.001, 0, 0]}
                scale={[20, 20, 1.1]}
                file={value.imagesContext.images[0].file}
              ></DecalWithImage>
            )}
          {value.imagesContext.combination === "BOTTOM_LEFT_CORNER" &&
            value.imagesContext.images[0] && (
              <DecalWithImage
                position={[-12, 5.5, 1.45]}
                rotation={[-0.001, 0, 0]}
                scale={[7, 7, 1]}
                file={value.imagesContext.images[0].file}
              ></DecalWithImage>
            )}
        </mesh>
      </group>
    </>
  );
}

function TShirtContainer() {
  const { value } = useContext(MetaContext);
  const glbBody = useLoader(GLTFLoader, "/3d/tshirt/tshirt.glb");
  const texture = useTexture("/assets/chisataki.jpg");

  useFrame(() => {
    // decalRef.current?.translateY(0.001);
  });

  const { nodes: bodyNodes, materials: bodyMaterials } = glbBody;
  console.log("🚀 ~ file: portal.tsx:27 ~ Playground ~ bodyNodes:", bodyNodes);

  return (
    <>
      <OrbitControls enableDamping enablePan enableRotate enableZoom />
      <group>
        <mesh
          key="tshirt"
          castShadow
          receiveShadow
          geometry={bodyNodes["tshirt"].geometry}
          material={bodyMaterials["tshirt"]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={value.palette.body} />
          {value.imagesContext.combination === "FULL_MIDDLE" &&
            value.imagesContext.images[0] && (
              <DecalWithImage
                scale={[0.15, 0.15, 0.09]}
                position={[0.06, -0.24, 0.1]}
                rotation={[-0.001, 0, 0]}
                file={value.imagesContext.images[0].file}
              ></DecalWithImage>
            )}
          {/* {value.imagesContext.combination === "FULL_MIDDLE" &&
              value.imagesContext.images[0] && (
                <DecalWithImage
                  position={[0, 20, 0.96]}
                  
                  scale={[20, 20, 1]}
                  file={value.imagesContext.images[0].file}
                ></DecalWithImage>
              )} */}
          {/* {value.imagesContext.combination === "BOTTOM_LEFT_CORNER" &&
              value.imagesContext.images[0] && (
                <DecalWithImage
                  position={[-12, 5.5, 1.45]}
                  rotation={[-0.001, 0, 0]}
                  scale={[7, 7, 1]}
                  file={value.imagesContext.images[0].file}
                ></DecalWithImage>
              )} */}
        </mesh>
      </group>
    </>
  );
}

function DecalWithImage(
  props: React.ComponentProps<typeof Decal> & { file: string }
) {
  const { file, ...rest } = props;
  const decalRef = useRef<Mesh | null>(null);
  const texture = useTexture(file);

  return <Decal {...rest} map={texture} ref={decalRef}></Decal>;
}

const createImageUrl = (buffer, type) => {
  const blob = new Blob([buffer], { type });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  console.log(imageUrl);
  return imageUrl;
};

export default function PortalPage() {
  const router = useRouter();
  const {
    data: designItem,

    isLoading,
    mutate,
  } = useSWR(["design-item"], async () => {
    if (!router.isReady) return null;

    const itemId = router.query.itemId;

    if (itemId instanceof Array || !itemId) throw new Error("Invalid query");

    const list = getDesignItemsFromLocalStorage();

    return list.find((item) => item.id === itemId);
  });

  useEffect(() => {
    mutate();
  }, [router.query]);

  const [tab, setTab] = useState<"META" | "IMAGE" | "PALETTE">("META");

  if (isLoading) return null;

  if (!designItem) return null;

  const openMenu = () => {
    modals.open({
      title: "Design items",
      centered: true,
      modalId: "design-items-modal",
      children: (
        <div className="w-full">
          <div className="provider-list flex flex-col">
            {getDesignItemsFromLocalStorage()?.map((item, index) => (
              <div key={item.id} className="h-[200px]">
                <DesignItemCard
                  data={item}
                  actions={
                    <div className="w-full flex justify-between">
                      <Button
                        onClick={() => {
                          router.push(
                            `/campaigns/create/1/design?itemId=${item.id}`
                          );
                          modals.close("design-items-modal");
                          mutate();
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ),
    });
  };

  return (
    <MetaProvider>
      <div className="!w-screen !h-screen">
        {tab === "IMAGE" && <ConfigImageTab />}
        {tab === "META" && <ConfigMetaTab />}
        {tab === "PALETTE" && <ConfigPaletteTab />}
        <div className="left-side absolute h-4/5 left-[2%] top-[5%] z-10">
          <div className="flex gap-x-3 navigation">
            <Button
              variant="outline"
              className="px-2 h-12 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              <IconArrowLeft className="w-8 aspect-square" />
            </Button>
            <Button
              onClick={openMenu}
              className="px-2 h-12 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              <IconMenu2 className="w-8 aspect-square" />
            </Button>
          </div>
          <div className="edit-menu mt-5 bg-white py-4 px-3 flex flex-col items-center gap-y-5 w-fit rounded-full">
            <Button
              onClick={() => setTab("META")}
              variant="outline"
              className="px-2 h-10 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              <IconAdjustmentsAlt className="w-6 aspect-square" />
            </Button>
            <Button
              onClick={() => setTab("IMAGE")}
              variant="outline"
              className="px-2 h-10 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              <IconPhotoEdit className="w-6 aspect-square my-2" />
            </Button>
            <Button
              onClick={() => setTab("PALETTE")}
              variant="outline"
              className="px-2 h-10 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              <IconPalette className="w-6 aspect-square" />
            </Button>
          </div>
        </div>
        {designItem && <DesignCanvas item={designItem} />}
      </div>
    </MetaProvider>
  );
}

function DesignCanvas({ item }: { item: DesignItem }) {
  return (
    <Canvas className="w-full h-full" key={item.id}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {item.product.model === "TOTE_BAG" && <ToteBagContainer key={item.id} />}
      {item.product.model === "T_SHIRT" && <TShirtContainer key={item.id} />}
    </Canvas>
  );
}

const MetaContext = createContext<{
  changePalette: (
    callback: (prev: {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }) => {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }
  ) => void;
  uploadImages: (callback: (images: any[]) => any[]) => void;
  changeImageMode: (value: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER") => void;
  value: {
    palette: { strap?: string; body?: string; embroideryLine?: string };
    imagesContext: {
      combination: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER";
      images: any[];
    };
  };
}>({
  changePalette: () => {},
  uploadImages: () => {},
  changeImageMode: () => {},
  value: {
    palette: {},
    imagesContext: {
      combination: "FULL_MIDDLE",
      images: [],
    },
  },
});

function MetaProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<{
    palette: { strap?: string; body?: string; embroideryLine?: string };
    imagesContext: {
      combination: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER";
      images: any[];
    };
  }>({
    palette: {
      strap: "green",
      body: "white",
      embroideryLine: "green",
    },
    imagesContext: {
      combination: "FULL_MIDDLE",
      images: [],
    },
  });

  const changePalette = (
    callback: (prev: {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }) => {
      strap?: string;
      body?: string;
      embroideryLine?: string;
    }
  ) => {
    setValue((prev) => ({
      ...prev,
      palette: callback(prev.palette),
    }));
  };

  const changeImageMode = (value: "FULL_MIDDLE" | "BOTTOM_LEFT_CORNER") =>
    setValue((prev) => ({
      ...prev,
      imagesContext: {
        images: [],
        combination: value,
      },
    }));

  const uploadImages = (callback: (images: any[]) => any[]) => {
    setValue((prev) => {
      console.log(
        "🚀 ~ file: portal.tsx:255 ~ uploadImages ~ images:",
        callback(prev.imagesContext.images)
      );
      return {
        ...prev,
        imagesContext: {
          ...prev.imagesContext,
          images: callback(prev.imagesContext.images).filter(
            (_, index) => index === 0
          ),
        },
      };
    });
  };

  return (
    <MetaContext.Provider
      value={{
        value,
        changePalette,
        changeImageMode,
        uploadImages,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
}

function ConfigMetaTab() {
  return (
    <div className="config-tab bg-white w-72 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg">
      <h2>Config meta</h2>
    </div>
  );
}

const colorRanges = [
  "#25262b",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

function ConfigPaletteTab() {
  const { changePalette } = useContext(MetaContext);

  return (
    <div className="config-tab bg-white w-72 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg">
      <h2>Config palette</h2>
      <h3>Strap</h3>
      <ColorPicker
        onChange={(value) =>
          changePalette((prev) => ({
            ...prev,
            strap: value,
          }))
        }
        format="hex"
        swatches={colorRanges}
      />
      <h3>Body</h3>
      <ColorPicker
        onChange={(value) =>
          changePalette((prev) => ({
            ...prev,
            body: value,
          }))
        }
        format="hex"
        swatches={colorRanges}
      />
      <h3>Embroidery Line</h3>
      <ColorPicker
        onChange={(value) =>
          changePalette((prev) => ({
            ...prev,
            embroideryLine: value,
          }))
        }
        format="hex"
        swatches={colorRanges}
      />
    </div>
  );
}

function ConfigImageTab() {
  const { value, uploadImages, changeImageMode } = useContext(MetaContext);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    resetRef.current?.();
  }, []);

  return (
    <div className="config-tab bg-white w-72 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg">
      <SegmentedControl
        value={value.imagesContext.combination}
        onChange={changeImageMode}
        data={[
          { label: "Full middle", value: "FULL_MIDDLE" },
          { label: "Bottom left", value: "BOTTOM_LEFT_CORNER" },
        ]}
      />
      <h3>Mode: {value.imagesContext.combination}</h3>
      {value.imagesContext.images[0] && (
        <Image src={value.imagesContext.images[0].file} />
      )}
      <Group position="center">
        <FileButton
          key={value.imagesContext.combination}
          resetRef={resetRef}
          onChange={async (e) => {
            const file = e;
            console.log("🚀 ~ file: portal.tsx:375 ~ onChange={ ~ file:", file);
            if (!file) return;
            const { type } = file;
            const buffer = await file.arrayBuffer();
            const imageUrl = createImageUrl(buffer, type);
            uploadImages((prev) => [{ file: imageUrl }]);
          }}
          accept="image/png,image/jpeg"
        >
          {(props) => (
            <Button
              {...props}
              className="px-2 mt-3 rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
            >
              Upload image
            </Button>
          )}
        </FileButton>
      </Group>
    </div>
  );
}
