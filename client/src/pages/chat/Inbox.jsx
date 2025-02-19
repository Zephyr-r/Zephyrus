import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  getChatList,
  getChatHistory,
  sendMessage,
  markAsRead,
} from "@/api/messages";
import { cn } from "@/lib/utils";

const Inbox = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const chatPollingRef = useRef(null);
  const messagePollingRef = useRef(null);

  // 获取聊天列表
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await getChatList();
      if (response?.data) {
        setChats(response.data);

        // 如果有 location.state.seller，选中对应的聊天
        if (location.state?.seller) {
          const sellerId =
            location.state.seller._id || location.state.seller.id;
          const existingChat = response.data.find(
            (chat) => chat.id === sellerId
          );

          if (existingChat) {
            setSelectedChat(existingChat);
          } else {
            const newChat = {
              id: sellerId,
              username: location.state.seller.username,
              avatar: location.state.seller.avatar,
              lastMessage: null,
              unreadCount: 0,
            };
            setChats((prev) => [newChat, ...prev]);
            setSelectedChat(newChat);
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "获取聊天列表失败",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取消息历史
  const fetchMessages = async () => {
    if (!selectedChat?.id) return;

    try {
      const response = await getChatHistory(selectedChat.id);
      if (response?.data) {
        setMessages(response.data);
        await markAsRead(selectedChat.id);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat.id ? { ...chat, unreadCount: 0 } : chat
          )
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "获取消息失败",
        description: error.message,
      });
    }
  };

  // 初始化轮询
  useEffect(() => {
    fetchChats();
    chatPollingRef.current = setInterval(fetchChats, 60000);
    return () => clearInterval(chatPollingRef.current);
  }, [location.state]);

  // 选中聊天后的轮询
  useEffect(() => {
    if (selectedChat?.id) {
      fetchMessages();
      messagePollingRef.current = setInterval(fetchMessages, 60000);
    }
    return () => clearInterval(messagePollingRef.current);
  }, [selectedChat?.id]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 发送消息
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat?.id) return;

    try {
      const response = await sendMessage({
        receiverId: selectedChat.id,
        content: newMessage,
        productId: location.state?.product?._id,
      });

      if (response?.data) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat.id
              ? {
                  ...chat,
                  lastMessage: {
                    content: newMessage,
                    createdAt: new Date(),
                    isSelf: true,
                  },
                }
              : chat
          )
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "发送失败",
        description: error.message || "消息发送失败，请重试",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 聊天列表 */}
        <div className="col-span-4 border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">消息列表</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors",
                    selectedChat?.id === chat.id && "bg-neutral-100"
                  )}
                  onClick={() => setSelectedChat(chat)}
                >
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>
                      {chat.username[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">
                        {chat.username}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-neutral-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-neutral-500">暂无聊天</div>
            )}
          </ScrollArea>
        </div>

        {/* 聊天内容 */}
        <div className="col-span-8 flex flex-col h-full">
          {selectedChat ? (
            <>
              {/* 聊天头部 */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>
                      {selectedChat.username[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedChat.username}</span>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-neutral-500 bg-white p-4 rounded-lg border border-gray-200">
                      暂无消息
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex w-full mb-4",
                          message.isSelf ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3 shadow-sm",
                            message.isSelf
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-200"
                          )}
                        >
                          <p className="break-words text-base">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* 输入框 */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t bg-white"
              >
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="输入消息..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    发送
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500">
              选择一个聊天开始交谈
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
