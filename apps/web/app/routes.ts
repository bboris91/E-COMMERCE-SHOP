import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("products", "routes/products/index.tsx"),
  route("products/:slug", "routes/product/index.tsx"),
  route("cart", "routes/cart/index.tsx"),
  route("checkout", "routes/checkout/index.tsx"),
  route("orders/:id", "routes/order/index.tsx"),
  route("auth/login", "routes/auth/login/index.tsx"),
  route("auth/register", "routes/auth/register/index.tsx"),
  route("o-nama", "routes/about/index.tsx"),
  route("blog", "routes/blog/index.tsx"),
  route("blog/:slug", "routes/blog-post/index.tsx"),
] satisfies RouteConfig;
