import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt-adapter";

export const signup = async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;
  try {

    if(!email || !fullName || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      // generate token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return
  }
};
export const login = (req: Request, res: Response) => {
  res.status(200).json({ message: "Login successful" });
};
export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout successful" });
};
