import { CartSection } from "@/services/backend/types/Cart";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartState = {
  selectedItems: CartSection[];
};

const initialState: CartState = {
  selectedItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    deleteItems: (
      state,
      action: PayloadAction<{
        productId: string;
      }>
    ) => {
      const selectedItems = state.selectedItems;
      let newArr = [...selectedItems];
      const productId = action.payload.productId;

      newArr.forEach((section) => {
        section.items = section.items.filter(
          (i) => i.productCode !== productId
        );

        if (section.items.length === 0) {
          newArr = newArr.filter(
            (item) => item.saleCampaign.id !== section.saleCampaign.id
          );
        }
      });

      state.selectedItems = newArr;
    },
    clearItems: (state) => {
      state.selectedItems = [];
    },
    toggleSelectItems: (
      state,
      action: PayloadAction<{
        cartSection: CartSection;
        isAll: boolean;
      }>
    ) => {
      // find the cart section belong to shopId
      const selectedItems = state.selectedItems;
      const { cartSection, isAll } = action.payload;
      const { saleCampaign: campaign, items } = cartSection;
      const campaignId = campaign.id;

      const selectItem = selectedItems.find(
        (item) => item.saleCampaign.id == campaignId
      );
      let newArr = [...selectedItems];

      // if select all items belonged to this shop Id
      if (isAll) {
        // if this shopId section already exist, remove it, otherwise, add it

        // remove this section belong to shopId
        newArr = newArr.filter((item) => item.saleCampaign.id != campaignId);

        // if this shop section doesn exist yet, add it to the selected items
        if (Number(selectItem?.items?.length ?? 0) < items.length) {
          newArr.push({
            saleCampaign: campaign,
            items,
          });
        }
      } else {
        // if this cart section already exist
        if (selectItem) {
          // find the item match the toggle id
          const nestedItem = selectItem.items.find(
            (item) => item.productCode === items[0].productCode
          );

          // loop through the new array
          newArr.forEach((item) => {
            // selected the section belong to this shop
            if (item.saleCampaign.id == campaignId) {
              // if the item is selected, remove it
              if (nestedItem) {
                item.items = item.items.filter(
                  (item) => item.productCode != items[0].productCode
                );

                // otherwise, add it
              } else {
                item.items.push(items[0]);
              }
            }
          });
          // otherwise, add new cart section
        } else {
          newArr.push({
            saleCampaign: campaign,
            items,
          });
        }
      }

      newArr.forEach((section) => {
        if (section.items.length === 0) {
          newArr.filter(
            (item) => item.saleCampaign.id !== section.saleCampaign.id
          );
        }
      });
      // set the new selected array
      state.selectedItems = newArr;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSelectItems, deleteItems, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
