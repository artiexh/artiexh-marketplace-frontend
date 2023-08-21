import { CartItem } from "@/services/backend/types/Cart";
import { SelectedItems } from "@/types/Cart";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartState = {
  selectedItems: SelectedItems[];
};

const initialState: CartState = {
  selectedItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleSelectItems: (
      state,
      action: PayloadAction<{
        artistId: string;
        items: CartItem[];
        isAll: boolean;
      }>
    ) => {
      // find the cart section belong to artistId
      const selectedItems = state.selectedItems;
      const { artistId, items, isAll } = action.payload;

      const selectItem = selectedItems.find(
        (item) => item.artistId == artistId
      );
      let newArr = [...selectedItems];

      // if select all items belonged to this artist Id
      if (isAll) {
        // if this artistId section already exist, remove it, otherwise, add it

        // remove this section belong to artistId
        newArr = newArr.filter((item) => item.artistId != artistId);

        // if this artist section doesn exist yet, add it to the selected items
        if (Number(selectItem?.items?.length ?? 0) < items.length) {
          newArr.push({
            artistId,
            items,
          });
        }
      } else {
        // if this cart section already exist
        if (selectItem) {
          // find the item match the toggle id
          const nestedItem = selectItem.items.find(
            (item) => item.id === items[0].id
          );

          // loop through the new array
          newArr.forEach((item) => {
            // selected the section belong to this artist
            if (item.artistId == artistId) {
              // if the item is selected, remove it
              if (nestedItem) {
                item.items = item.items.filter(
                  (item) => item.id != items[0].id
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
            artistId,
            items,
          });
        }
      }

      // set the new selected array
      state.selectedItems = newArr;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSelectItems } = cartSlice.actions;

export default cartSlice.reducer;
