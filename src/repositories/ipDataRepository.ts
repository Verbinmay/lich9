import { IpDataDBModel } from "../types/dbType";
import { ipDataCollections } from "./db";

export const ipDataRepository = {
  async checkIpData(ip: string, timeInSec: number, attempts: number) {
    const dateInMLS = Date.now() - timeInSec * 1000;
    const result: Array<IpDataDBModel> = await ipDataCollections
      .find({ ip: ip, data: { $gt: dateInMLS } })
      .toArray();
    return result.length > attempts ? false : true;
  },
  async addIpData(ip:string){
    const newIpData:any = {
        ip:ip,
        data: Date.now()
    }
    const result = await ipDataCollections.insertOne(newIpData)
    return result.acknowledged
  }
};
