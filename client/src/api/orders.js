const BASE_URL = "http://localhost:3000/api/orders";

// 获取通用的fetch配置选项
const getFetchOptions = (method = "GET", body = null) => ({
  method,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
  ...(body ? { body: JSON.stringify(body) } : {}),
});

// 处理响应的辅助函数
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const error = await response.json();
      throw new Error(error.error || "Request failed");
    }
    throw new Error("Server error, please try again later");
  }

  if (isJson) {
    return response.json();
  }

  throw new Error("Server returned non-JSON data");
};

// Create an order
export const createOrder = async (orderData) => {
  const response = await fetch(BASE_URL, getFetchOptions("POST", orderData));
  return handleResponse(response);
};

// Get order list
export const getOrders = async () => {
  const response = await fetch(
    `http://localhost:3000/api/users/orders`,
    getFetchOptions()
  );
  return handleResponse(response);
};

// Get order details
export const getOrderById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, getFetchOptions());
  return handleResponse(response);
};

// Update order status
export const updateOrderStatus = async (id, { action }) => {
  const response = await fetch(
    `${BASE_URL}/${id}/status`,
    getFetchOptions("PUT", { action })
  );
  return handleResponse(response);
};
