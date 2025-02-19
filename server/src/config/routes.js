export const ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  PRODUCTS: {
    BASE: "/api/products",
    DETAIL: "/api/products/:id",
    SEARCH: "/api/products/search",
    FAVORITES: "/api/products/favorites",
    MY_PRODUCTS: "/api/products/my-products",
  },
  ORDERS: {
    BASE: "/api/orders",
    DETAIL: "/api/orders/:id",
    STATUS: "/api/orders/:id/status",
  },
  USERS: {
    PROFILE: "/api/users/profile",
    AVATAR: "/api/users/avatar",
    PASSWORD: "/api/users/password",
  },
  MESSAGES: {
    BASE: "/api/messages",
    CHAT: "/api/messages/chat/:userId",
    CONVERSATIONS: "/api/messages/conversations",
  },
};
