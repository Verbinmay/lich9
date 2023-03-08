import { jwtService } from "./application/jwtService";
import { authRepository } from "./repositories/authRepository";
import { UserDBModel } from "./types/dbType";
import { FieldError } from "./types/errorsType";

export function errorMaker(msg: string, field: string, ...strings: any[]) {
  let arrayErrors: Array<FieldError> = [];
  arrayErrors.push({
    message: msg,
    field: field,
  });
  if (strings.length > 0) {
    for (let i = 0; i > strings.length; i + 2) {
      arrayErrors.push({
        message: strings[i],
        field: strings[i + 1],
      });
    }
  }
  return { errorsMessages: arrayErrors };
}

export async function tokenCreator(id: string, deviceId:string, iat:number) {
  const tokenAccess = await jwtService.createJWTAccesToken(id);
  const tokenRefresh = await jwtService.createJWTRefreshToken(id,deviceId,iat);

  return {
    accessToken: { accessToken: tokenAccess },
    refreshToken: tokenRefresh,
  };
}
