
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface MeResponse<U> {
  user: U|null;
  csrf: string;
}

export interface ObjectOfStrings {
  [key: string]: string;
}

export interface MetaDict {
  [key: string]: ObjectOfStrings;
}

export interface ErrorMessage {
  [key: string]: string[];
}
