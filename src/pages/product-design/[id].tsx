import { fetcher } from "@/services/backend/axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";
import { CommonResponseBase } from "@/types/ResponseBase";
import {
  Accordion,
  Button,
  ColorPicker,
  FileButton,
  Group,
  SegmentedControl,
} from "@mantine/core";
import { Canvas, useStore } from "@react-three/fiber";
import { IconPalette, IconPhotoEdit } from "@tabler/icons-react";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { TShirtContainer } from "./portal";
import { ImageConfig, SimpleProductBase } from "@/types/ProductBase";
import logoImage from "../../../public/assets/logo.svg";
import Image from "next/image";
import clsx from "clsx";
import { useForm } from "@mantine/form";
import { Decal, useTexture } from "@react-three/drei";
import { Mesh } from "three";

function ConfigMenu({
  tab,
  setTab,
}: {
  setTab: Dispatch<SetStateAction<"META" | "IMAGE">>;
  tab: "META" | "IMAGE";
}) {
  return (
    <>
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
      </div>
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

export default function DesignPortal() {
  const router = useRouter();

  const { id } = router.query;

  const [tab, setTab] = useState<"META" | "IMAGE">("META");

  const [combination, setCombination] = useState<{
    code: string;
    images: ImageConfig[];
    name: string;
  }>();

  const form = useForm<{
    sets: Array<{
      code: string;
      manufacturingImage?: any;
      mockupImage?: any;
    }>;
  }>({
    initialValues: {
      sets: [],
    },
  });

  const { data: response, isLoading } = useSWR<
    CommonResponseBase<SimpleDesignItem>
  >(["/design-inventory", id], () => fetcher(`/inventory-item/${id}`));

  const productBase = response?.data.variant.productBase;

  if (isLoading || !productBase) return null;

  return (
    <div className="!w-screen !h-screen">
      <div className="left-side absolute h-4/5 left-[2%] top-[5%] z-10">
        <ConfigMenu setTab={setTab} tab={tab} />
      </div>
      {tab === "IMAGE" && (
        <ImageCombinationPicker
          combination={combination}
          setCombination={setCombination}
          form={form}
          data={productBase.imageCombinations}
        />
      )}
      <Canvas className="w-full h-full">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <TShirtContainer>
          {combination?.images.map(
            (set) =>
              form.values.sets.find((i) => i.code === set.code)
                ?.mockupImage && (
                <DecalWithImage
                  key={set.code}
                  debug
                  position={set.position}
                  rotation={set.rotate}
                  scale={set.scale}
                  file={
                    form.values.sets.find((i) => i.code === set.code)
                      ?.mockupImage
                  }
                ></DecalWithImage>
              )
          )}
        </TShirtContainer>
      </Canvas>
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

function ImageCombinationPicker({
  data,
  form,
  setCombination,
  combination,
}: {
  data: SimpleProductBase["imageCombinations"];
  form: any;
  setCombination: any;
  combination?: {
    code: string;
    images: ImageConfig[];
    name: string;
  };
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    form.setValues({
      sets:
        combination?.images.map((set) => ({
          code: set.code,
        })) ?? [],
    });
  }, [combination]);

  return (
    <div className="config-tab bg-white w-72 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg p-4">
      {step === 0 && (
        <>
          <h3 className="font-bold text-lg">Image combinations</h3>
          <div className="flex flex-col gap-y-2 mt-2">
            {data.map((el) => (
              <div
                key={el.code}
                className={clsx(
                  "bg-white rounded-md hover:border hover:border-primary flex p-2 justify-between cursor-pointer"
                )}
                onClick={() => {
                  setCombination(el);
                  setStep(1);
                }}
              >
                <span className="font-semibold">{el.name}</span>
                {combination?.code === el.code ? (
                  <Image src={logoImage} className="w-6 aspect-square" />
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <div className="flex gap-x-2">
            <IconArrowLeft
              className="w-6 aspect-square cursor-pointer"
              onClick={() => setStep(0)}
            />
            <h3 className="font-bold text-lg">{combination?.name}</h3>
          </div>
          <div className="flex flex-col gap-y-2 mt-2">
            <Accordion multiple={true}>
              {form.values.sets?.map((el, index) => {
                const imageSet = combination?.images.find(
                  (i) => i.code === el.code
                );

                if (!imageSet) return null;

                return (
                  <Accordion.Item key={imageSet.code} value={imageSet.code}>
                    <Accordion.Control className="hover:text-white">
                      {imageSet.name}
                    </Accordion.Control>
                    <Accordion.Panel>
                      {el.mockupImage && <img src={el.mockupImage} />}
                      <Group position="center">
                        <FileButton
                          key={imageSet.code}
                          onChange={async (e) => {
                            const file = e;
                            if (!file) return;
                            const { type } = file;
                            const buffer = await file.arrayBuffer();
                            const imageUrl = createImageUrl(buffer, type);
                            form.setFieldValue(
                              `sets.${index}.mockupImage`,
                              imageUrl
                            );
                            console.log(form.values);
                          }}
                          accept="image/png,image/jpeg"
                        >
                          {(props) => (
                            <Button
                              {...props}
                              className="px-2 mt-3 rounded-full bg-white text-black border border-black shadow-none outline-none hover:bg-black hover:text-white"
                            >
                              Upload image
                            </Button>
                          )}
                        </FileButton>
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
}

// function ConfigImageTab() {
//   const { value, uploadImages, changeImageMode } = useContext(MetaContext);
//   const resetRef = useRef<() => void>(null);

//   useEffect(() => {
//     resetRef.current?.();
//   }, []);

//   return (
//     <div className="config-tab bg-white w-72 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg">
//       <SegmentedControl
//         value={value.imagesContext.combination}
//         onChange={changeImageMode}
//         data={[
//           { label: "Full middle", value: "FULL_MIDDLE" },
//           { label: "Bottom left", value: "BOTTOM_LEFT_CORNER" },
//         ]}
//       />
//       <h3>Mode: {value.imagesContext.combination}</h3>
//       {value.imagesContext.images[0] && (
//         <Image src={value.imagesContext.images[0].file} />
//       )}
//       <Group position="center">
//         <FileButton
//           key={value.imagesContext.combination}
//           resetRef={resetRef}
//           onChange={async (e) => {
//             const file = e;
//             console.log("🚀 ~ file: portal.tsx:375 ~ onChange={ ~ file:", file);
//             if (!file) return;
//             const { type } = file;
//             const buffer = await file.arrayBuffer();
//             const imageUrl = createImageUrl(buffer, type);
//             uploadImages((prev) => [{ file: imageUrl }]);
//           }}
//           accept="image/png,image/jpeg"
//         >
//           {(props) => (
//             <Button
//               {...props}
//               className="px-2 mt-3 rounded-full bg-white text-black border-none shadow-none outline-none hover:bg-black hover:text-white"
//             >
//               Upload image
//             </Button>
//           )}
//         </FileButton>
//       </Group>
//     </div>
//   );
// }
