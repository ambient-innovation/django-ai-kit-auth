
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ObjectOfStrings {
  [key: string]: string;
}

export interface MetaDict {
  [key: string]: ObjectOfStrings;
}
