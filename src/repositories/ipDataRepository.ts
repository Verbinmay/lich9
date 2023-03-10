import { IpDataDBModel } from "../types/dbType";
import { ipDataCollections } from "./db";

export const ipDataRepository = {
  async checkIpData(
    ip: string,
    timeInSec: number,
    attempts: number,
    route: string
  ) {
    const dateInMLS = Date.now() - timeInSec * 1000;
    const result: Array<IpDataDBModel> = await ipDataCollections
      .find({ ip: ip, route: route, data: { $gt: dateInMLS } })
      .toArray();

      console.log(result.length)

    if (result.length > attempts) {
      return false;
    } else {
      return true;
    }
  },
  async addIpData(ip: string, route: string) {
    const newIpData: any = {
      ip: ip,
      data: Date.now(),
      route: route,
    };
    const result = await ipDataCollections.insertOne(newIpData);
    return result.insertedId ? true : false;
  },
};
