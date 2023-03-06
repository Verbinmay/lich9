import { Request, Response, Router } from "express";
import { emailsAdapter } from "../adapters/emailAdapter";
import { registrationMessage } from "../adapters/messages";
import { jwtService } from "../application/jwtService";
import { errorMaker, tokenCreator } from "../functions";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  emailCreateValidation,
  inputValidationMiddleware,
  loginCreateValidation,
  loginOrEmailValidation,
  passwordCreateValidation,
  passwordValidation,
} from "../middlewares/inputValidationMiddleware";
import { authRepository } from "../repositories/authRepository";
import { usersRepository } from "../repositories/usersRepository";
import { authService } from "../services/authService";
import {
  CreatedTokenModel,
  LoginSuccessViewModel,
  MeViewModel,
} from "../types/authType";
import { AuthDBModel, UserDBModel } from "../types/dbType";

export const authRouter = Router({});

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const authPost: CreatedTokenModel | null = await authService.postAuth(
      req.body.loginOrEmail,
      req.body.password
    );
    if (authPost) {
      res.cookie("refreshToken", authPost.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).send(authPost.accessToken);
    } else {
      res.send(401);
    }
  }
);
authRouter.post("/refresh-token", async (req: Request, res: Response) => {
  const userFindId: string | null = await jwtService.getUserIdByToken(
    req.cookies.refreshToken
  );
  if (!userFindId) {
    res.send(401);
    return;
  }
  const match: AuthDBModel | null = await authService.matchToken(
    userFindId,
    req.cookies.refreshToken
  );

  if (match) {
    const newTokens: CreatedTokenModel = await tokenCreator(userFindId);

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).send(newTokens.accessToken);
  } else {
    res.send(401);
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  const userFindId: string | null = await jwtService.getUserIdByToken(
    req.cookies.refreshToken
  );
  if (!userFindId) {
    res.send(401);
    return;
  }
  const userFind: AuthDBModel | null = await authService.matchToken(
    userFindId,
    req.cookies.refreshToken
  );

  if (!userFind) {
    res.send(401);
    return;
  }

  const tokenRevoked = await authRepository.deleteRefreshToken(userFind.id);
  if (tokenRevoked) {
    res.send(204);
  } else {
    res.send(401);
  }
});

authRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const authGet: UserDBModel | null = await usersRepository.findUserById(
    req.user.id
  );
  const viewAuthGet: MeViewModel = {
    email: authGet!.email,
    login: authGet!.login,
    userId: authGet!.id,
  };
  res.status(200).send(viewAuthGet);
});

//REGISTRATION in the system. Email with confirmation code will be send to passed email address
authRouter.post(
  "/registration",
  loginCreateValidation,
  passwordCreateValidation,
  emailCreateValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const emailFinder = await authRepository.findUserByLoginOrEmail(
      req.body.email
    );
    if (emailFinder) {
      res
        .status(400)
        .send(errorMaker("login or email already exists", "email"));
      return;
    }
    const loginFinder = await authRepository.findUserByLoginOrEmail(
      req.body.login
    );

    if (loginFinder) {
      res
        .status(400)
        .send(errorMaker("login or email already exists", "login"));
      return;
    }

    const registationPost: UserDBModel = await authService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );
    const message = await registrationMessage(
      registationPost.emailConfimation.confimationCode
    );
    await emailsAdapter.sendEmail(
      req.body.email,
      message.subject,
      message.result
    );
    res.send(204);
  }
);

//CONFIRM registration
authRouter.post(
  "/registration-confirmation",
  async (req: Request, res: Response) => {
    const confirmPost = await authService.confirmEmail(req.body.code);
    if (confirmPost) {
      res.send(204);
    } else {
      res
        .status(400)
        .send(
          errorMaker(
            "If the confirmation code is incorrect, expired or already been applied",
            "code"
          )
        );
    }
  }
);

//REGISTRATION EMAIL RESENDING
authRouter.post(
  "/registration-email-resending",
  async (req: Request, res: Response) => {
    const emailResendingPost = await authService.resendingEmail(req.body.email);
    if (emailResendingPost) {
      const message = await registrationMessage(
        emailResendingPost.emailConfimation.confimationCode
      );
      await emailsAdapter.sendEmail(
        req.body.email,
        message.subject,
        message.result
      );
      res.send(204);
    } else {
      res
        .status(400)
        .send(
          errorMaker(
            " inputModel has incorrect values or if email is already confirmed",
            "email"
          )
        );
    }
  }
);
