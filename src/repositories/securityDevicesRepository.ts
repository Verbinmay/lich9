import {securityDevicesCollections} from "./db";
import {SecurityDevicesModel} from "../types/dbType";

export const securityDevicesRepository = {
    async findSession(id: string) {
        const result: Array<SecurityDevicesModel> | null = await securityDevicesCollections.find({userId: id}).toArray()
        return result
    }
}