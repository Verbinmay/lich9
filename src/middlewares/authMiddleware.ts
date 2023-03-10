import { NextFunction, Response, Request } from "express";
import { jwtService } from "../application/jwtService";
import { usersRepository } from "../repositories/usersRepository";
import { JwtPayload } from "jsonwebtoken";

export const AccessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];

  const verify: JwtPayload | null = await jwtService.verifyToken(token!);
  if (verify) {
    req.user = verify;
    next();
    return;
  } else {
    res.send(401);
  }
};

export const RefreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }
  const verify: JwtPayload | null = await jwtService.verifyToken(
    refreshToken
  );
 
  if (verify) {
    req.user = verify;
    next();
    return;
  } else {
    res.sendStatus(401);
  }
};
