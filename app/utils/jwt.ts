import { jwtDecode, JwtPayload } from "jwt-decode";
// import dotenv from "dotenv";
// dotenv.config();

// const secret = "your-secret-key";

export function verifyToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);
  console.log("decoded", decoded);
  return decoded;
}
