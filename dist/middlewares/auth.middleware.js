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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jwt_adapter_1 = require("../lib/jwt-adapter");
const user_model_1 = require("../models/user.model");
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ message: "Unauthorized access - Not token provided" });
            return;
        }
        const decoded = (0, jwt_adapter_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = yield user_model_1.User.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user; // Attach user to request body
        next();
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.protectRoute = protectRoute;
