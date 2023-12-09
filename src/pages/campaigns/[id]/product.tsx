import ProductListContainer from "@/containers/ProductListContainer/ProductListContainer";
import useCategories from "@/hooks/useCategories";
import useTags from "@/hooks/useTags";
import { useSearchParams } from "next/navigation";

const CampaignProductList = () => {
  const params = useSearchParams();
  const id = params?.get("id");
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  return (
    <ProductListContainer
      endpoint={`marketplace/sale-campaign/${id}/product-in-sale`}
      categories={categories?.data.items ?? []}
      tags={tags?.data.items ?? []}
      pathName={`/campaigns/${id}/product`}
    />
  );
};

export default CampaignProductList;
