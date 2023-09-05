export const AUTH_ROUTE = {
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/signup",
};

export const NOT_REQUIRE_AUTH_ROUTE = {
  HOME_PAGE: "/",
  PRODUCT_LIST: "/product",
  CART: "/cart",
  CHECKOUT: "/checkout",
};

export const ROUTE = {
  ...AUTH_ROUTE,
  ...NOT_REQUIRE_AUTH_ROUTE,
  SHOP: "/my-shop",
  PROFILE: "/profile",
  ORDER_CONFIRM: "/checkout/confirm",
  
};
