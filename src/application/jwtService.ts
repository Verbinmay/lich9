import jwt from "jsonwebtoken";
import {setting} from "../settings";
import {securityDevicesRepository} from "../repositories/securityDevicesRepository";

export const jwtService = {
    async createJWTAccesToken(id: string) {
        const token = jwt.sign({userId: id}, setting.JWT_SECRET, {
            expiresIn: "10s",
        });
        return token;
    },


    async createJWTRefreshToken( deviceId: string, id: string, date: number) {
        const token = jwt.sign({ deviceId: deviceId, userId: id, iat: date}, setting.JWT_SECRET, {
            expiresIn: "20s",
        });
        return token;
    }
    ,
    async verifyToken(token: string) {
        const result = jwt.verify(token, setting.JWT_SECRET);
        if (typeof result !== "string") {

            if (result.deviceId && result.iat) {
                const session: boolean = await securityDevicesRepository.checkRefreshTokenEqual(result.userId, result.deviceId, result.iat)
                if (session) {
                    return result

                }
            } return result
        }
        return null

    },
};
