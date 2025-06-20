"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = exports.io = exports.server = exports.app = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
const connectedUsers = {}; // {userId: socketId}
const messages = [];
const getReceiverSocketId = (receiverId) => {
    return connectedUsers[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    // io.emit is used to send events to all connected users
    if (userId) {
        connectedUsers[userId] = socket.id;
        exports.io.emit("getConnectedUsers", Object.keys(connectedUsers)); // ← esto actualiza a todos en tiempo real
    }
    socket.on("disconnect", () => {
        delete connectedUsers[userId];
        exports.io.emit("getConnectedUsers", Object.keys(connectedUsers));
    });
});
