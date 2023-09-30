import { fetcher } from "@/services/backend/axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";
import { CommonResponseBase } from "@/types/ResponseBase";
import {
  Button,
  ColorPicker,
  FileButton,
  Group,
  Image,
  SegmentedControl,
} from "@mantine/core";
import { Canvas } from "@react-three/fiber";
import { IconPalette, IconPhotoEdit } from "@tabler/icons-react";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { TShirtContainer } from "./portal";

export default function DesignPortal() {
  const router = useRouter();

  const { id } = router.query;

  const [tab, setTab] = useState<"META" | "IMAGE" | "PALETTE">("META");

  const { data: response, isLoading } = useSWR<
    CommonResponseBase<SimpleDesignItem>
  >(["/design-inventory", id], () => fetcher(`/inventory-item/${id}`));

  console.log("🚀 ~ file: [id].tsx:13 ~ DesignPortal ~ response:", response);

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
            <Button className="px-2 h-12 aspect-square w-fit rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white">
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
        <Canvas className="w-full h-full">
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <TShirtContainer />
        </Canvas>
      </div>
    </MetaProvider>
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

const createImageUrl = (buffer: BlobPart, type: string) => {
  const blob = new Blob([buffer], { type });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  console.log(imageUrl);
  return imageUrl;
};

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
