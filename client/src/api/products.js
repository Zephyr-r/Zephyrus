// 产品相关的 API 调用
const BASE_URL = "http://localhost:3000/api/products";

// Common fetch options
const getFetchOptions = (method = "GET", body = null) => ({
  method,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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

// 获取商品列表
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}?${queryString}`, getFetchOptions());
  return handleResponse(response);
};

// 获取商品详情
export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, getFetchOptions());
  return handleResponse(response);
};

// 搜索商品
export const searchProducts = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
    getFetchOptions()
  );
  return handleResponse(response);
};

// 创建商品
export const createProduct = async (productData) => {
  const response = await fetch(BASE_URL, getFetchOptions("POST", productData));
  return handleResponse(response);
};

// 更新商品
export const updateProduct = async (id, productData) => {
  const response = await fetch(
    `${BASE_URL}/${id}`,
    getFetchOptions("PUT", productData)
  );
  return handleResponse(response);
};

// 删除商品
export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, getFetchOptions("DELETE"));
  return handleResponse(response);
};
