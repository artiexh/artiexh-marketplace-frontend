import { fetcher } from "@/services/backend/axiosClient";
import { DesignItemDetail, SimpleDesignItem } from "@/types/DesignItem";
import { ImageConfig, SimpleProductBase } from "@/types/ProductBase";
import { CommonResponseBase } from "@/types/ResponseBase";
import { Accordion, Button, FileButton, Group, Text } from "@mantine/core";
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
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR, { SWRResponse } from "swr";
import { Mesh } from "three";
import logoImage from "../../../public/assets/logo.svg";
import { TShirtContainer } from "./portal";
import {
  updateImageCombinationApi,
  updateImageSetApi,
} from "@/services/backend/services/designInventory";
import { modals } from "@mantine/modals";
import {
  getPrivateFile,
  privateUploadFiles,
} from "@/services/backend/services/media";

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
          className="px-2 h-12 aspect-square w-fit rounded-full border-none shadow-none outline-none"
        >
          <IconArrowLeft className="w-8 aspect-square" />
        </Button>
        <Button className="px-2 h-12 aspect-square w-fit rounded-full border-none shadow-none outline-none">
          <IconMenu2 className="w-8 aspect-square" />
        </Button>
      </div>
      <div className="edit-menu mt-5 bg-white py-4 px-3 flex flex-col items-center gap-y-5 w-fit rounded-full">
        <Button
          onClick={() => setTab("META")}
          variant="outline"
          className="px-2 h-10 aspect-square w-fit rounded-full border-none shadow-none outline-none"
        >
          <IconAdjustmentsAlt className="w-6 aspect-square" />
        </Button>
        <Button
          onClick={() => setTab("IMAGE")}
          variant="filled"
          className="px-2 h-10 aspect-square w-fit rounded-full border-none shadow-none outline-none"
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

const DesignItemContext = createContext<SWRResponse<
  CommonResponseBase<DesignItemDetail>
> | null>(null);

export default function DesignPortal() {
  const router = useRouter();

  const { id } = router.query;

  const [tab, setTab] = useState<"META" | "IMAGE">("META");

  const form = useForm<{
    sets: Array<{
      code: string;
      manufacturingImage?: {
        id?: string;
        file: string | File;
        fileName: string;
      };
      mockupImage?: {
        id?: string;
        file: string | File;
        fileName: string;
      };
    }>;
  }>({
    initialValues: {
      sets: [],
    },
  });

  const swrRes = useSWR<CommonResponseBase<DesignItemDetail>>(
    ["/design-inventory", id],
    async () => {
      const res = await fetcher<CommonResponseBase<DesignItemDetail>>(
        `/inventory-item/${id}`
      );
      const imageSet = res.data.imageSet ?? [];
      const files = await Promise.all(
        imageSet.map((set) => getPrivateFile(set.mockupImage.id.toString()))
      );

      return {
        ...res,
        data: {
          ...res.data,
          imageSet: res.data.imageSet.map((set, index) => {
            const buffer = Buffer.from(files[index].data, "binary").toString(
              "base64"
            );
            let image = `data:${files[index].headers["content-type"]};base64,${buffer}`;
            console.log(
              "🚀 ~ file: [id].tsx:190 ~ imageSet:res.data.imageSet.map ~ image:",
              image
            );
            return {
              ...set,
              mockupImage: {
                ...set.mockupImage,
                file: image,
              },
            };
          }),
        },
      };
    }
  );

  const { data: response, isLoading, mutate } = swrRes;

  const productBase = response?.data.variant.productBase;

  if (isLoading || !productBase) return null;

  const combination = response.data.variant.productBase.imageCombinations.find(
    (combination) => combination.code === response.data.combinationCode
  );

  return (
    <DesignItemContext.Provider value={swrRes}>
      <div className="!w-screen !h-screen">
        <div className="left-side absolute h-4/5 left-[2%] top-[5%] z-10">
          <ConfigMenu setTab={setTab} tab={tab} />
        </div>
        {!isLoading && tab === "IMAGE" && (
          <ImageCombinationPicker
            combination={combination}
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
                (i) => i.positionCode === set.code
              )?.mockupImage;

              return image ? (
                <DecalWithImageContainer
                  name={set.code}
                  key={set.code}
                  debug
                  position={set.position}
                  rotation={set.rotate}
                  scale={set.scale}
                  file={image.file}
                ></DecalWithImageContainer>
              ) : null;
            })}
          </TShirtContainer>
        </Canvas>
      </div>
    </DesignItemContext.Provider>
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
  combination,
}: {
  data: SimpleProductBase["imageCombinations"];
  form: any;
  combination?: {
    code: string;
    images: ImageConfig[];
    name: string;
  };
}) {
  const swrRes = useContext(DesignItemContext);
  const [step, setStep] = useState(combination ? 1 : 0);
  const designItem = swrRes?.data?.data;

  useEffect(() => {
    if (combination?.code !== form.values.combinationCode) {
      console.log(designItem?.imageSet);
      form.setValues({
        combinationCode: combination?.code,
        sets:
          designItem?.imageSet.map((set, index) => ({
            positionCode: set.positionCode,
            mockupImage: {
              file: set.mockupImage.file,
              id: set.mockupImage.id.toString(),
              fileName: set.mockupImage.fileName,
            },
          })) ?? [],
      });
    }
  }, [combination]);
  console.log("🚀 ~ file: [id].tsx:270 ~ combination:", form.values);

  if (!designItem) return null;

  const handleChangeCombination = async (data: {
    code: string;
    images: ImageConfig[];
    name: string;
  }) => {
    if (designItem.combinationCode) {
      modals.openConfirmModal({
        modalId: "confirm-change-combination",
        title: "Please confirm your action",
        children: (
          <Text size="sm">
            The change of your combination might remove all of your setup in the
            images tab, are you sure you want to do it?
          </Text>
        ),
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onCancel: () => {
          modals.close("confirm-change-combination");
        },
        onConfirm: async () => {
          await updateImageCombinationApi(designItem, data.code);
          swrRes.mutate();
          setStep(1);
        },
      });
    } else {
      await updateImageCombinationApi(designItem, data.code);
      swrRes.mutate();
      setStep(1);
    }
  };

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
                  "bg-white rounded-md flex p-2 justify-between",
                  designItem.combinationCode !== el.code && "cursor-pointer"
                )}
                onClick={
                  designItem?.combinationCode === el.code
                    ? undefined
                    : () => handleChangeCombination(el)
                }
              >
                <span className="font-semibold">{el.name}</span>
                {designItem?.combinationCode === el.code ? (
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
              {combination?.images?.map((el, index) => {
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
                        {form.values.sets.find(
                          (s) => s.positionCode === imageSet.code
                        )?.mockupImage?.file && (
                          <ImageLoaderForFile
                            name={imageSet.code}
                            src={
                              form.values.sets.find(
                                (s) => s.positionCode === imageSet.code
                              )?.mockupImage?.file
                            }
                          />
                        )}
                        <FileButton
                          key={imageSet.code}
                          onChange={async (e) => {
                            const file = e;
                            if (!file) return;
                            const { data: res } = await privateUploadFiles([
                              file,
                            ]);
                            await updateImageSetApi(designItem, [
                              {
                                positionCode: imageSet.code,
                                mockupImage: {
                                  id: res.data.fileResponses[0].id,
                                  fileName: res.data.fileResponses[0].fileName,
                                },
                              },
                            ]);
                            form.setFieldValue(`sets.${index}.mockupImage`, {
                              id: res.data.fileResponses[0].id,
                              fileName: res.data.fileResponses[0].fileName,
                              file: file,
                            });
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
