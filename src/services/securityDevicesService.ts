import { JwtPayload } from "jsonwebtoken";
import { jwtService } from "../application/jwtService";
import { securityDevicesRepository } from "../repositories/securityDevicesRepository";
import { SecurityDevicesDBModel } from "../types/dbType";

export const securityDevicesService = {
  async deleteSessions(userId: string, iat: number) {
    const result: boolean = await securityDevicesRepository.deleteSessions(
      userId,
      iat
    );
    return result;
  },
  async deleteSessionLogout(userId: string, iat: number) {
    const result: boolean = await securityDevicesRepository.deleteSessionLogout(
      userId,
      iat
    );
    return result;
  },

  async checkUserDevices(userId: string, deviceId: string) {
    const result: SecurityDevicesDBModel | null =
      await securityDevicesRepository.findSessionByDeviceId(deviceId);
    return result ? result.userId === userId : false;
  },
  async deleteSessionsByDeviceId(deviceId: string) {
    const result: boolean =
      await securityDevicesRepository.deleteSessionsByDeviceId(deviceId);
    return result;
  },
  async createSession(
    iat: number,
    expirationDate: number,
    ip: string,
    title: string,
    deviceId: string,
    userId: string
  ) {
    const newSession = {
      lastActiveDate: iat.toString(),
      expirationDate: expirationDate.toString(),
      ip: ip,
      title: title,
      deviceId: deviceId,
      userId: userId,
    };
    const result: boolean = await securityDevicesRepository.createSession(
      newSession
    );
    return result;
  },
  async changeRefreshTokenInfo(newToken: string, iatOldSession: number) {
    const decoded: JwtPayload = await jwtService.decoderJWTs(newToken);
    const result: boolean =
      await securityDevicesRepository.updateSessionRefreshInfo(
        iatOldSession,
        decoded
      );
    return result;
  },
};
