import axiosClient from "@/services/backend/axiosClient";
import {
  getPrivateFile,
  privateUploadFiles,
} from "@/services/backend/services/media";
import { DesignItemDetail } from "@/types/DesignItem";
import { CommonResponseBase } from "@/types/ResponseBase";
import {
  Accordion,
  Button,
  FileButton,
  Group,
  Input,
  MultiSelect,
  Paper,
  TextInput,
  Textarea,
  Transition,
} from "@mantine/core";
import { Canvas } from "@react-three/fiber";
import {
  IconAdjustmentsAlt,
  IconArrowLeft,
  IconArrowRight,
  IconFileCheck,
  IconMenu2,
  IconPhotoEdit,
} from "@tabler/icons-react";
import {
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  ImgHTMLAttributes,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TShirtContainer } from "./portal";
import { Decal, useTexture } from "@react-three/drei";
import useSWR from "swr";
import { createImageUrl } from "@/utils/three";
import { Mesh } from "three";
import { ImageConfig } from "@/types/ProductBase";
import {
  updateGeneralInformationApi,
  updateImageCombinationApi,
  updateImageSetApi,
} from "@/services/backend/services/designInventory";
import clsx from "clsx";
import Image from "next/image";
import { useForm } from "@mantine/form";

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

export default function DesignPortalPage() {
  const router = useRouter();

  const { id } = router.query;

  if (router.isReady && typeof id !== "string")
    router.push("/my-shop/design-inventory");

  const designItemId = id as string;

  const { data: res, isLoading } = useQuery({
    queryKey: ["design-item", { id: id }],
    queryFn: async () => {
      if (!router.isReady) return null;
      const res = await axiosClient.get<CommonResponseBase<DesignItemDetail>>(
        `/inventory-item/${id}`
      );

      return res.data;
    },
  });

  const combinations = res?.data.variant.productBase.imageCombinations ?? [];

  if (isLoading) return <h1>Loading</h1>;

  if (!res?.data) return <h1>Something went wrong</h1>;

  const currentCombination = combinations.find(
    (combination) => combination.code === res.data.combinationCode
  );

  return (
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
        };
      })}
    >
      <div className="!w-screen !h-screen">
        <ConfigMenu />
        <DesignPortalContainer />
      </div>
    </MockupImagesProvider>
  );
}

const MockupImagesContext = createContext<UseQueryResult<MockupConfig>[]>([]);

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

function DesignPortalContainer() {
  const imageQueryResults = useContext(MockupImagesContext);

  return (
    <Canvas className="w-full h-full">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <TShirtContainer>
        {imageQueryResults
          .filter((el) => !el.isLoading)
          .map((el) => {
            const data = el.data;
            if (!data?.file) return null;
            return (
              <DecalWithImageContainer
                name={data.positionCode}
                key={data.positionCode}
                debug
                position={data.position}
                rotation={data.rotate}
                scale={data.scale}
                file={data.file}
              />
            );
          })}
      </TShirtContainer>
    </Canvas>
  );
}

function ConfigMenu() {
  const [tab, setTab] = useState<"META" | "IMAGE" | undefined>("META");

  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;

  const res = queryClient.getQueryData<CommonResponseBase<DesignItemDetail>>([
    "design-item",
    { id: id },
  ]);

  const combinations = res?.data?.variant?.productBase?.imageCombinations ?? [];

  const currentCombination = combinations.find(
    (combination) => combination.code === res?.data?.combinationCode
  );

  if (!res?.data) return null;

  return (
    <>
      <div className="left-side absolute h-4/5 left-[2%] top-[5%] z-10">
        <div className="flex gap-x-3 navigation">
          <Button
            onClick={() => router.push("/my-shop/design-inventory")}
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
  designItem: DesignItemDetail;
};

function MetaConfiguration({ designItem }: MetaConfigurationProps) {
  const queryClient = useQueryClient();
  const { data: tagList } = useTags();
  const { onSubmit, getInputProps, isDirty, reset, setValues, resetDirty } =
    useForm<MetaFieldsForm>({
      initialValues: {
        name: designItem.name,
        description: designItem.description,
        tags: designItem.tags ?? [],
      },
    });

  useEffect(() => {
    setValues({
      name: designItem.name,
      description: designItem.description,
      tags: designItem.tags ?? [],
    });
    resetDirty();
  }, [designItem]);

  // FETCH TAGS FROM SERVER
  const mapTagDataToTagOption = (data: Tag[]) =>
    data?.map((tag) => ({
      value: tag.name,
      label: tag.name,
    })) ?? [];
  const [tags, setTags] = useState<
    {
      value: string;
      label: string;
    }[]
  >(mapTagDataToTagOption(tagList?.data.items ?? []) ?? []);

  useEffect(() => {
    setTags(mapTagDataToTagOption(tagList?.data.items ?? []) ?? []);
  }, [tagList]);

  const updateGeneralInformationMutation = useMutation({
    mutationFn: async (data: MetaFieldsForm) => {
      const res = await updateGeneralInformationApi(designItem, data);

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [
          "design-item",
          {
            id: designItem.id,
          },
        ],
        data
      );
    },
  });

  const submitHandler = (data: MetaFieldsForm) => {
    updateGeneralInformationMutation.mutateAsync(data);
  };

  return (
    <>
      <h3>Product design</h3>
      <form
        onSubmit={onSubmit(submitHandler)}
        className="flex flex-col gap-y-2"
      >
        <TextInput label="Name" {...getInputProps("name")} />
        <MultiSelect
          data={tags}
          label="Tags"
          className="col-span-12"
          searchable
          clearable
          nothingFound="Nothing found"
          classNames={{
            values: "!mr-0",
          }}
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setTags((prev) => [...prev, item]);
            return item;
          }}
          {...getInputProps("tags")}
        />
        <Textarea label="Description" {...getInputProps("description")} />
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            disabled={!isDirty()}
            loading={updateGeneralInformationMutation.isLoading}
          >
            Apply
          </Button>
        </div>
      </form>
      <Accordion className="mt-5">
        <Accordion.Item value="detail">
          <Accordion.Control>Product details</Accordion.Control>
          <Accordion.Panel>
            <h3 className="mb-1.5 font-semibold">General information</h3>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-sm">
                <strong>Category: </strong>
                {designItem.variant.productBase.category.name}
              </span>
            </div>
            <h3 className="mb-1.5 font-semibold mt-3">Variant</h3>
            <div className="flex flex-col gap-y-1.5">
              {designItem.variant.variantCombinations.map((combination) => {
                const option =
                  designItem.variant.productBase.productOptions.find(
                    (o) => o.id === combination.optionId
                  );
                if (option === null) return null;
                return (
                  <span className="text-sm" key={combination.optionId}>
                    <strong>{option?.name}: </strong>
                    {option?.optionValues.find(
                      (v) => v.id === combination.optionValueId
                    )?.name ?? "N/A"}
                  </span>
                );
              })}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
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
};

function MockupImagesProvider({
  imageSets,
  designItemId,
  children,
}: ImagesProviderProps) {
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
          console.log(set.id);
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
          };
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

  const { id } = router.query;

  const designItemRes = queryClient.getQueryData<
    CommonResponseBase<DesignItemDetail>
  >(["design-item", { id: id }]);

  const updateMockupImageSetMutation = useMutation({
    mutationFn: async (body: { positionCode: string; file: File }) => {
      const { positionCode, file } = body;
      if (!designItemRes?.data) throw new Error("There is something wrong");
      const { data: fileRes } = await privateUploadFiles([file]);

      const firstImage = fileRes.data.fileResponses[0];
      if (!firstImage) throw new Error("There is something wrong");
      const res = await updateImageSetApi(
        designItemRes.data,
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
            ]
      );

      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries([
        "mockup-image",
        {
          designItemId: id,
          positionCode: variables.positionCode,
          imageId: data.data?.imageSet?.find(
            (el) => el?.positionCode === variables?.positionCode
          )?.mockupImage?.id,
        },
      ]);
      queryClient.setQueryData(["design-item", { id: id }], data);
    },
  });

  const updateManufacturingImageSetMutation = useMutation({
    mutationFn: async (body: { positionCode: string; file: File }) => {
      console.log("test");
      const { positionCode, file } = body;
      if (!designItemRes?.data) throw new Error("There is something wrong");
      const { data: fileRes } = await privateUploadFiles([file]);

      const firstImage = fileRes.data.fileResponses[0];
      if (!firstImage) throw new Error("There is something wrong");
      const res = await updateImageSetApi(
        designItemRes.data,
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
            ]
      );

      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["design-item", { id: id }], data);
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

          return (
            <Accordion.Item key={imageSet.code} value={imageSet.code}>
              <Accordion.Control className="hover:text-white">
                {imageSet.name}
              </Accordion.Control>
              <Accordion.Panel>
                <Group position="center">
                  <h3>Mockup image</h3>
                  {mockup?.file && (
                    <ImageLoaderForFile
                      name={imageSet.code}
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
                </Group>
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

import logoImage from "../../../public/assets/logo.svg";
import { Tag } from "@/types/Product";
import useTags from "@/hooks/useTags";

function CombinationCodePicker({ combinations }: CombinationCodePickerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;

  const designItemRes = queryClient.getQueryData<
    CommonResponseBase<DesignItemDetail>
  >(["design-item", { id: id }]);

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
      queryClient.setQueryData(["design-item", { id: id }], data);
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
              <Image src={logoImage} className="w-6 aspect-square" alt="logo" />
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
