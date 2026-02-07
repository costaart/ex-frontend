export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'USUARIO';
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

