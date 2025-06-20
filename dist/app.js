"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./lib/db");
const socket_io_1 = require("./lib/socket.io");
const PORT = process.env.PORT || 4000;
// middlewares
socket_io_1.app.use(express_1.default.json({ limit: '10mb' }));
socket_io_1.app.use(express_1.default.urlencoded({ extended: true, limit: "5mb" }));
socket_io_1.app.use((0, cookie_parser_1.default)());
socket_io_1.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
// routes
socket_io_1.app.use('/api/auth', auth_route_1.default);
socket_io_1.app.use('/api/message', message_route_1.default);
// start server
socket_io_1.server.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    (0, db_1.connectDB)();
});
