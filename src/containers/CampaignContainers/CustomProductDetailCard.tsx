import PrivateImageLoader from "@/components/PrivateImageLoader/PrivateImageLoader";
import { CampaignDetail, ProductInCampaignDetail } from "@/types/Campaign";
import { Tag } from "@/types/Product";

import clsx from "clsx";

import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/backend/axiosClient";
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";

import { CommonResponseBase } from "@/types/ResponseBase";
import { GENERAL_CAMPAIGN_ENDPOINT } from "@/services/backend/services/campaign";
import { useForm } from "@mantine/form";
import {
  Accordion,
  Card,
  Col,
  Collapse,
  Grid,
  Input,
  Tabs,
  Textarea,
} from "@mantine/core";
import PrivateFileUploadPreview from "@/components/FileUpload/FileUploadPreview";
import Thumbnail from "@/components/CreateProduct/Thumbnail";
import { currencyFormatter } from "@/utils/formatter";

function CustomProductDetailCard({
  campaignId,
  data,
}: {
  campaignId: string;
  data: CampaignDetail["products"][0];
}) {
  const { setValues } = useForm();
  const { data: productInCampaignRes, isLoading } = useQuery<
    CommonResponseBase<ProductInCampaignDetail>
  >({
    queryKey: ["product-in-campaign", { id: data.id }],
    queryFn: async () => {
      const res = await axiosClient.get<
        CommonResponseBase<ProductInCampaignDetail>
      >(`${GENERAL_CAMPAIGN_ENDPOINT}/${campaignId}/product/${data.id}`);
      setValues({
        name: res.data.data.customProduct.name,
        tags: res.data.data.customProduct.tags,
        quantity: res.data.data.quantity,
        price: res.data.data.price.amount,
        maxItemPerOrder: res.data.data.customProduct.maxItemPerOrder,
        category: res.data.data.customProduct.category.name,
        description: res.data.data.customProduct.description,
        attaches: res.data.data.customProduct.attaches?.filter(
          (el) => el.type !== "THUMBNAIL"
        ),
        thumbnail: res.data.data.customProduct.attaches?.find(
          (el) => el.type === "THUMBNAIL"
        ),
      });
      return res.data;
    },
  });

  if (isLoading || !productInCampaignRes) return null;

  return (
    <>
      <Tabs defaultValue="general-info" className="mt-5">
        <Tabs.List>
          <Tabs.Tab value="general-info">Info</Tabs.Tab>
          <Tabs.Tab value="design">Design</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general-info">
          <CustomProductGeneralInfo data={data} />
        </Tabs.Panel>

        <Tabs.Panel value="design">
          <div
            className={clsx(
              "w-full h-full flex flex-col justify-center p-4 gap-y-6"
            )}
          >
            <div className="w-full h-full flex gap-x-8 gap-y-4">
              <div className="relative aspect-[15/10] rounded-md flex-1">
                <div className="text-xl font-semibold">Preview</div>
                <Card
                  withBorder
                  className="relative aspect-[15/10] rounded-md mt-2"
                >
                  <PrivateImageLoader
                    id={data.customProduct.modelThumbnail?.id.toString()}
                    alt="test"
                    className="rounded-md w-full h-full object-cover"
                  />
                </Card>
              </div>

              <div className="content flex flex-col justify-between flex-1">
                <div className="flex flex-col gap-y-3">
                  <div className="text-xl font-semibold">
                    Thông tin thiết kế
                  </div>
                  <div className="variant-details">
                    <div className="text-lg font-semibold">
                      Thông tin sản xuất
                    </div>
                    <div className="mt-1">
                      <ul className="grid grid-flow-col">
                        {productInCampaignRes.data.customProduct.variant.variantCombinations
                          .sort(
                            (a, b) => Number(a.option.id) - Number(b.option.id)
                          )
                          .map((combination) => {
                            return (
                              <li
                                key={combination.option.id}
                                className="text-sm col-span-1"
                              >
                                <span className="font-semibold">
                                  {combination.option.name}
                                </span>
                                : {combination.optionValue.name}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  <div className="variant-details">
                    <div className="text-lg font-semibold">
                      Thông tin hình ảnh
                    </div>
                    <div className="mt-1">
                      <Accordion>
                        {productInCampaignRes?.data.customProduct.variant.productTemplate.imageCombinations
                          .find(
                            (el) =>
                              el.code ===
                              productInCampaignRes.data.customProduct
                                .combinationCode
                          )
                          ?.images.map((set) => {
                            const customSet =
                              productInCampaignRes.data.customProduct.imageSet.find(
                                (s) => s.positionCode === set.code
                              );

                            if (
                              !customSet ||
                              (!customSet?.mockupImage &&
                                !customSet?.manufacturingImage)
                            ) {
                              return (
                                <>
                                  <Accordion.Item
                                    key={set.code}
                                    value={set.code}
                                  >
                                    <Accordion.Control>
                                      <div
                                        key={set.code}
                                        className="text-sm col-span-1 flex gap-x-1"
                                      >
                                        <IconAlertCircleFilled
                                          size={18}
                                          className="text-yellow-400"
                                        />
                                        <span className="font-semibold">
                                          {set.name}
                                        </span>
                                        : Chưa tải ảnh
                                      </div>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                      <h1>Image preview</h1>
                                    </Accordion.Panel>
                                  </Accordion.Item>
                                </>
                              );
                            }

                            return (
                              <>
                                <Accordion.Item key={set.code} value={set.code}>
                                  <Accordion.Control>
                                    {!customSet?.mockupImage ||
                                    !customSet?.manufacturingImage ? (
                                      <>
                                        <div
                                          key={set.code}
                                          className="text-sm col-span-1 flex gap-x-1"
                                        >
                                          <IconAlertCircleFilled
                                            size={18}
                                            className="text-yellow-400"
                                          />
                                          <span className="font-semibold">
                                            {set.name}
                                          </span>
                                          :{" "}
                                          {!customSet?.mockupImage
                                            ? "Thiếu file mockup"
                                            : "Thiếu file sản xuất"}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          key={set.code}
                                          className="text-sm col-span-1 flex gap-x-1"
                                        >
                                          <IconCircleCheckFilled
                                            size={18}
                                            className="text-green-500"
                                          />
                                          <span className="font-semibold">
                                            {set.name}
                                          </span>
                                          : Done
                                        </div>
                                      </>
                                    )}
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <div className="flex flex-col gap-y-4">
                                      <div className="flex flex-col gap-y-1">
                                        <span>File mockup:</span>
                                        <PrivateFileUploadPreview
                                          allowView
                                          value={customSet?.mockupImage}
                                        />
                                      </div>
                                      <div className="flex flex-col gap-y-1">
                                        <span>File sản xuất:</span>
                                        <PrivateFileUploadPreview
                                          allowView
                                          value={customSet?.manufacturingImage}
                                        />
                                      </div>
                                    </div>
                                  </Accordion.Panel>
                                </Accordion.Item>
                              </>
                            );
                          }) ?? []}
                      </Accordion>
                      <div className="grid grid-flow-col">
                        {!productInCampaignRes?.data?.customProduct?.variant?.productTemplate?.imageCombinations.find(
                          (el) =>
                            el.code ===
                            productInCampaignRes.data.customProduct
                              .combinationCode
                        ) && (
                          <span className="text-sm col-span-1">
                            Không có thông tin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

function CustomProductGeneralInfo({
  data,
}: {
  data: CampaignDetail["products"][0];
}) {
  const attaches = data.customProduct.attaches;

  const thumbnail = data.customProduct.attaches?.find(
    (el) => el.type === "THUMBNAIL"
  );

  return (
    <div className="create-product-container flex flex-col gap-10 w-full pb-5">
      <div className="card general-wrapper bg-white">
        <div className="flex flex-col-reverse md:flex-row mt-5 gap-20">
          <div className="flex flex-col w-8/12">
            <div>
              <h2 className="text-xl font-bold mb-4">General information</h2>
            </div>
            <div className="flex flex-col gap-y-3">
              <Input.Wrapper label="Name">
                <Input readOnly value={data.customProduct.name} />
              </Input.Wrapper>
              <Grid justify="space-between">
                <Col span={6}>
                  <Input.Wrapper label="Quantity">
                    <Input readOnly value={data.quantity} />
                  </Input.Wrapper>
                </Col>
                <Col span={6}>
                  <Input.Wrapper label="Price">
                    <Input
                      readOnly
                      value={currencyFormatter(data.price.amount)}
                    />
                  </Input.Wrapper>
                </Col>
              </Grid>
              <Grid justify="space-between">
                <Col span={12}>
                  <Input.Wrapper label="Limit per order">
                    <Input
                      type="number"
                      readOnly
                      value={data.customProduct.maxItemPerOrder}
                    />
                  </Input.Wrapper>
                </Col>
              </Grid>

              <Input.Wrapper label="Category">
                <Input readOnly value={data.customProduct.category.name} />
              </Input.Wrapper>
              <Input.Wrapper label="Description">
                <Textarea
                  minRows={8}
                  readOnly
                  value={data.customProduct.description}
                />
              </Input.Wrapper>
            </div>
          </div>
          <div className="image-wrapper flex flex-col w-3/12">
            <div className="text-xl font-bold mb-4">Thumbnail:</div>

            <Thumbnail
              url={thumbnail?.url}
              className="aspect-square flex-none"
              defaultPlaceholder={
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-thin">+</p>
                  <p>Add thumbnail</p>
                </div>
              }
              clearable={false}
              disabled
            />
            <Input.Wrapper label="Attachments" className="mt-4">
              <div className="grid grid-cols-3 gap-x-4">
                {attaches
                  .filter((item) => item.type !== "THUMBNAIL")
                  .map((data, index) => (
                    <div key={data.id} className="col-span-1">
                      <Thumbnail
                        url={data.url}
                        defaultPlaceholder={
                          <div className="flex flex-col items-center">
                            <p className="text-4xl font-thin">+</p>
                            <p>Add thumbnail</p>
                          </div>
                        }
                        clearable={false}
                        disabled
                      />
                    </div>
                  ))}
              </div>
            </Input.Wrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomProductDetailCard;
