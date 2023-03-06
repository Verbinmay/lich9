import {securityDevicesCollections} from "./db";
import {SecurityDevicesModel} from "../types/dbType";

export const securityDevicesRepository = {
    async findSessionsById(id: string) {
        const result: Array<SecurityDevicesModel> | null = await securityDevicesCollections.find({userId: id}).toArray()
        return result
    },
    async checkRefreshTokenEqual(userId: string, deviceId: string, iat: number) {
        const result: SecurityDevicesModel | null = await securityDevicesCollections.findOne({
            userId: userId,
            deviceId: deviceId,
            lastActiveDate: iat.toString()
        })
        return result != null
    },
    async deleteSessions(userId: string, iat: number) {
        const result = await securityDevicesCollections.deleteMany({
            userId: userId,
            lastActiveDate: {$ne: iat.toString()}
        })
        return result.deletedCount === 1
    },
    async findSessionByDeviceId(deviceId: string) {
        const result: SecurityDevicesModel | null = await securityDevicesCollections.findOne({deviceId: deviceId})
        return result
    },
    async deleteSessionsByDeviceId( deviceId:string){
        const result = await securityDevicesCollections.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }

}