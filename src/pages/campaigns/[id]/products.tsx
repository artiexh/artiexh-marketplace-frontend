import ProductPreviewCard from "@/components/Cards/ProductCard/ProductPreviewCard";
import { products } from "@/constants/product";
import clsx from "clsx";
import productStyles from "@/styles/Products/ProductList.module.scss";

export default function CampaignProductList() {
  return (
    <div className="campaign-product-list">
      <div className="text-center mt-8 text-2xl font-semibold mb-6">
        Tất cả sản phẩm
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
    </div>
  );
}
