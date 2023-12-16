import ImageWithFallback from "@/components/ImageWithFallback/ImageWithFallback";
import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import axiosClient from "@/services/backend/axiosClient";
import { CampaignData } from "@/types/Campaign";
import { CommonResponseBase } from "@/types/ResponseBase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const CampaignProductList = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const id = router.query.id as string;
      const { data } = await axiosClient.get<CommonResponseBase<CampaignData>>(
        `/marketplace/sale-campaign/${id}`
      );
      return data;
    },
  });

  const campaignData = data?.data;

  return (
    <>
      <div className="relative">
        <ImageWithFallback
          src={campaignData?.thumbnailUrl}
          alt="img"
          className="!h-[160px] !w-full object-cover brightness-75"
          width={100}
          height={100}
        />
        <div
          className="absolute w-full h-full top-0 flex justify-center items-center cursor-pointer"
          onClick={() => router.push(`/campaigns/${campaignData?.id}`)}
        >
          <div>
            <div className="text-white font-bold text-2xl sm:text-3xl">
              {campaignData?.name}
            </div>
          </div>
        </div>
      </div>
      <ProductListContainer
        endpoint={`marketplace/sale-campaign/${id}/product-in-sale`}
        categories={categories?.data.items ?? []}
        tags={tags?.data.items ?? []}
        pathName={`/marketplace/sale-campaign/${id}/product-in-sale`}
      />
    </>
  );
};

export default CampaignProductList;
