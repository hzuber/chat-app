import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getByEmail, create, getById } from "../users/utils";
import { UserResponse } from "types";

dotenv.config();

const router = express.Router();

interface AuthRequest extends express.Request {
  userId?: string;
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("reg", username, email, password);

  const existingUser = await getByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await create({
    username,
    email,
    password: hashedPassword,
    icon: null,
  }).then((res) => res.user);
  console.log("reg", user);
  const token = jwt.sign(
    { userId: user.id },
    process.env.VITE_JWT_SECRET as string
  );
  console.log("reg", token);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      password: user.password,
      email: user.email,
    },
    token: token,
    status: res.status,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await getByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }
  const token = jwt.sign(
    { userId: user.id },
    process.env.VITE_JWT_SECRET as string
  );
  const response: UserResponse = { token, status: res.statusCode, user };
  res.json(response);
});

router.post("/validate", async (req: AuthRequest, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET as string
    ) as {
      userId: string;
    };
    console.log("validate", req.body);
    const user = decoded.userId && (await getById(decoded.userId));
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({
      user,
    });
  } catch (err) {
    return res.status(403).send("Unable to validate");
  }
});

export default router;