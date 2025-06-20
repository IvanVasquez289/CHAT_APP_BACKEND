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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const jwt_adapter_1 = require("../lib/jwt-adapter");
const bcrypt_adapter_1 = require("../lib/bcrypt-adapter");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email });
        if (user) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const salt = yield (0, bcrypt_adapter_1.generateSalt)();
        const hashedPassword = yield (0, bcrypt_adapter_1.hashPassword)(password, salt);
        const newUser = new user_model_1.User({
            email,
            fullName,
            password: hashedPassword,
        });
        if (newUser) {
            // generate token here
            (0, jwt_adapter_1.generateToken)(newUser._id, res);
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(422).json({ message: "Invalid user data" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Invalid Credentials" });
            return;
        }
        const isValidPassword = yield (0, bcrypt_adapter_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // generate token here
        (0, jwt_adapter_1.generateToken)(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        // Clear the token by setting it to an empty string
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { profilePic } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        if (!profilePic) {
            res.status(400).json({ message: "Profile picture is required" });
            return;
        }
        const uploadImage = yield cloudinary_1.default.uploader.upload(profilePic);
        const updateUser = yield user_model_1.User.findByIdAndUpdate(userId, { profilePic: uploadImage.secure_url }, { new: true });
        res.status(200).json(updateUser);
    }
    catch (error) {
        console.log("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("Error in checkAuth controller:", error);
    }
};
exports.checkAuth = checkAuth;
