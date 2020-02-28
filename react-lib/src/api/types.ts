
export interface User {
  username: string;
  email: string;
}

export interface MeResponse<U = User> {
  user: U;
}
