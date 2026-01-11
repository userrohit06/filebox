import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

type userRequest = {
  email: string;
  password: string;
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as userRequest;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      passwordHash,
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as userRequest;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPsdCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPsdCorrect) {
      return res.status(401).json({ messag: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
