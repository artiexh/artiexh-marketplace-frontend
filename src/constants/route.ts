export const AUTH_ROUTE = {
  SIGN_IN: "/auth/signin",
  SIGN_UP: "/auth/signup",
};

export const NOT_REQUIRE_AUTH_ROUTE = {
  HOME_PAGE: "/",
  CART: "/cart",
  PRODUCT_LIST: "/product",
};

export const ROUTE = {
  ...AUTH_ROUTE,
  ...NOT_REQUIRE_AUTH_ROUTE,
};
