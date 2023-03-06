import {Request, Response, Router} from "express";
import {securityDevicesRepository} from "../repositories/securityDevicesRepository";

export const securityRouter = Router({});

securityRouter.get("/devices", async (req: Request, res: Response) => {
    //todo middleware for check 401
    const devicesFind = await securityDevicesRepository.findSession(req.userid)

    if (devicesFind) {
        const session = devicesFind.map((t) => {
            return {
                ip: t.ip,
                title: t.title,
                lastActiveDate: t.lastActiveDate,
                deviceId: t.deviceId
            }
        })
        res.status(200).send(session)
    }
});

securityRouter.delete("/devices", async (req: Request, res: Response) => {


})



