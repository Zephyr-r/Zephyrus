const BASE_URL = "http://localhost:3000/api/messages";

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

// 获取聊天列表
export const getChatList = async () => {
  const response = await fetch(`${BASE_URL}/chats`, getFetchOptions());
  return handleResponse(response);
};

// 获取与特定用户的聊天记录
export const getChatHistory = async (userId) => {
  const response = await fetch(
    `${BASE_URL}/history/${userId}`,
    getFetchOptions()
  );
  return handleResponse(response);
};

// 发送消息
export const sendMessage = async ({
  receiverId,
  content,
  productId,
  orderId,
}) => {
  const response = await fetch(
    `${BASE_URL}/send`,
    getFetchOptions("POST", { receiverId, content, productId, orderId })
  );
  return handleResponse(response);
};

// 标记消息为已读
export const markAsRead = async (senderId) => {
  const response = await fetch(
    `${BASE_URL}/read/${senderId}`,
    getFetchOptions("PUT")
  );
  return handleResponse(response);
};
