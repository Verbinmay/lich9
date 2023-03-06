import jwt from "jsonwebtoken";
import { setting } from "../settings";

export const jwtService = {
  async createJWTAccesToken(id:string) {
    const token = jwt.sign({ userId: id }, setting.JWT_SECRET, {
      expiresIn: "10s",
    });
    return token;
  }
  ,

  async createJWTRefreshToken (id:string) {
    const token = jwt.sign({ userId: id }, setting.JWT_SECRET, {
      expiresIn: "20s",
    });
    return token;
  }
  ,
  async getUserIdByToken(token:string) {
    try {
      const result:any = jwt.verify(token, setting.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
