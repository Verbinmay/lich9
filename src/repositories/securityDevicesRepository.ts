import { securityDevicesCollections } from "./db";
import { SecurityDevicesDBModel } from "../types/dbType";
import { JwtPayload } from "jsonwebtoken";

export const securityDevicesRepository = {
  async findSessionsById(userId: string) {
    const result: Array<SecurityDevicesDBModel> =
      await securityDevicesCollections.find({ userId: userId }).toArray();
    
    return result;
  },
  async checkRefreshTokenEqual(iat: number, deviceId: string, userId: string) {
    const result: SecurityDevicesDBModel | null =
      await securityDevicesCollections.findOne({
        lastActiveDate: new Date(iat*1000).toISOString(),
        deviceId: deviceId,
        userId: userId,
      });
    return result != null;
  },
  async deleteSessions(userId: string, deviceId: string) {
    const result = await securityDevicesCollections.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return true;
  },
  async deleteSessionLogout(userId: string, deviceId: string) {
    const result = await securityDevicesCollections.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  },
  async findSessionByDeviceId(deviceId: string) {
    const result: SecurityDevicesDBModel | null =
      await securityDevicesCollections.findOne({ deviceId: deviceId });
    return result;
  },
  async deleteSessionsByDeviceId(deviceId: string) {
    const result = await securityDevicesCollections.deleteOne({
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  },
  async createSession(newSession: any) {
    const result = await securityDevicesCollections.insertOne(newSession);
    return result.insertedId ? true : false;
  },
  async updateSessionRefreshInfo(iatOldSession: number, decoded: JwtPayload) {
    const result = await securityDevicesCollections.updateOne(
      {
        lastActiveDate: new Date(iatOldSession * 1000).toISOString(),
        deviceId: decoded.deviceId!,
        userId: decoded.userId!,
      },
      {
        $set: {
          lastActiveDate: new Date(decoded.iat! * 1000).toISOString(),
          expireDate: new Date(decoded.exp! * 1000).toISOString(),
        },
      }
    );
    return result.matchedCount === 1;
  },
};
