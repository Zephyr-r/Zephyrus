const BASE_URL = "http://localhost:3000/api/orders";

// Common fetch options
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

// Error handler helper
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    if (isJson) {
      const error = await response.json();
      throw new Error(error.error || "请求失败");
    }
    throw new Error("服务器错误，请稍后再试");
  }

  if (isJson) {
    return response.json();
  }

  throw new Error("服务器返回了非JSON格式的数据");
};

// 创建订单
export const createOrder = async (orderData) => {
  const response = await fetch(BASE_URL, getFetchOptions("POST", orderData));
  return handleResponse(response);
};

// 获取订单列表
export const getOrders = async () => {
  const response = await fetch(
    `http://localhost:3000/api/users/orders`,
    getFetchOptions()
  );
  return handleResponse(response);
};

// 获取订单详情
export const getOrderById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, getFetchOptions());
  return handleResponse(response);
};

// 更新订单状态
export const updateOrderStatus = async (id, { action }) => {
  const response = await fetch(
    `${BASE_URL}/${id}/status`,
    getFetchOptions("PUT", { action })
  );
  return handleResponse(response);
};
