import express from "express";
import { auth } from "../middleware/auth.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { successResponse, errorResponse } from "../utils/response.js";
import mongoose from "mongoose";

const router = express.Router();

// 获取聊天列表
router.get("/chats", auth, async (req, res) => {
  try {
    // 获取当前用户参与的所有对话的最新消息
    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", req.user._id] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // 获取对话用户的信息
    const chatList = await Promise.all(
      latestMessages.map(async (chat) => {
        const otherUser = await User.findById(chat._id).select(
          "username avatar"
        );
        return {
          id: otherUser._id,
          username: otherUser.username,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            otherUser.username
          )}&background=e5e7eb&color=4b5563&size=128`,
          lastMessage: {
            content: chat.lastMessage.content,
            createdAt: chat.lastMessage.createdAt,
            isSelf: chat.lastMessage.sender.equals(req.user._id),
          },
          unreadCount: chat.unreadCount,
        };
      })
    );

    // 按最后消息时间排序
    chatList.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

    res.json(successResponse(chatList));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// 获取与特定用户的聊天记录
router.get("/history/:userId", auth, async (req, res) => {
  try {
    console.log("Fetching chat history for users:", {
      currentUser: req.user._id,
      otherUser: req.params.userId,
    });

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      console.log("Invalid user ID format");
      return res.json(successResponse([]));
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .populate("product", "name images price")
      .populate("order", "status");

    console.log(
      "Raw messages from database:",
      JSON.stringify(messages, null, 2)
    );
    console.log("Found messages count:", messages.length);

    const formattedMessages = messages.map((message) => ({
      id: message._id,
      content: message.content,
      createdAt: message.createdAt,
      isSelf: message.sender._id.equals(req.user._id),
      product: message.product,
      order: message.order,
    }));

    console.log(
      "Formatted messages:",
      JSON.stringify(formattedMessages, null, 2)
    );
    console.log("Formatted messages count:", formattedMessages.length);
    res.json(successResponse(formattedMessages));
  } catch (error) {
    console.error("Chat history error:", error);
    // 如果是因为没有聊天记录导致的错误，返回空数组
    if (error.name === "CastError" || error.name === "TypeError") {
      return res.json(successResponse([]));
    }
    res.status(500).json(errorResponse(error.message));
  }
});

// 发送消息
router.post("/send", auth, async (req, res) => {
  try {
    const { receiverId, content, productId, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json(errorResponse("Invalid receiver ID"));
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      product:
        productId && mongoose.Types.ObjectId.isValid(productId)
          ? productId
          : undefined,
      order:
        orderId && mongoose.Types.ObjectId.isValid(orderId)
          ? orderId
          : undefined,
    });

    await message.save();

    const formattedMessage = {
      id: message._id,
      content: message.content,
      createdAt: message.createdAt,
      isSelf: true,
      product: message.product,
      order: message.order,
    };

    res.status(201).json(successResponse(formattedMessage));
  } catch (error) {
    console.error("Send message error:", error);
    res.status(400).json(errorResponse(error.message));
  }
});

// 标记消息为已读
router.put("/read/:senderId", auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        receiver: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.json(successResponse(null, "Messages marked as read"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

export default router;
