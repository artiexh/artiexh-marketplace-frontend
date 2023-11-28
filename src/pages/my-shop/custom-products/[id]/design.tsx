import axiosClient from "@/services/backend/axiosClient";
import {
  updateImageCombinationApi,
  updateImageSetApi,
  updateThumbnailApi,
} from "@/services/backend/services/customProduct";
import {
  getPrivateFile,
  privateUploadFiles,
} from "@/services/backend/services/media";
import { CustomProductDesignInfo } from "@/types/CustomProduct";
import { ImageConfig, ProductBaseDetail } from "@/types/ProductBase";
import { CommonResponseBase } from "@/types/ResponseBase";
import { createImageUrl } from "@/utils/three";
import {
  Accordion,
  Button,
  FileButton,
  Group,
  LoadingOverlay,
  Paper,
  Transition,
} from "@mantine/core";
import { Decal, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  IconAdjustmentsAlt,
  IconArrowLeft,
  IconArrowRight,
  IconPhotoEdit,
} from "@tabler/icons-react";
import {
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import {
  ImgHTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSWR from "swr";
import { Mesh } from "three";

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

const OverlayContext = createContext({
  overlay: false,
  setOverlay: (prev: boolean) => {},
});

function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlay, setOverlay] = useState(false);

  return (
    <OverlayContext.Provider value={{ overlay, setOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
}

function OverlayElement() {
  const { overlay } = useContext(OverlayContext);

  return <LoadingOverlay visible={overlay} zIndex={1000} />;
}

export default function DesignPortalPage() {
  const router = useRouter();

  const { id } = router.query;

  if (router.isReady && typeof id !== "string")
    router.push("/my-shop/design-inventory");

  const designItemId = id as string;

  const { data: res, isLoading } = useQuery({
    queryKey: ["custom-product", { id: id }],
    queryFn: async () => {
      if (!router.isReady) return null;
      const res = await axiosClient.get<
        CommonResponseBase<CustomProductDesignInfo>
      >(`/custom-product/${id}/design`);

      return res.data;
    },
  });

  const { data: productTemplateRes, isLoading: isProductTemplateLoading } =
    useQuery({
      queryKey: [
        "product-template",
        { id: res?.data.variant.productTemplate.id },
      ],
      queryFn: async () => {
        if (!router.isReady || !res?.data.variant.productTemplate.id)
          return null;
        const response = await axiosClient.get<
          CommonResponseBase<ProductBaseDetail>
        >(`/product-template/${res?.data.variant.productTemplate.id}`);

        return response.data;
      },
    });

  const combinations = productTemplateRes?.data.imageCombinations ?? [];

  if (isLoading || isProductTemplateLoading) return <h1>Loading</h1>;

  if (!res?.data || !productTemplateRes?.data)
    return <h1>Something went wrong</h1>;

  const currentCombination = combinations.find(
    (combination) => combination.code === res.data.combinationCode
  );

  return (
    <OverlayProvider>
      <MockupImagesProvider
        designItemId={designItemId}
        imageSets={res.data.imageSet.map((el) => {
          const set = currentCombination?.images.find(
            (set) => set.code === el.positionCode
          );
          return {
            positionCode: el.positionCode,
            id: el?.mockupImage?.id.toString(),
            fileName: el?.mockupImage?.fileName,
            position: set?.position,
            rotate: set?.rotate,
            scale: set?.scale,
            mockupImageSize: set?.mockupImageSize ?? {
              height: 1024,
              width: 1024,
            },
          };
        })}
      >
        <div className="!w-screen !h-screen relative">
          <OverlayElement />
          <ConfigMenu />
          <DesignPortalContainer
            modelCode={productTemplateRes?.data.model3DCode}
          />
        </div>
      </MockupImagesProvider>
    </OverlayProvider>
  );
}

const MockupImagesContext = createContext<UseQueryResult<MockupConfig>[]>([]);

function DecalWithImageContainer(
  props: React.ComponentProps<typeof Decal> & {
    imageId?: string;
    file: string | File;
    name: string;
    mockupImageSize?: { height: number; width: number };
  }
) {
  const { file, name, ...rest } = props;

  const { data, isLoading } = useSWR([name, rest.imageId], async () => {
    if (typeof file === "string") return file;
    const { type } = file;
    const buffer = await file.arrayBuffer();
    const imageUrl = createImageUrl(buffer, type);
    return imageUrl;
  });

  if (isLoading) return null;

  if (typeof data !== "string") return null;

  return <DecalWithImage key={rest.id} {...rest} file={data} />;
}

function DecalWithImage(
  props: React.ComponentProps<typeof Decal> & {
    file: string;
    mockupImageSize?: { height: number; width: number };
  }
) {
  const { file, ...rest } = props;
  const decalRef = useRef<Mesh | null>(null);
  const texture = useTexture(file);

  const { scale = [1, 1, 1], mockupImageSize = { height: 1024, width: 1024 } } =
    rest;

  const imageSize = {
    width: texture.image.width ?? 1024,
    height: texture.image.height ?? 1024,
  };
  if (
    imageSize.width > mockupImageSize.width &&
    imageSize.height > mockupImageSize.height
  ) {
    //scale the image size based on mockupImageSize
    const scaleRatio = Math.min(
      mockupImageSize.width / imageSize.width,
      mockupImageSize.height / imageSize.height
    );
    console.log(scaleRatio);
    //asign new image size
    imageSize.width = imageSize.width * scaleRatio;
    imageSize.height = imageSize.height * scaleRatio;
  } else if (imageSize.width > mockupImageSize.width) {
    //scale the image size based on mockupImageSize
    const scaleRatio = mockupImageSize.width / imageSize.width;
    //asign new image size
    imageSize.width = imageSize.width * scaleRatio;
    imageSize.height = imageSize.height * scaleRatio;
  } else if (imageSize.height > mockupImageSize.height) {
    //scale the image size based on mockupImageSize
    const scaleRatio = mockupImageSize.height / imageSize.height;
    //asign new image size
    imageSize.width = imageSize.width * scaleRatio;
    imageSize.height = imageSize.height * scaleRatio;
  }

  return (
    <Decal
      {...rest}
      ref={decalRef}
      scale={[
        //@ts-ignore
        ((imageSize.width * 1) / mockupImageSize.width) * scale[0],
        //@ts-ignore
        ((imageSize.height * 1) / mockupImageSize.height) * scale[1],
        //@ts-ignore
        scale[2],
      ]}
    >
      <meshBasicMaterial map={texture} polygonOffset polygonOffsetFactor={-1} />
    </Decal>
  );
}

import { extend } from "@react-three/fiber";
extend({ ConfigMenu });

function DesignPortalContainer({ modelCode }: { modelCode: string }) {
  const imageQueryResults = useContext(MockupImagesContext);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;
  let WrapperContainer = null;

  const latest = useRef<number>();
  const ids = useRef<string[]>([]);
  const updateThumbail = useRef(
    _.debounce(async () => {
      const canvasElemnt = document.querySelector(
        "#portal-canvas canvas"
      ) as HTMLCanvasElement | null;

      if (!canvasElemnt) return;

      const blob = await (() =>
        new Promise<Blob | null>((resolve) => {
          canvasElemnt.toBlob((blob) => resolve(blob));
        }))();

      const designItemRes = queryClient.getQueryData<
        CommonResponseBase<CustomProductDesignInfo>
      >(["custom-product", { id: id }]);

      if (!designItemRes || !blob) return;

      let thumbnail: string | undefined = designItemRes.data.modelThumbnail?.id;

      const { data: fileRes } = await privateUploadFiles([
        new File([blob], "thumbnail.jpg"),
      ]);
      thumbnail = fileRes.data.fileResponses[0].id;

      const res = await updateThumbnailApi(designItemRes.data, thumbnail);

      queryClient.setQueryData(["custom-product", { id: id }], res.data);
    }, 300)
  );

  useEffect(() => {
    if (ids.current.length !== imageQueryResults.length) {
      //properly upadted
      latest.current = Math.max(
        ...imageQueryResults.map((el) => el.dataUpdatedAt)
      );
      ids.current = imageQueryResults
        .map((el) => el.data?.id)
        .filter((str) => str !== undefined) as string[];

      try {
        updateThumbail.current?.();
      } catch (e) {
        //ignore
      }
      return;
    }
    if (
      imageQueryResults.every((el) => el.isFetched) &&
      latest.current === undefined
    ) {
      //first mount
      latest.current = Math.max(
        ...imageQueryResults.map((el) => el.dataUpdatedAt)
      );
      ids.current = imageQueryResults
        .map((el) => el.data?.id)
        .filter((str) => str !== undefined) as string[];
      return;
    }
    if (
      imageQueryResults.every((el) => el.isFetched) &&
      imageQueryResults.some(
        (el) =>
          new Date(el.dataUpdatedAt ?? 0).getTime() >
          new Date(latest.current ?? 0).getTime()
      ) &&
      imageQueryResults.some((el) => !ids.current.includes(el.data?.id ?? ""))
    ) {
      latest.current = Math.max(
        ...imageQueryResults.map((el) => el.dataUpdatedAt)
      );
      ids.current = imageQueryResults
        .map((el) => el.data?.id)
        .filter((str) => str !== undefined) as string[];

      try {
        updateThumbail.current?.();
      } catch (e) {
        //ignore
      }
    }
  }, [imageQueryResults]);

  if (modelCode === "T_SHIRT") WrapperContainer = TShirtContainer;
  if (modelCode === "TOTE_BAG") WrapperContainer = ToteBagContainer;

  if (WrapperContainer === null) return null;

  return (
    <Canvas
      className="w-full h-full"
      gl={{ preserveDrawingBuffer: true }}
      id="portal-canvas"
      camera={{ fov: 1, near: 0.1, far: 1000, position: [0, 0, 5] }}
    >
      <OrbitControls enableDamping enablePan enableRotate enableZoom />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <WrapperContainer>
        {imageQueryResults
          .filter((el) => !el.isLoading)
          .map((el) => {
            console.log(el);
            const data = el.data;
            if (!data?.file) return null;
            return (
              <DecalWithImageContainer
                name={data.positionCode}
                key={data.id}
                imageId={data.id}
                debug
                position={data.position}
                rotation={data.rotate}
                scale={data.scale}
                file={data.file}
                mockupImageSize={data.mockupImageSize}
              />
            );
          })}
      </WrapperContainer>
    </Canvas>
  );
}

function ConfigMenu() {
  const [tab, setTab] = useState<"META" | "IMAGE" | undefined>("META");

  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;

  const res = queryClient.getQueryData<
    CommonResponseBase<CustomProductDesignInfo>
  >(["custom-product", { id: id }]);

  const productTemplateRes = queryClient.getQueryData<
    CommonResponseBase<ProductBaseDetail>
  >(["product-template", { id: res?.data.variant.productTemplate.id }]);

  const combinations = productTemplateRes?.data.imageCombinations ?? [];

  const currentCombination = combinations.find(
    (combination) => combination.code === res?.data?.combinationCode
  );

  if (!res?.data) return null;

  return (
    <>
      <div className="left-side absolute h-4/5 left-[2%] top-[5%] z-10">
        <div className="flex gap-x-3 navigation">
          <Button
            onClick={() => router.push("/my-shop/custom-products")}
            variant="outline"
            className="px-2 h-12 aspect-square w-fit rounded-full border-none shadow-none outline-none"
          >
            <IconArrowLeft className="w-8 aspect-square" />
          </Button>
        </div>
        <div className="edit-menu mt-5 bg-white py-4 px-3 flex flex-col items-center gap-y-5 w-fit rounded-full">
          <Button
            onClick={() =>
              setTab((prev) => (prev === "META" ? undefined : "META"))
            }
            variant="filled"
            className={clsx(
              "px-2 h-10 aspect-square w-fit rounded-full border-none shadow-none outline-none",
              tab === "META" && "bg-primary !text-white"
            )}
          >
            <IconAdjustmentsAlt className="w-6 aspect-square" />
          </Button>
          <Button
            onClick={() =>
              setTab((prev) => (prev === "IMAGE" ? undefined : "IMAGE"))
            }
            variant="filled"
            className={clsx(
              "px-2 h-10 aspect-square w-fit rounded-full border-none shadow-none outline-none",
              tab === "IMAGE" && "bg-primary !text-white"
            )}
          >
            <IconPhotoEdit className="w-6 aspect-square my-2" />
          </Button>
        </div>
      </div>
      <Transition
        mounted={tab === "IMAGE"}
        transition="slide-left"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            className="config-tab bg-white w-96 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg px-4 py-6 overflow-y-scroll"
            style={{ ...styles, zIndex: 1 }}
          >
            <ImageCombinationPicker
              currentCombination={currentCombination}
              combinations={combinations}
            />
          </Paper>
        )}
      </Transition>

      <Transition
        mounted={tab === "META"}
        transition="slide-left"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Paper
            className="config-tab bg-white w-96 h-4/5 right-5 top-[10%] fixed z-10 rounded-lg px-4 py-6 overflow-y-scroll"
            style={{ ...styles, zIndex: 1 }}
          >
            <MetaConfiguration designItem={res.data} />
          </Paper>
        )}
      </Transition>
    </>
  );
}

type MetaFieldsForm = {
  name: string;
  description?: string;
  tags?: string[];
};

type MetaConfigurationProps = {
  designItem: CustomProductDesignInfo;
};

function MetaConfiguration({ designItem }: MetaConfigurationProps) {
  return (
    <>
      <h3>Product design</h3>
      <div>
        <h3 className="mb-1.5 font-semibold">General information</h3>
        <div className="flex flex-col gap-y-1.5">
          <span className="text-sm">
            <strong>Category: </strong>
            {designItem.category.name}
          </span>
        </div>
        <h3 className="mb-1.5 font-semibold mt-3">Variant</h3>
        <div className="flex flex-col gap-y-1.5">
          {designItem.variant.variantCombinations.map((combination) => {
            return (
              <span className="text-sm" key={combination.option.id}>
                <strong>{combination.option?.name}: </strong>
                {combination?.optionValue?.name ?? "N/A"}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}

type ImagesProviderProps = {
  designItemId: string;
  imageSets: Omit<MockupConfig, "file">[];
  children?: React.ReactNode;
};

type MockupConfig = {
  id?: string;
  positionCode: string;
  fileName?: string;
  file?: string | File;
  position?: [number, number, number];
  rotate?: [number, number, number];
  scale?: [number, number, number];
  mockupImageSize?: {
    width: number;
    height: number;
  };
};

function MockupImagesProvider({
  imageSets,
  designItemId,
  children,
}: ImagesProviderProps) {
  const { setOverlay } = useContext(OverlayContext);

  const userQueriesResults = useQueries<MockupConfig[]>({
    queries: imageSets.map((set) => {
      return {
        queryKey: [
          "mockup-image",
          {
            designItemId: designItemId,
            positionCode: set.positionCode,
            imageId: set.id,
          },
        ],
        queryFn: async () => {
          try {
            console.log(set.id);
            setOverlay(true);
            if (!set.id)
              return {
                positionCode: set.positionCode,
              };

            const res = await getPrivateFile(set.id.toString());
            const buffer = Buffer.from(res.data, "binary").toString("base64");
            let image = `data:${res.headers["content-type"]};base64,${buffer}`;

            return {
              positionCode: set.positionCode,
              id: set.id,
              fileName: set.fileName,
              file: image,
              position: set.position,
              rotate: set.rotate,
              scale: set.scale,
              mockupImageSize: set.mockupImageSize,
            };
          } finally {
            setOverlay(false);
          }
        },
      };
    }),
  });

  return (
    <MockupImagesContext.Provider
      value={userQueriesResults as UseQueryResult<MockupConfig>[]}
    >
      {children}
    </MockupImagesContext.Provider>
  );
}

type ImageCombinationPickerProps = {
  currentCombination?: {
    code: string;
    images: ImageConfig[];
    name: string;
  };
  combinations: {
    code: string;
    images: ImageConfig[];
    name: string;
  }[];
};

function ImageCombinationPicker({
  combinations,
  currentCombination,
}: ImageCombinationPickerProps) {
  const [step, setStep] = useState(currentCombination ? 1 : 0);

  useEffect(() => {
    setStep(currentCombination ? 1 : 0);
  }, [currentCombination]);

  return (
    <>
      {step === 0 && (
        <>
          <div className="flex justify-between">
            <h3>Combinations</h3>
            <div>
              {currentCombination && (
                <IconArrowRight
                  className="w-6 aspect-square cursor-pointer"
                  onClick={() => setStep(1)}
                />
              )}
            </div>
          </div>
          <CombinationCodePicker combinations={combinations} />
        </>
      )}
      {step === 1 && (
        <>
          <div className="flex gap-x-2">
            <IconArrowLeft
              className="w-6 aspect-square cursor-pointer"
              onClick={() => setStep(0)}
            />
            <h3 className="font-bold text-lg">{currentCombination?.name}</h3>
          </div>
          <ImageSetPicker currentCombination={currentCombination} />
        </>
      )}
    </>
  );
}

type ImageSetPickerProps = {
  currentCombination?: {
    code: string;
    images: ImageConfig[];
    name: string;
  };
};

function ImageSetPicker({ currentCombination }: ImageSetPickerProps) {
  const imageQueryResults = useContext(MockupImagesContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setOverlay } = useContext(OverlayContext);

  const { id } = router.query;

  const designItemRes = queryClient.getQueryData<
    CommonResponseBase<CustomProductDesignInfo>
  >(["custom-product", { id: id }]);

  const updateMockupImageSetMutation = useMutation({
    mutationFn: async (body: { positionCode: string; file: File }) => {
      const { positionCode, file } = body;

      if (!designItemRes?.data) throw new Error("There is something wrong");

      const { data: fileRes } = await privateUploadFiles([file]);

      const firstImage = fileRes.data.fileResponses[0];
      if (!firstImage) throw new Error("There is something wrong");

      const res = await updateImageSetApi(
        designItemRes.data,
        //@ts-ignore
        designItemRes.data.imageSet.some(
          (el) => el.positionCode === positionCode
        )
          ? designItemRes.data.imageSet.map((set) => {
              if (set.positionCode !== positionCode) return set;

              return {
                ...set,
                mockupImage: {
                  id: firstImage.id.toString(),
                  fileName: firstImage.fileName,
                },
              };
            })
          : [
              ...designItemRes.data.imageSet,
              {
                positionCode: positionCode,
                mockupImage: {
                  id: firstImage.id.toString(),
                  fileName: firstImage.fileName,
                },
              },
            ],
        designItemRes.data.modelThumbnail?.id
      );

      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["custom-product", { id: id }], data);
    },
  });

  const updateManufacturingImageSetMutation = useMutation({
    mutationFn: async (body: { positionCode: string; file: File }) => {
      setOverlay(true);
      const { positionCode, file } = body;
      if (!designItemRes?.data) throw new Error("There is something wrong");
      const { data: fileRes } = await privateUploadFiles([file]);

      const firstImage = fileRes.data.fileResponses[0];
      if (!firstImage) throw new Error("There is something wrong");
      const res = await updateImageSetApi(
        designItemRes.data,
        //@ts-ignore
        designItemRes.data.imageSet.some(
          (el) => el.positionCode === positionCode
        )
          ? designItemRes.data.imageSet.map((set) => {
              if (set.positionCode !== positionCode) return set;

              return {
                ...set,
                manufacturingImage: {
                  id: firstImage.id.toString(),
                  fileName: firstImage.fileName,
                },
              };
            })
          : [
              ...designItemRes.data.imageSet,
              {
                positionCode: positionCode,
                manufacturingImage: {
                  id: firstImage.id.toString(),
                  fileName: firstImage.fileName,
                },
              },
            ],
        designItemRes.data.modelThumbnail?.id
      );

      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["custom-product", { id: id }], data);
    },
    onSettled: () => {
      setOverlay(false);
    },
  });

  return (
    <>
      <Accordion multiple={true}>
        {currentCombination?.images?.map((el, index) => {
          const imageSet = currentCombination?.images.find(
            (i) => i.code === el.code
          );

          if (!imageSet) return null;

          const mockup = imageQueryResults.find(
            (i) => !i.isLoading && i.data?.positionCode === imageSet.code
          )?.data;

          const { manufacturingImage, mockupImage } =
            designItemRes?.data.imageSet.find(
              (set) => set.positionCode === el.code
            ) ?? {};

          const mockupImageSize = imageSet?.mockupImageSize ?? {
            width: 1024,
            height: 1024,
          };

          return (
            <Accordion.Item key={imageSet.code} value={imageSet.code}>
              <Accordion.Control className="hover:text-white">
                {imageSet.name}
              </Accordion.Control>
              <Accordion.Panel>
                <Group position="center">
                  <h3>
                    Mockup image{" "}
                    {`(${mockupImageSize?.width}x${mockupImageSize?.height})`}
                  </h3>
                  {mockup?.file && (
                    <ImageLoaderForFile
                      key={mockup.id}
                      name={mockup.id ?? ""}
                      src={mockup?.file}
                    />
                  )}
                  <FileButton
                    key={imageSet.code}
                    disabled={
                      updateMockupImageSetMutation.isLoading ||
                      queryClient.getQueryState([
                        "mockup-image",
                        {
                          designItemId: id,
                          positionCode: imageSet.code,
                          imageId: mockup?.id,
                        },
                      ])?.status === "loading"
                    }
                    onChange={async (e) => {
                      const file = e;
                      if (!file) return;
                      updateMockupImageSetMutation.mutateAsync({
                        positionCode: imageSet.code,
                        file: file,
                      });
                    }}
                    accept="image/png,image/jpeg"
                  >
                    {(props) => (
                      <Button
                        {...props}
                        className="px-2 mt-3 rounded-full bg-white text-black border border-black shadow-none outline-none hover:bg-black hover:!text-white"
                      >
                        Upload image
                      </Button>
                    )}
                  </FileButton>
                </Group>
                <div>
                  <h3>Manufacturing image</h3>
                  <FileUpload
                    value={
                      manufacturingImage
                        ? {
                            fileName: manufacturingImage.fileName,
                            file: manufacturingImage.fileName,
                          }
                        : undefined
                    }
                    onChange={async (e) => {
                      const file = e;
                      if (!file) return;
                      updateManufacturingImageSetMutation.mutateAsync({
                        positionCode: imageSet.code,
                        file: file,
                      });
                    }}
                  />
                </div>
                {/* <Group position="center">
                  <h3>Manufacturing image</h3>
                  <div className="flex justify-between items-center w-full">
                    {manufacturingImage && (
                      <div className="w-1/2 flex gap-x-1">
                        <IconFileCheck className="w-6 aspect-square text-green-600 " />
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis w-3/4">
                          {manufacturingImage?.fileName}
                        </span>
                      </div>
                    )}
                    <FileButton
                      key={imageSet.code}
                      onChange={async (e) => {
                        const file = e;
                        if (!file) return;
                        updateManufacturingImageSetMutation.mutateAsync({
                          positionCode: imageSet.code,
                          file: file,
                        });
                      }}
                      accept="*"
                    >
                      {(props) => (
                        <Button
                          {...props}
                          className=" px-2 rounded-full bg-white text-black border border-black shadow-none outline-none hover:bg-black hover:text-white"
                        >
                          Upload file
                        </Button>
                      )}
                    </FileButton>
                  </div>
                </Group> */}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
}

type CombinationCodePickerProps = {
  combinations: {
    code: string;
    images: ImageConfig[];
    name: string;
  }[];
};

import FileUpload from "@/components/FileUpload/FileUpload";
import TShirtContainer from "@/containers/3dModelContainers/TShirtContainer";
import ToteBagContainer from "@/containers/3dModelContainers/ToteBagContainer";
import logoImage from "../../../../../public/assets/logo.svg";
import { mock } from "node:test";
import _ from "lodash";

function CombinationCodePicker({ combinations }: CombinationCodePickerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;

  const designItemRes = queryClient.getQueryData<
    CommonResponseBase<CustomProductDesignInfo>
  >(["custom-product", { id: id }]);

  const updateCombinationCodeMutate = useMutation({
    mutationFn: async (combinationCode: string) => {
      if (!designItemRes?.data) throw new Error("There is something wrong");
      const res = await updateImageCombinationApi(
        designItemRes.data,
        combinationCode
      );

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["custom-product", { id: id }], data);
    },
  });

  if (!designItemRes?.data) return null;

  return (
    <>
      <div className="flex flex-col gap-y-2 mt-2">
        {combinations.map((el) => (
          <div
            key={el.code}
            className={clsx(
              "bg-white rounded-md flex p-2 justify-between",
              designItemRes.data.combinationCode !== el.code && "cursor-pointer"
            )}
            onClick={
              designItemRes.data?.combinationCode === el.code
                ? undefined
                : () => updateCombinationCodeMutate.mutateAsync(el.code)
            }
          >
            <span className="font-semibold">{el.name}</span>
            {designItemRes.data?.combinationCode === el.code ? (
              <img src={logoImage} className="w-6 aspect-square" alt="logo" />
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
