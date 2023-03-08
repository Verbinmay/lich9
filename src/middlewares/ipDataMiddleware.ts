import { NextFunction, Request, Response } from "express";
import { ipDataRepository } from "../repositories/ipDataRepository";
export const ipDataMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timeInSec = 10;
  const attempts = 5;
  const ipDataCheck: boolean = await ipDataRepository.checkIpData(
    req.ip,
    timeInSec,
    attempts
  );
  if (!ipDataCheck) {
    res.send(429);
    return;
  }
  const ipDataAdd: boolean = await ipDataRepository.addIpData(req.ip);
  ipDataAdd ? next() : res.send(429);
};
