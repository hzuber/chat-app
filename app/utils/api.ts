// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { User } from "../../types";
// import dotenv from "dotenv";
// import authMiddleware from "../middleware/authMiddleware";

// dotenv.config();

// const router = express.Router();

// interface AuthRequest extends express.Request {
//   userId?: string;
// }

// router.post("/register", async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   const existingUser = await User.findOne({ where: { email } });
//   if (existingUser) {
//     return res.status(400).json({ error: "Email is already in use" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({
//     firstName,
//     lastName,
//     email,
//     password: hashedPassword,
//   });
//   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
//   res.json({
//     uuid: user.id,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     email: user.email,
//     token: token,
//   });
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ where: { email } });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).send("Invalid credentials");
//   }
//   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
//   res.json({ token });
// });

// router.post("/validate", authMiddleware, async (req: AuthRequest, res) => {
//   const user = await User.findByPk(req.userId);
//   if (!user) {
//     return res.status(404).send("User not found");
//   }
//   res.json({
//     user: {
//       uuid: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//     },
//   });
// });

// export default router;
