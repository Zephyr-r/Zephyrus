const BASE_URL = "http://localhost:3000/api/auth";

// 通用的 fetch 选项
const getFetchOptions = (method = "GET", body = null) => ({
  method,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
  mode: "cors",
  cache: "no-cache",
  ...(body ? { body: JSON.stringify(body) } : {}),
});

// 处理响应的错误
const handleResponse = async (response) => {
  try {
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.error || response.statusText || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("Response error:", error);
    throw error;
  }
};

// Login
export const login = async (credentials) => {
  try {
    const response = await fetch(
      `${BASE_URL}/login`,
      getFetchOptions("POST", credentials)
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed, please try again later");
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/register`,
      getFetchOptions("POST", userData)
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/me`, getFetchOptions());
    return handleResponse(response);
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, getFetchOptions("POST"));
    return handleResponse(response);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
