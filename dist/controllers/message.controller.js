"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getUsersForSidebar = void 0;
const user_model_1 = require("../models/user.model");
const message_model_1 = require("../models/message.model");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const socket_io_1 = require("../lib/socket.io");
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const filteredUsers = yield user_model_1.User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v");
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsersForSidebar = getUsersForSidebar;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: userTochatId } = req.params;
        const myId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const messages = yield message_model_1.Message.find({
            $or: [
                { senderId: myId, receiverId: userTochatId },
                { senderId: userTochatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: receiverId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { text, image } = req.body;
        if (!text && !image) {
            res.status(400).json({ message: "Message text or image is required" });
            return;
        }
        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadImage = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }
        const newMessage = new message_model_1.Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        yield newMessage.save();
        res.status(201).json(newMessage);
        // TODO: REAL TIME FUNCTIONALITY WITH SOCKET.IO
        const receiverSockerId = (0, socket_io_1.getReceiverSocketId)(receiverId);
        if (receiverSockerId) {
            socket_io_1.io.to(receiverSockerId).emit("newMessage", newMessage);
        }
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
