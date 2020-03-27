
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface CsrfResponse {
  csrf: string;
}

export interface PasswordValidationInput {
  ident?: string;
  username?: string;
  email?: string;
  password: string;
}

export interface MeResponse<U> extends CsrfResponse{
  user: U|null;
}

export interface ObjectOfStrings {
  [key: string]: string;
}

export interface MetaDict {
  [key: string]: ObjectOfStrings;
}

export interface ErrorMessage {
  [key: string]: string[]|undefined;
}
