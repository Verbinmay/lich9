import { NextFunction, Request, Response } from "express";
import { ipDataRepository } from "../repositories/ipDataRepository";
export const ipDataMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const route = (req.url ).toString()
  const timeInSec = 10;
  const attempts = 5;
  const ipDataCheck: boolean = await ipDataRepository.checkIpData(
    req.ip,
    timeInSec,
    attempts,
    route,
  );
  if (!ipDataCheck) {
    res.sendStatus(429);
    return;
  }
  const ipDataAdd: boolean = await ipDataRepository.addIpData(req.ip, route);
  ipDataAdd ? next() : res.sendStatus(429);
};
