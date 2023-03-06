export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type LoginSuccessViewModel = {
  accessToken: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type RegistrationConfimationCodeModel = {
  code: string;
};

export type RegistrationEmailResengingModel = {
  email: string;
};

export type CreatedTokenModel = {
  accessToken: {
    accessToken: string;
  };
  refreshToken: string;
};
