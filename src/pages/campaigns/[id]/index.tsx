/* eslint-disable @next/next/no-img-element */
import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import { campaignData } from "@/constants/campaign";
import { products } from "@/constants/product";
import productStyles from "@/styles/Products/ProductList.module.scss";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

export default function CampaignDetailPage() {
  const params = useSearchParams();

  const campaign = campaignData[0];
  const router = useRouter();

  // const { data: products } = useSWR("products", async () => {
  //   return axiosClient
  //     .get<CommonResponseBase<PaginationResponseBase<Product>>>(`/product`)
  //     .then((res) => res.data.data);
  // });

  return (
    <div className="campaign-detail-page">
      <div className="relative">
        <img
          src={campaign.thumbnailUrl}
          alt="campaign-thumbnail"
          className="w-full h-[300px] object-cover brightness-50"
        />
        <div className="absolute w-full h-full top-0 flex justify-center items-center">
          <div>
            <div className="text-white font-bold text-4xl">{campaign.name}</div>
            <div className="text-white text-lg mt-2">
              By: {campaign.owner.displayName}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-2xl font-semibold">
        Sản phẩm tiêu biểu
      </div>
      <div
        className="text-end mb-4 cursor-pointer"
        onClick={() => router.push(`/campaigns/${params?.get("id")}/products`)}
      >
        Xem tất cả
      </div>
      <div
        className={clsx(
          productStyles["product-list-grid"],
          "col-span-4 lg:!grid-cols-5"
        )}
      >
        {products?.length ? (
          products?.map((product, index) => (
            <ProductPreviewCard data={product} key={index} />
          ))
        ) : (
          <div className="col-span-4">
            <h2 className="text-lg font-semibold text-centers">
              Cannot find any items matching the criteria
            </h2>
          </div>
        )}
      </div>
      <div className="text-center mt-12 text-2xl font-semibold">Giới thiệu</div>
      <div className="text-center mt-2 px-20">
        Đây là bộ sưu tập áo sơ mới đến từ họa sĩ Pokemon cùng với sự giúp đỡ
        cũng như hỗ trợ in ấn đến từ Công Ty TNHH Japanese Merchandise. Bộ áo
        lấy cảm hứng từ mùa hè vui tươi, năng động, làm bừng lên sức trẻ cũng
        như năng lượng tích cực...
      </div>
      <div className="flex justify-center gap-10 mt-8">
        <div className="w-[300px] shadow-md rounded-lg">
          <div>
            <img
              src={campaign.owner.avatarUrl}
              alt="artist"
              className="w-full h-[300px] rounded-tl-lg rounded-tr-lg"
            />
          </div>
          <div className="p-4">
            <span className="font-semibold">Artist: </span>
            {campaign.owner.displayName}
          </div>
        </div>
        <div className="w-[300px] shadow-md rounded-lg">
          <div>
            <img
              src="https://quocluat.vn/photos/blog_post/Printing.jpg"
              alt="artist"
              className="w-full h-[300px] rounded-tl-lg rounded-tr-lg"
            />
          </div>
          <div className="p-4">
            <span className="font-semibold">Provider: </span> Công Ty TNHH
            Japanese Merchandise
          </div>
        </div>
      </div>
    </div>
  );
}
