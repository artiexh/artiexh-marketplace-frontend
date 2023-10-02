import { fetcher } from "@/services/backend/axiosClient";
import { SimpleDesignItem } from "@/types/DesignItem";
import { ImageConfig, SimpleProductBase } from "@/types/ProductBase";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Accordion, Button, FileButton, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Decal, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  IconAdjustmentsAlt,
  IconArrowLeft,
  IconFileCheck,
  IconMenu2,
  IconPhotoEdit,
} from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Dispatch,
  ImgHTMLAttributes,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { Mesh } from "three";
import logoImage from "../../../public/assets/logo.svg";
import { TShirtContainer } from "./portal";

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

function DecalWithImageContainer(
  props: React.ComponentProps<typeof Decal> & {
    file: string | File;
    name: string;
  }
) {
  const { file, name, ...rest } = props;
  const { data, isLoading } = useSWR([name], async () => {
    if (typeof file === "string") return file;
    const { type } = file;
    const buffer = await file.arrayBuffer();
    const imageUrl = createImageUrl(buffer, type);
    return imageUrl;
  });

  if (isLoading) return null;

  if (typeof data !== "string") return null;

  return <DecalWithImage {...rest} file={data} />;
}

function DecalWithImage(
  props: React.ComponentProps<typeof Decal> & { file: string }
) {
  const { file, ...rest } = props;
  const decalRef = useRef<Mesh | null>(null);
  const texture = useTexture(file);

  return <Decal {...rest} map={texture} ref={decalRef}></Decal>;
}

function ImageLoaderForFile({
  src,
  name,
  ...rest
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: File | string;
  name: string;
}) {
  const { data, isLoading } = useSWR([name], async () => {
    if (src instanceof File) {
      const { type } = src;
      const buffer = await src.arrayBuffer();
      const imageUrl = createImageUrl(buffer, type);
      return imageUrl;
    }
    return src;
  });

  if (isLoading) return null;

  return <img {...rest} src={data} />;
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
      manufacturingImage?: string | File;
      mockupImage?: string | File;
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
          {combination?.images.map((set) => {
            const image = form.values.sets.find(
              (i) => i.code === set.code
            )?.mockupImage;
            return image ? (
              <DecalWithImageContainer
                name={set.code}
                key={set.code}
                debug
                position={set.position}
                rotation={set.rotate}
                scale={set.scale}
                file={image}
              ></DecalWithImageContainer>
            ) : null;
          })}
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
                  <Image
                    src={logoImage}
                    className="w-6 aspect-square"
                    alt="logo"
                  />
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
                      <Group position="center">
                        <h3>Mockup image</h3>
                        {el.mockupImage && (
                          <ImageLoaderForFile
                            name={imageSet.code}
                            src={el.mockupImage}
                          />
                        )}
                        <FileButton
                          key={imageSet.code}
                          onChange={async (e) => {
                            const file = e;
                            if (!file) return;
                            form.setFieldValue(
                              `sets.${index}.mockupImage`,
                              file
                            );
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
                      <Group position="center">
                        <h3>Manufacturing image</h3>
                        <div className="flex justify-between items-center w-full">
                          {el.manufacturingImage && (
                            <div className="w-1/2 flex gap-x-1">
                              <IconFileCheck className="w-6 aspect-square text-green-600 " />
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis w-3/4">
                                {(el.manufacturingImage as File)?.name}
                              </span>
                            </div>
                          )}
                          <FileButton
                            key={imageSet.code}
                            onChange={async (e) => {
                              const file = e;
                              if (!file) return;
                              form.setFieldValue(
                                `sets.${index}.manufacturingImage`,
                                file
                              );
                            }}
                            accept="image/png,image/jpeg"
                          >
                            {(props) => (
                              <Button
                                {...props}
                                className=" px-2 rounded-full bg-white text-black border border-black shadow-none outline-none hover:bg-black hover:text-white"
                              >
                                Upload image
                              </Button>
                            )}
                          </FileButton>
                        </div>
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
