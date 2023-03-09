import { Request, Response, Router } from "express";
import { securityDevicesRepository } from "../repositories/securityDevicesRepository";
import { RefreshTokenMiddleware } from "../middlewares/authMiddleware";
import { securityDevicesService } from "../services/securityDevicesService";
import { SecurityDevicesDBModel } from "../types/dbType";

export const securityRouter = Router({});

securityRouter.get(
  "/devices",
  RefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const devicesFind = await securityDevicesRepository.findSessionsById(
      req.user.userid
    );

    if (devicesFind) {
      const session = devicesFind.map((t) => {
        return {
          ip: t.ip,
          title: t.title,
          lastActiveDate: t.lastActiveDate,
          deviceId: t.deviceId,
        };
      });
      res.status(200).send(session);
    }
  }
);

securityRouter.delete(
  "/devices",
  RefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const sessionsDelete: boolean = await securityDevicesService.deleteSessions(
      req.user.userId,
      req.user.iat
    );
    sessionsDelete ? res.send(204) : res.send(401);
  }
);

securityRouter.delete(
  "/devices/:deviceId",
  RefreshTokenMiddleware,
  async (req: Request, res: Response) => {
    const session: SecurityDevicesDBModel | null =
      await securityDevicesRepository.findSessionByDeviceId(
        req.params.deviceId
      );
    if (!session) {
      res.send(404);
      return;
    }
    if (session.userId === req.user.userId) {
      const sessionDelete: boolean =
        await securityDevicesService.deleteSessionsByDeviceId(
          req.params.deviceId
        );
      if (sessionDelete) {
        res.send(204);
      } else {
        res.send(404);
      }
    } else {
      res.send(403);
    }
  }
);
