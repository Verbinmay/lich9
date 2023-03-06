import {securityDevicesRepository} from "../repositories/securityDevicesRepository";
import {SecurityDevicesModel} from "../types/dbType";

export const securityDevicesService = {

    async deleteSessions (userId:string, iat: number){
        const result:boolean = await securityDevicesRepository.deleteSessions(userId, iat)
        return result
    },

    async checkUserDevices( userId:string, deviceId:string){
        const result : SecurityDevicesModel | null = await securityDevicesRepository.findSessionByDeviceId(deviceId)
        return result? result.userId === userId:false
    },
    async deleteSessionsByDeviceId(deviceId:string){
        const result : boolean = await securityDevicesRepository.deleteSessionsByDeviceId(deviceId)
        return result
    }
}