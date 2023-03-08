import jwt from "jsonwebtoken";
import {setting} from "../settings";
import {securityDevicesRepository} from "../repositories/securityDevicesRepository";
import jwtDecode, { JwtPayload } from "jwt-decode";

export const jwtService = {
    async createJWTAccesToken(id: string) {
        const token = jwt.sign({userId: id}, setting.JWT_SECRET, {
            expiresIn: "10s",
        });
        return token;
    },


    async createJWTRefreshToken( deviceId: string, userId: string, ) {
        const token = jwt.sign({ deviceId: deviceId, userId: userId}, setting.JWT_SECRET, {
            expiresIn: "20s",
        });
        return token;
    }
    ,
    async verifyToken(token: string) {
        const result = jwt.verify(token, setting.JWT_SECRET);
        if (typeof result !== "string") {

            if (result.deviceId) {
                const session: boolean = await securityDevicesRepository.checkRefreshTokenEqual(result.iat!, result.deviceId, result.userId)
                if (session) {
                    return result

                }
            } return result
        }
        return null

    },
    async decoderJWTs(token:string){
        const result:JwtPayload = await jwtDecode(token)
        return result
    }
};
