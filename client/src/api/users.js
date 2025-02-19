const BASE_URL = "http://localhost:3000/api/users";

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

// 获取用户信息
export const getUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/${userId}`, getFetchOptions());
  return handleResponse(response);
};

// 获取用户商品列表
export const getUserProducts = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/${userId}/products`,
    getFetchOptions()
  );
  return handleResponse(response);
};

// 更新用户资料
export const updateProfile = async (profileData) => {
  const response = await fetch(
    `${BASE_URL}/profile`,
    getFetchOptions("PUT", profileData)
  );
  return handleResponse(response);
};

// 更新用户头像
export const updateAvatar = async (avatarBase64) => {
  const response = await fetch(
    `${BASE_URL}/avatar`,
    getFetchOptions("POST", { avatarBase64 })
  );
  const result = await handleResponse(response);

  // 触发用户信息更新
  const event = new CustomEvent("userAvatarUpdate", {
    detail: { avatar: result.avatar },
  });
  window.dispatchEvent(event);

  return result;
};

// 修改密码
export const changePassword = async (passwordData) => {
  const response = await fetch(
    `${BASE_URL}/password`,
    getFetchOptions("PUT", passwordData)
  );
  return handleResponse(response);
};
